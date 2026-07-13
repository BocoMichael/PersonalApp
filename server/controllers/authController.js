import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await db.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({
      message: 'Login successful',
      data: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required.' });
    }

    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid Google login token.' });
    }

    const googleUser = await response.json();

    const emailVerified = googleUser.email_verified === true || googleUser.email_verified === 'true';

    if (!googleUser.email || !emailVerified) {
      return res.status(401).json({ error: 'Google account email could not be verified.' });
    }

    const existing = await db.query('SELECT id, username, email FROM users WHERE email = $1', [googleUser.email]);

    let user;
    if (existing.rows.length > 0) {
      user = existing.rows[0];
    } else {
      const result = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [googleUser.name || googleUser.email.split('@')[0], googleUser.email, null]
      );
      user = result.rows[0];
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({
      message: 'Google login successful',
      data: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Error logging in with Google:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password_hash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      message: 'Registration successful',
      data: user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logout successful' });
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, username }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};
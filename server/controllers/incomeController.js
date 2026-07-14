import db from "../db.js";

// FUNCTION 1: Add Income
export const addIncome = async (req, res) => {
  try {
    const { amount, source, date } = req.body;
    const user_id = req.user.id;

    const result = await db.query(
      'INSERT INTO income (user_id, amount, source, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, amount, source, date]
    );

    res.status(201).json({
      message: 'Income added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllIncome = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      'SELECT * FROM income WHERE user_id = $1 ORDER BY date DESC',
      [user_id]
    );

    res.json({
      message: 'Income retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting income:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await db.query(
      'DELETE FROM income WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({
      message: 'Income deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ error: error.message });
  }
};
import db from '../db.js';

export const getWallet = async (req, res) => {
  try {
    const userId = req.query.user_id || 1;

    const incomeResult = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = $1',
      [userId]
    );
    const expenseResult = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = $1',
      [userId]
    );

    const totalIncome = parseFloat(incomeResult.rows[0].total);
    const totalExpenses = parseFloat(expenseResult.rows[0].total);
    const currentBalance = totalIncome - totalExpenses;

    const result = await db.query(
      `UPDATE wallet 
       SET current_balance = $1, updated_at = NOW() 
       WHERE user_id = $2 
       RETURNING *`,
      [currentBalance, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found for this user' });
    }

    res.status(200).json({
      message: 'Wallet retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error retrieving wallet:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateThreshold = async (req, res) => {
  try {
    const { user_id, low_balance_threshold } = req.body;

    const result = await db.query(
      `UPDATE wallet 
       SET low_balance_threshold = $1, updated_at = NOW() 
       WHERE user_id = $2 
       RETURNING *`,
      [low_balance_threshold, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found for this user' });
    }

    res.status(200).json({
      message: 'Threshold updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating threshold:', error);
    res.status(500).json({ error: error.message });
  }
};
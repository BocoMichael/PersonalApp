import db from "../db.js";

// FUNCTION 1: Add Income
export const addIncome = async (req, res) => {
  try {
    const { user_id, amount, source, date } = req.body;
    
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
    const result = await db.query(
      'SELECT * FROM income ORDER BY date DESC'
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
    
    const result = await db.query(
      'DELETE FROM income WHERE id = $1 RETURNING *',
      [id]
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
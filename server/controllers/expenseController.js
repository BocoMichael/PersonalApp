import db from '../db.js';


export const addExpense = async (req, res) => {
    try {
        const { user_id, category_id, amount, description, date } = req.body;

        const result = await db.query(
            'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, category_id, amount, description, date]
        );
        
        res.status(201).json({
        message: 'Expense added successfully',
        data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllExpense = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT expenses.*, categories.name AS category_name 
             FROM expenses 
             LEFT JOIN categories ON expenses.category_id = categories.id 
             ORDER BY expenses.date DESC`
        );
        res.status(200).json({
            message: 'Expenses retrieved successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error retrieving expenses:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM expenses WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json({
            message: 'Expense deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: error.message });
    }
};
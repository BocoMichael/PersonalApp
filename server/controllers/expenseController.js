import db from '../db.js';

export const addExpense = async (req, res) => {
    try {
        const { category_id, amount, description, date, is_recurring, due_day } = req.body;
        const user_id = req.user.id;

        const result = await db.query(
            'INSERT INTO expenses (user_id, category_id, amount, description, date, is_recurring, due_day) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, category_id, amount, description, date, is_recurring || false, due_day || null]
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
        const user_id = req.user.id;

        const result = await db.query(
            `SELECT expenses.*, categories.name AS category_name 
             FROM expenses 
             LEFT JOIN categories ON expenses.category_id = categories.id 
             WHERE expenses.user_id = $1
             ORDER BY expenses.date DESC`,
            [user_id]
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
        const user_id = req.user.id;

        const result = await db.query(
            'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
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
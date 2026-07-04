import db from '../db.js';

export const addCategory = async (req, res) => {
    try {
        const { user_id, name } = req.body;
        const result = await db.query(
            'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
            [user_id, name]
        );
        res.status(201).json({
        message: 'Category added successfully',
        data: result.rows[0]
    });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        res.status(200).json({
            message: 'Categories retrieved successfully',
            data: result.rows
        });
    }
    catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({
            message: 'Category deleted successfully',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: error.message });
    }
};

        
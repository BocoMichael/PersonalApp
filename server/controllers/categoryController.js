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

        // Get the category being deleted
        const categoryResult = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const category = categoryResult.rows[0];

        // Prevent deleting the "Others" category itself
        if (category.name === 'Others') {
            return res.status(400).json({ error: 'Cannot delete the "Others" category' });
        }

        // Find or create the "Others" category for this user
        let othersResult = await db.query(
            'SELECT * FROM categories WHERE name = $1 AND user_id = $2',
            ['Others', category.user_id]
        );

        let othersCategory;
        if (othersResult.rows.length === 0) {
            const createOthers = await db.query(
                'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
                [category.user_id, 'Others']
            );
            othersCategory = createOthers.rows[0];
        } else {
            othersCategory = othersResult.rows[0];
        }

        // Reassign any expenses linked to this category over to "Others"
        await db.query(
            'UPDATE expenses SET category_id = $1 WHERE category_id = $2',
            [othersCategory.id, id]
        );

        // Now it's safe to delete the category
        const result = await db.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [id]
        );

        res.status(200).json({
            message: 'Category deleted successfully. Linked expenses moved to "Others".',
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: error.message });
    }
};

        
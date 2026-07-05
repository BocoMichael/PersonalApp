import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import incomeRoutes from './routes/income.js';
import expenseRoutes from './routes/expenses.js';
import categoryRoutes from './routes/categories.js';
import walletRoutes from './routes/wallet.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wallet', walletRoutes);

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected successfully!', 
      time: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
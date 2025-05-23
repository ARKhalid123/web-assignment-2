const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// In-memory storage
let expenses = [];
let nextId = 1;

// Routes
app.get('/', (req, res) => {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.render('assignment-no-2', { expenses: sortedExpenses });
});

app.get('/report', (req, res) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    res.render('report', { expenses, total });
});

// API Routes
app.post('/expenses', (req, res) => {
    const expense = {
        _id: nextId++,
        description: req.body.description,
        amount: parseFloat(req.body.amount),
        date: new Date()
    };
    expenses.push(expense);
    res.redirect('/');
});

app.put('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = expenses.findIndex(expense => expense._id === id);
    if (index !== -1) {
        expenses[index] = {
            ...expenses[index],
            description: req.body.description,
            amount: parseFloat(req.body.amount)
        };
        res.json(expenses[index]);
    } else {
        res.status(404).send('Expense not found');
    }
});

app.delete('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    expenses = expenses.filter(expense => expense._id !== id);
    res.json({ message: 'Expense deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
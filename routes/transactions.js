const router = require('express').Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// GET all transactions for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a new transaction
router.post('/', auth, async (req, res) => {
    const transaction = new Transaction({
        userId: req.user._id,
        customerName: req.body.customerName,
        amount: req.body.amount,
        type: req.body.type,
        description: req.body.description,
        date: req.body.date || Date.now()
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

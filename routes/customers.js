const router = require('express').Router();
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// GET all customers for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific customer by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a new customer
router.post('/', auth, async (req, res) => {
    // Check if customer with same name already exists for this user
    const existingCustomer = await Customer.findOne({
        userId: req.user._id,
        name: req.body.name
    });

    if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this name already exists' });
    }

    const customer = new Customer({
        userId: req.user._id,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a customer
router.put('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (req.body.name) customer.name = req.body.name;
        if (req.body.phoneNumber) customer.phoneNumber = req.body.phoneNumber;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a customer
router.delete('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Optional: Delete all transactions associated with this customer
        // Uncomment the line below if you want to cascade delete
        // await Transaction.deleteMany({ userId: req.user._id, customerName: customer.name });

        await customer.deleteOne();
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET customer balance (sum of all transactions)
router.get('/:id/balance', auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const transactions = await Transaction.find({
            userId: req.user._id,
            customerName: customer.name
        });

        let balance = 0;
        transactions.forEach(transaction => {
            if (transaction.type === 'CREDIT') {
                balance += transaction.amount; // You gave (they owe you)
            } else {
                balance -= transaction.amount; // You got (you owe them)
            }
        });

        res.json({
            customerId: customer._id,
            customerName: customer.name,
            balance: balance
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Sign-in route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret_key', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error signing in' });
  }
});

// Add address route
router.post('/address', authMiddleware, async (req, res) => {
  const { address } = req.body;
  if (!address || !address.house || !address.apartment || !address.category || !address.fullAddress) {
    return res.status(400).json({ error: 'Incomplete address data' });
  }

  try {
    const user = await User.findById(req.user.userId); // Ensure the userId is correctly decoded
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.addresses.push(address); // Add the address to the user's addresses array
    await user.save();
    res.json({ message: 'Address added successfully' });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(400).json({ error: 'Error adding address' });
  }
});
// Get addresses route
router.get('/addresses', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Ensure that the 'addresses' field exists in the user document
        console.log(user.addresses);
        res.json(user.addresses); // Send addresses directly
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(400).json({ error: 'Error fetching addresses' });
    }
});


// Add recent route
router.post('/recent', authMiddleware, async (req, res) => {
    const { fullAddress } = req.body;

    // Validate the input
    if (!fullAddress) {
        return res.status(400).json({ error: 'Incomplete recent data' });
    }

    try {
        // Create a new recent search entry
        const newSearch = new RecentSearch({
            fullAddress,
            user: req.user._id, // Assuming you store the user ID in the request after authentication
            createdAt: Date.now(),
        });

        // Save the recent search to the database
        await newSearch.save();

        // Respond with success
        res.status(201).json({ message: 'Recent search added successfully', data: newSearch });
    } catch (error) {
        console.error('Error saving recent search:', error);
        res.status(500).json({ error: 'Error saving recent search' });
    }
});

// Get recent route
router.get('/recent', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.recent); // Send recent items directly
    } catch (error) {
        console.error('Error fetching recent items:', error);
        res.status(400).json({ error: 'Error fetching recent items' });
    }
});
module.exports = router;


require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3333;
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FarmGrid Vanilla Express API!' });
});

// Auth routes
app.use('/api/auth', authRoutes);
// User routes
app.use('/api/v1/users', userRoutes); // Mount userRoutes at /api/v1/users

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

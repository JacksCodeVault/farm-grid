
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
  res.json({
    message: "Welcome to the FarmGrid API, the central backend service for the FarmGrid platform. This API is the digital backbone designed to bring efficiency, transparency, and trust to the agricultural supply chain. By connecting farmers, cooperatives (sellers), and buyers (processors), it powers the entire workflow from on-the-ground produce collection to final payment settlement. Key features include secure, role-based access for all stakeholders, real-time notifications via SMS/Email, and a unique webhook for offline data synchronization from remote field operators.",
    version: '1.0.0',
    documentation: '/api-docs' // Placeholder for future API documentation
  });
});

// Auth routes
app.use('/api/auth', authRoutes);
// User routes
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

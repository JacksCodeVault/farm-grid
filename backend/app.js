require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3333;
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const farmerRoutes = require('./src/routes/farmerRoutes');
const collectionRoutes = require('./src/routes/collectionRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');
const coopAdminRoutes = require('./src/routes/coopAdminRoutes');
const organizationRoutes = require('./src/routes/organizationRoutes');
const commodityRoutes = require('./src/routes/commodityRoutes');
const geographyRoutes = require('./src/routes/geographyRoutes');
const deliveryRoutes = require('./src/routes/deliveryRoutes');
const farmRoutes = require('./src/routes/farmRoutes');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the FarmGrid API, the central backend service for the FarmGrid platform. This API is the digital backbone designed to bring efficiency, transparency, and trust to the agricultural supply chain. By connecting farmers, cooperatives (sellers), and buyers (processors), it powers the entire workflow from on-the-ground produce collection to final payment settlement. Key features include secure, role-based access for all stakeholders, real-time notifications via SMS/Email, and a unique webhook for offline data synchronization from remote field operators.",
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
app.use('/api/v1/auth', authRoutes);
// User routes
app.use('/api/v1/users', userRoutes);
// COOP_ADMIN routes
app.use('/api/v1/coop-admin', coopAdminRoutes);
// Farmer routes
app.use('/api/v1/farmers', farmerRoutes);
// Collection routes
app.use('/api/v1/collections', collectionRoutes);
// Order routes
app.use('/api/v1/orders', orderRoutes);
// Payment routes
app.use('/api/v1/payments', paymentRoutes);
// Webhook routes
app.use('/api/v1/webhooks', webhookRoutes);
// Organization routes
app.use('/api/v1/organizations', organizationRoutes);
// Commodity routes
app.use('/api/v1/commodities', commodityRoutes);
// Geography routes
app.use('/api/v1/geography', geographyRoutes);
// Delivery routes

// Farm routes
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

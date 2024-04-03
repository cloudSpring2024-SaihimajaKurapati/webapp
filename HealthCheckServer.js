const express = require('express');
const healthCheckRoutes = require('./src/HealthCheck/routes');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/', healthCheckRoutes);
app.use('/v1/user', healthCheckRoutes)

app.use((req, res) => {
    res.status(404).end();
});

const server = app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        await initializeDatabase(); // Initialize database tables if necessary
        console.log('Database connection established successfully');
        console.log(`App listening on port ${port}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit the application if database connection fails
    }
});

module.exports = server;
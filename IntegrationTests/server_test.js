const express = require('express');
const healthCheckRoutes = require('./routes_test');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/', healthCheckRoutes);
app.use('/v1/user', healthCheckRoutes)

app.use((req, res) => {
    res.status(404).end();
});

const server= app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

module.exports = server;
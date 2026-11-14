const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB successfully.');

    const server = app.listen(config.port, () => {
      console.log(`SheRox server running on port ${config.port} [${config.nodeEnv}]`);
    });

    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = startServer;

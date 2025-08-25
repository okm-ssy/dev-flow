import express from 'express';
import cors from 'cors';
import { workflowRoutes } from './routes/workflows';
import { errorHandler } from './middleware/errorHandler';
import { fileStorage } from './services/file-storage';

const app = express();
const PORT = process.env.PORT || 9191;

// Initialize database and start server
async function startServer() {
  try {
    // Initialize file storage
    fileStorage.initialize();

    // Middleware
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5151',
      credentials: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/api/workflows', workflowRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        storage: 'file-based'
      });
    });

    // Error handling middleware
    app.use(errorHandler);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 dev-flow API running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5151'}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, gracefully shutting down...');
  try {
    fileStorage.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, gracefully shutting down...');
  try {
    fileStorage.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();
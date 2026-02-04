import express from 'express';
import cors from 'cors';
import path from 'path';
import { ROUTES } from './constants/routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import serviceRoutes from './routes/service.routes';
import bookingRoutes from './routes/booking.routes';
import protectedRoutes from './routes/protected.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(`${ROUTES.API.BASE}${ROUTES.API.AUTH}`, authRoutes);
app.use(`${ROUTES.API.BASE}${ROUTES.USERS.base}`, userRoutes);
app.use(`${ROUTES.API.BASE}${ROUTES.SERVICES.BASE}`, serviceRoutes);
app.use(`${ROUTES.API.BASE}${ROUTES.BOOKINGS.BASE}`, bookingRoutes);
app.use(`${ROUTES.API.BASE}`, protectedRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
    res.json({ status: 'online', service: 'Occasia API' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`| CRITICAL ERROR: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'The server encountered an unhandled exception.',
    });
});

export default app;

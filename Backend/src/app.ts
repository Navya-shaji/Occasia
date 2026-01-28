import express from 'express';
import cors from 'cors';
import { ROUTES } from './constants/routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Debug Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(`${ROUTES.API.BASE}${ROUTES.API.AUTH}`, authRoutes);


export default app;

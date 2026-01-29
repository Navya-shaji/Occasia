import express from 'express';
import cors from 'cors';
import { ROUTES } from './constants/routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import serviceRoutes from './routes/service.routes';
import protectedRoutes from './routes/protected.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(`${ROUTES.API.BASE}${ROUTES.API.AUTH}`, authRoutes);
app.use(`${ROUTES.API.BASE}${ROUTES.USERS.base}`, userRoutes);
app.use(`${ROUTES.API.BASE}${ROUTES.SERVICES.BASE}`, serviceRoutes);
app.use(`${ROUTES.API.BASE}`, protectedRoutes);


export default app;

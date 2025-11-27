import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
// ------------------------------------------------- DASHBOARD ROUTES ------------------------------------------------------
router.get('/', authMiddleware, (req, res) => {
    res.render('dashboard', { user: req.user });
});

export default router;

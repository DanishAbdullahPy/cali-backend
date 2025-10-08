import { Request, Response, NextFunction } from 'express';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Email and password must be strings' });
    }
    next();
};

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Email and password must be strings' });
    }
    if (firstName && typeof firstName !== 'string') {
        return res.status(400).json({ message: 'First name must be a string' });
    }
    if (lastName && typeof lastName !== 'string') {
        return res.status(400).json({ message: 'Last name must be a string' });
    }
    next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;
    if (email && typeof email !== 'string') {
        return res.status(400).json({ message: 'Email must be a string' });
    }
    if (password && typeof password !== 'string') {
        return res.status(400).json({ message: 'Password must be a string' });
    }
    if (firstName && typeof firstName !== 'string') {
        return res.status(400).json({ message: 'First name must be a string' });
    }
    if (lastName && typeof lastName !== 'string') {
        return res.status(400).json({ message: 'Last name must be a string' });
    }
    next();
};

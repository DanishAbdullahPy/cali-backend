
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import { LoginRequest, CreateUserRequest } from '../types';

export const register = async (req: Request, res: Response) => {
    try {
        const userData = req.body as CreateUserRequest;
        const user = await userService.createUser(userData, req.file);
        const { token } = await authService.login(userData.email, userData.password);
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Registration error:', error);
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginRequest;
        const { user, token } = await authService.login(email, password);
        res.json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { CreateUserRequest, UpdateUserRequest, AuthPayload } from '../types';

interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body as CreateUserRequest, req.file);
        res.status(201).json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await userService.getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await userService.updateUser(id, req.body as UpdateUserRequest, req.file);
        res.json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        await userService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};

export const fetchAndStoreUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.fetchAndStoreUsers();
        res.status(201).json({ 
            message: 'Users fetched and stored successfully',
            created: result.createdCount,
            updated: result.updatedCount
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({ message });
    }
};


import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateCreateUser, validateUpdateUser } from '../middlewares/validation.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

router.post('/fetch', userController.fetchAndStoreUsers);
router.post('/', upload.single('avatar'), userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', authenticate, upload.single('avatar'), validateUpdateUser, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;

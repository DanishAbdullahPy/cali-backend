
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as userController from '../controllers/user.controller';
import { validateLogin, validateCreateUser } from '../middlewares/validation.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

router.post('/register', upload.single('avatar'), validateCreateUser, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;

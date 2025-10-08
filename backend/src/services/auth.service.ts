
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { prisma } from '../index';

export const login = async (email: string, password: string) => {
    console.log('Attempting login for email:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('User not found for email:', email);
        throw new Error('Invalid email or password');
    }

    console.log('Found user, checking password...');
    console.log('Input password length:', password.length);
    console.log('Stored password hash:', user.password.substring(0, 20) + '...');
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
        console.log('Invalid password for email:', email);
        throw new Error('Invalid email or password');
    }

    const token = generateToken({ id: user.id, email: user.email });
    return { user, token };
};

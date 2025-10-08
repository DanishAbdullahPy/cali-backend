import bcrypt from 'bcrypt';
import axios from 'axios';
import { prisma } from '../index';
import { CreateUserRequest, UpdateUserRequest } from '../types';

export const createUser = async (data: CreateUserRequest, file?: Express.Multer.File) => {
    console.log('Creating user with email:', data.email);
    console.log('Original password length:', data.password.length);
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log('Hashed password:', hashedPassword.substring(0, 20) + '...');
    
    const userData: CreateUserRequest & { password: string; avatar?: string } = {
        ...data,
        password: hashedPassword,
    };
    if (file) {
        userData.avatar = `/uploads/${file.filename}`;
    }
    return prisma.user.create({
        data: userData,
    });
};

export const getUsers = async () => {
    return prisma.user.findMany();
};

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (id: number, data: UpdateUserRequest, file: Express.Multer.File | undefined) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    if (file) {
        data.avatar = `/uploads/${file.filename}`;
    }
    return prisma.user.update({
        where: { id },
        data,
    });
};

export const deleteUser = async (id: number) => {
    return prisma.user.delete({ where: { id } });
};

export const fetchAndStoreUsers = async () => {
    try {
        // Fetch users from third-party API as specified in requirements
        const thirdPartyApiUrl = process.env.THIRD_PARTY_API_URL || 'https://reqres.in/api';
        const response = await axios.get(`${thirdPartyApiUrl}/users`);
        const users = response.data.data;
        console.log(`Fetched ${users.length} users from reqres.in`);

        // Store users in our database
        let createdCount = 0;
        let updatedCount = 0;

        for (const user of users) {
            // Map the fields from reqres.in to our schema
            const userData = {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                avatar: user.avatar,
                password: await bcrypt.hash('password', 10), // default password
            };

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            });

            if (existingUser) {
                // Update existing user
                await prisma.user.update({
                    where: { email: userData.email },
                    data: userData
                });
                updatedCount++;
            } else {
                // Create new user
                await prisma.user.create({
                    data: userData
                });
                createdCount++;
            }
        }

        console.log(`Successfully created ${createdCount} new users and updated ${updatedCount} existing users`);
        return { createdCount, updatedCount };
    } catch (error) {
        console.error('Error fetching and storing users:', error);
        throw error;
    }
};

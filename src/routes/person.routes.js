import { Router } from 'express';
import prisma from '../utils/db_client.js';
import { accountNumberGenerator } from '../utils/account_helper.js';

const router = Router();

router.post('/', async (req, res) => {
    const { name, idNumber, email, phone, adress, password } = req.body;
    // Validate the request body, if the validation fails, return 400 Bad Request
    if (!name || !idNumber || !email || !phone || !adress || !password) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const person = await prisma.person.create({
            data: {
                name: name,
                idNumber: idNumber,
                email: email,
                phone: phone,
                adress: adress,   
            }
        });

        if (!person) {
            throw new Error('Error creating person');
        }

        const account = await prisma.account.create({
            data: {
                accountNumber: await accountNumberGenerator(),
                balance: 0,
                personId: person.id
            }
        });

        if (!account) {
            throw new Error('Error creating account');
        }

        const user = await prisma.user.create({
            data: {
                accountNumber: account.accountNumber,
                password: password
            }
        });

        if (!user) {
            throw new Error('Error creating user');
        }

        return res.status(201).json({ 
            message: 'Person, account and user created successfully', 
            accountNumber: account.accountNumber   
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    } 
});

export default router;
import { Router } from 'express';
import prisma from '../utils/db_client.js';
import { getDetailedAccount } from '../utils/account_helper.js';

const router = Router();

router.post('/login', async (req, res) => {
    const { accountNumber, password } = req.body;
    if (!accountNumber || !password) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                accountNumber: accountNumber
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== password) {
            throw new Error('Invalid password');
        }

        const account = await getDetailedAccount(accountNumber);
        return res.status(200).json(account);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.patch("/updatePassword", async (req, res) => {
    const { accountNumber, newPassword ,oldPassword } = req.body;
    if (!accountNumber || !newPassword || !oldPassword) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                accountNumber: accountNumber
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== oldPassword) {
            throw new Error('Invalid password');
        }

        await prisma.user.update({
            where: {
                accountNumber: accountNumber
            },
            data: {
                password: newPassword
            }
        });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export default router;
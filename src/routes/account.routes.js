import { Router } from 'express';
import prisma from '../utils/db_client.js';
import { accountNumberGenerator, accountBalanceValidator, accountExists, getAccount, getDetailedAccount } from '../utils/account_helper.js';

const router = Router();

router.get('/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;
    if (!accountNumber) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const account = await getAccount(accountNumber);
        if (!account) {
            throw new Error('Account not found');
        }

        return res.status(200).json(account);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get('/:accountNumber/detail', async (req, res) => {
    // Get account and person details
    const accountNumber = req.params.accountNumber;
    if (!accountNumber) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const account = await getDetailedAccount(accountNumber);
        return res.status(200).json(account);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
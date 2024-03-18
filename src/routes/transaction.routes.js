import { Router } from 'express';
import prisma from '../utils/db_client.js';
import { getDetailedAccount, getAccount, accountBalanceValidator, updateAccountBalance } from '../utils/account_helper.js';

const router = Router();

router.post('/deposit', async (req, res) => {
    const { accountNumber, amount } = req.body;
    if (!accountNumber || !amount) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const account = await getAccount(accountNumber);
        if (!account) {
            throw new Error('Account not found');
        }

        const newBalance = account.balance + amount;
        
        if(newBalance < 0){
            throw new Error('Invalid amount');
        }

        if(!(await updateAccountBalance(accountNumber, newBalance))){
            throw new Error('Error updating account balance');
        }

        const updatedAccount = await updateAccountBalance(accountNumber, newBalance);
        
        const transaction = await prisma.transaction.create({
            data: {
                type: 'DEPOSIT',
                amount: amount,
                accountNumber: accountNumber
            }
        });

        if (!transaction) {
            throw new Error('Error creating transaction');
        }

        return res.status(200).json(updatedAccount);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post('/withdraw', async (req, res) => {
    const { accountNumber, amount } = req.body;
    if (!accountNumber || !amount || amount < 0) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const account = await getAccount(accountNumber);
        if (!account) {
            throw new Error('Account not found');
        }
    

        if(!(await accountBalanceValidator(accountNumber, amount))){
            throw new Error('Insufficient funds');
        }

        const newBalance = account.balance - amount;
        if(newBalance < 0){
            throw new Error('Invalid amount');
        }

        if(!(await updateAccountBalance(accountNumber, newBalance))){
            throw new Error('Error updating account balance');
        }

        const updatedAccount = await updateAccountBalance(accountNumber, newBalance);

        const transaction = await prisma.transaction.create({
            data: {
                type: 'WITHDRAW',
                amount: amount,
                accountNumber: accountNumber
            }
        });

        if (!transaction) {
            throw new Error('Error creating transaction');
        }

        return res.status(200).json(updatedAccount);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get('/transactions/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;
    if (!accountNumber) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const account = await getAccount(accountNumber);
        if (!account) {
            throw new Error('Account not found');
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                accountNumber: accountNumber
            }
        });

        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
import { Router } from 'express';
import prisma from '../utils/db_client.js';
import { getDetailedAccount, getAccount, accountBalanceValidator, updateAccountBalance } from '../utils/account_helper.js';

const router = Router();

router.post('/deposit', async (req, res) => {
    const { originAccount, destinationAccount, amount } = req.body;
    if (!originAccount || !destinationAccount || !amount) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const originAccountRepo = await getAccount(originAccount);
        const destinyAccountRepo = await getAccount(destinationAccount);
        if (!originAccountRepo || !destinyAccountRepo) {
            throw new Error('Account not found');
        }

        const newBalances = [originAccountRepo.balance - amount, destinyAccountRepo.balance + amount];

        if(!(await accountBalanceValidator(originAccountRepo.accountNumber, amount))){
            throw new Error('Insufficient funds');
        }

        if(!(await updateAccountBalance(originAccountRepo.accountNumber, newBalances[0]))){
            throw new Error('Error updating account balance');
        }

        if(!(await updateAccountBalance(destinyAccountRepo.accountNumber, newBalances[1]))){
            throw new Error('Error updating account balance');
        }

        const transfer = await prisma.transfer.create({
            data: {
                amount: amount,
                originAccount: originAccountRepo.accountNumber,
                destinationAccount: destinyAccountRepo.accountNumber
            }
        });

        if (!transfer) {
            throw new Error('Error creating transaction');
        }

        return res.status(200).json({ message: 'Transfer completed successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    

})


router.get('/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;
    if (!accountNumber) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        // Get all transfers where the account is the origin or destination
        const transfers = await prisma.transfer.findMany({
            where: {
                OR: [
                    {
                        originAccount: accountNumber
                    },
                    {
                        destinationAccount: accountNumber
                    }
                ]
            }
        });

        if (!transfers) {
            throw new Error('Transfers not found');
        }

        return res.status(200).json(transfers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


export default router;
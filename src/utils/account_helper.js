import prisma from "./db_client.js";

export const accountNumberGenerator = async () => {
    // Returns a 5 digit random number (from 00000 to 99999)
    let accountNumber = '00001';
    while (await accountExists(accountNumber)) {
        accountNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    }
    return accountNumber;
}

export  const accountBalanceValidator = async (accountNumber, amount) => {
    // Returns a boolean value
    const account = await prisma.account.findUnique({
        where: {
            accountNumber: accountNumber
        }
    });
    return account.balance >= amount;
}

export const accountExists = async (accountNumber) => {
    // Returns a boolean value
    const account = await prisma.account.findUnique({
        where: {
            accountNumber: accountNumber
        }
    });
    return account === null ? false : true;
}

export const getAccount = async (accountNumber) => {
    // Returns an object
    return await prisma.account.findUnique({
        where: {
            accountNumber: accountNumber
        }
    });
}

export const getDetailedAccount = async (accountNumber) => {
    const account = await getAccount(accountNumber);
    if (!account) {
        throw new Error('Account not found');
    }

    const person = await prisma.person.findUnique({
        where: {
            id: account.personId
        }
    });

    if (!person) {
        throw new Error('Person not found');
    }

    account.person = person;

    return account;
}

export const updateAccountBalance = async (accountNumber, amount) => {
    const account = await getAccount(accountNumber);
    if (!account) {
        throw new Error('Account not found');
    }
    return await prisma.account.update({
        where: {
            accountNumber: accountNumber
        },
        data: {
            balance: amount
        }
    });
}
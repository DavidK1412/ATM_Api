import  express  from "express";
import cors from 'cors';

import accountRoutes from './routes/account.routes.js';
import personRoutes from './routes/person.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/person', personRoutes);
app.use('/api/user', userRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/transfer', transferRoutes);

app.listen(3000)
console.log("Server is running on port 3000");
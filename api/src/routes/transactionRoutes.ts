import { Router, Request, Response } from "express";

// import { AppDataSource } from "../db/dataSource"; // Actual database
import { AppDataSource } from "../tests/dataSourceTestLite"; // For testing
import { User } from "../db/entities/User";
import { Transaction } from "../db/entities/Transaction";
import { Space } from "../db/entities/Space";


const router = Router();

// POST transaction - create a new transaction
router.post('/transaction/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { amount, date, type, account_id, category_id, description, space_id } = req.body;

  const missingFields = [
    amount, 
    date, 
    type, 
    account_id, 
    category_id,
  ].some(field => !field); // Required fields
  
  if (isNaN(user_id) || missingFields) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  try {    
    const newTransaction = AppDataSource.manager.create(Transaction, {
      user: { user_id: user_id },
      amount: amount, 
      date: date, 
      type: type, 
      account: { account_id }, 
      category: { category_id}, 
      description: description ?? undefined,
    }) as Transaction;
    if(space_id !== undefined) {
      const space = await AppDataSource.manager.findOne(Space, space_id) as Space;
      if (space) {
        newTransaction.space = space; 
      }
    }
    await AppDataSource.manager.save(newTransaction);
    return res.status(201).json({ 
      success: true, 
      message: 'Transaction created successfully', 
      transaction: newTransaction
		});
	} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET transactions of a user
router.get('/transactions/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  
  try {
    const transactions = await AppDataSource.manager.findBy(Transaction, { user: { user_id: user_id } }) as Transaction[];
    
    return res.status(200).json({ transactions: transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET transaction info
router.get('/transaction/:user_id/:transaction_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const transaction_id = parseInt(req.params.transaction_id, 10);
  
  try {
    const transaction = await AppDataSource.manager.findOneBy(Transaction, {
      user: { user_id: user_id}, // Check the ownership
      transaction_id: transaction_id
    }) as Transaction;

    return res.status(200).json({transaction: transaction})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// PUT transaction - update a transaction
router.put('/transaction/:user_id/:transaction_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const transaction_id = parseInt(req.params.transaction_id, 10);
  const { amount, date, type, account, category, description, space, comments } = req.body;
  
  try {
    const transaction = await AppDataSource.manager.findOneBy(Transaction, {
      user: { user_id: user_id},
      transaction_id: transaction_id
    }) as Transaction;

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const updates: Partial<Transaction> = {};
    
    if (amount !== undefined) updates.amount = amount;
    if (date !== undefined) updates.date = date;
    if (type !== undefined && ['expense', 'income', 'transfer'].includes(type)) transaction.type = type;
    if (account !== undefined) updates.account = account;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (space !== undefined) updates.space = space;
    if (comments !== undefined && comments.length > 0) updates.comments = comments;

    if (Object.keys(updates).length === 0) {
      return res.status(409).json({ success: false, message: 'No valid updates was found' });
    }

    AppDataSource.manager.merge(Transaction, transaction, updates);
    const updatedTransaction = await AppDataSource.manager.save(transaction);

    return res.status(200).json({ 
      success: true, 
      message: 'Transaction updated successfully', 
      updatedTransaction 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// // DELETE a transaction
router.delete('/transaction/:user_id/:transaction_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const transaction_id = parseInt(req.params.transaction_id, 10);
  
  try {
    const transaction = await AppDataSource.manager.findOneBy(Transaction, {
      user: { user_id: user_id }, // Ownership check
      transaction_id: transaction_id
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await AppDataSource.manager.delete(Transaction, transaction_id);

    return res.status(200).json({ success: true, message: 'Transaction deleted successfully', deletedTransaction: transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

export default router
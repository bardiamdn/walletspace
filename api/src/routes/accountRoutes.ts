import { Router, Request, Response } from "express";

// Change to AppDataSourceTest on test runs
import { AppDataSource } from "../db/dataSource"; // Actual database
import { AppDataSourceTest } from "../tests/dataSourceTestLite"; // For testing
import { User } from "../db/entities/User";
import { Account } from "../db/entities/Account";

const router = Router();


// POST account - create a new account
router.post('/account/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { account_name, initialBalance } = req.body;
  
  if (isNaN(user_id) || !account_name) {
    return res.status(400).json({ success: false, message: 'Invalid user ID or missing account name' });
  }

  try {
    const user = await AppDataSource.manager.findOneBy(User, {user_id: user_id}) as User;
    const account = await AppDataSource.manager.findOneBy(Account, {account_name: account_name}) as Account;
    
    if(account) {
      return res.status(400).json({ success: false, message: "Account name already exists, try another name"});
    }
    const newAccount = AppDataSource.manager.create(Account, {
      user,
      account_name,
      balance: initialBalance || 0
    });

    await AppDataSource.manager.save(newAccount);
    return res.status(201).json({ 
      success: true, 
      message: 'Account created successfully', 
      account: {
        account_id: newAccount.account_id,
        account_name: newAccount.account_name,
        balance: newAccount.balance,
        created_at: newAccount.created_at,
        last_updated: newAccount.last_updated
      }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET all accounts of a user
router.get('/accounts/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  
  try {
    const accounts = await AppDataSource.manager.findBy(Account, { user: { user_id: user_id } }) as Account[];
    
    return res.status(200).json({ accounts: accounts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET one account's info
router.get('/account/:user_id/:account_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const account_id = parseInt(req.params.account_id, 10);
  
  try {
    const account = await AppDataSource.manager.findOneBy(Account, {
      user: { user_id: user_id}, 
      account_id: account_id
    }) as Account;

    return res.status(200).json({account: account})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// PUT account - update an account
router.put('/account/:user_id/:account_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const account_id = parseInt(req.params.account_id, 10);
  const { account_name, balance } = req.body;
  
  try {
    const account = await AppDataSource.manager.findOneBy(Account, {
      user: { user_id: user_id}, 
      account_id: account_id
    }) as Account;

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (account_name !== undefined) {
      account.account_name = account_name;
    }
    if (balance !== undefined) {
      account.balance = balance;
    }

    const updatedAccount = await AppDataSource.manager.save(account);

    return res.status(200).json({ success: true, message: 'Account updated successfully', account: updatedAccount})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// // DELETE account
router.delete('/account/:user_id/:account_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const account_id = parseInt(req.params.account_id, 10);
  
  try {
    const account = await AppDataSource.manager.findOneBy(Account, {
      user: { user_id: user_id }, 
      account_id: account_id
    });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    await AppDataSource.manager.delete(Account, account_id);

    return res.status(200).json({ success: true, message: 'Account deleted successfully', deletedAccount: account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

export default router
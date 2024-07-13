import { Router, Request, Response } from "express";

import { AppDataSource } from "../db/dataSource"; // Actual database
// import { AppDataSource } from "../tests/dataSourceTestLite"; // For testing
import { User } from "../db/entities/User";
import { Account } from "../db/entities/Account";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();


// POST account - create a new account
router.post('/account', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const { account_name, initialBalance } = req.body;
  
  if (isNaN(user_id) || !account_name) {
    return res.status(400).json({ success: false, message: 'Invalid user ID or missing account name' });
  }

  try {
    // const user = await AppDataSource.manager.findOneBy(User, {user_id: user_id}) as User;
    const account = await AppDataSource.manager.findOneBy(Account, {
      user: { user_id: user_id },
      account_name: account_name
    }) as Account;
    
    if(account) {
      return res.status(409).json({ success: false, message: "Account name already exists, try another name"});
    }
    const newAccount = AppDataSource.manager.create(Account, {
      user: { user_id: user_id },
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
      },
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET all accounts of a user
router.get('/accounts', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  
  try {
    const accounts = await AppDataSource.manager.findBy(Account, { user: { user_id: user_id } }) as Account[];
    
    return res.status(200).json({ 
      success: true, 
      message: "Account data retrived successfully", 
      accounts: accounts, 
      authInfo: req.jwt 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET one account's info
router.get('/account/:account_id', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const account_id = parseInt(req.params.account_id, 10);
  
  try {
    const account = await AppDataSource.manager.findOneBy(Account, {
      user: { user_id: user_id}, 
      account_id: account_id
    }) as Account;

    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      account: account,
      authInfo: req.jwt
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// PATCH account - update an account
router.patch('/account/:account_id', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const account_id = parseInt(req.params.account_id, 10);
  const { account_name, balance } = req.body;
  
  try {
    const account = await AppDataSource.manager.findOneBy(Account, {
      user: { user_id: user_id}, 
      account_id: account_id
    }) as Account;
    
    if (!account) {
      return res.status(409).json({ success: false, message: 'Account not found' });
    }
    
    if (account_name !== undefined) {
      const existingAccountName = await AppDataSource.manager.findOneBy(Account, {
        user: { user_id: user_id}, 
        account_name: account_name
      }) as Account;
      if (!existingAccountName) {
        account.account_name = account_name;
      } else {
        return res.status(409).json({ success: false, message: "Account name already exists, try another name"});
      }
    }
    if (balance !== undefined) {
      account.balance = balance;
    }

    const updatedAccount = await AppDataSource.manager.save(account);

    return res.status(200).json({ 
      success: true, 
      message: 'Account updated successfully', 
      account: updatedAccount,
      authInfo: req.jwt
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// // DELETE account
router.delete('/account/:account_id', authMiddleware, async (req: Request, res: Response) => {
  const user_id = req.jwt.sub;
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

    return res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully', 
      deletedAccount: account,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

export default router
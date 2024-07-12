import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

import { app } from '../app';
import { AppDataSource } from './dataSourceTestLite';
import { Account } from '../db/entities/Account';
import { Category } from '../db/entities/Category';
import { Transaction } from '../db/entities/Transaction';
import { User } from '../db/entities/User';


jest.mock('../middlewares/authMiddleware', () => {
	return (req: Request, res: Response, next: NextFunction) => {
		if(req.headers.authorization === 'valid_token') {
			next();
		} else res.status(401).json({ success: false, msg: 'You are not authorized'});
	}
});

beforeAll(async () => {

	const testUser = new User();
	testUser.user_id = 1;
	testUser.email = "test@example.com";
	testUser.password_hash = "hash";
	testUser.password_salt = "salt";
	testUser.email_confirmed = true;
	const savedUser = await AppDataSource.manager.save(testUser);
	
	const testCategory = new Category();
	testCategory.category_id = 1;
	testCategory.category_name = "test_category_1";
	testCategory.category_type = "expense";
	testCategory.category_color = "#ffff";
	testCategory.user = savedUser;
	const savedCategory = await AppDataSource.manager.save(testCategory);

	const testAccount = new Account();
	testAccount.account_id = 1;
	testAccount.account_name = "test_account_1";
	testAccount.user = savedUser;
	const savedAccount = await AppDataSource.manager.save(testAccount);

    const testTransaction = new Transaction();
		testTransaction.user = testUser;
    testTransaction.transaction_id = 1;
    testTransaction.amount = 250;
    testTransaction.date = new Date();
		testTransaction.type = "expense";
    testTransaction.account = savedAccount;
    testTransaction.category = savedCategory;
    testTransaction.description = "test description";
    const savedTransaction = await AppDataSource.manager.save(testTransaction);

	console.log(savedTransaction);
});


describe('POST /api/transaction', () => {
	
	it('Should not authorize', async () => {
		const testUserId = 1;
		const response = await request(app)
      .post(`/api/transaction/${testUserId}`);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
	});
  
	it('should not accept missing required fields', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/transaction/${testUserId}`)
    .set('authorization', 'valid_token')
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Missing required fields');
	});
  
	it('should save the new transaction', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/transaction/${testUserId}`)
    .set('authorization', 'valid_token')
    .send({
			"user_id": testUserId,
			"amount": 20,
			"type": "income",
			"category_id":  1,
			"account_id": 1,
			"date": "2024-07-07T12:00:00Z",
			"description": "Test description"
		});
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('transaction');
	});
});

describe('GET /api/transactions', () => {

  it('should return transactions', async () => {
    const testUserId = 1;
    const response = await request(app)
    .get(`/api/transactions/${testUserId}`)
    .set('authorization', 'valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('transactions');
  });
});

describe('GET /api/transaction', () => {

  it('should return the test transaction 1', async () => {
    const testUserId = 1;
    const testTransactionId = 1;
    const response = await request(app)
      .get(`/api/transaction/${testUserId}/${testTransactionId}`)
      .set('authorization', 'valid_token');

    expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('transaction');
  });
});

describe('PUT /api/transaction', () => {
  
  it('should not update the non-existent transaction', async () => {
    const testUserId = 1;
    const testTransactionId = 3;
    const response = await request(app)
      .put(`/api/transaction/${testUserId}/${testTransactionId}`)
      .set('authorization', 'valid_token')
      .send({ transaction_amount: 10});
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Transaction not found');
  });

  it('should not update the transcation with an undefined type', async () => {
    const testUserId = 1;
    const testTransactionId = 1;
    const response = await request(app)
      .put(`/api/transaction/${testUserId}/${testTransactionId}`)
      .set('authorization', 'valid_token')
      .send({ type: 'undefined_type'});
  
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('No valid updates was found');
  });

  it('should update the test transaction 1', async () => {
    const testUserId = 1;
    const testTransactionId = 1;
    const response = await request(app)
      .put(`/api/transaction/${testUserId}/${testTransactionId}`)
      .set('authorization', 'valid_token')
      .send({ description: 'updated description'});
  
		expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('updatedTransaction');
    expect(response.body.updatedTransaction.description).toBe('updated description');
  });
});

describe('DELETE /api/transaction', () => {
  
  it('should not delete a non existant transaction', async () => {
    const testUserId = 1;
    const testTransactionId = 3;
    const response = await request(app)
      .delete(`/api/transaction/${testUserId}/${testTransactionId}`)
      .set('authorization', 'valid_token');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Transaction not found');
  });

  it('should delete the second test transaction', async () => {
    const testUserId = 1;
    const testTransactionId = 2;
    const response = await request(app)
      .delete(`/api/transaction/${testUserId}/${testTransactionId}`)
      .set('authorization', 'valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('deleted successfully');
  });
});
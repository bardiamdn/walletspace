import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

import { Account } from '../db/entities/Account';
import { app } from '../app';
import { AppDataSourceTest } from './dataSourceTestLite';

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
	const savedUser = await AppDataSourceTest.manager.save(testUser);
	
	const testAccount = new Account();
	testAccount.account_id = 1;
	testAccount.account_name = "test_account_1";
	testAccount.user = savedUser;
	const savedAccount = await AppDataSourceTest.manager.save(testAccount);

	console.log(savedAccount);
});


describe('POST /api/account', () => {
	
	it('Should not authorize', async () => {
		const testUserId = 1;
		const response = await request(app)
      .post(`/api/account/${testUserId}`);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
	});
  
	it('should not accept missing account name on the body', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/account/${testUserId}`)
    .set('authorization', 'valid_token')
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('missing account name');
	});
  
	it('should save the new account', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/account/${testUserId}`)
    .set('authorization', 'valid_token')
    .send({ account_name: 'test_account_2'});
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('account');
	});

  it('should not accept the same account name', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/account/${testUserId}`)
    .set('authorization', 'valid_token')
    .send({ account_name: 'test_account_2' });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Account name already exists');
  });
});

describe('GET /api/accounts', () => {

  it('should return accounts', async () => {
    const testUserId = 1;
    const response = await request(app)
    .get(`/api/accounts/${testUserId}`)
    .set('authorization', 'valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accounts');
  });
});

describe('GET /api/account', () => {

  it('should return the test account 1', async () => {
    const testUserId = 1;
    const testAccountId = 1;
    const response = await request(app)
      .get(`/api/account/${testUserId}/${testAccountId}`)
      .set('authorization', 'valid_token');

    expect(response.status).toBe(200);
    expect(response.body.account.account_name).toBe('test_account_1');
  });
});

describe('PUT /api/account', () => {
  
  it('should not update the non existant account', async () => {
    const testUserId = 1;
    const testAccountId = 3;
    const response = await request(app)
      .put(`/api/account/${testUserId}/${testAccountId}`)
      .set('authorization', 'valid_token')
      .send({ account_name: 'updated_test_account'});
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Account not found');
  });

  it('should update the test account 1', async () => {
    const testUserId = 1;
    const testAccountId = 1;
    const response = await request(app)
      .put(`/api/account/${testUserId}/${testAccountId}`)
      .set('authorization', 'valid_token')
      .send({ account_name: 'updated_test_account'});
  
    expect(response.status).toBe(200);
    expect(response.body.account.account_name).toBe('updated_test_account');
  });
});

describe('DELETE /api/account', () => {
  
  it('should not delete a non existant account', async () => {
    const testUserId = 1;
    const testAccountId = 3;
    const response = await request(app)
      .delete(`/api/account/${testUserId}/${testAccountId}`)
      .set('authorization', 'valid_token');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Account not found');
  });

  it('should delete the second test account', async () => {
    const testUserId = 1;
    const testAccountId = 2;
    const response = await request(app)
      .delete(`/api/account/${testUserId}/${testAccountId}`)
      .set('authorization', 'valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('deleted successfully');
  });
});
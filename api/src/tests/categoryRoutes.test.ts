import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

import { app } from '../app';
import { AppDataSource } from './dataSourceTestLite';
import { Category } from '../db/entities/Category';
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
	const savedAccount = await AppDataSource.manager.save(testCategory);

	console.log(savedAccount);
});


describe('POST /api/category', () => {
	
	it('Should not authorize', async () => {
		const testUserId = 1;
		const response = await request(app)
      .post(`/api/category/${testUserId}`);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
	});
  
	it('should not accept missing category info on the body', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/category/${testUserId}`)
    .set('authorization', 'valid_token')
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid user ID or missing category info');
	});
  
	it('should save the new category', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/category/${testUserId}`)
    .set('authorization', 'valid_token')
    .send({ 
		category_name: 'test_category_2',
		category_type: 'income',
		category_color: '#c5c5cc'
	});
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('category');
	});

  it('should not accept the same category name', async () => {
    const testUserId = 1;
    const response = await request(app)
    .post(`/api/category/${testUserId}`)
    .set('authorization', 'valid_token')
    .send({ 
			category_name: 'test_category_2',
			category_type: 'income',
		 });
    
    expect(response.status).toBe(409);
    expect(response.body.message).toContain('Category name already exists');
  });
});

describe('GET /api/categories', () => {

  it('should return categories', async () => {
    const testUserId = 1;
    const response = await request(app)
    .get(`/api/categories/${testUserId}`)
    .set('authorization', 'valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('categories');
  });
});

describe('GET /api/category', () => {

  it('should return the test category 1', async () => {
    const testUserId = 1;
    const testCategoryId = 1;
    const response = await request(app)
      .get(`/api/category/${testUserId}/${testCategoryId}`)
      .set('authorization', 'valid_token');

    expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('category');
    expect(response.body.category.category_name).toBe('test_category_1');
  });
});

describe('PUT /api/category', () => {
  
  it('should not update the non existant category', async () => {
    const testUserId = 1;
    const testCategoryId = 3;
    const response = await request(app)
      .put(`/api/category/${testUserId}/${testCategoryId}`)
      .set('authorization', 'valid_token')
      .send({ category_name: 'updated_test_category'});
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Category not found');
  });

  it('should not update the category with a duplicate category_name', async () => {
    const testUserId = 1;
    const testCategoryId = 1;
    const response = await request(app)
      .put(`/api/category/${testUserId}/${testCategoryId}`)
      .set('authorization', 'valid_token')
      .send({ category_name: 'test_category_1'});
  
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Category name exists, try another name');
  });

  it('should update the test category 1', async () => {
    const testUserId = 1;
    const testCategoryId = 1;
    const response = await request(app)
      .put(`/api/category/${testUserId}/${testCategoryId}`)
      .set('authorization', 'valid_token')
      .send({ category_name: 'updated_test_category'});
  
    expect(response.status).toBe(200);
    expect(response.body.category.category_name).toBe('updated_test_category');
  });
});

describe('DELETE /api/category', () => {
  
  it('should not delete a non existant category', async () => {
    const testUserId = 1;
    const testCategoryId = 3;
    const response = await request(app)
      .delete(`/api/category/${testUserId}/${testCategoryId}`)
      .set('authorization', 'valid_token');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Category not found');
  });

  it('should delete the second test category', async () => {
    const testUserId = 1;
    const testCategoryId = 2;
    const response = await request(app)
      .delete(`/api/category/${testUserId}/${testCategoryId}`)
      .set('authorization', 'valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('deleted successfully');
  });
});
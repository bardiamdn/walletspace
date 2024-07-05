import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

import { Profile } from '../db/entities/Profile';
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
	
	const testProfile = new Profile();
	testProfile.profile_id = 1;
	testProfile.username = "test";
	testProfile.user = savedUser;
	const savedProfile = await AppDataSourceTest.manager.save(testProfile);

	console.log(savedProfile);
});

// afterAll(async () => {
// 	await AppDataSource.destroy(); // close the connection initialized in app.ts
// });

describe('Profile Routes', () => {

	it('should not allow without auth headers', async() => {
		const testUserId = 1;
		const response = await request(app).get(`/api/profile/${testUserId}`);
		expect(response.status).toBe(401);
		expect(response.body.msg).toContain('You are not authorized');
	});
	
	it('should return a profile if user exists', async () => {
		const testUserId = 1;
		const response = await request(app)
			.get(`/api/profile/${testUserId}`)
			.set('authorization', 'valid_token');
			
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('username');
	  });
		
	  it('should return 404 if profile does not exist', async () => {
			const nonExistingUserId = 2;
			const response = await request(app)
			.get(`/api/profile/${nonExistingUserId}`)
			.set('authorization', 'valid_token');
			expect(response.status).toBe(404);
			expect(response.body).toEqual({ message: 'Profile not found' });
	  });
		
	  it('should return 500 on server error', async () => {
			// Simulate a server error scenario
			jest.spyOn(AppDataSourceTest.manager, 'findOne').mockRejectedValueOnce(new Error('Database connection failed'));
			const testUserId = 1;
			const response = await request(app)
			.get(`/api/profile/${testUserId}`)
			.set('authorization', 'valid_token');
		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Server error' });
	  });
});

describe('PUT /profile/:user_id', () => {
	it('should update username successfully', async () => {
	const testUserId = 1;
	const newUsername = 'new_username';
	const response = await request(app)
		.put(`/api/profile/${testUserId}`)
		.query({ username: newUsername })
		.set('authorization', 'valid_token');
	expect(response.status).toBe(200);
	expect(response.body).toEqual({ success: true, message: 'Username updated successfully' });

	const updatedProfile = await AppDataSourceTest.manager.findOne(Profile, { where: { user: { user_id: testUserId } } });
	expect(updatedProfile?.username).toBe(newUsername);
	});

	it('should return 404 if profile does not exist', async () => {
	const nonExistingUserId = 2;
	const newUsername = 'new_username';
	const response = await request(app)
		.put(`/api/profile/${nonExistingUserId}`)
		.query({ username: newUsername })
		.set('authorization', 'valid_token');
	expect(response.status).toBe(404);
	expect(response.body).toEqual({ message: 'Profile not found' });
	});

	it('should return 500 on server error', async () => {
	// Simulate a server error scenario
	jest.spyOn(AppDataSourceTest.manager, 'findOne').mockRejectedValueOnce(new Error('Database connection failed'));
	const testUserId = 1;
	const newUsername = 'new_username';
	const response = await request(app)
		.put(`/api/profile/${testUserId}`)
		.query({ username: newUsername })
		.set('authorization', 'valid_token');
	expect(response.status).toBe(500);
	expect(response.body).toEqual({ message: 'Server error' });
	});
});
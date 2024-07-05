import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken'
import { app } from '../app';
import { AppDataSource } from '../db/dataSource';
import { User } from '../db/entities/User';
import * as utils from '../lib/utils';
import { AppDataSourceTest } from './dataSourceTestLite';


jest.mock('../lib/utils');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Routes', () => {

  // afterAll(async () => {
  //   await AppDataSource.destroy();
  // });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      // Mock the utility functions
      (utils.isValidEmail as jest.Mock).mockReturnValue(true);
      (utils.genPassword as jest.Mock).mockReturnValue({ salt: 'salt', hash: 'hash' });
      (utils.issueJWT as jest.Mock).mockReturnValue({ token: 'Bearer token' });
      (utils.sendConfirmationEmail as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toEqual(201);
      expect(res.body.success).toBeTruthy();
    });

    it('should not register a user with an invalid email', async () => {
      (utils.isValidEmail as jest.Mock).mockReturnValue(false);

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'invalid-email', password: 'password' });

      expect(res.status).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });

    it('should not register an existing user', async () => {
      (utils.isValidEmail as jest.Mock).mockReturnValue(true);

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('GET /auth/resend-confirm', () => {
    it('should resend the confirmation email', async () => {

      const res = await request(app).get('/auth/resend-confirm').query({ email: 'test@example.com' });

      expect(res.status).toEqual(200);
      expect(res.text).toContain('Please Confirm Your Email');
    });

    it('should return 404 for a non-existent or already confirmed email', async () => {
      const res = await request(app).get('/auth/resend-confirm').query({ email: 'nonexistent@example.com' });

      expect(res.status).toEqual(404);
      expect(res.text).toContain("Email doesn't exist or email is already confirmed");
    });
  });

  describe('GET /auth/confirm-email', () => {
    it('should confirm the email', async () => {
      const user = await AppDataSourceTest.manager.findOne(User, {where: {email: "test@example.com"}}) as User;
      user.email_confirmed = false;
      await AppDataSourceTest.getRepository(User).save(user);
  
      (jsonwebtoken.verify as jest.Mock).mockReturnValue({
        email: 'test@example.com',
        iat: Math.floor(Date.now()),
      });
  
      const token = 'mocked-token';
      const res = await request(app).get('/auth/confirm-email').query({ token });
  
      expect(res.status).toEqual(200);
      expect(res.text).toContain('Email Confirmation Successful!');
  
      const updatedUser = await AppDataSourceTest.getRepository(User).findOne({ where: { email: 'test@example.com' } });
      expect(updatedUser?.email_confirmed).toBe(true);
    });
  
    it('should handle expired token', async () => {
      (jsonwebtoken.verify as jest.Mock).mockReturnValue({
        email: 'test@example.com',
        iat: Math.floor(Date.now()) - 3600_000, // 1 hour ago
      });
  
      const res = await request(app).get('/auth/confirm-email').query({ token: 'expired-token' });
  
      expect(res.status).toEqual(400);
      expect(res.text).toContain('Your token is expired');
    });
  
    it('should handle user not found', async () => {
      (jsonwebtoken.verify as jest.Mock).mockReturnValue({
        email: 'nonexistent@example.com',
        iat: Math.floor(Date.now()),
      });
  
      const res = await request(app).get('/auth/confirm-email').query({ token: 'valid-token' });
  
      expect(res.status).toEqual(404);
      expect(res.text).toContain('User not found or email already confirmed');
    });
  });

  describe('POST /auth/signin', () => {
    it('should sign in a user', async () => {
      const userRepo = await AppDataSourceTest.manager.findOne(User, {where: { email: 'test@example.com' }}) as User;
      userRepo.email_confirmed = true
      await AppDataSourceTest.manager.save(userRepo);

      (utils.validPassword as jest.Mock).mockReturnValue(true);
      (utils.issueJWT as jest.Mock).mockReturnValue({ token: 'Bearer token' });

      const res = await request(app).post('/auth/signin').send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ success: true, authInfo: { token: 'Bearer token' } });
    });

    it('should return 404 for a non-existent user', async () => {
      const res = await request(app).post('/auth/signin').send({ email: 'nonexistent@example.com', password: 'password' });

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({ success: false, message: 'User not found' });
    });
    
    it('should return 401 for an invalid password', async () => {

      (utils.validPassword as jest.Mock).mockReturnValue(false);

      const res = await request(app).post('/auth/signin').send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({ success: false, message: 'Authentication failed' });
    });

    it('should return 401 for an unconfirmed email', async () => {
      const userRepo = await AppDataSourceTest.manager.findOne(User, {where: {email: "test@example.com"}}) as User;
      userRepo.email_confirmed = false;
      await AppDataSourceTest.manager.save(userRepo);

      const res = await request(app).post('/auth/signin').send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toEqual(401);
      expect(res.body.succcess).toBeFalsy();
    });
  });
});

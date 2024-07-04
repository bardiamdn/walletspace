import nodemailer from 'nodemailer';
import { AppDataSourceTest } from "./dataSourceTestLite";
import * as utils from '../lib/utils';
import { User } from '../db/entities/User';

jest.mock('nodemailer');


describe('Password Utilities', () => {
  const testPass: string = 'test_password';
  let hash: string;
  let salt: string;

  beforeEach(() => {
    const passwordData = utils.genPassword(testPass);
    hash = passwordData.hash;
    salt = passwordData.salt;
  });

  test('should generate a salt and a hash', () => {
    expect(hash).toHaveLength(128);
    expect(salt).toHaveLength(64);
  });

  test('should validate password', () => {
    const isValid: boolean = utils.validPassword(testPass, hash, salt);
    expect(isValid).toBeTruthy();
  });

  test('should invalidate wrong password', () => {
    const isValid: boolean = utils.validPassword('wrong_password', hash, salt);
    expect(isValid).toBeFalsy();
  });
});

describe('Email Utilities', () => {
  describe('isValidEmail', () => {
    test('should validate correct email addresses', () => {
      expect(utils.isValidEmail('test@example.com')).toBe(true);
      expect(utils.isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
    });

    test('should invalidate incorrect email addresses', () => {
      expect(utils.isValidEmail('plainaddress')).toBe(false);
      expect(utils.isValidEmail('@@missingusername.com')).toBe(false);
      expect(utils.isValidEmail('username@.com')).toBe(false);
      expect(utils.isValidEmail('username@.com.')).toBe(false);
    });
  });

  describe('sendConfirmationEmail', () => {
    let mockSendMail: jest.Mock;

    beforeEach(() => {
      mockSendMail = jest.fn().mockResolvedValue({});
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });
    });

    test('should send a confirmation email', async () => {
      const to = 'test@example.com';
      const token = 'test_token';

      await utils.sendConfirmationEmail(to, token);

      expect(mockSendMail).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'MS_qwdB6o@wallet-space.com',
        to: to,
        subject: 'Confirm Your Email',
        html: `<p>Click <a href="http://localhost:3000/auth/confirm-email?token=${token}">here</a> to confirm your email address.</p>`,
      });
    });

    test('should handle sendMail error', async () => {
      const to = 'test@example.com';
      const token = 'test_token';
      const error = new Error('Send mail failed');

      mockSendMail.mockRejectedValueOnce(error);

      console.error = jest.fn();

      await utils.sendConfirmationEmail(to, token);

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("Issue JWT", () =>{
    it('should create a token and an expires', async ()=> {
      const user = AppDataSourceTest.manager.create( User, {
        email: "test@example.com",
        password_hash: "hash",
        password_salt: "salt",
        email_confirmed: true
      }) as User;
      await AppDataSourceTest.manager.save(user);
  
      const userToken = utils.issueJWT(user);
  
      expect(userToken.token).toContain("Bearer ");
      expect(userToken.expires).toBe("7d");
    });
  });
});



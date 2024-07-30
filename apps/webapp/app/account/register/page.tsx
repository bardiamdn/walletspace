// /account/register.tsx
'use client'
import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

import styles from '../../authRoutes.module.css';

interface RegisterFormValues {
  email: string;
  password: string;
}

const RegisterPage: NextPage = () => {
  const [formValues, setFormValues] = useState<RegisterFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const newErrors: { email?: string; password?: string } = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const validate = () => {

    if (!emailRegex.test(formValues.email)) newErrors.email = 'Invalid email address';
    if (formValues.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://192.168.1.184:3000/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (res.status === 201) {
        alert('You’ve been registered successfully! Please check your email to confirm your account and activate your registration.');
        router.push('/account/signin');
      } else {
        const data = await res.json();
        alert(data.message || 'Register failed');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (formValues.email.length === 0) {
      setErrors({ email: 'You must enter your email' });
      return;
    }
    if (!emailRegex.test(formValues.email)) {
      setErrors({ email: 'Invalid email address' });
      return;
    }
    
    setResendLoading(true);
    try {
      const res = await fetch(`http://192.168.1.184:3000/auth/resend-email?email=${formValues.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        alert('Email sent successfully');
        setErrors({});
      } else {
        const data = await res.json();
        alert(data.message || 'Resend email failed');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className={styles.inlineContainer}>
          <p className={styles.text}>Already have an account?</p>
          <a href='/account/signin' className={styles.link}>
            Sign in
          </a>
          <button type='button' onClick={handleResendEmail} className={styles.resendButton} disabled={resendLoading}>
          {resendLoading ? "Sending Email..." : "Resend Email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage
// /account/signin.tsx
'use client'
import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import styles from '../authRoutes.module.css';

interface SignInFormValues {
  email: string;
  password: string;
}


const api_url = process.env.NEXT_PUBLIC_API_URL_DEV;
const SignInPage: NextPage = () => {
  const [formValues, setFormValues] = useState<SignInFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (formValues.email.length === 0) newErrors.email = 'Empty email fiekd';
    if (formValues.password.length === 0) newErrors.password = 'Empty password fiekd';
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
      const res = await fetch(api_url+'/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formValues),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('authToken', data.authInfo.token)
        router.replace('/');
      } else {
        alert(data.message || 'Sign-in failed');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
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
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className={styles.inlineContainer}>
          <p className={styles.text}>
            Don't have an account? 
          </p>
          <a className={styles.link} href='/account/register' >
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignInPage
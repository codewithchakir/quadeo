'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(credentials);
    
    if (result.success) {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-6">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Quadeo
            </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="Email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:primary-500"
          />
        </div>
        
        {/* Password Input */}
        <div>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:primary-500"
          />
        </div>
        
        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:primary-500 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Sign up link */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
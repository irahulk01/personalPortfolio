"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '../../api/admin';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const data = await loginAdmin(email, password);

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e2029]">
      <div className="bg-[#2a2d3e] p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#3e4355]">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Admin Panel</h2>
        <p className="text-center text-[#8c90aa] mb-8">Sign in to access the dashboard</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#8c90aa] mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e2029] border border-[#3e4355] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff033e] transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8c90aa] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1e2029] border border-[#3e4355] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff033e] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff033e] hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(255,3,62,0.3)] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

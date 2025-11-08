import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for login.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Login gagal'));
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">LifeMon</h1>
          <p className="text-lg text-blue-200">Monitor and improve the quality of your healthy lifestyle every day.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-dark mb-8">
            Welcome back!
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-2" />
              <input
                type="email" name="email" id="email" placeholder="anda@email.com"
                onChange={handleChange} required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-2" />
              <input
                type="password" name="password" id="password" placeholder="••••••••"
                onChange={handleChange} required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2.5 px-4 rounded-md hover:bg-primary-hover transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
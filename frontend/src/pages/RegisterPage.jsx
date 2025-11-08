import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi'; 

function RegisterPage() {
  const [formData, setFormData] = useState({ nama: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Registrasi gagal'));
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* Kolom Kiri - Branding/Visual (Sama seperti halaman Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">LifeMon</h1>
          <p className="text-lg text-blue-200">Monitor and improve the quality of your healthy lifestyle every day.</p>
        </div>
      </div>

      {/* Kolom Kanan - Form Registrasi */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-dark mb-8">
           Create New Account
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Input untuk Nama Lengkap */}
            <div className="mb-4 relative">
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-2" />
              <input
                type="text" name="nama" id="nama" placeholder="Nama Anda"
                onChange={handleChange} required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Input untuk Email */}
            <div className="mb-4 relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-2" />
              <input
                type="email" name="email" id="email" placeholder="anda@email.com"
                onChange={handleChange} required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            
            {/* Input untuk Password */}
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-2" />
              <input
                type="password" name="password" id="password" placeholder="••••••••"
                onChange={handleChange} required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-2.5 px-4 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              List Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
           Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
             Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
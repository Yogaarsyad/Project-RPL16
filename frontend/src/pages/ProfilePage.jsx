import React, { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile, uploadAvatar } from '../services/api';
import { FiCamera, FiSave, FiEdit, FiUser, FiBook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function ProfilePage() {
  const [profile, setProfile] = useState({
    nama: '',
    npm: '',
    jurusan: '',
    email: '',
    phone: '',
    alamat: '',
    bio: '',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (response && response.data) {
          setProfile({
            nama: response.data.nama || user.nama || '',
            npm: response.data.npm || user.npm || '',
            jurusan: response.data.jurusan || user.jurusan || '',
            email: response.data.email || user.email || '',
            phone: response.data.phone || user.phone || '',
            alamat: response.data.alamat || user.alamat || '',
            bio: response.data.bio || user.bio || '',
            avatar_url: response.data.avatar_url || user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback ke localStorage data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setProfile({
          nama: user.nama || '',
          npm: user.npm || '',
          jurusan: user.jurusan || '',
          email: user.email || '',
          phone: user.phone || '',
          alamat: user.alamat || '',
          bio: user.bio || '',
          avatar_url: user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, dll)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    try {
      setSaving(true);
      
      // Preview image langsung
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar_url: e.target.result }));
      };
      reader.readAsDataURL(file);

      // Upload ke server
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await uploadAvatar(formData);
      
      // Update profile dengan URL avatar dari response
      if (response.data.avatar_url) {
        setProfile(prev => ({ ...prev, avatar_url: response.data.avatar_url }));
      }
      
      alert('Foto profil berhasil diubah!');
    } catch (error) {
      console.error("Gagal upload avatar:", error);
      alert('Gagal mengubah foto profil. Pastikan backend mendukung upload avatar.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateProfile({
        nama: profile.nama,
        npm: profile.npm,
        jurusan: profile.jurusan,
        email: profile.email,
        phone: profile.phone,
        alamat: profile.alamat,
        bio: profile.bio
      });
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        nama: profile.nama,
        npm: profile.npm,
        jurusan: profile.jurusan,
        email: profile.email,
        phone: profile.phone,
        alamat: profile.alamat,
        bio: profile.bio
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error("Error update profil:", error);
      alert('Gagal memperbarui profil. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Mahasiswa</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Photo & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';
                  }}
                />
                <button
                  onClick={handleAvatarClick}
                  disabled={saving}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiCamera className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mt-4">{profile.nama}</h2>
              <p className="text-gray-600 text-sm">{profile.npm}</p>
              <p className="text-blue-600 font-medium">{profile.jurusan}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiMail className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm truncate">{profile.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiPhone className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                {profile.alamat && (
                  <div className="flex items-start text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{profile.alamat}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Profil</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                {editing ? 'Batal Edit' : 'Edit Profil'}
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="nama" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="w-4 h-4 mr-2" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    id="nama"
                    value={profile.nama}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="npm" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiBook className="w-4 h-4 mr-2" />
                    NPM
                  </label>
                  <input
                    type="text"
                    name="npm"
                    id="npm"
                    value={profile.npm}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Masukkan NPM"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="jurusan" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiBook className="w-4 h-4 mr-2" />
                    Jurusan
                  </label>
                  <select
                    name="jurusan"
                    id="jurusan"
                    value={profile.jurusan}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    <option value="">Pilih Jurusan</option>
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Teknik Komputer">Teknik Komputer</option>
                    <option value="Teknik Elektro">Teknik Elektro</option>
                    <option value="Teknik Industri">Teknik Industri</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Akuntansi">Akuntansi</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="w-4 h-4 mr-2" />
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="08xx-xxxx-xxxx"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="alamat" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    Alamat
                  </label>
                  <textarea
                    name="alamat"
                    id="alamat"
                    rows="3"
                    value={profile.alamat}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-none"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="w-4 h-4 mr-2" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows="4"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-none"
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                  />
                </div>
              </div>

              {editing && (
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
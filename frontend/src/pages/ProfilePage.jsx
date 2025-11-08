import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getProfile, updateProfile } from '../services/api'; // Import fungsi API asli

function ProfilePage() {
  const [profile, setProfile] = useState({
    bio: '',
    nama: '',
    avatar_url: 'https://via.placeholder.com/150' // URL Avatar default
  });
  const [loading, setLoading] = useState(true);

  // Ambil data profil dari backend saat komponen dimuat.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        const user = JSON.parse(localStorage.getItem('user'));
        setProfile({
          bio: data.bio || '',
          nama: user.nama || '', // Menggunakan nama dari localStorage jika tersedia.
          avatar_url: data.avatar_url || 'https://via.placeholder.com/150'
        });
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 2. Kirim data yang diperbarui ke backend
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ bio: profile.bio, nama: profile.nama });
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      alert('Gagal memperbarui profil.');
      console.error("Error update profil:", error);
    }
  };

  // (fungsi handleAvatarChange untuk upload foto bisa diimplementasikan nanti)

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profil</h2>

        <div className="flex items-center space-x-6 mb-8">
          <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
          {/* ... (logika upload foto tetap sama) ... */}
        </div>

        <form onSubmit={handleProfileUpdate}>
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text" name="nama" id="nama"
              value={profile.nama} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio" name="bio" rows="4"
              value={profile.bio} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ceritakan sedikit tentang diri Anda..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2.5 px-4 rounded-md hover:bg-primary-hover"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
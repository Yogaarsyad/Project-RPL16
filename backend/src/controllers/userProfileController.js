// backend/src/controllers/userProfileController.js
const userProfileModel = require('../models/userProfileModel');
const userModel = require('../models/userModel');

exports.getProfile = async (req, res) => {
    try {
        // Memanggil fungsi getProfileByUserId yang sudah di-JOIN
        const profile = await userProfileModel.getProfileByUserId(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profil tidak ditemukan' });
        }
        res.json({ 
            success: true, 
            data: profile 
        });
    } catch (error) {
        console.error('Error getProfile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Ambil semua data dari body
        const { nama, npm, jurusan, email, phone, alamat, bio, avatar_url } = req.body;
        const userId = req.user.id;
        
        if (!nama || !npm || !jurusan || !email) {
            return res.status(400).json({
                success: false, message: 'Nama, NPM, jurusan, dan email wajib diisi'
            });
        }

        // 1. Siapkan data untuk tabel 'users'
        const userData = { nama, npm, jurusan, email };
        
        // 2. Siapkan data untuk tabel 'user_profiles'
        const profileData = { phone, alamat, bio, avatar_url };

        // 3. Jalankan kedua update secara paralel
        await Promise.all([
            userModel.updateUser(userId, userData),
            userProfileModel.upsertProfileByUserId(userId, profileData)
        ]);
        
        // 4. Ambil data gabungan yang baru
        const updatedFullProfile = await userProfileModel.getProfileByUserId(userId);
        
        res.json({ 
            success: true, 
            message: 'Profil berhasil diperbarui',
            data: updatedFullProfile 
        });
    } catch (error) {
        console.error('Error updateProfile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
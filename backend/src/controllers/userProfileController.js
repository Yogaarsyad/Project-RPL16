const userProfileModel = require('../models/userProfileModel');

// Fungsi untuk MENGAMBIL data profil saat ini
exports.getProfile = async (req, res) => {
    try {
        const profile = await userProfileModel.getProfileByUserId(req.user.id);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fungsi untuk MEMPERBARUI data profil pengguna. 
exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await userProfileModel.updateProfileByUserId(req.user.id, req.body);
        res.json({ message: 'Profil berhasil diperbarui', profile: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
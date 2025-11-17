// backend/src/models/userProfileModel.js
const db = require('../config/db');

/**
 * Mengambil data gabungan dari users dan user_profiles
 */
async function getProfileByUserId(userId) {
    try {
        const query = `
            SELECT 
                u.id, u.nama, u.email, u.npm, u.jurusan,
                up.phone, up.alamat, up.bio, up.avatar_url
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = $1
        `;
        const { rows } = await db.query(query, [userId]);
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to get profile: ${error.message}`);
    }
}

/**
 * Meng-update atau Meng-insert profil di tabel user_profiles
 * Ini disebut "UPSERT"
 */
async function upsertProfileByUserId(userId, profileData) {
    const { phone, alamat, bio, avatar_url } = profileData;
    try {
        const query = `
            INSERT INTO user_profiles (user_id, phone, alamat, bio, avatar_url, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET
                phone = EXCLUDED.phone,
                alamat = EXCLUDED.alamat,
                bio = EXCLUDED.bio,
                avatar_url = EXCLUDED.avatar_url,
                updated_at = NOW()
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, phone, alamat, bio, avatar_url]);
        return rows[0];
    } catch (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
    }
}

module.exports = {
    getProfileByUserId,
    upsertProfileByUserId // <-- Nama fungsi diubah
};
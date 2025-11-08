const db = require('../config/db');

/**

 * @param {number} userId ID pengguna.
  @returns {Promise<object>} Data profil pengguna.
 */
const getProfileByUserId = async (userId) => {
    const result = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    return result.rows[0];
};

/**

 * @param {number} userId 
 * @param {object} profileData 
 * @returns {Promise<object>}
 */
const updateProfileByUserId = async (userId, { tinggi_cm, berat_kg, usia, jenis_kelamin, bio, avatar_url }) => {
   
    const result = await db.query(
        `UPDATE user_profiles 
         SET 
            tinggi_cm = COALESCE($1, tinggi_cm), 
            berat_kg = COALESCE($2, berat_kg), 
            usia = COALESCE($3, usia), 
            jenis_kelamin = COALESCE($4, jenis_kelamin),
            bio = COALESCE($5, bio),
            avatar_url = COALESCE($6, avatar_url),
            updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $7 RETURNING *`,
        [tinggi_cm, berat_kg, usia, jenis_kelamin, bio, avatar_url, userId]
    );
    return result.rows[0];
};

module.exports = {
    getProfileByUserId,
    updateProfileByUserId,
};
const model = require('../models/exerciseLogModel');

exports.addLog = async (req, res) => {
    try {
       
        const newLog = await model.createExerciseLog(
            req.user.id, 
            req.body.nama_olahraga, 
            req.body.durasi_menit, 
            req.body.kalori_terbakar, 
            req.body.tanggal
        );
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan log olahraga', error: error.message });
    }
};


exports.getLogs = async (req, res) => {
    try {
        // Panggil nama fungsi yang baru: getExerciseLogsByUserId
        const logs = await model.getExerciseLogsByUserId(req.user.id);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil log olahraga', error: error.message });
    }
};
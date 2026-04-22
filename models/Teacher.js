const mongoose = require('mongoose');

// Схема для викладачів
const teacherSchema = new mongoose.Schema({
    surname: { type: String, required: true },      // піб
    position: { type: String, required: true },     // посада
    degree: { type: String, required: true },       // ступінь (кандидат наук, доцент, професор)
    roomNumber: { type: String, required: true }    // номер аудиторії
}, { timestamps: true });  // автоматично додає createdAt, updatedAt

module.exports = mongoose.model('Teacher', teacherSchema);
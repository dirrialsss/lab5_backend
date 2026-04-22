const mongoose = require('mongoose');

// Схема для курсів
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },          // назва курсу
    hours: { type: Number, required: true },         // кількість годин
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }  // зв'язок з викладачем
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
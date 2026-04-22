const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

// список всіх викладачів
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find().sort({ createdAt: -1 });
        res.render('index', { teachers, title: 'Викладачі кафедри' });
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// форма додавання нового викладача
router.get('/add', (req, res) => {
    res.render('add', { title: 'Додати викладача' });
});

// збереження нового викладача
router.post('/add', async (req, res) => {
    try {
        const newTeacher = new Teacher({
            surname: req.body.surname,
            position: req.body.position,
            degree: req.body.degree,
            roomNumber: req.body.roomNumber
        });
        await newTeacher.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// показ інформації про викладача та його курси
router.get('/teacher/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).send('Викладача не знайдено');
        
        const courses = await Course.find({ teacherId: teacher._id });
        
        res.render('show', { teacher, courses, title: 'Інформація про викладача' });
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// форма редагування викладача
router.get('/edit/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).send('Викладача не знайдено');
        res.render('edit', { teacher, title: 'Редагувати викладача' });
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// збереження змін викладача
router.post('/edit/:id', async (req, res) => {
    try {
        await Teacher.findByIdAndUpdate(req.params.id, {
            surname: req.body.surname,
            position: req.body.position,
            degree: req.body.degree,
            roomNumber: req.body.roomNumber
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// видалення викладача та його курсів
router.post('/delete/:id', async (req, res) => {
    try {
        // Спочатку видаляємо всі курси цього викладача
        await Course.deleteMany({ teacherId: req.params.id });
        // Потім видаляємо самого викладача
        await Teacher.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// додавання курсу для викладача
router.post('/add-course/:teacherId', async (req, res) => {
    try {
        const newCourse = new Course({
            name: req.body.courseName,
            hours: req.body.hours,
            teacherId: req.params.teacherId
        });
        await newCourse.save();
        res.redirect(`/teacher/${req.params.teacherId}`);
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// видалення курсу
router.post('/delete-course/:courseId', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        const teacherId = course.teacherId;
        await Course.findByIdAndDelete(req.params.courseId);
        res.redirect(`/teacher/${teacherId}`);
    } catch (err) {
        res.status(500).send('Помилка: ' + err.message);
    }
});

// API для отримання списку викладачів у форматі JSON
router.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
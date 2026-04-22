const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');

const app = express();
const PORT = 3000;

// реєструємо хелпер для порівняння значень у шаблонах
hbs.registerHelper('eq', function(a, b) {
    return a === b;
});

// Підключення до MongoDB Atlas
const MONGODB_URI = 'mongodb://siukalods_db_user:qnXfEn5lpkKebjqD@ac-haw00pw-shard-00-00.r1hs7l5.mongodb.net:27017,ac-haw00pw-shard-00-01.r1hs7l5.mongodb.net:27017,ac-haw00pw-shard-00-02.r1hs7l5.mongodb.net:27017/?ssl=true&replicaSet=atlas-95nzlf-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Підключено до MongoDB Atlas!'))
    .catch(err => console.log('Помилка підключення:', err));

// налаштування шаблонів
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// налаштування для обробки даних форм та статичних файлів
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// маршрути
const teacherRoutes = require('./routes/teachers');
app.use('/', teacherRoutes);

// запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
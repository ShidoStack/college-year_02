const express = require('express');
const router = express.Router();


router.use((req, res, next) => {

    console.log(
        req.method,
        req.baseUrl + req.url,
        new Date().toLocaleString()
    );

    next();
});


router.get('/students', (req, res) => {
    res.send('Students List');
});

router.get('/courses', (req, res) => {
    res.send('Courses List');
});

router.get('/faculty', (req, res) => {
    res.send('Faculty List');
});


module.exports = router;
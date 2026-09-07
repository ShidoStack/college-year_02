const express = require('express');
const app = express();

const router = require('./router');
const PORT = 3000;


app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


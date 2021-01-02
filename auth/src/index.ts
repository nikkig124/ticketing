import express = require('express');
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
    res.send('hello')
})

app.listen(3000, () => {
    console.log('listening on 3000');
});

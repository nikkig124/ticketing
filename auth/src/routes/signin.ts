import { Request, Response } from 'express';
import * as express from 'express';

const router = express.Router();

router.get('/api/users/sigin', (req, res) => {
    res.send('signin')
});

export {router as signInRouter};
import { Request, Response } from 'express';
import * as express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    res.send('hi there')
});

export {router as currentUserRouter};
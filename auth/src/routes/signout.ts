import { Request, Response } from 'express';
import * as express from 'express';

const router = express.Router();

router.get('/api/users/signout', (req, res) => {
    res.send('hi signout')
});

export {router as signOutRouter};
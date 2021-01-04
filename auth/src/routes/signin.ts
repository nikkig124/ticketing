import { Request, Response } from 'express';
import * as express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request';
import { Password } from '../util/password';

const router = express.Router();

router.post(
    '/api/users/signin',
    [
        body('email').isEmail().withMessage('email must be valid'),
        body('password').trim().notEmpty().withMessage('you must supply pw'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(
          existingUser.password,
          password
        );
        if (!passwordsMatch) {
          throw new BadRequestError('Invalid Credentials');
        }

        // Generate JWT
        const userJwt = jwt.sign(
          {
            id: existingUser.id,
            email: existingUser.email
          },
          process.env.JWT_KEY!
        );

        // Store it on session object
        req.session = {
          jwt: userJwt
        };

        res.status(200).send(existingUser);
    },
);

export { router as signinRouter };

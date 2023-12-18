import {Router} from 'express';
const router = Router();

import * as helpers from '../helpers.js';

import dotenv from 'dotenv';
dotenv.config();

router.route('/').get(async (req, res) => {
    const env = {
        domain: process.env.DOMAIN,
        clientId: process.env.CLIENT_ID
    }
    return res.status(200).json(env)
});

export default router;

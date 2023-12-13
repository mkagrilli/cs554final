/*******************************************************************************
 * Name        : stories.js
 * Author      : Brandon Leung
 * Date        : March 25, 2023
 * Description : Lab 6 bands route function implementation.
 * Pledge      : I pledge my honor that I have abided by the Stevens Honor System.
 ******************************************************************************/
// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
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

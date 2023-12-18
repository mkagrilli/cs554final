import {Router} from 'express';
const router = Router();

import * as helpers from '../helpers.js';
import * as posts from '../data/posts.js';

import dotenv from 'dotenv';
dotenv.config();

router.route('/').get(async (req, res) => {
    try {
        return res.status(200).json({data: await posts.getAll()})
    } catch (e) {
        return res.status(400).json({error: e.message});
    }    
});

// router.route('/newpost').post(async (req, res) => {
//     try {
//         let postInfo = req.body;

//         const post = await posts.create()
//         return res.status(200).json({data: await users.get(req.params.id)});
//     } catch (e) {
//         return res.status(400).json({error: e.message});
//     }
// });

router.route('/:id').get(async (req, res) => {
    try {
        req.params.id = helpers.isValidString(req.params.id, "User ID");
        return res.status(200).json({data: await posts.get(req.params.id)});
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
});

export default router;

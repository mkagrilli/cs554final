import {Router} from 'express';
const router = Router();

import * as helpers from '../helpers.js';
import * as posts from '../data/posts.js';
import * as comments from '../data/comments.js';
import { ObjectId } from 'mongodb';
import axios from 'axios';

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
        req.params.id = helpers.isValidString(req.params.id, "Post ID");
        return res.status(200).json({data: await posts.get(req.params.id)});
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
})
.post(async (req, res) => {
        const postId = req.params.id
        const comment = req.body
        const userId = "6583386c02d40519dff254b6"
        let body = comment.body
        let classification = comment.classification
    try {
        console.log('hi')
         //placeholder, will be retrieved via express-session cookie
        body = helpers.isValidString(body, 'body');
        classification = helpers.isValidString(classification, 'classification')
        const confirmResponse = await axios.get(`https://nuthatch.lastelm.software/birds/${classification}`, {headers: {accept: 'application/json', 'API-Key': '5740c2e1-3293-45b3-a215-31edafa6d2d6'}})
        console.log(confirmResponse.data)
        if (!ObjectId.isValid(postId)) {throw new Error("Error: invalid object ID")};
	    if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID")};
    }catch(e) {
        console.log(e.response.config.headers)
        console.log('error')
        return res.status(400).json({error: e.message});
    }
    try {
        let commentId = await comments.create(postId.trim(), userId.trim(), body.trim(), classification.trim())
        if (!commentId) {
            throw `error: could not post comment`
        }
        console.log(commentId)
        return res.status(200).json({commentId: commentId})
    }catch(e) {
        console.log(e)
        return res.status(500).json({error: e})
    }
});

export default router;

import {Router} from 'express';
const router = Router();

import * as helpers from '../helpers.js';
import * as users from '../data/users.js'

import dotenv from 'dotenv';
dotenv.config();

router.route('/').get(async (req, res) => {
    try {
        return res.status(200).json({data: await users.getAll()})
    } catch (e) {
        return res.status(400).json({error: e.message});
    }    
});

// Come back to this when we get Auth0 Down
// router.route('/register').post(async (req, res) => {
//     try {
//         let registerInfo = req.body;

//         return res.status(200).json({data: await users.get(req.params.id)});
//     } catch (e) {
//         return res.status(400).json({error: e.message});
//     }
// });

router.route('/:id').get(async (req, res) => {
    try {
        req.params.id = helpers.isValidString(req.params.id, "User ID");
        return res.status(200).json({data: await users.get(req.params.id)});
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
});

router.route('/checkIfRegistered').post(async (req, res) => {
    
    const data = req.body;
    try {
        console.log(await users.getByAuthId(req.body.authId));
        return res.status(200).json({isRegistered: true});
    } catch (e) {
        return res.status(200).json({isRegistered: false});

    }
    
});

router.route('/register').post(async (req, res) => {
    const data = req.body;
    try {
        console.log(await users.create(data.authId, data.username, data.email));
        return res.status(200).json({isRegistered: true});
    } catch (e) {
        return res.status(200).json({isRegistered: false});

    }
    
});

router.route('/authid/:id').get(async (req, res) => {
    try {
        req.params.id = helpers.isValidString(req.params.id, "User ID");
        return res.status(200).json({data: await users.getByAuthId(req.params.id)});
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
});

export default router;

import {Router} from 'express';
const router = Router();

import * as helpers from '../helpers.js';
import * as users from '../data/users.js'

import dotenv from 'dotenv';
dotenv.config();

import * as redis from 'redis';
const client = redis.createClient();
await client.connect();

router.route('/').get(async (req, res) => {
    console.log("hello")
    try {
        if (await client.exists(`allUsers`)) {
            console.log("All users found in cache.")
            let userData = JSON.parse(await client.get(`allUsers`));
            console.log('Sending JSON from Redis....');
            return res.status(200).json({data: userData});

        } else {
            const userData = await users.getAll();
            console.log("All users were not found in cache.")
            await client.set(`allUsers`, JSON.stringify(userData))
            return res.status(200).json({data: userData});
        }
    } catch (e) {
        return res.status(400).json({error: e.message});
    }    
});


router.route('/:id').get(async (req, res) => {
    try {
        req.params.id = helpers.isValidString(req.params.id, "User ID");
        if (await client.exists(`users-${req.params.id}`)) {
            console.log("User found in cache.")
            let userData = JSON.parse(await client.get(`users-${req.params.id}`));
            console.log('Sending JSON from Redis....');
            return res.status(200).json({data: userData});

        } else {
            const userData = await users.get(req.params.id);
            console.log("User was not found in cache.")
            await client.set(`users-${req.params.id}`, JSON.stringify(userData))
            return res.status(200).json({data: userData});
        }
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
        await client.del('allUsers');
        return res.status(200).json({isRegistered: true});
    } catch (e) {
        return res.status(200).json({isRegistered: false});

    }
    
});

router.route('/authid/:id').get(async (req, res) => {
    try {
        req.params.id = helpers.isValidString(req.params.id, "User ID");
        if (await client.exists(`userAuthId-${req.params.id}`)) {
            console.log("User AuthId found in cache.")
            let userData = JSON.parse(await client.get(`userAuthId-${req.params.id}`));
            console.log('Sending JSON from Redis....');
            return res.status(200).json({data: userData});

        } else {
            const userData = await users.getByAuthId(req.params.id)
            console.log("User AuthId was not found in cache.")
            await client.set(`userAuthId-${req.params.id}`, JSON.stringify(userData))
            return res.status(200).json({data: userData});
        }
    } catch (e) {
        return res.status(400).json({error: e.message});
    }
});

export default router;

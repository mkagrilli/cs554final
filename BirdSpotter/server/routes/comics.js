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
import md5 from 'blueimp-md5';
import axios from 'axios'
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});
const publickey = '60592156bde3858f1caa49a399680cdd';
const privatekey = 'd5cad7eff74d9a354c015d6f12293802a1bbb4fc';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';

router.route('/page/:pagenum').get(async (req, res) => {
    try {
        helpers.isValidNumber(req.params.pagenum);
        if (req.params.pagenum < 1) {
            throw new Error("Error")
        }
    } catch (e) {
        return res.status(400).json({error: 'Error: invalid page number.'});
    }
    try {
        const limit = 50;
        const offset = limit * (req.params.pagenum - 1)
        console.log(`Will load results ${offset} - ${offset + 50}`)
        const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&limit=' + limit + '&offset=' + offset;
        console.log(url)
        let {data} = await axios.get(url);
        if (data.code !=  200 || data.status != "Ok") {
            throw new Error("Error: comic not found.")
        }
        const comicData = data.data.results;
        console.log(`Page Size: ${comicData.length}`)
        if (comicData.length == 0) {
            throw new Error("Page 2 Hi")
        }
        await client.set(`comics-page-${req.params.pagenum}`, JSON.stringify(comicData));
        return res.status(200).json(comicData);
    } catch (e) {
        console.log("Error occured in /routes/comics.js")
        return res.status(404).json({error: e.message});
    }
});


router.route('/:id').get(async (req, res) => {
    try {
        helpers.isValidString(req.params.id);
        helpers.isNumericString(req.params.id);
    } catch (e) {
        return res.status(400).json({error: 'Error: invalid id.'});
    }
    try {
        const url = baseUrl + '/' + req.params.id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        let {data} = await axios.get(url);
        if (data.code !=  200 || data.status != "Ok") {
            throw new Error("Error: comic not found.")
        }
        const comicData = data.data.results[0];
        await client.set(`comics-id-${req.params.id}`, JSON.stringify(comicData));
        return res.status(200).json(comicData);
    } catch (e) {
        return res.status(404).json({error: e.message});
    }
});

export default router;

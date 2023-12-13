/*******************************************************************************
 * Name        : app.js
 * Author      : Brandon Leung
 * Date        : March 25, 2023
 * Description : Hello, comment "Hello there" if you read this :)
 * Pledge      : I pledge my honor that I have abided by the Stevens Honor System.
 ******************************************************************************/
// This file should set up the express server as shown in the lecture code

import express from 'express';
import cors from 'cors'
import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const staticDir = express.static(__dirname + '/public');
import configRoutes from './routes/index.js';
import * as helpers from './helpers.js'
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());



// app.use('/api/comics/page/:pagenum', async (req, res, next) => {
//     try {
//         helpers.isValidNumber(req.params.pagenum);
//         if (req.params.pagenum < 1) {
//             throw new Error("Error")
//         }
//     } catch (e) {
//         console.log("Error occured in /app.js (/api/comics/page/:pagenum)")
//         return res.status(400).json({error: 'Error: invalid page number.'});
//     }
//     try {
//         if (await client.exists(`comics-page-${req.params.pagenum}`)) {
//             console.log('Comic data found in cache.');
//             let comicData = JSON.parse(await client.get(`comics-page-${req.params.pagenum}`));
//             console.log('Sending JSON from Redis....');
//             return res.status(200).json(comicData);
//         } else {
//             console.log('Comic not data found in cache.');
//             next();
//         }
//     } catch (error) {
//         console.log("Error occured in /app.js (/api/comics/page/:pagenum)")
//         return res.status(500).json({error: "Error: was not able to fetch comic data from cache"})
//     }
// })

// app.use('/api/comics/:id', async (req, res, next) => {
//     if ((req.originalUrl.includes('/api/comics/page')) == false) {
//         console.log(req.originalUrl)
//         try {
//             helpers.isValidNumber(req.params.id);
//             if (req.params.id < 1) {
//                 throw new Error("Error")
//             }
//         } catch (e) {
//             console.log("Error occured in /app.js (/api/comics/:id)")
//             return res.status(400).json({error: 'Error: invalid id.'});
//         }
//         try {
//             if (await client.exists(`comics-id-${req.params.id}`)) {
//                 console.log('Comic data found in cache.');
//                 let comicData = JSON.parse(await client.get(`comics-id-${req.params.id}`));
//                 console.log('Sending JSON from Redis....');
//                 return res.status(200).json(comicData);
//             } else {
//                 console.log('Comic not data found in cache.');
//                 next();
//             }
//         } catch (error) {
//             console.log("Error occured in /app.js (/api/comics/:id)")
//             return res.status(500).json({error: "Error: was not able to fetch comic data from cache"})
//         }
//     } else {
//         next();
//     }
// });

configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

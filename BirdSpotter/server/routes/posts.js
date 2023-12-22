import { Router } from 'express';
import axios from 'axios';
import multer from 'multer';
import * as redis from 'redis';
import * as helper from '../helpers.js';
import { flatten, unflatten } from 'flat';

const client = redis.createClient();
const upload = multer();
const router = Router();

import * as helpers from '../helpers.js'
import * as posts from '../data/posts.js';
import * as comments from '../data/comments.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
var api_key = 'cf69ccfea8804bfa99abb6fe78e8f6f0';

import * as cloud from '../utils/cloudinary.js';
import { promisify } from 'util';
import fs from 'fs';
const readdirAsync = promisify(fs.readdir);
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
import {dirname} from 'path';
import { type } from 'os';
const __dirname = dirname(__filename);

await client.connect();

router.route('/').get(async (req, res) => {
    try {
        return res.status(200).json({data: await posts.getAll()})
    } catch (e) {
        return res.status(400).json({error: e.message});
    }    
});

router.route('/page/:pagenum').get(async (req, res) => {
    let pagenum;
    try {
      pagenum = helper.checkNumber(req.params.pagenum);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let exists = await client.exists('pagenum'+String(pagenum));
      if (exists) {
        console.log("exist");
        let posts = await client.get('pagenum'+String(pagenum));
        let unflatresults = unflatten(JSON.parse(posts));
        res.status(200).json(unflatresults);
      } else {
        console.log("Does not exist");
        let limit = 20;
        let skip = limit * (pagenum - 1);
        let data = await posts.getAll(limit, skip)
        let flatresults = flatten(data);
        let end = await client.set('pagenum'+String(pagenum),JSON.stringify(flatresults));
        console.log("here", data);
        res.status(200).json(data);
      }
    } catch (e) {
      return res.status(404).json({error: `Error: Could not find page`});
    }
  });

router.route('/newpost').post(upload.single('image'), async (req, res) => {
    try {
        const { title, desc, userId } = req.body;
        const image = req.file;
    
        const coordinates = [parseFloat(req.body.latitude), parseFloat(req.body.longitude)];
    
        console.log('Received form data:', { title, desc, coordinates });
        console.log('Received image:', image);
  
      let latitude = coordinates[0];
      let longitude = coordinates[1];
      let query = latitude + ',' + longitude;
      var api_url = 'https://api.opencagedata.com/geocode/v1/json';
  
      var request_url =
        api_url +
        '?' +
        'key=' +
        api_key +
        '&q=' +
        encodeURIComponent(query) +
        '&pretty=1' +
        '&no_annotations=1';
  
      const response = await axios.get(request_url);
  
      if (response.status === 200) {
        const data = response.data;
        console.log("echo")
        console.log(req.body)
        let location = data.results[0].formatted;
        let Allimages = image ;
	    let paths = [];
        if (Array.isArray(Allimages)){
            await Promise.all(
                Allimages.map(async (x) => {
                    if (
                        x.mimetype === 'image/jpeg' ||
                        x.mimetype === 'image/png' ||
                        x.mimetype === 'image/jpg' ||
                        x.mimetype === 'jpeg/jpg' ||
                        x.mimetype === 'jpg/jpeg'
                    ) {
                        const image = x;
                        const imagePath = path.join(__dirname, '..', 'uploads', image.originalname);
                        paths.push(imagePath);
    
                        const writeStream = fs.createWriteStream(imagePath);
                        await writeStream.write(image.buffer);
                        await writeStream.end();
                }
                else{
                    let pathway = path.join(__dirname, '..', 'uploads');
                    fs.readdir(pathway, (err, files) => {
                        if (err) throw err;
                        for( let x of files){
                            if (x != "258.png"){
                            let filepath = path.join(pathway, x);
                            fs.unlink(filepath, err => {
                                if (err) throw err;
                            });
                        }
                        }
                    });
                }
            })
            );
        }
        else{
            if (
                image.mimetype === 'image/jpeg' ||
                image.mimetype === 'image/png' ||
                image.mimetype === 'image/jpg' ||
                image.mimetype === 'jpeg/jpg' ||
                image.mimetype === 'jpg/jpeg'
            ) {
                const imagefile = image;
                const imagePath = path.join(__dirname, '..', 'uploads', imagefile.originalname);
                paths.push(imagePath);
    
                const writeStream = fs.createWriteStream(imagePath);
                await writeStream.write(imagefile.buffer);
                await writeStream.end();
                }
                else{
                    let pathway = path.join(__dirname, '..', 'uploads');
                fs.readdir(pathway, (err, files) => {
                    if (err) throw err;
                    for( let x of files){
                        if (x != "258.png"){
                        let filepath = path.join(pathway, x);
                        fs.unlink(filepath, err => {
                            if (err) throw err;
                        });
                    }
                    }
                });
                }
            
        }
        const uploadFolderPath = path.join(__dirname, '..', 'uploads');
        const files = await readdirAsync(uploadFolderPath);
        console.log('Contents of the "uploads" folder:', files);
        let images = await cloud.uploadImage(paths);
        const post = await posts.create(userId, title, images, desc, location, [latitude, longitude]);
        let amount = await posts.getPostCount();
        let pages = amount/20;
        let x = 1;
        while(x<=pages){
            await client.del('pagenum' + String(x));
            x++;
        }
        return res.status(200).json({ data: post });
      } else {
        console.log('Unable to geocode! Response code: ' + response.status);
        console.log('Error message: ' + response.data.status.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    catch (e) {
        console.log(e)
        return res.status(400).json({error: e.message});
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        req.params.id = helpers.isValidString(req.params.id, "Post ID");
        return res.status(200).json({data: await posts.get(req.params.id)});
    } catch (e) {
      console.error('Error processing request:', e);
      return res.status(400).json({ error: e.message });
    }
})
.post(async (req, res) => {
        const postId = req.params.id
        const comment = req.body
        const userId = comment.userId
        let body = comment.body
        let classification = comment.classification
    try {
        if (!postId || !comment || !body || !classification || !userId) {
            throw new Error("Error: must provide all fields")
        }
        body = helpers.isValidString(body, 'body');
        classification = helpers.isValidString(classification, 'classification')
        const confirmResponse = await axios.get(`https://nuthatch.lastelm.software/birds/${classification}`, {headers: {accept: 'application/json', 'API-Key': '5740c2e1-3293-45b3-a215-31edafa6d2d6'}})
        console.log(confirmResponse.data)
        if (!ObjectId.isValid(postId)) {throw new Error("Error: invalid object ID")};
	    if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID")};
    }catch(e) {
        console.log(e)
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
  router.route('/postcount/amount').get(async (req, res) => {
    try {
        const postCount = await posts.getPostCount();
        return res.status(200).json({ postCount: postCount });
    } catch (e) {
        console.error('Error getting post count:', e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.route('/:postId/comments/:commentId')
  .put(async (req, res) => {
    const commentId = req.params.commentId
    const body = req.body
    let userId = req.body.userId
    let type = req.body.type
    let good = true
    
    try {
        if (type !== 'upvote' && type !== 'downvote') {
            throw `Error: must provide type as either upvote or downvote`
        }
        if (!ObjectId.isValid(commentId)) {throw new Error("Error: invalid object ID")};
	    if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID")};
    }catch(e) {
        console.log(e)
        good = false
        return res.status(400).json({error: e})
    }
    if(good) {
        try {
            if (type == "upvote") {
                let upvoted = await comments.addUpvote(commentId, userId)
                if (!upvoted) {
                    throw `could not upvote post`
                }
                else {
                    return res.status(200).json({upvoted: true})
                }
            }
            else if (type == "downvote") {
                let downvoted = await comments.addDownvote(commentId, userId)
                if (!downvoted) {
                    throw `could not downvote post`
                }
                else {
                    return res.status(200).json({downvoted: true})
                }
            }
        }catch(e) {
            return res.status(500).json({error: e})
        }
    } 
  })

export default router;

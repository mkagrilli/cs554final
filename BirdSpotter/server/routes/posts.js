import { Router } from 'express';
import axios from 'axios';
import multer from 'multer';
import * as redis from 'redis';
import * as helper from '../helpers.js';
import { flatten, unflatten } from 'flat';

const client = redis.createClient();
const upload = multer();
const router = Router();

import * as posts from '../data/posts.js';
import * as comments from '../data/comments.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
var api_key = 'cf69ccfea8804bfa99abb6fe78e8f6f0';

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
        let offset = 50 * (pagenum-1);
        let data = await posts.getAll();
        let flatresults = flatten(data);
        let end = await client.set('pagenum'+String(pagenum),JSON.stringify(flatresults));
        res.status(200).json(data);
      }
    } catch (e) {
      return res.status(404).json({error: `Error: Could not find page`});
    }
  });

router.route('/newpost').post(upload.single('image'), async (req, res) => {
    try {
        const { title, desc, userId } = req.body; // Remove coordinates from here
        const image = req.file;
    
        const coordinates = [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]; // Parse coordinates
    
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
        let location = data.results[0].formatted;
        const post = await posts.create(userId, title, image, desc, location, [latitude, longitude]);
        return res.status(200).json({ data: post });
      } else {
        console.log('Unable to geocode! Response code: ' + response.status);
        console.log('Error message: ' + response.data.status.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    catch (e) {
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

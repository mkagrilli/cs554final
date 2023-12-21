import { Router } from 'express';
import axios from 'axios';
import multer from 'multer';

const upload = multer();
const router = Router();

import * as posts from '../data/posts.js';
import dotenv from 'dotenv';
dotenv.config();
var api_key = 'cf69ccfea8804bfa99abb6fe78e8f6f0';


router.route('/').get(async (req, res) => {
    try {
        return res.status(200).json({data: await posts.getAll()})
    } catch (e) {
        return res.status(400).json({error: e.message});
    }    
});

router.route('/newpost').post(upload.single('image'), async (req, res) => {
    try {
        console.log(req.body);
        const { title, desc } = req.body; // Remove coordinates from here
        const image = req.file;
    
        const coordinates = [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]; // Parse coordinates
    
        console.log('Received form data:', { title, desc, coordinates });
        console.log('Received image:', image);
  
      console.log('Received form data:', { title, desc });
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
        let location = data.results[0].components.city + ', ' + data.results[0].components.country;
        const post = await posts.create(id, title, image, desc, location, [longitude, latitude]);
        return res.status(200).json({ data: post });
      } else {
        console.log('Unable to geocode! Response code: ' + response.status);
        console.log('Error message: ' + response.data.status.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (e) {
      console.error('Error processing request:', e);
      return res.status(400).json({ error: e.message });
    }
  });

export default router;

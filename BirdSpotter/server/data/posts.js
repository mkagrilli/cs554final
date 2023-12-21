import {posts} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';
import * as cloud from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
import {dirname} from 'path';
import { type } from 'os';
const __dirname = dirname(__filename);

export const create = async (userId, title, imageUrl, description, location, coordinates) => {
	title = helpers.isValidString(title, "Title");
	if (title.length < 5) {
		throw new Error("Error: title must be at least 5 characters long.")
	}
	if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID.")};
	let Allimages = imageUrl //req.files.imageInput
	let paths = [];
	description = helpers.isValidString(description);
	location = helpers.isValidString(location);
	//IMAGE
	//----------------------
	if (Array.isArray(Allimages)){
		for(let x of Allimages){
			if(x.mimetype === "image/jpeg" || x.mimetype === "image/png" || x.mimetype === "image/jpg" || x.mimetype === "jpeg/jpg" || x.mimetype === "jpg/jpeg"){
				const image = x;
			const writeStream = fs.createWriteStream(path.join(__dirname, '..', 'uploads', image.originalname));
			paths.push(path.join(__dirname, '..', 'uploads', image.originalname));
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
		}
	}
	else{
			if(Allimages.mimetype === "image/jpeg" || Allimages.mimetype === "image/png" || Allimages.mimetype === "image/jpg" || Allimages.mimetype === "jpeg/jpg" || Allimages.mimetype === "jpg/jpeg"){
				const image = Allimages;
				let x = path.join(__dirname, '..', 'uploads', image.originalname);
				const writeStream = fs.createWriteStream(x);
				paths.push(path.join(__dirname, '..', 'uploads', image.originalname));
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
		
	}
	let images = await cloud.uploadImage(paths);
	//----------------------

	let newPost= {
		userId: new ObjectId("6583386c02d40519dff254b6"), //userId,
		title: title,
		imageUrl: images,
		description: description,
		location: location,
		coordinates: coordinates,
		comments: []
    };

	const postCollection = await posts();
	const insertInfo = await postCollection.insertOne(newPost);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {throw new Error("Error: unable to add post.")}
	const newId = insertInfo.insertedId.toString();
	const post = await get(newId);
	
	//removing images
	//--------------------
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
	//--------------------

	return post;
};

export const getAll = async () => {
	const postCollection = await posts();
	let postList = await postCollection.find({}, {}).toArray();
	if (!postList) {throw new Error("Error: was unable to get all posts.")}
	postList = postList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return postList;
};

export const get = async (id) => {
	id = helpers.isValidString(id);
	if (!ObjectId.isValid(id)) {throw new Error("Error: invalid object ID.")}
	const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(id)});
    if (post === null) {throw new Error("Error: there is no post with that id.")}
    post._id = post._id.toString();
    return post;
};

export const remove = async (id) => {
	if (!ObjectId.isValid(id)) {throw new Error("Error: invalid object ID.")}
	const postCollection = await posts();
	const deletionInfo = await postCollection.findOneAndDelete({_id: new ObjectId(id)});
	console.log(deletionInfo)
	if (deletionInfo === null) {throw new Error(`Error: was unable to delete post with id of ${id}.`)}
	return `${deletionInfo.title} has been successfully deleted!`;
};

import {posts} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';

export const create = async (userId, title, imageUrl, description, location, coordinates) => {
	title = helpers.isValidString(title, "Title");
	if (title.length < 5) {
		throw new Error("Error: title must be at least 5 characters long.")
	}

	if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID.")};
	imageUrl = helpers.isValidString(imageUrl);
	description = helpers.isValidString(description);
	location = helpers.isValidString(location);
	coordinates = helpers.isValidString(coordinates);

	let newPost= {
		userId: userId,
		title: title,
		imageUrl: imageUrl,
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

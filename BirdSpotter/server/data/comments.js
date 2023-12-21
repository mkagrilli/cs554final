import {posts} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';

export const create = async (postId, userId, body, classification) => { // Good?
	if (!ObjectId.isValid(postId)) {throw new Error("Error: invalid object ID")};
	if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID")};
	body = helpers.isValidString(body, 'body');
	classification = helpers.isValidString(classification, 'classification')
	const commentId = new ObjectId();
	const newComment = {
		_id: commentId,
		postId: postId,
		userId: userId,
		body: body,
		classification: classification,
		upvotes: [],
		downvotes: []
	};

	const postCollection = await posts();
	await postCollection.updateOne({_id: new ObjectId(postId)}, {$push: {comments: newComment}});
	return await get(commentId.toString());
};

export const getAll = async (postId) => {
	if (!ObjectId.isValid(postId)) {throw new Error("Error: invalid object ID")};
	const postCollection = await posts();
	const postObj = await postCollection.findOne({'_id': new ObjectId(postId)});
	if (postObj === null) {throw new Error("Error: there is no post with that id.")}
	let commentArr = postObj.comments;
	for (let i = 0; i < commentArr.length; i++) {
		commentArr[i]._id = commentArr[i]._id.toString();
	}
	return commentArr;
};

export const get = async (commentId) => {
	if (!ObjectId.isValid(commentId)) {throw new Error("Error: invalid object ID")};
	const postCollection = await posts();
	const postObj = await postCollection.findOne({"comments._id": new ObjectId(commentId)});
	if (postObj === null) {throw new Error("Error: there is no comment with that id.")}
	for (let i = 0; i < postObj.comments.length; i++) {
		if (postObj.comments[i]._id.toString() == commentId.toString()) {
			postObj.comments[i]._id = postObj.comments[i]._id.toString()
			return postObj.comments[i]
		}
	}
	throw new Error("Error: a comment with that id was not found.")
};
	
export const remove = async (commentId) => {
	if (!ObjectId.isValid(commentId)) {throw new Error("Error: invalid object ID")};
	const postCollection = await posts();
    const postObj = await postCollection.findOneAndUpdate({"comments._id": new ObjectId(commentId)},
    {$pull: {comments: {_id: new ObjectId(commentId)}}},{returnOriginal: true});
	if (postObj === null) {throw new Error("Error: there is no comment with that id.")}
	return postObj.value;
};

export const addUpvote = async (commentId, userId) => {
	if (!ObjectId.isValid(commentId)) {throw new Error("Error: invalid object ID")};
	if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID")};
	const commentObj = await get(commentId);
	if (commentObj.userId !== userId) {
		if (commentObj.upvotes.includes(userId)) {
			helpers.removeElementFromArray(commentObj.upvotes, userId)
		} else if (commentObj.downvotes.includes(userId)) {
			helpers.removeElementFromArray(commentObj.downvotes, userId)
			commentObj.upvotes.push(userId);
		} else {
			commentObj.upvotes.push(userId);
		}
		const comments = await getAll(commentObj.postId)
		for (let i = 0; i < comments.length; i++) {
			if (comments[i]._id == commentObj._id) {
				comments[i] = commentObj
			}
			comments[i]._id = new ObjectId(comments[i]._id)
		}
		const postCollection = await posts();
		let upvoted = await postCollection.findOneAndUpdate({_id: new ObjectId(commentObj.postId)}, {$set: { comments: comments} }, {returnDocument: 'after'});
		if (!upvoted) {
			return false
		}
		else {
			return true
		}
	} else {
		console.log("A commenter attempted to upvote their own comment.")
	}
}

export const addDownvote = async (commentId, userId) => {
	if (!ObjectId.isValid(commentId)) {throw new Error("Error: invalid object ID")};
	if (!ObjectId.isValid(userId)) {throw new Error("Error: invalid object ID")};
	const commentObj = await get(commentId);
	if (commentObj.userId !== userId) {
		if (commentObj.downvotes.includes(userId)) {
			helpers.removeElementFromArray(commentObj.downvotes, userId)
		} else if (commentObj.upvotes.includes(userId)) {
			helpers.removeElementFromArray(commentObj.upvotes, userId)
			commentObj.downvotes.push(userId);
		} else {
			commentObj.downvotes.push(userId);
		}
		const comments = await getAll(commentObj.postId)
		for (let i = 0; i < comments.length; i++) {
			if (comments[i]._id == commentObj._id) {
				comments[i] = commentObj
			}
			comments[i]._id = new ObjectId(comments[i]._id)
		}
		const postCollection = await posts();
		let downvoted = await postCollection.findOneAndUpdate({_id: new ObjectId(commentObj.postId)}, {$set: { comments: comments} }, {returnDocument: 'after'});
		if (!downvoted) {
			return false
		}
		else {
			return true
		}
	} else {
		console.log("A commenter attempted to downvote their own comment.")
	}
}
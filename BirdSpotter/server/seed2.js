/************************************************************************************
 * Name        : seed.js
 * Author      : Brandon Leung
 * Date        : March 25, 2023
 * Description : Lab 6 seed function implementation.
 * Pledge      : I pledge my honor that I have abided by the Stevens Honor System.
 ***********************************************************************************/
import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {ObjectId} from 'mongodb';
import {users} from './config/mongoCollections.js';

const db = await dbConnection();

// Creation

const userCollection = await users();
const placeholder = {
    _id: new ObjectId("6583386c02d40519dff254b6"),
    username: "placeholder",
    email: "placeholder@gmail.com"
}
await userCollection.insertOne(placeholder)

//////////////////// Fetch ////////////////////

// console.log(await users.get(user1._id));
// console.log(await posts.get(post1._id));
// console.log(await comments.get(comment1._id));

// console.log(await users.getAll());
// console.log(await posts.getAll());
// console.log(await comments.getAll(post1._id));

// console.log(await users.getByUsername("echrow"))

//////////////////// Manipulation ////////////////////

// await comments.remove(comment1._id)
// await posts.remove(post1._id)

// // Upvote once -> upvote
// await comments.addUpvote(comment1._id, user3._id)

// // Downvote once -> downvote
// await comments.addDownvote(comment1._id, user4._id)

// // Upvote twice -> No upvote
// await comments.addUpvote(comment1._id, user3._id)
// await comments.addUpvote(comment1._id, user3._id)

// // Downvote twice -> No downvote
// await comments.addDownvote(comment1._id, user4._id)
// await comments.addDownvote(comment1._id, user4._id)


// // Downvote then upvote -> upvote and no downvote
// await comments.addDownvote(comment1._id, user3._id)
// await comments.addUpvote(comment1._id, user3._id)


// // Upvote then downvote -> downvote and no upvote
// await comments.addUpvote(comment1._id, user4._id)
// await comments.addDownvote(comment1._id, user4._id)

// // Commenter upvote
// await comments.addUpvote(comment1._id, user2._id)

// // Commenter downvote
// await comments.addDownvote(comment1._id, user2._id)

//////////////////// Error Checking ////////////////////

// await users.create("", "baduser@gmail.com")
// await users.create("baduser", "")
// await users.create("baduser", "baduser")
// await users.create("brecksit", "brecksit@gmail.com")
// await users.create("ba", "brecksit@gmail.com")

// await users.getByUsername()
// await users.getByUsername("")
// await users.getByUsername(2)


console.log('Done seeding database');

await closeConnection();









    


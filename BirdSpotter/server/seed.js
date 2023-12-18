/************************************************************************************
 * Name        : seed.js
 * Author      : Brandon Leung
 * Date        : March 25, 2023
 * Description : Lab 6 seed function implementation.
 * Pledge      : I pledge my honor that I have abided by the Stevens Honor System.
 ***********************************************************************************/
import {dbConnection, closeConnection} from './config/mongoConnection.js';
import * as users from './data/users.js';
import * as posts from './data/posts.js';
import * as comments from './data/comments.js';

const db = await dbConnection();
await db.dropDatabase();

// Creation

const user1 = await users.create("brecksit", "brecksit@gmail.com")
const user2 = await users.create("echrow", "echrow@gmail.com")
const user3 = await users.create("linkinparkfan", "linkinparkfan@gmail.com")
const user4 = await users.create("john_cotton", "jcottonvat19@gmail.com")
const user5 = await users.create("muteki", "lmuhnicky@gmail.com")

const post1 = await posts.create(user1._id, "Raven I think?", "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/85864161/1800", "I think its a raven, but might also be a crow. I also don't know specific breeds as well.", "Brooklyn, NY", [40.688096, -73.942343]);


const comment1 = await comments.create(post1._id, user2._id, "Thats actually a Large-billed Crow. You can tell by the beak structure or something idk im not a expert.")
const comment2 = await comments.create(post1._id, user3._id, "Looks like a Raven to me.")
const comment3 = await comments.create(post1._id, user4._id, "Some type of Crow i think.")
const comment4 = await comments.create(post1._id, user5._id, "Probably a corvid.")

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









    


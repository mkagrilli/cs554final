import {dbConnection, closeConnection} from './config/mongoConnection.js';
import * as users from './data/users.js';
import * as posts from './data/posts.js';
import * as comments from './data/comments.js';

const db = await dbConnection();
await db.dropDatabase();

// Creation

// Users
const user1 = await users.create("auth0|657694419fa97e13efcf9027", "brecksit", "brecksit@gmail.com")
const user2 = await users.create("auth0|740683hf83nh03ng8238g843", "echrow", "echrow@gmail.com")
const user3 = await users.create("auth0|73khw9184027f937t9jg93j5", "linkinparkfan", "linkinparkfan@gmail.com")
const user4 = await users.create("auth0|607593769d83hg04uh94ht96", "john_cotton", "jcottonvat19@gmail.com")
const user5 = await users.create("auth0|7395jg9795010674hg94bhg9", "muteki", "lmuhnicky@gmail.com")
const user6 = await users.create("auth0|105809359gj49ti4j994953j", "willthebirdman", "wjennings10@gmail.com")
const user7 = await users.create("auth0|3968059g93901395f94uti49", "tweetybird", "pete2matt@gmail.com")
const user8 = await users.create("auth0|380917445827j49g803f024i", "amunra", "arsungod@gmail.com")
const user9 = await users.create("auth0|124883829f894h84g8498593", "Lotus", "crimsonredlotus@gmail.com")
const user10 = await users.create("auth0|19389473023985940983g94h", "amateurphotogapher", "mikedelphotography@gmail.com")

// Posts
const post1 = await posts.create(user6._id, "American Raven", ["https://www.aladdin.st/bird-watching/maps/large-billed_crow8.jpg"], "I think its a raven, but might also be a crow. I also don't know specific breeds as well.", "Brooklyn, NY", [40.688096, -73.942343]);
const post2 = await posts.create(user1._id, "Black-Capped Chickadee", ["https://news.uoguelph.ca/wp-content/uploads/2015/12/chickadee100.jpg"], "Found this guy while banding today.", "Garvins Falls Road, Concord, NH 03301, United States of America", [43.178955, -71.5118343]);
const post3 = await posts.create(user3._id, "Fulvous Whistling-Duck", ["https://i.ytimg.com/vi/9-uokCybjeU/maxresdefault.jpg"], "I don't know what duck this is.", "Putney Road, Cumberland County, VA, United States of America", [37.431205, -78.27298]);
const post4 = await posts.create(user10._id, "Vaux's Swift", ["https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTN6NitrKhh2Ow559YJ6sj_4xAS56QfXOVP6do902Mn7F_cETye"], "a littol guy :)", "Nesbit Road, Robertson County, TX, United States of America", [31.087857, -96.638383]);
const post5 = await posts.create(user1._id, "Common Ground Dove", ["https://upload.wikimedia.org/wikipedia/commons/0/04/Columbina_passerina_-near_Salton_Sea%2C_California%2C_USA-8.jpg"], "he looks like a pigeon lol", "Kern County, California, United States of America", [34.939503, -119.273881]);
const post6 = await posts.create(user9._id, "Violet-crowned Hummingbird", ["https://www.hummingbirdcentral.com/images/alan-schmierer/violet-crowned-hummingbird-arizona.jpg"], "Can you guys help me with the id of this little guy", "3476 East Corona Avenue, Phoenix, AZ 85040, United States of America", [33.406254, -112.007377]);
const post7 = await posts.create(user1._id, "Gyrfalcon", ["https://www.animalspot.net/wp-content/uploads/2016/09/Prairie-Falcon-Bird.jpg"], "What a majestic bird.", "Laramie County, Wyoming, United States of America", [41.195215, -104.921217]);
const post8 = await posts.create(user6._id, "Rock Wren", ["https://media.audubon.org/nas_birdapi/apa_2015_heatherroskelley_278065_pacific_wren_kk_adult.jpg"], "What kind of wren is this?!?!?!? They all look the same!!!!!!!!!", "West 69th Avenue, Vancouver, BC, Canada", [49.209410, -123.110021]);
const post9 = await posts.create(user2._id, "Pine Siskin", ["https://media.audubon.org/nas_birdapi/birdimages_istock_american-goldfinch_istockphoto-125913615-1024x1024_non-breeding-adult-female.jpg"], "has to be a pine siskin", "Brooklyn, NY", [40.688096, -73.942343]);
const post10 = await posts.create(user4._id, "Pine Siskin", ["https://thebackyardnaturalist.com/wordpress/wp-content/uploads/TheBYN-Pine-Siskin-Feeder-Irruption-2020.png"], "Hello people of the internet. What is this thing?", "14140 Forsythe Road, Sykesville, Howard County, MD 21784, United States of America", [39.343449, -77.005591]);

// Comments under post 1
const comment1 = await comments.create(post1._id, user2._id, "Thats actually a Large-billed Crow. You can tell by the beak structure or something idk im not a expert.",'407')
const comment2 = await comments.create(post1._id, user3._id, "Looks like a Raven to me.", '410')
const comment3 = await comments.create(post1._id, user4._id, "Some type of Crow i think.", '407')
const comment4 = await comments.create(post1._id, user5._id, "Probably a corvid.", '398')
// Comments under post 3
const comment5 = await comments.create(post3._id, user6._id, "It's actually an American Black Duck. Funny name since it's a brown duck.", '22')
const comment6 = await comments.create(post3._id, user10._id, "american black duck", '22')
// Comments under post 4
const comment7 = await comments.create(post4._id, user5._id, "Isn't that a chimney swift?", '100')
const comment8 = await comments.create(post4._id, user9._id, "It kinda looks like a rough winged swallow", '423')
const comment9 = await comments.create(post4._id, user1._id, "i agree with Lotus", '423')
// Comments under post 6
const comment10 = await comments.create(post6._id, user5._id, "That's right! Violet crowned hummingbird.", '115')
// Comments under post 7
const comment11 = await comments.create(post7._id, user2._id, "Prairie Falcon", '345')
const comment12 = await comments.create(post7._id, user3._id, "that's actually a prairie falcon", '345')
const comment13 = await comments.create(post7._id, user4._id, "Close! It's a prairie falcon", '345')
// Comments under post 8 (rock wren)
const comment14 = await comments.create(post8._id, user1._id, "idk but not a rock wren lol", '447')
const comment15 = await comments.create(post8._id, user5._id, "Yeah I think it's a pacific wren too", '447')
// Comments under post 9
const comment16 = await comments.create(post9._id, user5._id, "Wrong. Goldfinch", '503')
const comment17 = await comments.create(post9._id, user6._id, "American goldfinch actually", '503')
const comment18 = await comments.create(post9._id, user7._id, "american goldfinch", '503')
const comment19 = await comments.create(post9._id, user8._id, "This is a female american goldfinch", '503')


const comment1up = await comments.addUpvote(comment1._id, user3._id);
const comment1upagain = await comments.addUpvote(comment1._id, user10._id);
const comment2up = await comments.addUpvote(comment1._id, user3._id);
const comment2down = await comments.addDownvote(comment1._id, user4._id)
const comment16up = await comments.addUpvote(comment16._id, user3._id);
const comment16up2 = await comments.addUpvote(comment16._id, user1._id);
const comment16up3 = await comments.addUpvote(comment16._id, user2._id);
const comment17up = await comments.addUpvote(comment17._id, user3._id);



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









    


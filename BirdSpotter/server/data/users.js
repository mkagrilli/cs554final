import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';

export const create = async (authId, username, email) => {
    authId = helpers.isValidString(authId, "Auth0 Id");
	username = helpers.isValidString(username, "Username");
    if (username.length < 3) {
        throw new Error("Error: usernames must be at least 3 characters long.")
    }
    if (username.length > 32) {
        throw new Error("Error: usernames must be less than 32 characters long.")
    }
    email = helpers.isValidEmail(email, "Email");

    const allUsers = await getAll();
    for (let i = 0; i < allUsers.length; i++) {  
        if (allUsers[i].username == username) {
            throw new Error("Error: username is already in use.")
        }
    }
	let newUser= {
        authId: authId,
		username: username.toLowerCase(),
		email: email
    };

	const userCollection = await users();
	const insertInfo = await userCollection.insertOne(newUser);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {throw new Error("Error: unable to add user.")}
	const newId = insertInfo.insertedId.toString();
	const user = await get(newId);
	return user;
};

export const getAll = async () => {
	const userCollection = await users();
	let userList = await userCollection.find({}, {}).toArray();
	if (!userList) {throw new Error("Error: was unable to get all users.")}
	userList = userList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return userList;
};

export const get = async (id) => {
	id = helpers.isValidString(id);
	if (!ObjectId.isValid(id)) {throw new Error("Error: invalid object ID.")}
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (user === null) {throw new Error("Error: there is no user with that id.")}
    user._id = user._id.toString();
    return user;
};

export const getByUsername = async (username) => {
	username = helpers.isValidString(username, "Username");
    const userCollection = await users();
    const user = await userCollection.findOne({username: username});
    if (user === null) {throw new Error("Error: there is no user with that username.")}
    user._id = user._id.toString();
    return user;
};

export const getByAuthId = async (authId) => {
	authId = helpers.isValidString(authId, "Auth0 Id");
    const userCollection = await users();
    const user = await userCollection.findOne({authId: authId});
    if (user === null) {throw new Error("Error: there is no user with that Auth0 Id.")}
    user._id = user._id.toString();
    return user;
};

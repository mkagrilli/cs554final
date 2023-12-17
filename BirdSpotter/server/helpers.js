/*******************************************************************************
 * Name        : helpers.js
 * Author      : Brandon Leung
 * Date        : March 25, 2023
 * Description : Lab 6 helper function implementation.
 * Pledge      : I pledge my honor that I have abided by the Stevens Honor System.
 ******************************************************************************/
// You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

export const isValidString = (arg, argName) => { // Universal
    if (!isValidString) {throw new Error(`Error: the ${argName} parameter does not exist.`)}
    if (typeof arg === "undefined" || !arg) {throw new Error(`Error: the ${argName} parameter is undefined.`)}
    if (typeof arg !== "string") {throw new Error(`Error: the ${argName} parameter is not a valid string.`)}
    if (arg.trim() == "") {throw new Error(`Error: the ${argName} parameter consists of only white space.`)}
    arg = arg.trim();
    arg = arg.replace(/\s+/g, ' ');
    return arg
}

export const isAlphanumericString = (arg, argName) => {
    arg = isValidString(arg, argName);
    if (arg.match(/^[a-zA-Z0-9]+$/) === null) {
        throw new Error(`Error: the ${argName} parameter contains a non-alphanumeric character.`)
    } else {
        return arg;
    }
}

export const isValidEmail = (arg) => {
	arg = isValidString(arg);
	arg = arg.toLowerCase();
	let format = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(arg.match(format) == false) {throw new Error("Error: invalid email format.")}
	return arg;
}

export const isNumericString = (arg, argName) => {
    arg = isValidString(arg, argName);
    if (arg.match(/^[0-9]+$/) === null) {
        throw new Error(`Error: the ${argName} parameter contains a non-alphanumeric character.`)
    } else {
        return arg;
    }
}

export const isValidPassword = (arg, argName) => {
    arg = isValidString(arg, argName)
    if (/[A-Z]/.test(arg) == false) {throw new Error("Error: does not contain uppercase letters.")}
    if (/\d/.test(arg) == false) {throw new Error("Error: does not contain numbers.")}
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(arg) == false) {throw new Error("Error: does not contain special characters.")};
    return arg;
}

export const isValidBoolean = (arg, argName) => {
    if (typeof arg !== "boolean") {
        throw new Error(`Error: the ${argName} parameter is not a boolean.`);
    } 
}

export const isValidNumber = (arg, argName) => {
    if (isNaN(arg)) {throw new Error(`Error: the ${argName} parameter is not a valid number.`)}
}


export const isValidObj = (arg, argName) => {
    if (arg !== null && typeof arg !== 'object') {
        throw new Error(`Error: the ${argName} parameter is not a valid object.`)
    }
}



export const isValidArray = (arg, argName) => { // Universal
    if (!arg) {throw new Error(`Error: the ${argName} parameter does not exist.`)}
    if (typeof arg === "undefined") {throw new Error(`Error: the ${argName} is undefined.`)}
    if (Array.isArray(arg) == false) {throw new Error(`Error: the ${argName} is not a valid array`)}
    if (arg.length == 0) {throw new Error(`Error: the ${argName} parameter is an empty array.`)}
}


export const isRegistered = async (req) => {
    await teachers.emailExists(req.oidc.user.email)
    if (await teachers.emailExists(req.oidc.user.email) == false) {
        return false;
    } else {
        return true;
    }
}
export const convertDate = (arg) => {
    arg = isValidString(arg);
    let date = arg.split(" - ")
    date = date[0].split("/")
    const monthArr = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const month = monthArr[parseInt(date[1]) - 1]
    const day = parseInt(date[2], 10).toString()
    const year = date[0]
    const result = month.concat(" ", day.concat(", ", year))
    return result
}  

export const isValidRating = (arg) => { // Specific
    if (isNaN(arg)) {throw new Error("Error: rating is not a number.")}
    if ((arg.toString().length == 1 || arg.toString().length == 3) == false) {throw new Error("Error: invalid rating format.")}
    if (arg < 1 || arg > 5) {throw new Error("Error: the rating is invalid.")}
}

export const removeElementFromArray = (array, element) => {
    array.splice(array.indexOf(element), 1)
    return array;
}

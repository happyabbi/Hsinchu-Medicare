const userDb = require('../../database/db').user;

const addOrUpdateUserData = (path, data) => {
    userDb.push(path, data);
}

const getUserData = (Id) => {
    try {
        return userDb.getData(`/${Id}`);
    } catch(error) {
        return null;
    };
}

module.exports = { addOrUpdateUserData, getUserData };
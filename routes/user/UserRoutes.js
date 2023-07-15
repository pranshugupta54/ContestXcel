const express = require('express');
const router = express.Router();
const date = require("../../date.js");
const UserFunctions = require('./UserFunctions');

router.get('/', UserFunctions.getAllUsers);
router.get('/:vanity', UserFunctions.getUserByVanity);
router.post('/edit', UserFunctions.updateUserByVanity);
router.post('/delete', UserFunctions.deleteUserByVanity);
router.post('/add', UserFunctions.addUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const date = require("../../date.js");
const UserFunctions = require('./UserFunctions');

router.get('/', UserFunctions.getAllUsers);
router.get('/:vanity', UserFunctions.getUserByVanity);
router.post('/:vanity', UserFunctions.updateUserByVanity);

module.exports = router;
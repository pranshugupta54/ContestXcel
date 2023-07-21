const express = require('express');
const router = express.Router();
const date = require("../date.js");
const UserFunctions = require('./user/UserFunctions');

// router.get('/', UserFunctions.getAllUsersFordashboard);
router.get('/', async function(req,res){
    const users = await UserFunctions.getAllUsersFordashboard();
    console.log(users);
    res.render("dashboard.ejs", {users:users});
});
// router.get('/:vanity', UserFunctions.getUserByVanity);
// router.post('/:vanity', UserFunctions.updateUserByVanity);

module.exports = router;
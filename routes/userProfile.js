const express = require('express');
const fs = require('fs');
const router = express.Router();
const leetCodeService = require('../services/leetcode');
const codeforcesService = require('../services/codeforces');
const codeforcesUser = require('../services/userinfo/codeforcesUser');
const geeksforgeeksService = require('../services/geeksforgeeks');
const codechefService = require('../services/codechef');
const date = require("../date.js");
const { application } = require('express');


let users = [];


fs.readFile(__dirname + '/userdb.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading user database file:', err);
    return;
  }

  if (data) {
    try {
      users = JSON.parse(data);
      console.log('Users loaded successfully from userdb.txt');
    //   console.log(users);
    } catch (err) {
      console.log('Error parsing user database:', err);
    }
  }
});


function saveUsersToFile() {
  const data = JSON.stringify(users);

  fs.writeFile('userdb.txt', data, 'utf8', (err) => {
    if (err) {
      console.log('Error saving user database file:', err);
      return;
    }
    console.log('Users saved successfully to userdb.txt');
    // console.log(users);
  });
}




async function cf_user(handle) {
  try {
    const now = Math.floor(Date.now() / 1000); // Get the current UNIX timestamp in seconds
    const user = users.find((u) => u.codeforces && u.codeforces.username === handle);
    if (user) {
      if (user.codeforces.fetchtime && now - user.codeforces.fetchtime < 60) {
        console.log("User info was fetched within the last minute. Skipping API request.");
        return;
      }
      const userInfo = await codeforcesUser.codeforces_u(handle);
    //   console.log(userInfo);
      // Update the user's codeforces info with the received data
      user.codeforces.maxRating = userInfo.maxRating;
      user.codeforces.maxRank = userInfo.maxRank;
      user.codeforces.fetchtime = now; // Update the fetch time
      console.log("User info updated:", user);
      saveUsersToFile();
    } else {
      console.log("User not found in the array");
    }
  } catch (error) {
    console.log("Error fetching user info:", error);
  }
}




function findUserByVanity(vanity) {
  return users.find(user => user.vanity === vanity);
}

function findAndUpdateUserByVanity(vanity, updatedUser) {
  const userIndex = users.findIndex(user => user.vanity === vanity);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
  }
}

router.get('/', function(req,res){
    try {
        // console.log(users);
        const day = date.getDate();
        res.render("users.ejs", { date: day, users:users});
      } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
      }
})

router.get('/:vanity', async function(req,res){
    try {
        const vanity = req.url.substring(1);
        // console.log(vanity);
        const user = findUserByVanity(vanity);
        // console.log(user);
        await cf_user(user.codeforces.username);
        // console.log(info);
        // res.send(req);
        // console.log(users);
        const day = date.getDate();
        res.render("userPage.ejs", { date: day, user:user});
      } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
      }
})

router.post('/:vanity', function(req,res){
    try{
        // console.log()
        const vanity = req.url.substring(1);
        const updatedUser = {
            username: 'Pranshuuuuu',
            fetchtime: 1689247374,
            codechef: 'updatedcodechef',
            codeforces: 'updatedcodeforces',
        };
        findAndUpdateUserByVanity(vanity, updatedUser);
        console.log(users);
    } catch(error){
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;

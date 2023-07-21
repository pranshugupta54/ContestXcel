const fs = require('fs');
const date = require("../../date.js");
const codeforcesUser = require('../../services/userinfo/codeforcesUser');
const leetcodeUser = require('../../services/userinfo/leetcodeUser');
const codechefUser = require('../../services/userinfo/codechefUser');

let users = [];

let codeforces_wait_time = 60;
let leetcode_wait_time = 60;
let codechef_wait_time = 60;
let dbUrl = __dirname + '/userdb.txt';


fs.readFile(dbUrl, 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading user database file:', err);
    return;
  }

  if (data) {
    try {
      users = JSON.parse(data);
      console.log('Users loaded successfully from userdb.txt');
    } catch (err) {
      console.log('Error parsing user database:', err);
    }
  }
});

function saveUsersToFile() {
  const data = JSON.stringify(users);

  fs.writeFile(dbUrl, data, 'utf8', (err) => {
    if (err) {
      console.log('Error saving user database file:', err);
      return;
    }
    console.log('Users saved successfully to userdb.txt');
  });
}

async function cf_user(handle) {
  try {
    const now = Math.floor(Date.now() / 1000); // Get the current UNIX timestamp in seconds
    const user = users.find((u) => u.codeforces && u.codeforces.username === handle);
    if (user) {
      if (user.codeforces.fetchtime && now - user.codeforces.fetchtime < codeforces_wait_time) {
        console.log("User info (CF) was fetched within the last minute. Skipping API request.");
        return;
      }
      const userInfo = await codeforcesUser.codeforces_u(handle);
      user.codeforces.maxRating = userInfo.maxRating;
      user.codeforces.maxRank = userInfo.maxRank;
      user.codeforces.fetchtime = now;
      // console.log("User info updated:", user);
      console.log("User CF Updated");
      saveUsersToFile();
    } else {
      console.log("User not found in the array");
    }
  } catch (error) {
    console.log("Error fetching user info:", error);
  }
}

// const { leetcode_u } = require('./leetcode');

async function leetcode_user(handle) {
  try {
    const now = Math.floor(Date.now() / 1000); // Get the current UNIX timestamp in seconds
    const user = users.find((u) => u.leetcode && u.leetcode.username === handle);
    if (user) {
      if (user.leetcode.fetchtime && now - user.leetcode.fetchtime < leetcode_wait_time) {
        console.log("User info (Leetcode) was fetched within the last minute. Skipping API request.");
        return;
      }
      const userInfo = await leetcodeUser.leetcode_u(handle);
      // console.log(userInfo.userContestRanking);
      user.leetcode.rating = parseInt(userInfo.userContestRanking.rating);
      user.leetcode.globalRanking = userInfo.userContestRanking.globalRanking;
      user.leetcode.fetchtime = now;
      // console.log("User info updated:", user);
      console.log("User Leetcode updated");
      saveUsersToFile();
    } else {
      console.log("User not found in the array");
    }
  } catch (error) {
    console.log("Error fetching user info:", error);
  }
}

async function codechef_user(handle) {
  try {
    const now = Math.floor(Date.now() / 1000); // Get the current UNIX timestamp in seconds
    const user = users.find((u) => u.codechef && u.codechef.username === handle);
    if (user) {
      if (user.codechef.fetchtime && now - user.codechef.fetchtime < codechef_wait_time) {
        console.log("User info (Codechef) was fetched within the last minute. Skipping API request.");
        return;
      }
      const userInfo = await codechefUser.codechef_u(handle);
      // console.log(userInfo);
      user.codechef.rating = userInfo.rating;
      user.codechef.stars = userInfo.stars;
      user.codechef.fetchtime = now;
      console.log("User info updated:", user);
      saveUsersToFile();
      console.log("User CodeChef updated");
      console.log(users);
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
  saveUsersToFile();
  console.log(users);
}

function findAndDeleteUserByVanity(vanity) {
  const userIndex = users.findIndex(user => user.vanity === vanity);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
  // console.log(users);
  saveUsersToFile();
}

function addUserBydetails(user) {
  console.log(user);

  // Check if vanity already exists
  const existingUser = users.find(existingUser => existingUser.vanity === user.vanity);
  if (existingUser) {
    throw new Error(`User with vanity '${user.vanity}' already exists.`);
  }

  const newUser = {
    username: user.username,
    vanity: user.vanity,
    codechef: {
      username: user?.codechef,
      rating: 0,
      stars: 0,
      fetchtime: 1,
    },
    codeforces: {
      username: user?.codeforces,
      fetchtime: 1,
    },
    leetcode: {
      username: user?.leetcode,
      fetchtime: 1,
    },
  };
  
  users.push(newUser);
  saveUsersToFile();
}


async function getAllUsers(req, res) {
  try {
    const day = date.getDate();
    res.render("users.ejs", { date: day, users: users });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getAllUsersFordashboard() {
  try {
    const day = date.getDate();
    return users;
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getUserByVanity(req, res) {
  try {
    // res.render("loading.ejs");
    const vanity = req.url.substring(1);
    const user = findUserByVanity(vanity);
    if(user == null){
      let text = "No User Found";
      res.render("404", {text:text});
    } else {
      const cfPromise = cf_user(user.codeforces.username);
      const leetCodePromise = leetcode_user(user.leetcode.username);
      const codechefPromise = codechef_user(user.codechef.username);

      await Promise.all([cfPromise, leetCodePromise, codechefPromise]);
      const day = date.getDate();
      res.render("userPage.ejs", { date: day, user: user });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteUserByVanity(req,res){
  try {
    console.log("Im Here");
    // console.log(req);
    findAndDeleteUserByVanity(req.body.vanity);
    // console.log(req.body);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function addUser(req,res){
  try {
    // console.log("Im Here");
    addUserBydetails(req.body);
    // console.log(req);
    // console.log(req.body);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateUserByVanity(req, res) {
  try {
    // const vanity = req.url.substring(1);
    console.log(req.body);
    const user = req.body;

    const updatedUser = {
      username: user.username,
      codechef: {"username":user.codechef},
      codeforces: {"username":user.codeforces},
      leetcode: {"username":user.leetcode},
    };
    findAndUpdateUserByVanity(user.vanity, updatedUser);
    // console.log(users);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getAllUsers,
  getUserByVanity,
  getAllUsersFordashboard,
  updateUserByVanity,
  deleteUserByVanity,
  addUser
};

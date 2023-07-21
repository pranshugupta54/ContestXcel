const express = require('express');
const router = express.Router();
const leetCodeService = require('../../services/leetcode');
const codeforcesService = require('../../services/codeforces');
const geeksforgeeksService = require('../../services/geeksforgeeks');
const codechefService = require('../../services/codechef');
const date = require("../../date.js");

let contestList = [];
let timing = {};

async function fetchContests() {
  try {
    contestList = [];
    const now = new Date();
    const fetchTime = now.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    timing = { fetchTime };

    // Fetch contests from codeforcesService
    try {
      const cflist = await codeforcesService.codeforces_c();
      contestList.push(...cflist);
      console.log("Codeforces contests fetched successfully.");
    } catch (error) {
      console.log("Error fetching Codeforces contests:", error);
    }

    // Fetch contests from leetCodeService
    try {
      const llist = await leetCodeService.leetcode_c();
      contestList.push(...llist);
      console.log("LeetCode contests fetched successfully.");
    } catch (error) {
      console.log("Error fetching LeetCode contests:", error);
    }

    // Fetch contests from geeksforgeeksService
    try {
      const gfglist = await geeksforgeeksService.geeksforgeeks_c();
      contestList.push(...gfglist);
      console.log("GeeksforGeeks contests fetched successfully.");
    } catch (error) {
      console.log("Error fetching GeeksforGeeks contests:", error);
    }

    // Fetch contests from codechefService
    try {
      const cclist = await codechefService.codechef_c();
      contestList.push(...cclist);
      console.log("CodeChef contests fetched successfully.");
    } catch (error) {
      console.log("Error fetching CodeChef contests:", error);
    }

    contestList.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

    console.log("All contests fetched successfully.");
  } catch (error) {
    console.log("Error fetching contests:", error);
  }
}


// Call the function to fetch contests when the server starts
fetchContests();
setInterval(fetchContests, 60 * 60 * 1000);

router.get("/", function (req, res) {
  try {
    const day = date.getDate();
    res.render("contests.ejs", { date: day, list: contestList, fetchTime: timing.fetchTime });
    // console.log(contestList);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

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
    const cflist = await codeforcesService.codeforces_c();
    const llist = await leetCodeService.leetcode_c();
    const gfglist = await geeksforgeeksService.geeksforgeeks_c();
    const cclist = await codechefService.codechef_c();

    contestList = [...cflist, ...llist, ...gfglist, ...cclist];
    contestList.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    
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

    console.log("Contests fetched successfully.");
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
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
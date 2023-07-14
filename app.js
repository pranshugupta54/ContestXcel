//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
var _ = require('lodash');
const date = require(__dirname + "/date.js");
const contestsRouter = require('./routes/contest/allContests.js');
const usersRouter = require('./routes/user/UserRoutes.js');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.use('/contests', contestsRouter);
app.use('/users', usersRouter);

// async function codeforces_c() {
//   const url = "https://codeforces.com/api/contest.list";

//   let list = "";

//   const promise = new Promise((resolve, reject) => {
//     https.get(url, function (response) {
//       if (response.statusCode === 200) {
//         resolve(response);
//       } else {
//         reject(new Error("Error getting contests"));
//       }
//     });
//   });

//   const filteredContestsPromise = promise.then(function (response) {
//     response.on("data", function (data) {
//       list += data;
//     });

//     return new Promise((resolve) => {
//       response.on("end", function () {
//         try {
//           const contestList = JSON.parse(list.toString());
//           const filteredContests = contestList.result.filter(
//             (contest) => contest.relativeTimeSeconds < 0
//           );
//           resolve(filteredContests);
//         } catch (error) {
//           console.log("Error parsing JSON:", error);
//           resolve([]);
//         }
//       });
//     });
//   });
//   return filteredContestsPromise;
// }

// app.get("/contests", async function (req, res) {
//   try {
//     const day = date.getDate()
//     const list = await codeforces_c();
//     console.log("FILTERED:");
//     console.log(list.length);
//     res.render("codeforces.ejs", {date: day, list:list});
//     // res.send(list);
//   } catch (error) {
//     console.log("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


app.get(["/", '/home'], function(req,res){
  res.render("home");
})

app.post("/contact", function(req,res){
    res.send(`Working on it <br> <a href="/">HOME</a>`)
})

app.get("/contests/:contestCode", function(req,res){
  const requestCode = _.lowerCase(req.params.eventCode);
  events.forEach(function(event){
    const storedCode = _.lowerCase(event.code);
    if(storedCode == requestCode){
      res.render("event", {eventFull: event})
    }
    // else{
    //     res.render("404");
    //     res.send(`Can't find ${requestCode} || ${storedCode}`);
    // }
  })
  res.render("404");
})

// app.get("*", function(req,res){
//   console.log("HMMMMMMMM");
//     res.render("404");
// })

app.listen(process.env.PORT || 3001, function() {
  console.log("Server started on port 3001.");
});
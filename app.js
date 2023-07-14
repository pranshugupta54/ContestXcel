const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const date = require(__dirname + "/date.js");
const contestsRouter = require('./routes/contest/allContests.js');
const usersRouter = require('./routes/user/UserRoutes.js');
const dashboardRouter = require('./routes/dashboard.js');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/contests', contestsRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
let PORT = 3001;

// app.post('/edit', (req, res) => {
//   console.log(req.body);
//   // Send a success response
//   res.status(200).json({ message: 'Form submitted successfully' });
// });



app.get(["/", '/home'], function(req,res){
  res.render("home");
})

// app.get("/contests/:contestCode", function(req,res){
//   const requestCode = _.lowerCase(req.params.eventCode);
//   events.forEach(function(event){
//     const storedCode = _.lowerCase(event.code);
//     if(storedCode == requestCode){
//       res.render("event", {eventFull: event})
//     }
//     // else{
//     //     res.render("404");
//     //     res.send(`Can't find ${requestCode} || ${storedCode}`);
//     // }
//   })
//   res.render("404");
// })

app.get("*", function(req,res){
  console.log("HMMMMMMMM");
    res.render("404", {text:"Page not found"});
})

app.listen(process.env.PORT || PORT, function() {
  console.log(`Server started on port ${PORT}.`);
});
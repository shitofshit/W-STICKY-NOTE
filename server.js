import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

const date = new Date();
let dayt = date.getDate();
let month = date.getMonth();
let day = date.getDay();
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let year = date.getFullYear();

var workList = [];
var todayList = [];

// Middleware to check and clear the arrays if the day has changed
function checkAndClearArrays(req, res, next) {
  const currentDate = new Date();
  if (currentDate.getDate() !== dayt) {
    workList = [];
    todayList = [];
    dayt = currentDate.getDate();
    month = currentDate.getMonth();
    day = currentDate.getDay();
    year = currentDate.getFullYear();
  }
  next();
}


//server JS
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkAndClearArrays);

app.get("/", (req,res)=>{
    res.render(__dirname +"/views/today.ejs", { dayt, month, day, year, monthnames: months, daynames: days, listItems: todayList });
});
app.get("/work", (req,res)=>{
    res.render(__dirname +"/views/work.ejs",{ dayt, month, day, year, monthnames: months, daynames: days, listItems: workList });
});

app.post("/adder",(req,res, next)=>{
    var key = Object.keys(req.body)[0];
    var ItemToBeAdded = req.body[key];
    if (key == "newItem") {
      workList.push(ItemToBeAdded);
      res.redirect("/work");
      next();
    } else {
      todayList.push(ItemToBeAdded);
      res.redirect("/");
      next();
    }
  });


app.listen(port, (req,res)=>{
    console.log("Listening to port : " + port);
})

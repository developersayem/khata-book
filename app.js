const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  fs.readdir("./hisaab", (err, files) => {
    if (err) return res.status(500).send("something went wrong");

    res.status(200).render("index", { files });
  });
});

app.get("/create", (req, res) => {
  res.status(200).render("create");
});

app.post("/createhisaab", (req, res) => {
  const currentDate = new Date();
  const date = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}-${currentDate.getMilliseconds()}`;

  fs.writeFile("./hisaab/" + date, req.body.content, (err) => {
    if (err) return res.status(500).send("Something went wrong");

    res.redirect("/");
  });
});
app.listen(3000);

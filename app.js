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
  const date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}-${currentDate.getSeconds()}`;

  fs.writeFile("./hisaab/" + date + ".txt", req.body.content, (err) => {
    if (err) return res.status(500).send("Something went wrong");

    res.redirect("/");
  });
});

app.get("/hisaab/:filename", (req, res) => {
  fs.readFile("./hisaab/" + req.params.filename, "utf8", (err, data) => {
    if (err) return res.status(500).send("Something went wrong");

    res.status(200).render("hisaab", { data, filename: req.params.filename });
  });
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile("./hisaab/" + req.params.filename, "utf8", (err, data) => {
    if (err) return res.status(500).send("Something went wrong");

    res.status(200).render("edit", { data, filename: req.params.filename });
  });
});

app.post("/update/:filename", (req, res) => {
  fs.writeFile(
    "./hisaab/" + req.params.filename.split(":")[1],
    req.body.content,
    (err) => {
      if (err)
        return res.status(500).send("Something went wrong: " + err.message);

      // Redirect to the "hisaab" route to display updated content
      res.status(200).render("hisaab", {
        data: req.body.content,
        filename: req.params.filename.split(":")[1],
      });
    }
  );
});
app.get("/delete/:filename", (req, res) => {
  fs.unlink("./hisaab/" + req.params.filename, (err) => {
    if (err) return res.status(500).send("Something went wrong");

    res.redirect("/");
  });
});

app.listen(3000);

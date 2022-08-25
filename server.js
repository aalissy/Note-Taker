const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", function (req, res) {
    let myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let note = req.body;
    let id = myNotes.length.toString();
    note.id = id;
    myNotes.push(note);
    fs.writeFileSync("./db/db.json", JSON.stringify(myNotes));
    res.json(myNotes);
})

app.get("/api/notes/:id", function (req, res) {
    let myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(myNotes[Number(req.params.id)]);
});

app.delete("/api/notes/:id", function (req, res) {
    let myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let id = req.params.id;
    let first = 0;
    myNotes = myNotes.filter((note) => {
        return note.id != id;
    });
    for (note of myNotes) {
        note.id = first.toString();
        first++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(myNotes));
    res.json(myNotes);
})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`)
})
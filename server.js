// Const express that requires express
const express = require("express");
// Const path that requires path
const path = require("path");
// Const fs that requires fs
const fs = require("fs");

// Const PORT that either grabs the environment variable PORT or uses 3001 if there is none
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON
app.use(express.json());
// Middleware for urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Loads files in the public directory
app.use(express.static("public"));

// GET route for notes getting the notes.html file
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET route for the notes api grabbing the notes saved in db.json
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// POST route for the notes api which saves the notes
app.post("/api/notes", function (req, res) {
    // Const myNotes reads the db.json file converting the json file to a Javascript object
    const myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // Const note that accesses the user data stored in the body
    const note = req.body;
    // Const id that stringifies the length of myNotes
    const id = myNotes.length.toString();
    // the id of note is the id defined above
    note.id = id;
    // Pushes the new note to myNotes
    myNotes.push(note);
    // Writes the stringified notes to the db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(myNotes));
    // Sends a json response from the data in myNotes
    res.json(myNotes);
})

// GET route for the notes by id
app.get("/api/notes/:id", function (req, res) {
    // Const myNotes reads the db.json file converting the json file to a Javascript object
    const myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // Sends a json response from the notes array from the provided parameter ids
    res.json(myNotes[Number(req.params.id)]);
});

// DELETE route for the notes by id
app.delete("/api/notes/:id", function (req, res) {
    // Const myNotes reads the db.json file converting the json file to a Javascript object
    const myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // Const id that grabs the provided paramater id
    const id = req.params.id;
    // Const first is 0
    const first = 0;
    // Filters the notes in myNotes 
    myNotes = myNotes.filter((note) => {
        // Removes the note by id
        return note.id != id;
    });
    // For the note in myNotes
    for (note of myNotes) {
        // The id of Note is the string of first which is 0
        note.id = first.toString();
        // Adds first
        first++;
    }
    // Writes the stringified notes to the db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(myNotes));
    // Sends a json response from the data in myNotes
    res.json(myNotes);
})

// GET route for the index.html file
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

// Listens using the PORT variable defined above
app.listen(PORT, () => {
    // Logs App listening at http://localhost: using the PORT variable to the console 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
})

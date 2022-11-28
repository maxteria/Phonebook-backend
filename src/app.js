
require('dotenv').config()

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");


const Person = require("./models/person.js");


app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

// GET root endpoint
app.get("/", (req, res) => {
    const html = `<h1>Phonebook API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/persons">/api/persons</a></li>
      <li><a href="/info">/info</a></li>
    </ul>`;

    res.send(html);
});

app.get("/api/", (req, res) => {
    const html = `<h1>Phonebook API</h1>
    <p>Available endpoints:</p>
    <ul>
        <li><a href="/api/persons">/api/persons</a></li>
        <li><a href="/info">/info</a></li>
    </ul>`;
    res.send(html);
});

// GET Api info
app.get("/info", (req, res) => {
    Person.find({}).then((persons) => {
        res.send(
            `<p>Phonebook has into for ${persons.length} people</p><pre>${Date()}</pre>`
        );
    }).catch((error) => {
        console.log(error);
        res.status(500).end();
    });
});

// GET ALL
app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    }).catch((error) => {
        console.log(error);
        res.status(500).end();
    });
});


// GET ONE
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findById(id).then((person) => {
        res.json(person);
    });
});

// ADD PERSON
app.post("/api/persons", morgan(":body"), (req, res) => {
    const body = req.body;
    if (!body) return res.status(400).json({ error: "content missing" });
    if (!body.name) return res.status(400).json({ error: "name missing" });
    if (!body.number) return res.status(400).json({ error: "number missing" });

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person.save().then((savedPerson) => {
        res.json(savedPerson);
    });
});

// UPDATE NUMBER
app.put("/api/persons/:id", morgan(":body"), (req, res) => {
    const body = req.body;
    if (!body) return res.status(400).json({ error: "content missing" });
    if (!body.name) return res.status(400).json({ error: "name missing" });
    if (!body.number) return res.status(400).json({ error: "number missing" });

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(req.params
        .id
        .toString(), person, { new: true })
        .then((updatedPerson) => {
            res.json(updatedPerson);
        });
});

// DELETE PERSON
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id).then((result) => {
        res.status(204).end();
    });
});

// UNKNOW ENDPOINT
app.use((req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
});

// LISTEN PORT 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generateId } from "../utils/generateId.js";
import { PORT } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

let persons = [
    {
        id: 1,
        name: "Maximiliano",
        number: "222999444",
    },
    {
        id: 2,
        name: "Sabrina",
        number: "555444999",
    },
    {
        id: 3,
        name: "Hector",
        number: "112345678",
    },
];

// GET
app.get("/", (req, res) => {
    res.send("<h1>Welcome to server</h1>");
});

app.get("/api/", (req, res) => {
    res.send("<h1>Phonebook API By Maxteria for fullstackopen course</h1>");
});

// GET INFO
app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has into for ${persons.length} people</p><pre>${Date()}</pre>`
    );
});

// GET ALL
app.get("/api/persons", (req, res) => {
    res.json(persons);
});

// GET ONE
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((p) => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

// ADD PERSON
app.post("/api/persons", morgan(":body"), (req, res) => {
    const body = req.body;

    if (!body) return res.status(400).json({ error: "content missing" });
    if (!body.name) return res.status(400).json({ error: "name missing" });
    if (!body.number) return res.status(400).json({ error: "number missing" });

    const personExists = persons.find((person) =>
        person.name.includes(body.name)
    );

    if (personExists)
        return res.status(400).json({ error: "name must be unique" });

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(persons),
    };

    persons = persons.concat(person);
    res.json(person);
});

// UPDATE NUMBER
app.put("/api/persons/:id", morgan(":body"), (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    
    const person = persons.find((p) => p.id === id);
    if (!person) return res.status(404).end();
    
    const updatedPerson = { ...person, number: body.number };
    persons = persons.map((p) => (p.id === id ? updatedPerson : p));
    res.json(updatedPerson);
});

// DELETE ONE
app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((p) => id !== p.id);

    res.status(204).end();
});

// UNKNOW ENDPOINT
app.use((req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
});

// LISTEN PORT 3001
app.listen(PORT);
if(app.get('env') === 'development') {
    console.log(`Server running on port ${PORT}`);
}
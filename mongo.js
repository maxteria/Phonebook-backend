import mongoose from "mongoose";

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log("Please provide the password as an argument: node mongo.js <password>");
    console.log("With only password as argument, you can list all the phonebook entries");
    console.log("With password, name and number as arguments, you can add a new entry");
    process.exit(1);
}

const [password, name, number] = process.argv.slice(2);

// Connect to database
const url = `mongodb+srv://fullstackopen:${password}@cluster0.6hj7ur0.mongodb.net/persons?retryWrites=true&w=majority`;
mongoose.connect(url);

// Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

// Model
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    // List all entries
    Person.find({}).then(result => {
        console.log("Phonebook:");
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else {
    // Add new entry
    const person = new Person({
        name,
        number,
    });

    // Save person to database
    person.save(person).then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
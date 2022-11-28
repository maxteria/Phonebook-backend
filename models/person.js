const mongoose = require('mongoose')

// Connect to MongoDB
const url = process.env.MONGODB_URI
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })


//schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

// transfor _id to  id
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


// Model
module.exports = mongoose.model('Person', personSchema)
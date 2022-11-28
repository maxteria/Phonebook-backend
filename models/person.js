const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Connect to MongoDB
const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB', result)
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

// schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
})

personSchema.plugin(uniqueValidator)

// transfor _id to id whent toJSON is called
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Model
module.exports = mongoose.model('Person', personSchema)

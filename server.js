const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://rcbalaji:07070707@cluster0.bbw2v33.mongodb.net/StudentDB?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Define the schema and model
const studentSchema = new mongoose.Schema({
    userName: String,
    email: String,
    collegeName: String,
    dept: String,
    phoneNumber: String
});

const Student = mongoose.model('Student', studentSchema);

app.post('/webhook/register', (req, res) => {
    const params = req.body.queryResult.parameters;

    const userName = params['user_name'];
    const email = params['email'];
    const collegeName = params['college_name'];
    const dept = params['dept'];
    const phoneNumber = params['phone-number'];

    // Create a new student record
    const newStudent = new Student({
        userName: userName,
        email: email,
        collegeName: collegeName,
        dept: dept,
        phoneNumber: phoneNumber
    });

    // Save the student record to MongoDB
    newStudent.save().then(() => {
        console.log('Registered Successfully');
        console.log(`Name: ${userName}`);
        console.log(`Email: ${email}`);
        console.log(`College: ${collegeName}`);
        console.log(`Dept: ${dept}`);
        console.log(`Phone Number: ${phoneNumber}`);

        res.json({
            fulfillmentText: `Registered Successfully || Name: ${userName} || Email: ${email} || College: ${collegeName} || Dept: ${dept} || Phone Number: ${phoneNumber}`
        });
    }).catch(err => {
        console.error('Error saving to MongoDB', err);
        res.json({
            fulfillmentText: 'Failed to register. Please try again later.'
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

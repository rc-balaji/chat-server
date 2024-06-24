const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://rcbalaji:07070707@cluster0.bbw2v33.mongodb.net/StudentDB?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
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

// Google Sheets setup

async function accessSpreadsheet() {
    // Use the service account credentials to authorize the Google Spreadsheet
    const auth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines in the key
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet('15jGgZY_ab201I638ju5icVIMQirtmFPQiSIKsYklCJI',auth); // Replace with your sheet ID

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Assuming you want to use the first sheet
    return sheet;
}

app.post('/webhook/register', async (req, res) => {
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

    try {
        // Save the student record to MongoDB
        await newStudent.save();

        // Access Google Sheets
        const sheet = await accessSpreadsheet();

        // Add the new row to the sheet
        await sheet.addRow({
            Email: email,
            Name: userName,
            College: collegeName,
            Dept: dept,
            'Phone Number': phoneNumber
        });

        console.log('Registered Successfully');
        console.log(`Name: ${userName}`);
        console.log(`Email: ${email}`);
        console.log(`College: ${collegeName}`);
        console.log(`Dept: ${dept}`);
        console.log(`Phone Number: ${phoneNumber}`);

        res.json({
            fulfillmentText: `Registered Successfully || Name: ${userName} || Email: ${email} || College: ${collegeName} || Dept: ${dept} || Phone Number: ${phoneNumber}`
        });
    } catch (err) {
        console.error('Error saving to MongoDB or Google Sheets', err);
        res.json({
            fulfillmentText: 'Failed to register. Please try again later.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

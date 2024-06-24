const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

async function writeToGSheet() {
    // Google Sheets setup
    const auth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines in the key
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet('15jGgZY_ab201I638ju5icVIMQirtmFPQiSIKsYklCJI',auth); // Replace with your sheet ID

    // Use the service account credentials to authorize the Google Spreadsheet

    try {
        // Inject authentication into the GoogleSpreadsheet instance
        await doc.loadInfo();

        // Select the first sheet
        const sheet = doc.sheetsByIndex[0];

        // Add a new row with static data
        await sheet.addRow({
            Email: 'test@example.com',
            Name: 'John Doe',
            College: 'Sample College',
            Dept: 'Sample Department',
            'Phone Number': '1234567890'
        });

        console.log('Row added successfully');
    } catch (err) {
        console.error('Error accessing Google Sheets', err);
    }
}

// Execute the function
writeToGSheet();

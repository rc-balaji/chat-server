const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json());

app.post('/webhook/registered', (req, res) => {

    const intentName = req.body.queryResult.intent.displayName;

    if (intentName === 'Get Password Intent') {
        const userid = req.body.queryResult.parameters.userid;
        const password = req.body.queryResult.parameters.password;

        console.log(`UserID: ${userid}`);
        console.log(`Password: ${password}`);

        res.json({
            fulfillmentText: 'Registered successfully!'
        });
    } else {
        res.json({
            fulfillmentText: 'I did not understand that.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sample data
const users = [
    { user_id: 12, city: 'Tirupur' },
    { user_id: 11, city: 'Bengal' },
    { user_id: 13, city: 'Tirupur' }
];

app.post('/webhook/get_city', (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;

    if (intentName === 'Get City Intent') {
        const userId = req.body.queryResult.parameters.user_id;
        const user = users.find(u => u.user_id === userId);

        let responseText = '';

        if (user) {
            responseText = `The city for user ${userId} is ${user.city}.`;
        } else {
            responseText = `I couldn't find the city for user ${userId}.`;
        }

        res.json({
            fulfillmentText: responseText
        });
    } else {
        res.json({
            fulfillmentText: 'I did not understand that.'
        });
    }
});

app.post('/webhook', (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
  
    function handleIntent(agent) {
      const response = {
        "richContent": [
          [
            {
              "type": "button",
              "icon": {
                "type": "chevron_right",
                "color": "#FF9800"
              },
              "text": "Click here to visit Google.com",
              "link": "https://www.google.com"
            }
          ]
        ]
      }
      
  
      agent.add(new Payload(agent.UNSPECIFIED, response, { rawPayload: true }));
  
      // If you need to handle additional logic based on user input, you can add it here
    }
  
    let intentMap = new Map();
    intentMap.set('URL', handleIntent); // Replace 'yourIntentName' with your actual intent name
    agent.handleRequest(intentMap);
  });
  
  


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express')
const app = express()
let port = process.env.PORT;
let postmark = require("postmark")

const serverToken = "c930074c-8ca1-4ec8-b20e-021f214e0e4a"
const client = new postmark.ServerClient(serverToken);

if (port == null || port == "") {
  port = 3000;
}

app.get('/', (req, res) => {

    client.sendEmailWithTemplate({
        TemplateId:26736087,
        From: "vineet@digitizeco.in",
        To: "shashiy@digitizeco.in",
        TemplateModel: {
          "person": {
              "first_name": "shashi the yadav",
              "sender_name" : "Vineet the Tanwar"
                }}
    }).then(response => {
        console.log(response.To);
        console.log(response.SubmittedAt);
        console.log(response.Message);
        console.log(response.MessageID);
        console.log(response.ErrorCode);
    });
    
    res.send('Welcome to Make REST API Calls In Express!')

})

app.listen(port, () => console.log(`App listening on port ${port}!`))
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
let port = process.env.PORT;
let postmark = require("postmark");

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//  global const

const TEMPLATE_ID = 26736087;
const SENDER_EMAIL = 'vineet@digitizeco.in';
const SERVER_TOKEN = "c930074c-8ca1-4ec8-b20e-021f214e0e4a";

const client = new postmark.ServerClient(SERVER_TOKEN);


if (port == null || port == "") {
  port = 3000;
}

app.get('/', (req, res) => {

    // client.sendEmailWithTemplate({
    //     TemplateId:26736087,
    //     From: "vineet@digitizeco.in",
    //     To: "shashiy@digitizeco.in",
    //     TemplateModel: {
    //       "person": {
    //           "first_name": "shashi the yadav",
    //           "sender_name" : "Vineet the Tanwar"
    //             }}
    // }).then(response => {
    //     console.log(response.To);
    //     console.log(response.SubmittedAt);
    //     console.log(response.Message);
    //     console.log(response.MessageID);
    //     console.log(response.ErrorCode);
    // });
    
    res.send('Welcome to Make REST API Calls In updated Express!')

})

app.post('/sendEmailWithTemplate', jsonParser, (req, res) => {

    // request body
    // {
    //     recieverEmail,
    //     recieverName,
    // }


    const response = {
        message: 'Something error',
        status: false

    }

    const recieverEmail = req.body?.recieverEmail;
    const recieverName = req.body?.recieverName;

    if(!recieverEmail){
        response['message'] = 'please give reciever email';
        res.send(response);
    }

    if(!recieverName){
        response['message'] = 'please give reciever name';
        res.send(response);
    }

    

    client.sendEmailWithTemplate({
        TemplateId:TEMPLATE_ID,
        From: SENDER_EMAIL,
        To: recieverEmail,
        TemplateModel: {
          "person": {
              "first_name": "shashi the yadav",
              "sender_name" : recieverName
                }}
    }, function(error, response) {
        if(error) {
            console.error("Unable to send via postmark: " + error.message);
            response['message'] = error.message;
            res.send(response);
        }else{
            console.log(response.To);
            console.log(response.SubmittedAt);
            console.log(response.Message);
            console.log(response.MessageID);
            console.log(response.ErrorCode);
            response['data'] = {
                message: response.Message,
                messageID: response.MessageID,
                recieverEmail: response.To
            }
    
            res.send(response);
        }
        
    });






    // console.log(req.body);

    // const data = {
    //     message: 'success',
    //     body: req.body,
    //     recieverEmail: req.body.recieverEmail
    // }
    // // res.send(JSON.stringify(data));
    // res.send(data);
    

})

app.listen(port, () => console.log(`App listening on port ${port}!`))
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')


let port = process.env.PORT;
let postmark = require("postmark");

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })


//  global const

const TEMPLATE_ID = 26736087;
const SENDER_EMAIL = 'vineet@digitizeco.in';
const SERVER_TOKEN = "c930074c-8ca1-4ec8-b20e-021f214e0e4a";

const client = new postmark.ServerClient(SERVER_TOKEN);


if (port == null || port == "") {
  port = 3000;
}

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {

    
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
        return false;
    }

    if(!recieverName){
        response['message'] = 'please give reciever name';
        res.send(response);
        return false;
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
            return false;
        }
        
    });
})
app.use(cors());
app.listen(port, () => console.log(`App listening on port ${port}!`))
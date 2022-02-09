import generatePdf from './pdf-generator/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import postmark from 'postmark';

const app = express();
let port = process.env.PORT;
// create application/json parser
var jsonParser = bodyParser.json({ limit: "50mb" })
 
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
    const attachments = req.body?.Attachments ? req.body.Attachments : []

    client.sendEmailWithTemplate({
        TemplateId:TEMPLATE_ID,
        From: SENDER_EMAIL,
        To: recieverEmail,
        TemplateModel: {
          "person": {
              "first_name": "shashi the yadav",
              "sender_name" : recieverName
              }
        },
        Attachments: attachments
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

app.get('/api/pdf/:template', async (req, res) => {
    if (!req.params.template)
      return res.status(422).send({ message: 'missing PDF template' });
  
    try {
      const pdf = await generatePdf(req.params.template, undefined);
  
      res.set({ 'Content-type': 'application/pdf' });
      res.status(200).send(pdf);
    } catch (e) {
      console.log(e);
      res.status(422).send(e);
    }
  });

  app.post('/api/pdf/:template',jsonParser, async (req, res) => {
    if (!req.body) return res.status(422).send();
    if (!req.params.template)
      return res.status(422).send({ message: 'missing PDF template' });
    try {
      const pdf = await generatePdf(req.params.template, req.body);
      res.set(
        Object.assign(
          { 'Content-type': 'application/pdf' },
          req.query.download === 'true'
            ? {
                'Content-Disposition': `attachment;filename=${
                  req.query.filename || 'threekit-configuration.pdf'
                }`,
              }
            : {}
        )
      );
      res.end(pdf);
    } catch (e) {
      console.log(e);
      res.status(422).send(e);
    }
  });

app.use(cors());
app.listen(port, () => console.log(`App listening on port ${port}!`))
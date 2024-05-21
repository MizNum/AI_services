require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const PORT = 3000;
const otpService = require('./otpService')
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');   
const crypto = require('crypto')
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const axios = require('axios');
const querystring = require('querystring');



//translate function 

async function translate(langFrom, langTo, text) {
  const url = process.env.GS_KEY_URL;
  const params = querystring.stringify({
      q: text,
      target: langTo,
      source: langFrom
  });

  try {
      const response = await axios.get(`${url}?${params}`, {
          headers: {
              'User-Agent': 'Mozilla/5.0'
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error translating text:', error);
      throw error;
  }
}


//translate function ends














app.get('', (req, res) => {
    res.status(200).send('AiChatbot....');
});




























app.post('/sendOtp', (req, res) => {
    const { email } = req.body;
    otpService.sendOTP(email)
        .then(response => res.status(201).send(response))
        .catch(error => res.status(500).send(error));
});































app.post('/bot-response', async (req, res) => {
    const { text } = req.body;
    try {
        const response =       {
          "type": "bot_response",
          "sender": "bot",
          "timestamp": "2024-05-07 10:01:00 AM",
          "name": "bot",
          "videoUrl": "../../assets/video/360p.mp4", 
              "vflag":false,
          "vtlag":false,
          "Summary": "Summary by Gpt",
          "startTime": "hh:mm:ss",
          "endTime": "hh:mm:ss",
          "result": "The logistic regression is a technique used for binary classification or binary response analysis. It is a linear regression algorithm that estimates the probability of an observation's outcome based on input variables. In logistic regression, we assume that each observation belongs to one or more categories, and we predict the probability of the observation belonging to each category given its input variables. The output for each observation is the predicted outcome (0 or 1), which determines whether the observation belongs to the true class, and the actual outcome (0 or 1) determines the probability of being in the true class.\n\nThe logistic regression algorithm works as follows:\n\n1. Calculate the log-odds ratios based on each input variable's estimated value and the predicted outcome for the observation. These log-odds ratios are used to calculate the probability of the observation's belonging to each category.\n\n2. Calculate the probability of the observation belonging to class 1 (or 0) given its input variables and predicted output using the formula: P(Y=1|X, O) = log(L/H), where L is the logistic likelihood function for class 1, H is the logistic likelihood function for class 0, and L is the logistic log-likelihood for class 1 and H is the logistic log-likelihood for class 0.\n\n3. Calculate the output (P(O=1|X)) using the formula: P(Y=1|X) = exp(logits).\n\nThe logistic regression algorithm works by finding the coefficients of each input variable that best fit the data, which are usually chosen by maximizing the likelihood function. The logistic regression output is then used to predict the probability of a specific observation belonging to each category.",
          "seekTime": {
            "end": 1044.4599999999998,
            "id": 268,
            "seek": 103086,
            "start": 1042.4599999999998,
            "text": " So for logistic regression,",
            "video_name": "2023-10-04_KInt_default"
          },
          "source": "So that's what we want to have. So for logistic regression, there is a very concrete loss function that we always use. And this loss function is defined like this, and this is called the logistic loss. And so let's look at what this does. So our target class, Y, is either zero or it is one. If it's either zero or one, if it's zero, this means this part vanishes over here. If it's one, it means this part vanishes over here because this part, thing becomes zero. So it means either we have this part, or we have this part of the loss function. Depending on the value of Y. So if we say Y is equal to one, and this part over here vanishes, and it means we take, our loss function will be the logarithm of our prediction. So logarithm of our prediction. So what is if we get a large prediction? So how does the log of any function look like? So I haven't made a plot of this. Would have been nice if I had some internet connection right now. Hmm., So let's see if I can get. So, ah yeah, some plot of logarithm. So the"
        }
        res.status(201).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});






























const uploadPath = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadPath);

app.post('/upload', (req, res) => {
  const base64String = req.body.file;
  try {
    const decodedBuffer = Buffer.from(base64String, 'base64');
    const timestamp = moment().format('YYYYMMDD-HHmmss'); 
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${timestamp}-${uniqueId}.wav`;
    const filePath = path.join(uploadPath, fileName);

    fs.writeFile(filePath, decodedBuffer, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(500).send('Error saving audio');
        return;
    }

    

    //   console.log('Audio data saved successfully:', filePath);

      const audioUrl =`/uploads/${fileName}`; // Construct the URL

      res.json({
        message: 'Audio data uploaded successfully',
        url: audioUrl
      }); // Include the URL in the response
    });

  } catch (error) {
    console.error('Error decoding Base64:', error);
    res.status(400).send('Invalid Base64 data');
  }
});













app.post('/translate',( async (req,res)=>{
  const {text,sourceLang,targetLang,API_KEY_TRANSLATE} = req.body;


  if(API_KEY_TRANSLATE!==process.env.API_KEY_TRANSLATE){
    res.status(201).send("Key doesn't matches");
  }
  else{
      try {
          const translatedText = await translate(sourceLang, targetLang, text);
          res.status(200).send({translatedText : translatedText});
      } catch (error) {
          res.status(500).send('ERROR :',error);
          console.error('Translation failed:', error);
      }
  }

}
));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

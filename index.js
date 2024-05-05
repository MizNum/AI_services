require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const otpService = require('./otpService')

app.use(cors());
app.use(bodyParser.json());

app.get('', (req, res) => {
    res.status(200).send('AiChatbot....');
});

app.post('/sendOtp', (req, res) => {
    const { email } = req.body;
    otpService.sendOTP(email)
        .then(response => res.status(201).send(response))
        .catch(error => res.status(500).send(error));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

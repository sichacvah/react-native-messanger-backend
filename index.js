import * as admin from 'firebase-admin'
import express from 'express'
import bodyParser from 'body-parser'
import twilio from 'twilio'
import TokenStore from './TokenStore'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_ACCOUNT_TOKEN = process.env.TWILIO_ACCOUNT_TOKEN
const TWILIO_NUMBER = process.env.TWILIO_NUMBER
const MIN_TOKEN = 1000
const MAX_TOKEN = 9999


const twilioClient = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN)

const app = express()
app.use(bodyParser.json())

const serviceAccount = require('./react-native-messanger-5d4b373610bc.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://react-native-messanger.firebaseio.com/"
})


function getToken(min, max) {
    return Math.random() * (MAX_TOKEN - MIN_TOKEN) + MIN_TOKEN
}

const tokenStore = new TokenStore()

app.post('/send_phone', (req, res) => {
    if (!req.body || !req.body.phonenumber) return res.sendStatus(400)
    const token = getToken()
    tokenStore.push({token, phonenumber: req.body.phonenumber})
    client.messages.create({
        body: `Код поддтерждения ${token}`,
        from: TWILIO_NUMBER,
        to: phonenumber
    }, (error, message) => {
        if (err) return res.status(500).send({error})
        res.status(200).send({})
    })
})

app.post('/verify', (req, res) => {
    if (!req.body || !req.body.payload || !tokenStore.isValid(req.body.payload)) {
        return res.status(500).send({error: {message: 'wrong token'}})
    }
    admin.auth().createCustomToken(res.body.payload.phonenumber)
        .then((customToken) => res.status(200).send({token: customToken}))
        .catch(error => res.status(401).send({error}))
})


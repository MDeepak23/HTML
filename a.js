const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');
const token = '7451144826:AAHvTAtgGyHtTXigpq1jpRtVq8G65mfmniU';
const bot = new TelegramBot(token, { polling: true });
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = getFirestore();

bot.on('message', function (msg) {
  const a = msg.text;
  const NewMsg = a.split(' ');

  if (NewMsg[0] === 'marksentry') {
    bot.sendMessage(msg.chat.id, 'Please Enter Marks(MPC)');
  } else if (NewMsg[0] === 'insert') {
    db.collection('Marks').add({
      key: NewMsg[1],
      datavalue: NewMsg[2],
      UserId: msg.from.id
    }).then(() => {
      bot.sendMessage(msg.chat.id, NewMsg[1]+' Marks Stored Successfully');
    });
  } else if (NewMsg[0] === 'get') {
    db.collection('Marks').where('UserId', '==', msg.from.id).get().then((docs) => {
      docs.forEach((doc) => {
        console.log(doc.data());
        bot.sendMessage(msg.chat.id, doc.data().key+" " +doc.data().datavalue);
      });
    });
  } else {
    bot.sendMessage(msg.chat.id, 'Please give valid information');
  }
});
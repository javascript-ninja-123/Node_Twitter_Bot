const express = require('express');
const app = express();
const {reduceList} = require('./util/util')
const bodyParser = require('body-parser');


app.use(bodyParser.json())

const Twit = require('twit')
const {consumer_key,
consumer_secret,
access_token,
access_token_secret} = require('./config/keys')

const BOT = new Twit({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  timeout_ms:60*1000,
})

app.post('/update', (req,res) => {
  BOT.post('statuses/update', { status: req.body.text },(err, data, response) => {
    if(err) return res.status(404).send({message:err.message})
    res.send({message:`${data.text} is tweeted`})
  })
})

app.post('/followers', (req,res) => {
  BOT.get('followers/list', { screen_name: req.body.tag },  function (err, data, response) {
    if(err) return res.status(404).send({message:err.message})
    const followerList = data.users.reduce((acc,val) => {
      acc.push(val.name)
      return acc;
    },[])
    res.send({followerList})
  })
});

app.post('/follow', (req,res) => {
  BOT.post('friendships/create', {screen_name:req.body.follower}, (err,data,response) => {
    if(err) return res.status(404).send({message:err.message})
    res.send({follower:`you started following ${req.body.follower}`})
  })
});

app.post('/my-friend-list', (req,res) => {
  BOT.post('friends/list', {screen_name:req.body.userName}, (err,data,response) => {
    if(err) return res.status(404).send({message:err.message})
    const friendList = reduceList(data.users,'name');
    res.send({friends:friendList})
  })
});


app.post('/friend-detail', (req,res) => {
  BOT.get('friendships/lookup', {screen_name:req.body.friend}, (err,data,response)=> {
    if(err)return res.status(404).send({message:err.message});
    res.send({friend:data})
  })
})

// BOT.post('direct_messages/new', {screen_name:'SsuyiYi', text:'sup'}, (err,data,response) => {
//   if(err) return console.log(err)
//   console.log(data)
// })

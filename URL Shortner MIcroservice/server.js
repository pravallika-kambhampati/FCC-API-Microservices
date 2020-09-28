'use strict';

var express = require('express');
var mongo = require('mongodb');

//monodb & mongoose config
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const { Schema } = mongoose;
const urlsSchema = new Schema({
  id: Number,
  url: String,

})

var URLS = mongoose.model('URLS', urlsSchema);


//body-parser 
var bodyParser = require('body-parser')

var cors = require('cors');

//express
var app = express();


var port = process.env.PORT || 3000;

app.use(cors());

//body-parser config
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({     
  extended: true
})); 



app.use('/public', express.static(process.cwd() + '/public'));

//api routes 
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

function getJedisQuery(query_id){
   var query = URLS.find({id: query_id});
   return query;
}


let id = -1;

app.post("/api/shorturl/new", (req, res) => {

    var createAndSaveUrl = (data) => {
    var url = new URLS ({ id: id++, url: data });
    url.save((err)=> {
    if(err) return console.log.error(err);
    res.json({"original_url": req.body.url , "short_url": id })
    });

  };  
  createAndSaveUrl(req.body.url);
});

app.get("/api/shorturl/:id", (req, res)=> {

  const id = Number(req.params.id) - 1;
  const q = getJedisQuery(id);
  q.exec(function(err,jedis){
   if(err) return console.log(err);
   res.redirect(jedis[0]["url"]);  
   });
});

//listening at port whatever
app.listen(port, function () {
  console.log('Node.js listening ...');
});
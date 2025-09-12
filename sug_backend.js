const express = require("express");
var cors = require('cors');
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.urlencoded());
server.use(bodyParser.json());
server.use(cors());
const port = 5500;

server.post('/post-url',async(req,res)=>{
  const longurl = req.body.longURL;
  console.log("recieved: ",longurl);
  var randword = Math.random().toString(36).substring(2,7);

  await client.connect();
  const database = client.db("shorturldata");
  const urlcon = database.collection("urls");

  while(await urlcon.findOne({ shortd: randword })!=null){
    randword = Math.random().toString(36).substring(2,7);
  }
    res.json(randword);
  inserturl(randword,longurl);
})  

server.get('/',async(req,res) =>{
  const para = await req.query.id;
  console.log('recieved: ',para);
  var redi = await pointer(para);
  return res.redirect(redi);
})


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb_uri";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //await client.db("admin").command({ ping: 1 });
    await client.connect();
    const database = client.db("shorturldata");
    const collection = database.collection("urls");
    await collection.createIndex({ "createdAt": 1 },{ expireAfterSeconds: 3600 })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

async function inserturl(urlshort,urllong) {
  await client.connect();
  const database = client.db("shorturldata");
  const collection = database.collection("urls");
  const currentDate = new Date();
  const urlsToInsert = {
      shortd: urlshort,
      longd: urllong,
      createdAt: currentDate 
    };
  await collection.insertOne(urlsToInsert);
}

async function pointer(paraurl) {
  await client.connect();
  const database = client.db("shorturldata");
  const urlcon = database.collection("urls");
  if( await urlcon.findOne({ shortd: paraurl }) == null){
    server.use((req, res, next) => {
      res.status(404).send('<h1>404 - Page Not Found</h1>');
    });
  }
  else{
    var what = await urlcon.findOne({ shortd: paraurl });
    return what.longd;
  }
}
  
run().catch(console.dir);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(express.json());

// mongo db 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://DBUser:<password>@cluster0.natc4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log('Connected')
  client.close();
});


app.get('/', (req, res) => {
    res.send('Welcome To My Ware House Server')
})
app.listen(port, ()=> {
    console.log('WareHouse', port)
})
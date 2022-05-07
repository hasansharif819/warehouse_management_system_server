const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(express.json());

// mongo db 

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.natc4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const smartColletion = client.db('smartPhone').collection('products');

        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = smartColletion.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/inventory', async(req, res) => {
            const query = {};
            const cursor = smartColletion.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await smartColletion.findOne(query);
            res.send(inventory);
        });
        //Delete from database
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await smartColletion.deleteOne(query);
            res.send(result);
        });

        //post // form or data received from client server
        app.post('/inventory', async (req, res) => {
            const newInventories = req.body;
            const result = await smartColletion.insertOne(newInventories);
            res.send(result);
        });
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome To My Ware House Server')
})
app.listen(port, ()=> {
    console.log('WareHouse', port)
})
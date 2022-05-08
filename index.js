const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(express.json());

//JWT
// function varifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     console.log(authHeader);
//     if (!authHeader) {
//         return res.status(401).send({ message: 'Unauthorized Access' });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             return res.status(403).rsend({ message: 'Forbidden Access' });
//         }
//         console.log('decoded', decoded);
//         req.decoded = decoded;
//         next();
//     })
// }

// mongo db 

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.natc4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const smartColletion = client.db('smartPhone').collection('products');
        const myItemCollection = client.db('smartPhone').collection('items');

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

        app.post('/login', async(req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '2d'});
            res.send(accessToken);
        });

        app.post('/myitem', async (req, res) => {
            const item = req.body;
            const result = await myItemCollection.insertOne(item);
            res.send(result);
        });
        
        app.get('/myitem', async(req, res) => {
            const email = req.query.email;
            const query = { email };
            const cursor = myItemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // app.get('/myitem', varifyJWT, async(req, res) => {
        //     const email = req.query.email;
        //     console.log(email);
        //     const decodedEmail = req.decoded.email;
        //     // const email = req.query.email;
        //     if(decodedEmail === email){
        //         const query = { email };
        //         const cursor = myItemCollection.find(query);
        //         const result = await cursor.toArray();
        //         res.send(result);
        //         console.log(decodedEmail)
        //     }
        //     else{
        //         return req.status(403).send({message: 'Forbidden Access'});
        //         console.log('whats happened??')
        //     }
        // })
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
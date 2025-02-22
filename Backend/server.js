import express from 'express';
import 'dotenv/config'
import { MongoClient } from "mongodb"
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json())
 app.use(cors())

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


const dbName = 'Vaultora';
 await client.connect();


app.get('/', async(req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

app.post('/', async(req, res) => {
    const db = client.db(dbName);
    const password = req.body
    const collection = db.collection('passwords');
    const insertResult = await collection.insertOne(password);
    res.send({success:true});
});
app.delete('/', async(req, res) => {
    const db = client.db(dbName);
     const password = req.body
    const collection = db.collection('passwords');
    const deleteResult = await collection.deleteOne(password);
    res.send({success:true});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});   
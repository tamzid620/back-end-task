const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = 3000
const { ObjectId } = require("mongodb");

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());
// ------------------------------------------------

const dbUsername = process.env.DB_USERNAME ;
const dbPassword = process.env.DB_PASSWORD ;
const dbName = process.env.DB_NAME ;

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.qtemx5j.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// -------------------------------------------------

let allEquipmentCollection;

client.connect()
  .then(() => {
    const db = client.db(dbName);
    allEquipmentCollection = db.collection('equipments');
    console.log('Connected to MongoDB and collection initialized.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


app.get('/all-equipments', (req, res) => {
  allEquipmentCollection.find().toArray()
    .then((data) => res.json(data))
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Error fetching data' });
    });
});

app.get('/all-equipments/:id', (req, res) => {
  const equipmentId = req.params.id;
  allEquipmentCollection.findOne({ id: parseInt(equipmentId) })
    .then((equipment) => {
      if (equipment) {
        res.json(equipment);
      } else {
        res.status(404).json({ message: 'equipment not found' });
      }
    })
    .catch((error) => {
      console.error('Error fetching equipment:', error);
      res.status(500).json({ message: 'Error fetching equipment' });
    });
});

// test port section -------------------------------------------

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

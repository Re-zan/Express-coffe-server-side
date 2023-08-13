const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

//midalware
app.use(cors());
app.use(express.json());

//mongodb connection

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6wlkevy.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const coffeCollection = client.db("coffeDB").collection("coffe");
    //process start
    app.get("/coffes", async (req, res) => {
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/coffes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.findOne(query);
      res.send(result);
    });
    app.post("/addCoffes", async (req, res) => {
      const coffes = req.body;
      const result = await coffeCollection.insertOne(coffes);
      res.send(result);
      // console.log(coffes);
    });

    app.put("/coffes/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffes = req.body;
      const updateDoc = {
        $set: {
          name: coffes.name,
          chef: coffes.chef,
          supplier: coffes.supplier,
          taste: coffes.taste,
          category: coffes.category,
          details: coffes.details,
          photo: coffes.photo,
        },
      };
      const result = await coffeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.delete("/coffes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("let's make some coffeee.....");
});

app.listen(port);

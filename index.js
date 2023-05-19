const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 2000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_TOY}:${process.env.SECRET_KEY}@cluster0.ik2qndc.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const ToysCollection = client.db("ToyDB").collection("Toys");
    app.get("/data/:text", async (req, res) => {
      if (
        req.params.text == "Thanos" ||
        req.params.text == "Thor" ||
        req.params.text == "Iron-man"
      ) {
        const result = await ToysCollection.find({
          Category: req.params.text,
        }).toArray();
        return res.send(result);
      }
    });

    app.post("/toys", async (req, res) => {
      const newToys = req.body;
      console.log(newToys);
      const result = await ToysCollection.insertOne(newToys);
      res.send(result); // Send the inserted document as the response
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toys are walking");
});
app.listen(port, () => {
  console.log(`Toys are walking on port : ${port}`);
});

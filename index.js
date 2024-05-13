const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credential: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6xa5uzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // collection name
    const postedServiceCollection = client.db("services").collection("posted");
    const bookedServiceCollection = client.db("services").collection("booked");

    // post a single service data
    app.post("/services", async (req, res) => {
      const postedData = req.body;
      const result = await postedServiceCollection.insertOne(postedData);
      res.send(result);
    });

    // post a single post data
    app.post("/bookedService", async (req, res) => {
      const bookedData = req.body;
      const result = await bookedServiceCollection.insertOne(bookedData);
      res.send(result);
    });

    // get all documents
    app.get("/services", async (req, res) => {
      const result = await postedServiceCollection.find().toArray();
      res.send(result);
    });

    // get all booked documents
    app.get("/bookedService", async (req, res) => {
      const result = await bookedServiceCollection.find().toArray();
      res.send(result);
    });

    // get a single document
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postedServiceCollection.findOne(query);
      res.send(result);
    });

    // get all documents of a specific user
    app.get("/services/:email", async (req, res) => {
      const email = req.params.email;
      const result = await postedServiceCollection
        .find({ "serviceProviderInfo.serviceProviderEmail": email })
        .toArray();
      res.send(result);
    });

    // get all document of book service by a specific user
    app.get("/bookedService/:email", async (req, res) => {
      const email = req.params.email;
      const result = await bookedServiceCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // get all document of book service by a specific user
    app.get("/bookedService-provider/:email", async (req, res) => {
      const email = req.params.email;
      const result = await bookedServiceCollection
        .find({ "serviceProvider.serviceProviderEmail": email })
        .toArray();
      res.send(result);
    });

    // update status by provider
    app.patch("/bookedService-updateStatus/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await bookedServiceCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete a document
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postedServiceCollection.deleteOne(query);
      res.send(result);
    });

    // update a service
    app.patch("/service/:id", async (req, res) => {
      const id = req.params.id;
      const changedData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          serviceImg: changedData.serviceImg,
          serviceName: changedData.serviceName,
          servicePrice: changedData.servicePrice,
          serviceArea: changedData.serviceArea,
          serviceDescription: changedData.serviceDescription,
        },
      };
      const result = await postedServiceCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 11");
});

app.listen(port, () => console.log("server running on port", port));

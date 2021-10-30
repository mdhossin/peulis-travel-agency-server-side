// user : travelUser
// pass : 3H3HTMMAWnP3TbUJ

const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3m2s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(uri);

async function run() {
  try {
    await client.connect();
    const servicesCollection = client.db("travelAgency").collection("services");
    const ordersCollection = client.db("travelAgency").collection("orders");

    // get api read data show on the ui
    // get api read all product from database  load korsi
    app.get("/products", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.send(result);
    });

    // add new service for create post api
    app.post("/products", async (req, res) => {
      const newService = req.body;
      // console.log(req.body);
      const result = await servicesCollection.insertOne(newService);
      res.json(result);
    });

    // create get api find a single product useing id show on the ui
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });

    // add single product buy now button create api set on the database
    app.post("/placeorder", async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await ordersCollection.insertOne(newProduct);
      res.json(result);
    });

    // load buy now order on the ui api my order component
    app.get("/orders/:email", async (req, res) => {
      const id = req.params.email;
      // console.log(id);

      const result = await ordersCollection.find({ email: id }).toArray();

      res.send(result);
    });
    // delete from my orders create delete api
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id hitting", id);
      const query = { _id: id };
      console.log(query);
      const result = await ordersCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });

    // delete from manage order
    app.delete("/manageorder/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id hitting", id);
      const query = { _id: id };
      console.log(query);
      const result = await ordersCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello backend how are you");
});

app.listen(port, () => {
  console.log("listening to port ", port);
});

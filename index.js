const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database connection helper
async function getCollection() {
  await client.connect();
  return client.db("expenseDB").collection("expenses");
}

// Routes
app.post("/expenses", async (req, res) => {
  try {
    const expenseCollection = await getCollection();
    const result = await expenseCollection.insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to add expense" });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const expenseCollection = await getCollection();
    const expenses = await expenseCollection.find({}).toArray();
    res.send(expenses);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch expenses" });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const expenseCollection = await getCollection();
    const query = { _id: new ObjectId(req.params.id) };
    const result = await expenseCollection.deleteOne(query);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to delete" });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const expenseCollection = await getCollection();
    const filter = { _id: new ObjectId(req.params.id) };
    const updateDoc = {
      $set: {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date,
      },
    };
    const result = await expenseCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to update" });
  }
});

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(port, () => console.log(`Server running on port ${port}`));
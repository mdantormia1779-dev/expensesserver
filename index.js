const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // JSON data receive karne ke liye zaroori hai

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // Database aur Collection define karein
    const db = client.db("expenseDB");
    const expenseCollection = db.collection("expenses");

    // Yahan aap apne routes likh sakte hain
    // Jaise POST request (data add karne ke liye):
    app.post("/expenses", async (req, res) => {
      const newExpense = req.body;
      const result = await expenseCollection.insertOne(newExpense);
      res.send(result);
    });

    // GET request (data dekhne ke liye)
    app.get("/expenses", async (req, res) => {
      const query = {};
      const cursor = expenseCollection.find(query);
      const expenses = await cursor.toArray();
      res.send(expenses);
    });

    const { ObjectId } = require("mongodb");

    app.delete("/expenses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await expenseCollection.deleteOne(query);
      res.send(result);
    });

    // PUT route (Update karne ke liye)
app.put('/expenses/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            title: updatedData.title,
            amount: updatedData.amount,
            category: updatedData.category,
            date: updatedData.date
        },
    };
    const result = await expenseCollection.updateOne(filter, updateDoc);
    res.send(result);
});

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.error(error);
  }
  // Note: 'finally' block hata diya hai taaki connection open rahe
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Expense Tracker Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

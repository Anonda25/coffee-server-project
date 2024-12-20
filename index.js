const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// maiddlewere
app.use(cors());
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ls3lx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollation = client.db("CoffeeDB").collection("coffee");

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollation.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollation.findOne(query)
            res.send(result)
        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id:new ObjectId(id) }
            const options = { upsert: true };
            const UpdateCoffee = req.body;
            const coffee = {
                $set: {
                    name: UpdateCoffee.name,
                    teast: UpdateCoffee.teast,
                    quentity: UpdateCoffee.quentity,
                    supplier: UpdateCoffee.supplier,
                    category: UpdateCoffee.category,
                    details: UpdateCoffee.details,
                    photo: UpdateCoffee.photo,

                },
            };
            const result = await coffeeCollation.updateOne(filter, coffee, options);
            res.send(result)

        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollation.insertOne(newCoffee);
            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollation.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee macking is running')
})
app.listen(port, () => {
    console.log(`coffee macking is start : ${port}`);
})
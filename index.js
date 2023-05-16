const express = require('express')
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken')


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000

const cors = require('cors')
//Middleware

// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
//   }
//   app.use(cors(corsConfig))


app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtm85fa.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("coffeeDB");
    const coffees = database.collection("coffees");

   

    //servies route
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.get('/addcoffee', async(req, res)=>{
      const cursor = coffees.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/addcoffee', async(req, res)=>{
      const coffee = req.body;
      // console.log(coffee);
      const result = await coffees.insertOne(coffee)
      res.send(result)
    })

    app.patch('/addcoffee/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedData = req.body;
      const filter = {_id: new ObjectId(id)}
      const updatedDoc ={
        $set:{...updatedData}
      }
      const result = await coffees.updateOne(filter, updatedDoc)

      res.send(result)

    })

    app.delete('/addcoffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await coffees.deleteOne(query)
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





app.listen(port, () => {
  console.log(`Server is running at port : ${port}`)
})
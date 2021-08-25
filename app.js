const express = require('express')
const app = express()

const hbs = require('hbs')
app.use(express.static(__dirname + '/public'));

const {ObjectId,MongoClient} = require('mongodb');
const url = 'mongodb+srv://bien2206:bien2206@cluster0.g9h5m.mongodb.net/test';

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req,res)=>{

    res.render('index')
})
app.get('/show', async (req,res)=>{
    const client = await MongoClient.connect(url);
    const dbo = client.db("ProductDB");
    const results = await dbo.collection("Product").find({}).toArray();
    res.render('list',{model:results});
})
app.get('/insert', (req,res)=>{
    res.render('NewProduct');
})
app.post('/doInsert', async (req,res)=>{
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const colorInput = req.body.txtColor;
    const categoryInput = req.body.txtCategory;
    const pictureInput = req.body.txtPicture;
    const newProduct = {productName : nameInput, price : priceInput, color : colorInput, category : categoryInput, picture : pictureInput};
    const client = await MongoClient.connect(url);
    const dbo = client.db("ProductDB");
    
        await dbo.collection("Product").insertOne(newProduct);

        res.redirect('/show');
})

app.get('/delete', async (req,res)=>{
    const id = req.query.id;
    var ObjectId = require('mongodb').ObjectId;
    const condition = {"_id" : ObjectId(id)};

    const client = await MongoClient.connect(url,{useUnifiedTopology: true});
    const dbo = client.db("ProductDB");

    await dbo.collection("Product").deleteOne(condition);
    res.redirect('/show');

})

app.get('/edit', async (req,res)=>{
    const id = req.query.id;

    const ObjectId = require('mongodb').ObjectId;
    const condition = {'_id' : ObjectId(id)};

    const client = await MongoClient.connect(url);
    const dbo = client.db("ProductDB");
    const results = await dbo.collection('Product').findOne(condition);
    
    res.render('edit', {model: results});
})

app.post('/Update', async (req,res)=>{
    const id = req.body.id;
    const nameEdit= req.body.txtName;
    const priceEdit = req.body.txtPrice;
    const colorEdit = req.body.txtColor;
    const categoryEdit = req.body.txtCategory;
    const pictureEdit = req.body.txtPicture
    const newValues= {$set: {productName: nameEdit, price : priceEdit, color : colorEdit, category : categoryEdit, picture : pictureEdit}};
    const ObjectId = require('mongodb').ObjectId;
    const condition = {"_id" : ObjectId(id)};

    const client = await MongoClient.connect(url);
    const dbo = client.db("ProductDB");
    await dbo.collection("Product").updateOne(condition,newValues);

    res.redirect('/show');
})
app.post('/search', async (req,res)=>{
    let nameSearch = req.body.txtSearch; 
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("ProductDB");

    let searchProduct = {productName : new RegExp(nameSearch, 'i')};
    let results = await dbo.collection('Product').find(searchProduct).toArray();
    console.log(results);
    res.render('list', {model: results});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT)
console.log("app is running ", PORT)

const dotenv = require("dotenv")
const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shorturl")

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
dotenv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DATABVASE CONNECTED"))
.catch(err => console.log(err))

app.set("view engine", "ejs")

app.get("/", async (req, res) => {
  try{
    const shortUrls = await ShortUrl.find()
    res.render("index", {shortUrls: shortUrls})
  } catch(err){
    console.log(err)
  }
})


app.post("/shorturls", async (req, res) => {
  const fullUrl = req.body.fullUrl
  
  try{
    var shortUrl = '';
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    for(var i = 0; i < 8; i++){
      shortUrl += char.charAt(Math.floor(Math.random() * char.length))
    }
    const newUrl = new ShortUrl({ url: fullUrl, shortUrl: shortUrl })
    await newUrl.save()
    res.redirect("/")
  }catch(err){
    console.log(err)
  }
})


app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl
  try{
    const short = await ShortUrl.findOne({shortUrl})
    if(!short) return res.status(404)
    res.redirect(short.url)
  }catch(err){
    console.log(err)
  }
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log("server running on port : ", port))
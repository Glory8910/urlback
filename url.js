let mongodb = require("mongodb")
let express = require('express');
let bodyparser = require('body-parser')
let mongoose = require('mongoose');
let urlExists = require('url-exists')
var cors = require('cors')
require('dotenv').config()

const { shoridurl } = require("./models/nano.js");

var { nanoid } = require("nanoid");
// var ID = nanoid(5);
 console.log(.env)
const app = express()
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());

let val=process.env.IP;
let pas=process.env.PASS;

var corsOptions = {
    orgin:val,
    optionSuccessStatus: 200,
    methods: "GET,POST"
}
app.use(cors(corsOptions))

const uri = "mongodb+srv://newurls:`${pas}`@datas.knlcs.mongodb.net/list?retryWrites=true&w=majority"

app.get("/data", async (req, res) => {


    try {
        await mongoose.connect(uri, { useNewUrlParser: true });
        let alldata = await shoridurl.find(function (err, data) {
            if (err) throw err
            res.status(200).json({ "initial": data });
        })
    }
    catch (err) {
        console.log(err)
    }
    finally {
        mongoose.disconnect()


    }

})


app.post("/long", cors(), async (req, res) => {

    try {
        urlExists(req.body.longurl,async function(err, exists) {
          if (!exists || err) {
                console.log(error,exists)
                res.status(400).json({ "message": "try with correct url" })
            }
            else if(exists) {
                console.log(exists)
                await mongoose.connect(uri, { useNewUrlParser: true });

                var ID = nanoid(5);
                let generator = new shoridurl({
                    longurl: req.body.longurl,
                    shorturl: ID
                })


                console.log(req.body)
                  await generator.save()
                let alldata = await shoridurl.find(function (err, data) {
                    if (err) throw err
                    res.status(200).json({ "initial": data });
                })



            }

        })
    }
    catch (err) {
        console.log(err)
    }
    finally {
        mongoose.disconnect()

    }

    })




app.get("/delete/:shortner", async function (req, res) {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true });
        await shoridurl.findOneAndDelete({ shorturl: req.params.shortner }, async function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
            
                res.json({ "data": "deleted" })
            }


        });

    }
    catch {
        console / log(error)
    }
    finally {
        mongoose.disconnect();
    }



})


app.get("/redirect/:shortner", async function (req, res) {

    try {
        await mongoose.connect(uri, { useNewUrlParser: true });
        await shoridurl.findOne({ shorturl: req.params.shortner }, async function (err, docs) {
          if (err) {
            console.log(err)
          }
          else {
            console.log(docs.longurl, docs.count)
    
            shoridurl.updateOne({ shorturl: req.params.shortner },
              { "$inc": { count: 1 } }, function (err, docs) {
                if (err) {
                  console.log(err)
                }
                else {
                  console.log("Updated Docs : ", docs);
                }
              });
    
            console.log(docs.count);
    
    
            console.log(req.params.shortner);
            await res.redirect(docs.longurl);
          }
        });
    
      }
      catch {
        console.log(error)
      }
      finally {
        mongoose.disconnect();
      }
    

})

app.listen( process.env.PORT || 3000, console.log("started..."))
const express = require('express');
const mongoose = require('mongoose');
const ejs= require('ejs');

const app = express();
app.set('view engine','ejs');
const port = process.env.PORT || 3000;

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title:String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// *********************** requests targetting to all articles *************************** //

app.route('/articles')

.get(function(req, res){
    Article.find({}).then((doc)=>{
        res.send(doc);
    }).catch((err)=>{res.send(err)});
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(()=>{res.send("sucsessfully added a new article")}).catch((err)=>(res.send(err)));
})

.delete(function(req, res){
    Article.deleteMany({}).then(()=>{res.send("successfully deleted all items")}).catch((err)=>{res.seend(err)});
});


// *********************** request targetting to a specific article *************************** //

app.route('/articles/:specificArticle')
.get(function(req,res){
    Article.findOne({title: req.params.specificArticle}).then((doc)=>{if(doc.title===null){res.send(null)}else{res.send(doc)}}).catch((err)=>{res.send(err)});          
})
.put(function(req,res){
   Article.findOneAndUpdate({title: req.params.specificArticle},{title: req.body.title, content: req.body.content},{overwrite: true},function(err){
        if(err){
            res.send(err);
        } else {
            res.send("successfully updated");
        }
    });  
})
.patch(function(req,res){
    Article.findOneAndUpdate({title: req.params.specificArticle},{$set: req.body},function(err){
        if(err){
            res.send(err);
        }else{
            res.send("success");
        }
    });
})
.delete(function(req,res){
    Article.deleteOne({title: req.params.specificArticle}).then(()=>{res.send("success")}).catch((err)=>{res.send(err)});
});


app.get('/', function(req,res){
    res.render('index');
});

app.listen(port,function(){
    console.log(`Server is running at port ${port} http://localhost:${port}`);
});

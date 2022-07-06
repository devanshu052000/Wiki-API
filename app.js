const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles").get(function(req, res){
  Article.find({},function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
}).post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save();
    res.redirect("/articles");
}).delete(function(req, res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Succesfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle").get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    } else {
      res.send(err);
    }
  });
}).put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("successfully updated article.");
      }
    }
  )
}).patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: {title: req.body.title}},
    function(err){
      if(!err){
        res.send("successfully updated article.");
      }
    }
  )
}).delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted article.");
      }
    })
});

app.listen(3000,function(req, res){
  console.log("Server started on port 3000");
});

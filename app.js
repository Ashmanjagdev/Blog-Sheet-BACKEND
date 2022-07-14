const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://ashman_jagdev:ashmanraju@cluster0.n8apx.mongodb.net/BlogsDB');

let express=require("express");
let bodyParser=require("body-parser");
var _ = require('lodash');
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

const blogSchema=new mongoose.Schema ({
  heading: String,
  content: String,
  date: String
});

const Blog=mongoose.model('Blog',blogSchema);

const blog= new Blog ({
  heading: "Mona Lisa",
  content: "Leonardo da Vinci is hot property these days. Recently we’ve had the silly furore about La Bella Principessa, and now there’s the 1 millionth new theory about the Mona Lisa, that world-famous, “mysterious” picture that is, in reality, a small but wonderful portrait of a Florentine merchant’s wife. The theory was announced in last week’s BBC2 documentary Secrets of the Mona Lisa, which I haven’t had time to write anything about yet. Let me just say that though the documentary made for riveting tele, the art history concerned was, well, let’s say optimistically dumbed-down. There were also a number of incongruous leaps made that I simply couldn’t understand.",
  date: "Saturday, 9 July, 2022 at 4:51 am"
});
app.get("/",function(req,res)
{

  Blog.find({},function(error,data){
    if(data.length===0)
    {
      blog.save();
      res.redirect("/");
    }
    else {
      res.render("index",{listItems:data,headings:data,date:data});
    }
  });

});
app.get("/compose",function(req,res)
{
  res.render("compose");

});
app.get("/delete",function(req,res)
{
  Blog.find({},function(error,data){

  res.render("delete",{listItems:data,headings:data,date:data});

  });
});
app.get("/contact",function(req,res)
{
  res.render("contact");

});
app.get("/posts/:head",function(req,res)
{
  let requestedTitle=req.params.head;

  Blog.find({},function(error,data){
    data.forEach((item) => {
      if(requestedTitle===_.kebabCase([string=item.heading]))
      res.render("posts",{postHeading:item,postContent:item,date:item});
      });
  });

});
let options = {
 weekday: 'long',
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 hour:'numeric',
 minute: 'numeric'
};
app.post("/",function(req,res)
{
  let date = new Date();
  let d=date.toLocaleString('gb-EG', options);

  let item=req.body.input;
  let heading=req.body.headings;
  const newblog= new Blog ({
    heading: heading,
    content: item,
    date: d
  });
  newblog.save();

res.redirect("/compose");
});
app.post("/delete",function(req,res)
{
  const id=req.body.delete;
  Blog.findByIdAndRemove(id,function(err){
    if(!err)
    {
    res.redirect("/delete");
  }
  else {
    console.log(err);
  }
  });
});
app.listen(process.env.PORT || 3000,function() {
  console.log("hosted at port 3000");
});

const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _ = require("lodash");
// const date=require(__dirname+ "/date.js");

const app=express();

// let newLists=["buy food","cook food","eat food"];
// let workItems=[];
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://subgau0817:5kd3hzzZGiOXG0Gf@cluster0.cuiox4f.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemsSchema={
  name:String
};

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist!"
});

const item2=new Item({
  name:"Hit the +button to off a new item."
});

const item3=new Item({
  name:"<--- Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];
// Item.insertMany(defaultItems);

const listSchema ={
  name:String,
  items:[itemsSchema]
};

const List= mongoose.model("List",listSchema);

app.get("/",function(req,res){

  Item.find({},function(err,foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems);
      res.redirect("/");
  }else {
    res.render("list",{listTitle:"Today",newListItems:foundItems});
  }


    // if (foundItems.length===0){
    //
    //
  });
  // res.redirect("/");
  // }else{







// const day=date.getDate();
});
app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);

  List.findOne({name: customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        // create a new list
        const list= new List({
          name:customListName,
          items:defaultItems
        });
          list.save();
          res.redirect("/"+ customListName);
        // console.log("Doesn't exist!");
      } else {
        // show an existing list
        // console.log("Exists!");
        res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
      }

    }
  });



});
app.post("/",function(req,res){

  const itemName = req.body.listValue;
  const listName = req.body.list;
  // create a new document
  const item=new Item({
    name:itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");

  }else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);

    });
  }


  // item.save();

  // this to render it on to the webpage
  // res.redirect("/");
  // console.log(req.body);
  // if (req.body.list===''){
  //  workItems.push(newList);
  //  res.redirect("/work");
  // }else{
  //  newLists.push(newList);
  //  res.redirect("/");
  // }
});
app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;

  if (listName ==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  }else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }


});

app.get("/about",function(req,res){
  res.render("about");
});

app.get("/work",function(req,res){
  res.render("list",{listTitle: "Work List",newListItems:workItems});
});

app.listen(3000,function(){
  console.log("server is running on PORT3000");
});

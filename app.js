//jshint esversion:6

const express=require("express")
const bodyParser=require("body-parser")
const date=require(__dirname+"/date.js")
const app=express()
const mongoose=require("mongoose")
const _=require("lodash");

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))
mongoose.connect("mongodb+srv://ojesvi123:ojesvi123@cluster0.p968tso.mongodb.net/?retryWrites=true&w=majority")
const itemsschema={
    name:String
}

const listschema={
    name:String,
    items:[itemsschema]
}

const List=mongoose.model("List",listschema)

const item=mongoose.model("item",itemsschema)

const item1=new item({
    name:"welcome to your to do list"
});
const item2=new item({
    name:"Hit this + to add a new item"
});
const item3=new item({
    name:"Hit this to delete the item"
});
const defaultnewitems=[item1,item2,item3]
app.set('view engine','ejs')

app.get("/",function(req,res){


    item.find({},function(err,foundItems){//founditems array
    
        if(foundItems.length===0)
        {
            item.insertMany(defaultnewitems,function(err){
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    console.log("Successfully added new item to your database")
                }
            })
            res.redirect("/")
        }
        else
        {
            res.render("list",{
                listTitle:"Today",
                newListitems:foundItems
               });
        }
    })
})

app.get("/:customListname",function(req,res){
      const customListname=_.capitalize(req.params.customListname)

      List.findOne({name:customListname},function(err,foundList){//foundList object
        if(!err){
            if(!foundList){
                const list=new List({
                    name:customListname,
                    items:defaultnewitems
                  })
                  list.save()
                  res.redirect("/"+ customListname)
            }
            else
            {
                res.render("list",{
                    listTitle:foundList.name,
                    newListitems:foundList.items
                   });
            }
        }
      })
})
app.post("/",function(req,res){
    const itemName=req.body.newItem
    const listName=req.body.list
    const item4=new item({
        name:itemName
    })
    if(listName==="Today")
    {
    item4.save()
    res.redirect("/")
    }
    else
    {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item4)
            foundList.save()
            res.redirect("/" + listName)
        })
    }
})
app.post("/delete",function(req,res){
    const checkedItemcode=req.body.checkbox
    const listName=req.body.listName
    if(listName==="Today"){
    item.findByIdAndRemove(checkedItemcode,function(err){
        if(!err)
        {
            console.log("Sucessfuly deleted checked item");
            res.redirect("/");
        }
    });
}

    else
    {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemcode}}},function(err,foundList){
            if(!err)
            {
                res.redirect("/" + listName)
            }
        });
    }
})

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work list",newListitems:work})
});

app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("Server listening on port 3000")
})
const express=require('express');
const router=express.Router();
const fetchuser = require("../middleware/fetchUser")
const Notes=require("../models/Notes")
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes= await Notes.find({user: req.user.id});
        res.json(notes)    
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
    
})


router.post('/addnote',fetchuser,[
    body('title',"enter a valid title").isLength({min:3}),
    body('description',"Please enter at least 5 character").isLength({min:5}), 
],async (req,res)=>{
    const {title,description,tag}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notes=new Notes({title,description,tag,user:req.user.id})
        const savenotes=await notes.save()
        
        res.json(savenotes)     
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
   
})
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    const {title,description,tag}=req.body;
    const newnote={}
    if(title){newnote.title=title}
    if(description){newnote.description=description}
    if(tag){newnote.tag=tag}

    let note=await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not Allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
    res.json({note})
})

router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
   try {
   
    let note=await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"successfuly deleted", note:note})
        
   } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
}
})

module.exports = router;
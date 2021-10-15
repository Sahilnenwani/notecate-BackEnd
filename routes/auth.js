const express=require('express');
const router=express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const user = require('../models/User');
const JWT_secrect="SahilNenwani";
const fetchuser = require("../middleware/fetchUser")

router.post('/createuser',[
    body('name',"enter a valid name").isLength({min:3}),
    body('email').isEmail(),
  body('password').isLength({ min: 5 }),

],async (req,res)=>{
  let success =false;
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {

      let user=await User.findOne({email:req.body.email})
      if (user){
        return res.status(400).json({success,error:"This email already exists"})
      }
      const salt= await bcrypt.genSalt(10);
      const secpass=await bcrypt.hash(req.body.password,salt) ;
      user = await User.create({
          name: req.body.name,
          email:req.body.email,
          password:secpass,
        })
        const data={
          user:{
            id:user.id
          }
        }
        const authtoken= jwt.sign(data,JWT_secrect);
        success=true
        res.json({success,authtoken});
        // .then(user => res.json(user))
        // .catch(err=>{console.log(err)
        // res.json({error:'please enter unique email adderss'})})      
    } 
      catch (error) {
        console.error(error.message);
        res.status(500).send(success,"some error occured");
      }
    })

// authenticate the user using: post /api/auth/login

router.post('/login',[
  body('email').isEmail(),
  body('password','password cannot be blank').exists()
],async (req,res)=>{
  const errors = validationResult(req);
  let success =false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {email,password}=req.body;
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({error:"Please enter Right details"});
    }
    else{
    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      success=false;
      return res.status(400).json({success,error:"Please enter Right details"});
    }
    else{
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken= jwt.sign(data,JWT_secrect);
    success=true
    res.json({success,authtoken});}
  }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error occured");
  }

}
)
router.post('/getuser',fetchuser,async(req,res)=>{
  
  try {
   userid= req.user.id
   const user = await User.findById(userid).select("-password")
    res.send(user)  
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error occured");
  }

})

module.exports = router;
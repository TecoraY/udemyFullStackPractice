const express =require ('express');
const router = express.Router();
const gravatar= require('gravatar');
const bcrypt=require('bcryptjs');
//express validator-error handler
const { check, validationResult}=require('express-validator/check');
const User = require('../models/User');


//@route  post api/users
//@desc   Register User
//@access Public
router.post('/', 
[
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({min:6})
], 
async (request, response) => {
    //need to initialize middleware
    
    const errors=validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()//if information not correct get a bad request message explaining what's missing
    });
    }//pulls the certain things out if request.body.
    //send error if they do exists- no multiple emails
    const {name, email, password}=request.body;
    try{//see if user exists
    let user=await User.findOne({email});

    if (user){
        return response.status(400).json({errors: [{msg: 'User already exists'}]});
    }
    
    //get users gravatar
    const avatar=gravatar.url(email,{
        s: '200',//size of gravatar
        r: 'pg',//rating: pg no obscene images
        d: 'mm'//default: img placeholder
    })
    user= new User({
        name,
        email,
        avatar,
        password
    });
    //encrypt password
    const salt=await bcrypt.genSalt(10);

    user.password= await bcrypt.hash(password, salt);

    await user.save();
    

    //return jsonwebtoken
    response.send('User registered');
    }catch(err){
    console.error(err.message);
    response.status(500).send('Server error');
    }
    
    //response.send(User route)//verify that route works

});

module.exports= router;
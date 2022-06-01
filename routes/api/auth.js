const express =require('express');
const router = express.Router();
const bcrypt= require('bcryptjs');
const auth=require('../../middleware/auth');
const jwt=require('jsonwebtoken');
const config= require('config');
//express validator-error handler
const { check, validationResult}=require('express-validator');
const User = require('../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
//@route  POST api/auth
//@desc   Test route
//@access Public
router.post('/', 
[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password is required').exists(),
], 
async (request, response) => {
    //need to initialize middleware
    
    const errors=validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()//if information not correct get a bad request message explaining what's missing
    });
    }//pulls the certain things out if request.body.
    //send error if they do exists- no multiple emails
    const {email, password}=request.body;
    try{//see if user exists
    let user=await User.findOne({email});

    if (!user){
        return response.status(400).json({errors: [{msg: 'invalid credentials'}]});
    }
    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
        return response.status(400).json({errors:[{msg:'Invalid Credentials'}]})
    }


    const payload={
        user:{
            id:user.id//will pull id from mongoose. 
        }
    };
    jwt.sign(payload, config.get('jwtSecret'),
    {expiresIn: 360000},
    (err, token)=>{
        if (err) throw err;
        response.json({token});
    });
    //return jsonwebtoken- jsonwebtoken allows you to store information 
    //in encryption. the information that users input will be stored 
    //in a way that only those with access will be able to decipher the 
    //information.
    //install it
    //sign it and pass in payload, then use a callback, create middleware to verify token. either allow or disallow access based on the token.

    }catch(err){
    console.error(err.message);
    response.status(500).send('Server error');
    }
    
    //response.send(User route)//verify that route works

});

module.exports= router;
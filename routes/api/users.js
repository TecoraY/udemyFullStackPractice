const express =require ('express');
const router = express.Router();
//express validator-error handler
const { check, validationResult}=require('express-validator/check')

//@route  post api/users
//@desc   Register User
//@access Public
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({min:6})
], 
(request, response) => {
    //need to initialize middleware
    const errors=validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors:errors.array()//if information not correct get a bad request message
    });
}
    response.send('User route');

});

module.exports= router;
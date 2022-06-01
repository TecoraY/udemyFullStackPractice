const express =require ('express');
const router = express.Router();
const auth=require('../../middleware/auth');//will protect the route to getuser profile

const Profile = require('../models/Profile');
//@route  GET api/profile/me
//@desc   get current user profile
//@access private

//route to get the profile
router.get('/me', auth, async (request, response) => {
    try{
        const profile=await Profile.findOne({user: request.user.id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return response.status(400).json({msg:'There is no profile for this user'});
        }
        response.json(profile);
    }catch(err){
        console.error(err.message);
        response.status(500).send('Server Error');
    }
});

module.exports= router;
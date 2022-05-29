const express= require('express');
const connectDB=require('./config/db');
const app= express();
//connect database
connectDB();
app.get('/', (request, response)=> response.send('API Running'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


//process.env.port allows it to be found when running with heroku
//|| 5000, says that locally the page should be ran from port 5000
const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on Port ${PORT}`));
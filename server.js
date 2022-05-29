const express= require('express');

const app= express();

app.get('/', (request, response)=> response.send('API Running'));
//process.env.port allows it to be found when running with heroku
//|| 5000, says that locally the page should be ran from port 5000
const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on Port ${PORT}`));
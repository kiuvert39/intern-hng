const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;
const weatherApiKey = process.env.WEATHER_API_KEY


app.use(requestIp.mw());



app.get('/api/hello',async(req,res)=>{
    const visitorName = req.query.visitor_name 
    let clientIp = req.clientIp; 

    if (clientIp === '::1') {
        clientIp = '129.0.60.27';
      }

    try   {       

        if(!visitorName){
            return res.status(400).json({ error: 'Name is required' });
        } 

        const response = await axios.get(`https://ipapi.co/${clientIp}/json`);
        const ip=response.data.ip
        const location=response.data.city
        console.log(response.data);
        console.log('IPinfo response:', response.data.ip)


        const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}&aqi=no`);
       
        const temp = weatherResponse.data.current.temp_c

        const responseUser = {
            client_ip: ip,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temp} degrees Celsius in ${location}`
          };
        console.log(weatherResponse.data.current.temp_c);
        res.status(200).json({responseUser})
           
    }catch(error){
        console.error('Error fetching data:', error.message);
        res.status(500).json({error})
    }   

  

})

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
  });

app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})
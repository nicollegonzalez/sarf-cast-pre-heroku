const express = require('express');
// const mongoose = require('mongoose'); // I don't need this...yet
const router  = express.Router();
const SurfBreak    = require('../models/SurfBreak');
const County = require('../models/County')
//
const axios = require('axios');
const bodyParser = require('body-parser').json();

// const uploadMagic = require('../config/cloundinary-setup'); // don't know yet, might need this later

// Developer get route for testing only brah
// GET route => to get all the surf spots in the choosen region
router.get('/developer', bodyParser, (req, res, next) => {
  SurfBreak.find()//.populate('forecast')
    .then((allTheSurfBreaks)=>{
      let allSpotIdsArr = [];
      allTheSurfBreaks.forEach((eachSurfBreak)=>{
        allSpotIdsArr.push(eachSurfBreak.spot_id);
      })
      // console.log("the arra of the forecast id's =========== ", allSpotIdsArr);
      // allSpotIdsArr = [1,122,2]; //Only for testing
      // console.log("the arra of the forecast id's =========== ", allSpotIdsArr);
     
      let updatedForcastObj = {};
      let allGetForecastAxiosArr = [];

      allSpotIdsArr.forEach((eachSpotId)=>{
        let urlStr = `http://api.spitcast.com/api/spot/forecast/${eachSpotId}/`
        allGetForecastAxiosArr.push(axios.get(urlStr));
      })

      axios.all(allGetForecastAxiosArr)
      .then((theArr)=>{

        // This is where I redefine my obj:updatedForcastObj
        theArr.forEach((eachUpdatedSpotForcastArr)=>{
          let theSpotId = eachUpdatedSpotForcastArr.data[0].spot_id;
          let theUpdatedSpotForecast = eachUpdatedSpotForcastArr.data
          updatedForcastObj[theSpotId] = theUpdatedSpotForecast;
        })

        //This is were I update each of my surfbreak forcast for the day
        allSpotIdsArr.forEach((eachSpotId)=>{

          let aNewForecastArr = updatedForcastObj[eachSpotId];

          SurfBreak.findOneAndUpdate({spot_id: eachSpotId},{forecast: aNewForecastArr})
          .then(()=>{
            console.log("HOLY MOLLEY IT UPDATED CORRECTLY")
          })
          .catch((err)=>{
            console.log("NOPE TRY AGAIN",err);
          })

        })
        res.json(updatedForcastObj);

      })
      .catch((err)=>{
        console.log(err)
      })

    })
    .catch((err)=>{
      console.log("Error message:",err);
    })

})
    

// Region get route
// GET route => to get all the surf spots in the choosen region
router.get('/region/:region', (req, res, next) => {
  let theCountyName = req.params.region;

  County.find({name: theCountyName})
  .then((theCounty)=>{
    // console.log("Hellooooo",theCounty);
    let surfBreakIDsArr = [];
    surfBreakIDsArr = theCounty[0].surfBreakIDs;
    // console.log("IDs",surfBreakIDsArr);


    SurfBreak.find()//.populate('forecast')
    .then((allTheSurfBreaks)=>{
      // console.log("Hello again:",theCounty);

      let allRegionalSurfBreaks = allTheSurfBreaks;

      
      
      allRegionalSurfBreaks = allRegionalSurfBreaks.filter((eachSurfBreak)=>{
        return surfBreakIDsArr.includes(String(eachSurfBreak.spot_id)) //to string before it wasn'y working
      })
      
 
      console.log("+-+-+-+-+-+-+-",allRegionalSurfBreaks);

  
      // res.json({theCounty: theCounty})
      res.json({theRegionalSurfBreaks: allRegionalSurfBreaks})
    })
    .catch((err)=>{
      console.log("-=-=-=-=-=",err)
      res.json(err);
    })
  })
});



module.exports = router;

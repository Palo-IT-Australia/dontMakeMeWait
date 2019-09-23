const GOOGLE_API_KEY = require("../util/constants");

const https = require('https');
const googleDetails = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=";
const GetHospitalDetailsBaseUrl = "https://ws-spsl-ext-non-auth.webapp.health.nsw.gov.au/rted/api/GetHospitalDetails/";

exports.getHospitalDetails = (hospital, callback) => {

  let url = googleDetails + hospital.name +
    // + "location="  + hospital.coordinates.lat + ","  + hospital.coordinates.lng +
    "&inputtype=textquery&fields=rating,opening_hours&key=" + "AIzaSyDSAkQGyNAzhjzqsMRqFYWjqyI8__aTCG0";

  let data = "";

  https.get(url, (response) => {
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      console.log(data);
      let googleData = JSON.parse(data);

      if (googleData.candidates[0]) {
        callback({
          rating: googleData.candidates[0].rating,
          open_now: googleData.candidates[0].opening_hours.open_now
        });
      } else {
        callback({
          error: true
        });
      }

    });
    response.on('error', function(e) {
      console.error(e);
      callback({error: true, message: e});
    });
  })
};

exports.pollData = (hospital, callback) => {
  https.get(GetHospitalDetailsBaseUrl + hospital.id, (response) => {
    let data = "";

    response.on('data', (_chunks) => {
      data += _chunks;
    });
    response.on('end', () => {
      callback(JSON.parse(data));
    })
  })
};

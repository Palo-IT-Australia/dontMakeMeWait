const https = require('https');

const GOOGLE_API_KEY = "AIzaSyDSAkQGyNAzhjzqsMRqFYWjqyI8__aTCG0";

const GOOGLE_API_ENDPOINT = "https://maps.googleapis.com/maps/api/distancematrix/json";

const exampleResponse = {
  "destination_addresses": ["85-87 N Quay, Brisbane City QLD 4000, Australia"],
  "origin_addresses": ["9 Carrington St, Sydney NSW 2000, Australia"],
  "rows": [
    {
      "elements": [
        {
          "distance": {
            "text": "574 mi",
            "value": 924106
          },
          "duration": {
            "text": "2 days 5 hours",
            "value": 189254
          },
          "status": "OK"
        }
      ]
    }
  ],
  "status": "OK"
};

const travelModes = [
  'driving',
  'walking',
  'bicycling',
  'transit' //public transport
];

exports.calculateTravelTime = function (location, hospital, callback) {

  const url = GOOGLE_API_ENDPOINT +
    "?units=metric&origins=" + location.lat + "," + location.lng +
    "&mode=" + travelModes[0] +
    "&destinations=" + hospital.coordinates.lat + "," + hospital.coordinates.lng +
    "&key=" + GOOGLE_API_KEY;

  https.get(url, (response) => {

      let data = "";
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const exampleResponse = JSON.parse(data);
        callback(exampleResponse);
      })
    });
};

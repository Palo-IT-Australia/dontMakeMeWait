const https = require('https');
const ClosestHospitalBaseUrl = "https://ws-spsl-ext-non-auth.webapp.health.nsw.gov.au/rted/api/GetNearestHospitalsByAddress?";
const HospitalDetailsUrl = "https://ws-spsl-ext-non-auth.webapp.health.nsw.gov.au/rted/api/GetHospitalDetails/";
const HospitalWaitingDetails = "https://ws-spsl-ext-non-auth.webapp.health.nsw.gov.au/rted/api/GetHospitalWaitingDetails/";
const MaxHospitalsPerRequest = 9;
const AverageWaitingTime = 300;
const Hospital = require('./../models/hospitalModel');
const Location = require('./../models/locationModel');
const healthRepository = require('./../repository/health');

exports.findClosestHospital = (location, callback) => {

  let url = ClosestHospitalBaseUrl +
    "latitude=" + location.lat +
    "&longitude=" + location.lng;

  let data = "";

  getHospitalList = (hospitalData) => {
    const hospitalDetails = JSON.parse(hospitalData);
    const hospitalList = [];
    let closestHospital = new Hospital(hospitalDetails);
    hospitalList.push(closestHospital);
    return hospitalList.concat(hospitalDetails.reportingHospitalDetails
    .slice(0, MaxHospitalsPerRequest)
    .map(hospital => {
      return {
        id: hospital.hospitalID,
        name: hospital.hospitalName,
        address: hospital.address,
        phone: hospital.phone,
        location: hospital.location,
        coordinates: new Location(hospital.latitude, hospital.longitude),
        districtName: hospital.districtName,
        lastUpdated: hospital.totalDurationSinceLastUpdated,
        waitCount: hospital.waitCount,
        waitThresold: hospital.waitCountThreshold
      }
    }));
  };

  https.get(url, (response) => {
    response.on('data', (_chunks) => {
      data += _chunks
    });

    response.on('end', () => {
      let hospital = JSON.parse(data)[0];
      https.get(HospitalDetailsUrl + hospital.hospitalID, (response) => {
        let hospitalData = "";
        response.on('data', (_chunks) => {
          hospitalData += _chunks
        });

        response.on('end', () => {
          let result = getHospitalList(hospitalData);

          callback(result);
        });
      });
    })
  })
};

exports.calculateWaitingTime = (hospital) => {

  let timeInSeconds = hospital.direction.duration.value + (hospital.waitCount * AverageWaitingTime);

  healthRepository.queryAverageTreatmentTime(hospital);
  return {
    value: timeInSeconds,
    text: ((timeInSeconds / 60) | 0) + " mins"
  };
};

exports.orderHospitals = (hospitals) => {
  let compareHospital = (h1, h2) => {
    if (h1.waitingTime.value < h2.waitingTime.value) {
      return -1;
    }
    if (h1.waitingTime.value > h2.waitingTime.value) {
      return 1;
    }
    return 0;
  };
  return hospitals.sort(compareHospital);
};

exports.fetchHospitalDetails = () => {

};

exports.getBedCapacity = (hospital, f) => {

  https.get(HospitalWaitingDetails + hospital.id, (response) => {
    let result = "";
    response.on('data', (_chunks) => {
      result += _chunks;
    });

    response.on('end', () => {
      f(JSON.parse(result).bedDetails[0].bedCapacity);
    })
  })
};

'use strict';

const Location = require('./../models/locationModel');
const distanceService = require('./../services/distanceService');
const hospitalService = require('./../services/hospitalService');
const hospitalDetailsSercice = require('./../services/hospitalDetailsService');

exports.calculateTime = function (req, res) {
  const currentLocation = new Location(req.query.lat, req.query.lng);

  hospitalService.findClosestHospital(currentLocation, (hospitals) => {
    let hospitalCount = hospitals.length;
    let callbacks = 0;

    hospitals.forEach(hospital => {
      hospitalService.getBedCapacity(hospital, (beds) => {
        hospital.bedCapacity = beds;
        distanceService.calculateTravelTime(currentLocation, hospital, (travelTime) => {
          hospital.direction = {
            destination: travelTime.destination_addresses[0],
            origin: travelTime.origin_addresses[0],
            distance: travelTime.rows[0].elements[0].distance,
            duration: travelTime.rows[0].elements[0].duration
          };
          hospital.waitingTime = hospitalService.calculateWaitingTime(hospital);
          hospitalDetailsSercice.getHospitalDetails(hospital, (details) => {
            hospital.googleDetails = details;

            callbacks++;

            if (callbacks === hospitalCount) {
              res.json(hospitalService.orderHospitals(hospitals));
            }
          });
        })
      });
    });
  });

};

exports.getTravelTime = (req, resp) => {

}

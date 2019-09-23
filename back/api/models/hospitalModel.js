const Location = require('./locationModel');

const Hospital = function (data) {
  this.id = data.hospitalDetails[0].hospitalID;
  this.name = data.hospitalDetails[0].hospitalName;
  this.address = data.hospitalDetails[0].address;
  this.phone = data.hospitalDetails[0].phone;
  this.location = data.hospitalDetails[0].location;
  this.coordinates = new Location(data.hospitalDetails[0].latitude, data.hospitalDetails[0].longitude);
  this.districtName = data.hospitalDetails[0].districtName;
  this.lastUpdated = data.waitingDetails[0].lastUpdatedDate;
  this.waitCount = data.waitingDetails[0].waitCount;
  this.bedCapacity = data.bedDetails[0].bedCapacity;
};


module.exports = Hospital;

var TravelTimeResult = function (data) {
  this.Create();
};


TravelTimeResult.prototype.Create = () => {

  let googleData = JSON.parse(this.data);

  this.destinationAddresses = googleData.destination_addresses;
  this.originAddresses = googleData.origin_addresses;
  this.distance = googleData.rows[0].elements[0].distance;
  this.duration = googleData.rows[0].elements[0].duration;

};

TravelTimeResult.prototype.data = "";

module.exports = TravelTimeResult;

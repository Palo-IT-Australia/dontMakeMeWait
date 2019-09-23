const CronJob = require('cron').CronJob;
const hospitalDetailsService = require('./../services/hospitalDetailsService');

const hospitals = [
  {
    name: "Prince of Wales Hospital",
    id: 155
  },
  {
    name: "Sydney Children's Hospital",
    id: 177
  },
  {
    name: "St Vincent's Hospital",
    id: 175
  },
  {
    name: "Sydney Hospital & Sydney Eye Hospital",
    id: 178
  },
  {
    name: "Royal Prince Alfred Hospital",
    id: 162
  },
  {
    name: "Royal North Shore Hospital",
    id: 162
  },
  {
    name: "St George Hospital",
    id: 172
  },
  {
    name: "Canterbury Hospital",
    id: 41
  },
  {
    name: "Sutherland Hospital & Community Health Service",
    id: 176
  },
  {
    name: "Manly Hospital",
    id: 122
  },
  {
    name: "Bankstown Lidcombe Hospital",
    id: 7
  }
];

new CronJob("0 0,15,36,45 * * * *", () => {
  hospitals.forEach(hospital => {
    hospitalDetailsService.pollData(hospital, (details) => {
      console.log(details);
    })
  });

}, null, true, 'America/Los_Angeles').start();

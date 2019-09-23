var getClosest = require("get-closest");
var Levenshtein = require('levenshtein');

const waitingTime = [
  {
    "name": "Gosford Hospital",
    "value": 24
  },
  {
    "name": "Wyong Hospital",
    "value": 22.3333333333333
  },
  {
    "name": "Broken Hill Base Hospital",
    "value": 18.3333333333333
  },
  {
    "name": "Armidale and New England Hospital",
    "value": 23.6666666666667
  },
  {
    "name": "Belmont Hospital",
    "value": 17
  },
  {
    "name": "Calvary Mater Newcastle",
    "value": 19.3333333333333
  },
  {
    "name": "Cessnock District Hospital",
    "value": 22
  },
  {
    "name": "Gunnedah District Hospital",
    "value": 16.6666666666667
  },
  {
    "name": "Inverell District Hospital",
    "value": 11
  },
  {
    "name": "John Hunter Hospital",
    "value": 23.3333333333333
  },
  {
    "name": "Kurri Kurri District Hospital",
    "value": 10.6666666666667
  },
  {
    "name": "Maitland Hospital",
    "value": 24.6666666666667
  },
  {
    "name": "Manning Base Hospital",
    "value": 20.6666666666667
  },
  {
    "name": "Moree District Hospital",
    "value": 7
  },
  {
    "name": "Muswellbrook District Hospital",
    "value": 19.3333333333333
  },
  {
    "name": "Narrabri District Hospital",
    "value": 13
  },
  {
    "name": "Singleton District Hospital",
    "value": 24.3333333333333
  },
  {
    "name": "Tamworth Base Hospital",
    "value": 23
  },
  {
    "name": "Other HNELHD",
    "value": 11
  },
  {
    "name": "Milton and Ulladulla Hospital",
    "value": 21
  },
  {
    "name": "Shellharbour Hospital",
    "value": 22.6666666666667
  },
  {
    "name": "Shoalhaven District Memorial Hospital",
    "value": 28
  },
  {
    "name": "Wollongong Hospital",
    "value": 26.3333333333333
  },
  {
    "name": "Other ISLHD",
    "value": 23.5
  },
  {
    "name": "Coffs Harbour Base Hospital",
    "value": 16
  },
  {
    "name": "Kempsey Hospital",
    "value": 23.3333333333333
  },
  {
    "name": "Macksville District Hospital",
    "value": 23.3333333333333
  },
  {
    "name": "Port Macquarie Base Hospital",
    "value": 21.3333333333333
  },
  {
    "name": "Other MNCLHD",
    "value": 6.5
  },
  {
    "name": "Deniliquin Health Service",
    "value": 8
  },
  {
    "name": "Griffith Base Hospital",
    "value": 15.6666666666667
  },
  {
    "name": "Wagga Wagga Rural Referral Hospital",
    "value": 19.3333333333333
  },
  {
    "name": "Young Health Service",
    "value": 7.66666666666667
  },
  {
    "name": "Blue Mountains District Anzac Memorial Hospital",
    "value": 19
  },
  {
    "name": "Hawkesbury District Health Services (public hospital services only)",
    "value": 18
  },
  {
    "name": "Lithgow Health Service",
    "value": 12
  },
  {
    "name": "Nepean Hospital",
    "value": 36.3333333333333
  },
  {
    "name": "Ballina District Hospital",
    "value": 20.3333333333333
  },
  {
    "name": "Byron Central Hospital",
    "value": 19.6666666666667
  },
  {
    "name": "Casino and District Memorial Hospital",
    "value": 21.6666666666667
  },
  {
    "name": "Grafton Base Hospital",
    "value": 22.3333333333333
  },
  {
    "name": "Lismore Base Hospital",
    "value": 25.3333333333333
  },
  {
    "name": "Maclean District Hospital",
    "value": 13.3333333333333
  },
  {
    "name": "Murwillumbah District Hospital",
    "value": 15
  },
  {
    "name": "The Tweed Hospital",
    "value": 16.3333333333333
  },
  {
    "name": "Other NNSWLHD",
    "value": 18.6666666666667
  },
  {
    "name": "Hornsby and Ku-Ring-Gai Hospital",
    "value": 15.3333333333333
  },
  {
    "name": "Manly District Hospital",
    "value": 13
  },
  {
    "name": "Mona Vale and District Hospital",
    "value": 17
  },
  {
    "name": "Royal North Shore Hospital",
    "value": 19.3333333333333
  },
  {
    "name": "Ryde Hospital",
    "value": 14
  },
  {
    "name": "Prince of Wales Hospital",
    "value": 21.3333333333333
  },
  {
    "name": "St George Hospital",
    "value": 28.3333333333333
  },
  {
    "name": "Sutherland Hospital",
    "value": 31.3333333333333
  },
  {
    "name": "Sydney/Sydney Eye Hospital",
    "value": 22.6666666666667
  },
  {
    "name": "Bankstown / Lidcombe Hospital",
    "value": 27.6666666666667
  },
  {
    "name": "Bowral and District Hospital",
    "value": 21
  },
  {
    "name": "Campbelltown Hospital",
    "value": 15.6666666666667
  },
  {
    "name": "Fairfield Hospital",
    "value": 21.3333333333333
  },
  {
    "name": "Liverpool Hospital",
    "value": 20.3333333333333
  },
  {
    "name": "Other SWSLHD",
    "value": 19.5
  },
  {
    "name": "Bateman's Bay District Hospital",
    "value": 20.6666666666667
  },
  {
    "name": "Cooma Health Service",
    "value": 18.6666666666667
  },
  {
    "name": "Goulburn Base Hospital",
    "value": 21
  },
  {
    "name": "Moruya District Hospital",
    "value": 20.3333333333333
  },
  {
    "name": "Queanbeyan Health Service",
    "value": 24
  },
  {
    "name": "South East Regional Hospital",
    "value": 20
  },
  {
    "name": "Other SNSWLHD",
    "value": 18
  },
  {
    "name": "St Vincent's Hospital, Darlinghurst",
    "value": 14.6666666666667
  },
  {
    "name": "Sydney Children's Hospital",
    "value": 20.6666666666667
  },
  {
    "name": "The Children's Hospital at Westmead",
    "value": 22.6666666666667
  },
  {
    "name": "Canterbury Hospital",
    "value": 20
  },
  {
    "name": "Concord Hospital",
    "value": 22.3333333333333
  },
  {
    "name": "Royal Prince Alfred Hospital",
    "value": 28.3333333333333
  },
  {
    "name": "Bathurst Base Hospital",
    "value": 17.6666666666667
  },
  {
    "name": "Cowra District Hospital",
    "value": 16
  },
  {
    "name": "Dubbo Base Hospital",
    "value": 19.6666666666667
  },
  {
    "name": "Forbes District Hospital",
    "value": 16.5
  },
  {
    "name": "Mudgee District Hospital",
    "value": 22
  },
  {
    "name": "Orange Health Service",
    "value": 17.5
  },
  {
    "name": "Other WNSWLHD",
    "value": 17.6666666666667
  },
  {
    "name": "Auburn Hospital",
    "value": 23.6666666666667
  },
  {
    "name": "Blacktown Hospital",
    "value": 31.6666666666667
  },
  {
    "name": "Mount Druitt Hospital",
    "value": 33.3333333333333
  },
  {
    "name": "Westmead Hospital",
    "value": 38.3333333333333
  }
];


const attendance = [
  {
    "name": "Gosford Hospital",
    "value": 173
  },
  {
    "name": "Wyong Hospital",
    "value": 170
  },
  {
    "name": "Broken Hill Base Hospital",
    "value": 62
  },
  {
    "name": "Armidale and New England Hospital",
    "value": 45
  },
  {
    "name": "Belmont Hospital",
    "value": 68
  },
  {
    "name": "Calvary Mater Newcastle",
    "value": 97
  },
  {
    "name": "Cessnock District Hospital",
    "value": 47
  },
  {
    "name": "Gunnedah District Hospital",
    "value": 25
  },
  {
    "name": "Inverell District Hospital",
    "value": 28
  },
  {
    "name": "John Hunter Hospital",
    "value": 208
  },
  {
    "name": "Kurri Kurri District Hospital",
    "value": 14
  },
  {
    "name": "Maitland Hospital",
    "value": 129
  },
  {
    "name": "Manning Base Hospital",
    "value": 77
  },
  {
    "name": "Moree District Hospital",
    "value": 24
  },
  {
    "name": "Muswellbrook District Hospital",
    "value": 24
  },
  {
    "name": "Narrabri District Hospital",
    "value": 16
  },
  {
    "name": "Singleton District Hospital",
    "value": 31
  },
  {
    "name": "Tamworth Base Hospital",
    "value": 121
  },
  {
    "name": "Other HNELHD",
    "value": 148
  },
  {
    "name": "Bulli District Hospital",
    "value": 17
  },
  {
    "name": "Milton and Ulladulla Hospital",
    "value": 37
  },
  {
    "name": "Shellharbour Hospital",
    "value": 80
  },
  {
    "name": "Shoalhaven and District Memorial Hospital",
    "value": 100
  },
  {
    "name": "Wollongong Hospital",
    "value": 172
  },
  {
    "name": "Coffs Harbour Base Hospital",
    "value": 104
  },
  {
    "name": "Kempsey Hospital",
    "value": 68
  },
  {
    "name": "Port Macquarie Base Hospital",
    "value": 87
  },
  {
    "name": "Griffith Base Hospital",
    "value": 55
  },
  {
    "name": "Wagga Wagga Base Hospital",
    "value": 106
  },
  {
    "name": "Blue Mountains District Anzac Memorial Hospital",
    "value": 46
  },
  {
    "name": "Hawkesbury District Health Service",
    "value": 63
  },
  {
    "name": "Lithgow Health Service",
    "value": 35
  },
  {
    "name": "Nepean Hospital",
    "value": 186
  },
  {
    "name": "Ballina District Hospital",
    "value": 44
  },
  {
    "name": "Casino and District Memorial Hospital",
    "value": 38
  },
  {
    "name": "Grafton Base Hospital",
    "value": 67
  },
  {
    "name": "Lismore Base Hospital",
    "value": 86
  },
  {
    "name": "Maclean District Hospital",
    "value": 31
  },
  {
    "name": "Murwillumbah District Hospital",
    "value": 48
  },
  {
    "name": "The Tweed Hospital",
    "value": 133
  },
  {
    "name": "Other NNSWLHD",
    "value": 45
  },
  {
    "name": "Hornsby and Ku-Ring-Gai Hospital",
    "value": 105
  },
  {
    "name": "Manly District Hospital",
    "value": 66
  },
  {
    "name": "Mona Vale and District Hospital",
    "value": 93
  },
  {
    "name": "Royal North Shore Hospital",
    "value": 214
  },
  {
    "name": "Ryde Hospital",
    "value": 74
  },
  {
    "name": "Prince of Wales Hospital",
    "value": 149
  },
  {
    "name": "St George Hospital",
    "value": 204
  },
  {
    "name": "Sutherland Hospital",
    "value": 138
  },
  {
    "name": "Sydney Eye Hospital",
    "value": 55
  },
  {
    "name": "Sydney Hospital",
    "value": 45
  },
  {
    "name": "Bankstown / Lidcombe Hospital",
    "value": 142
  },
  {
    "name": "Bowral and District Hospital",
    "value": 50
  },
  {
    "name": "Camden Hospital",
    "value": 91
  },
  {
    "name": "Campbelltown Hospital",
    "value": 154
  },
  {
    "name": "Fairfield Hospital",
    "value": 133
  },
  {
    "name": "Liverpool Hospital",
    "value": 170
  },
  {
    "name": "Bateman's Bay District Hospital",
    "value": 39
  },
  {
    "name": "Bega District Hospital",
    "value": 32
  },
  {
    "name": "Goulburn Base Hospital",
    "value": 47
  },
  {
    "name": "Moruya District Hospital",
    "value": 27
  },
  {
    "name": "St Vincent's Hospital  Darlinghurst",
    "value": 123
  },
  {
    "name": "Sydney Children's Hospital",
    "value": 107
  },
  {
    "name": "The Children's Hospital at Westmead",
    "value": 161
  },
  {
    "name": "Canterbury Hospital",
    "value": 119
  },
  {
    "name": "Concord Hospital",
    "value": 105
  },
  {
    "name": "Royal Prince Alfred Hospital",
    "value": 202
  },
  {
    "name": "Bathurst Base Hospital",
    "value": 69
  },
  {
    "name": "Dubbo Base Hospital",
    "value": 87
  },
  {
    "name": "Orange Health Service",
    "value": 78
  },
  {
    "name": "Auburn Hospital",
    "value": 75
  },
  {
    "name": "Blacktown Hospital",
    "value": 119
  },
  {
    "name": "Mount Druitt Hospital",
    "value": 94
  },
  {
    "name": "Westmead Hospital",
    "value": 194
  }
];



exports.queryAverageTreatmentTime = (hospital) => {

  function compareLevenshteinDistance(compareTo, baseItem) {
    console.log(compareTo, baseItem);
    return new Levenshtein(compareTo.name, baseItem).distance;
  }

  var val = getClosest.custom(hospital.name, waitingTime, compareLevenshteinDistance);
  console.log(val);
  return hospital.waitCount * val.value * 60 + hospital.direction.duration.value;
};

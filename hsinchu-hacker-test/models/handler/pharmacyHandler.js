const db = require('../../database/db').botDatabase_min;
const distance = require('../common/distance');


const getPharmacy = () => {
    return db.getData('/Hsinchu/Pharmacy');
}

const getPharmacyOrderByPosition = (lat, lng) => {
    return getPharmacy().map((data) => {
        return distance.addDistanceProp(
            data,
            distance.getLatLonDistance(lat, lng, data.Lat, data.Lng)
        )
    }).sort((a, b) => {
        return a.Distance - b.Distance;
    });
}

module.exports = { getPharmacy, getPharmacyOrderByPosition }
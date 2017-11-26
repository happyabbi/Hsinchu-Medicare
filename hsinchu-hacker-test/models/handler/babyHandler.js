const db = require('../../database/db').botDatabase_min;
const distance = require('../common/distance');

const getBaby = () => {
    return db.getData('/Hsinchu/Baby');
}

const getBabyOrderByPosition = (lat,lng) => {
    return getBaby().map((data) => {
        return distance.addDistanceProp(
            data,
            distance.getLatLonDistance(lat, lng, data.Lat, data.Lng)
        )
    }).sort((a, b) => {
        return a.Distance - b.Distance;
    });
}

module.exports = {
    getBaby,
    getBabyOrderByPosition
}
const db = require('../../database/db').botDatabase_min;
const distance = require('../common/distance');

const getEmergency = () => {
    return db.getData('/Hsinchu/Emergency');
}

const getEmergencyOrderByPosition = (userData) => {
    let { Lat, Lng, hierarchyMenu } = userData;
    let searchText = hierarchyMenu[hierarchyMenu.length - 1]
    return getEmergency().filter(x => {
        switch(searchText)
        {
            case '急救醫院':
                return x.Type == '醫院';
            case '急救AED':
                return x.Type == 'AED';
        }
        
    })
    .map((data) => {
        return distance.addDistanceProp(
            data,
            distance.getLatLonDistance(Lat, Lng, data.Lat, data.Lng)
        )
    }).sort((a, b) => {
        return a.Distance - b.Distance;
    });
}

module.exports = {
    getEmergency,
    getEmergencyOrderByPosition
}
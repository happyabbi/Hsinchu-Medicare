const db = require('../../database/db').botDatabase_min;
const distance = require('../common/distance');


const getPreventiveHealthCare = () => {
    return db.getData('/Hsinchu/PreventiveHealthCare');
}

const getPreventiveHealthCareOrderByPosition = (userData) => {
    let { Lat, Lng, hierarchyMenu } = userData;
    return getPreventiveHealthCare().filter(x => {
        let searchText = hierarchyMenu[hierarchyMenu.length - 1]
        switch(searchText)
        {
            case '成人':
            case '長者':
                return x.AdultPreventiveHealthCare;
            case '兒童':
                return x.ChildPreventiveHealthCare;
            default: 
                return false;
        }
    }).map((data) => {
        return distance.addDistanceProp(
            data,
            distance.getLatLonDistance(Lat, Lng, data.Lat, data.Lng)
        )
    }).sort((a, b) => {
        return a.Distance - b.Distance;
    });
}

module.exports = { getPreventiveHealthCare, getPreventiveHealthCareOrderByPosition }
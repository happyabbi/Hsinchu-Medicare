const db = require('../../database/db').botDatabase_min;
const distance = require('../common/distance');

const getMedical = () => {
    return db.getData('/Hsinchu/Medical');
}

const getMedicalOrderByPosition = (lat, lng) => {
    return getMedical().map((data) => {
        return distance.addDistanceProp(
            data,
            distance.getLatLonDistance(lat, lng, data.Lat, data.Lng)
        )
    }).sort((a, b) => {
        return a.Distance - b.Distance;
    });
}

const getCancer = () => {
    let serviceList = ['口腔黏膜檢查', '婦女乳房檢查', '婦女子宮頸抹片檢查', '定量免疫法糞便潛血檢查'];
    return getMedical().filter(
        x => {
            return serviceList.some((service, index) => {
                return x.Service.includes(service);
            });
        }
    );
}

const getCancerOrderByPosition = (userData) => {
    let { Lat, Lng, hierarchyMenu } = userData;

    let serviceMap = {
        '口腔癌篩檢': '口腔黏膜檢查',
        '乳癌篩檢': '婦女乳房檢查',
        '子宮頸癌篩檢': '婦女子宮頸抹片檢查',
        '大腸癌篩檢': '定量免疫法糞便潛血檢查',
    }

    return getCancer().filter(
        x => {
            return x.Service.includes(serviceMap[hierarchyMenu[hierarchyMenu.length - 1]]);
        }
    ).map((data) => {
        return distance.addDistanceProp(
            data,
            distance.getLatLonDistance(Lat, Lng, data.Lat, data.Lng)
        )
    }).sort((a, b) => {
        return a.Distance - b.Distance;
    });
}

module.exports = {
    getMedical,
    getMedicalOrderByPosition,
    getCancer,
    getCancerOrderByPosition,
}
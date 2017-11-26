const host = require('../constant/config').host;
const generateImageButtonArea = (imageButtonList, ix, iy, dx, dy, wl, hl, hc, vc) => {
    for (var v = 0; v < vc; v++) {
        for (var h = 0; h < hc; h++) {
            if (imageButtonList.length >= (h + 1) + (v * hc)) {
                var imageButton = imageButtonList[h + (v * hc)];
                imageButton.area = {
                    "x": ix + h * dx,
                    "y": iy + v * dy,
                    "width": wl,
                    "height": hl
                }

            }
            else break;
        }
    }
    return imageButtonList;
}

const medicalNext = {
    '家庭醫學科': { dbSearchText: '家醫科' },
    '兒科': { dbSearchText: '兒科' },
    '內科': { dbSearchText: '內科' },
    '婦產科': { dbSearchText: '婦產科' },
    '外科': { dbSearchText: '外科' },
    '骨科': { dbSearchText: '骨科' },
    '整形外科': { dbSearchText: '整形外科' },
    '泌尿科': { dbSearchText: '泌尿科' },
    '耳鼻喉科': { dbSearchText: '耳鼻喉科' },
    '中醫一般科': { dbSearchText: '中醫科' },
    '皮膚科': { dbSearchText: '皮膚科' },
    '牙科': { dbSearchText: '牙科' },
    '精神科': { dbSearchText: '精神科' },
    '西醫一般科': { dbSearchText: '不分科' },
    '復健科': { dbSearchText: '復健科' },
    '眼科': { dbSearchText: '眼科' },
    '齒顎矯正科': { dbSearchText: '齒顎矯正科' },
}

const cancerNext = {
    '口腔癌篩檢': { dbSearchText: '口腔癌' },
    '乳癌篩檢': { dbSearchText: '乳癌' },
    '子宮頸癌篩檢': { dbSearchText: '子宮頸癌' },
    '大腸癌篩檢': { dbSearchText: '大腸癌' },
}

const healthcareNext = {
    '兒童': { dbSearchText: '兒童' },
    '成人': { dbSearchText: '成人' },
    '長者': { dbSearchText: '長者' },
}

const emergencyNext = {
    '急救醫院': { dbSearchText: '急救醫院' },
    '急救AED': { dbSearchText: '急救AED' }, 
}

const menuObj = {
    '診所': {
        next: medicalNext,
        result: {
            "type": "imagemap",
            "baseUrl": `${host}/image/odmedicalmenu01.png`,
            "altText": "this is an imagemap",
            "baseSize": {
                "width": 1040,
                "height": 1450
            },
            "actions": generateImageButtonArea(Object.keys(medicalNext).map(x => {
                return {
                    type: 'message',
                    text: x
                }
            }), 40, 156, 490, 140, 470, 120, 2, 9)
        }
    },
    '藥局': {},
    '急救': {
        next: emergencyNext,
        result: {
            "type": "imagemap",
            "baseUrl": `${host}/image/odemergencymenu01.png`,
            "altText": "this is an imagemap",
            "baseSize": {
                "width": 1040,
                "height": 370
            },
            "actions": generateImageButtonArea(Object.keys(emergencyNext).map(x => {
                return {
                    type: 'message',
                    text: x
                }
            }),60, 160, 360, -1, 440, 160, 2, 1)
        }
    },
    '健檢': {
        next: healthcareNext,
        result: {
            "type": "imagemap",
            "baseUrl": `${host}/image/odpreventivehealthcaremenu01.png`,
            "altText": "this is an imagemap",
            "baseSize": {
                "width": 1040,
                "height": 370
            },
            "actions": generateImageButtonArea(Object.keys(healthcareNext).map(x => {
                return {
                    type: 'message',
                    text: x
                }
            }),35, 160, 330, -1, 310, 160, 3, 1)
        }
    },
    '哺乳': {},
    '癌篩': {
        next: cancerNext,
        result: {
            "type": "imagemap",
            "baseUrl": `${host}/image/odcancermenu01.png`,
            "altText": "this is an imagemap",
            "baseSize": {
                "width": 1040,
                "height": 910
            },
            "actions": generateImageButtonArea(Object.keys(cancerNext).map(x => {
                return {
                    type: 'message',
                    text: x
                }
            }),60, 160, -1, 180, 920, 150, 1, 4)
        }
    },
};

module.exports = {
    getMenuObj: () => menuObj,
    getMedicalSearchText: (key) => {
        return medicalNext[key].dbSearchText;
    }
}
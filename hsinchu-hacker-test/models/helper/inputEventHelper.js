const host = require('../constant/config').host;
const {
    userHandler,
    medicalHandler,
    pharmacyHandler,
    emergencyHandler,
    preventiveHealthCareHandler,
    babyHandler
} = require('../handler');
const hierarchyMenuHelper = require('./hierarchyMenuHelper');
const menuObj = hierarchyMenuHelper.getMenuObj();
const templateHelper = require('./templateHelper');
const googleMapCommon = require('../common/googleMap');

const seeMoreMessage = (index) => {
    return {
        "type": "template",
        "altText": "this is a confirm template",
        "template": {
            "type": "confirm",
            "text": "看更多...",
            "actions": [
                {
                    "type": "message",
                    "label": " ",
                    "text": " "
                },
                {
                    "type": "postback",
                    "label": "下五筆",
                    "data": JSON.stringify({ type: 'next', index: index + 5 })
                }
            ]
        }
    }
}

const textMap = (text) => {
    if (!text) return null;
    const cmdMap = [
        { src: "要看病", dst: "診所" },
        { src: "生病了", dst: "診所" },
        { src: "找醫院", dst: "診所" },
        { src: "找醫生", dst: "診所" },
        { src: "發燒", dst: "診所" },
        { src: "掛急診", dst: "診所" },
        { src: "嘔吐", dst: "診所" },
        { src: "拉肚子", dst: "診所" },
        { src: "看病", dst: "診所" },
        { src: "找診所", dst: "診所" },
        { src: "哪裡有診所", dst: "診所" },
        
        { src: "買藥", dst: "藥局" },
        { src: "我要買藥", dst: "藥局" },
        { src: "找藥局", dst: "藥局" },
        { src: "藥局", dst: "藥局" },
        { src: "哪裡有藥局", dst: "藥局" },
        
        { src: "送急診", dst: "急救" },
        { src: "急診醫院", dst: "急救" },
        { src: "叫救護車", dst: "急救" },
        { src: "送醫院", dst: "急救" },
        { src: "醫院", dst: "急救" },
        { src: "AED", dst: "急救" },
        { src: "心臟停了", dst: "急救" },
        { src: "昏倒了", dst: "急救" },
        { src: "哪裡有急診醫院", dst: "急救" },       
        
        { src: "老人", dst: "健檢" },
        { src: "小孩", dst: "健檢" },
        { src: "大人", dst: "健檢" },
        { src: "健康檢查", dst: "健檢" },
        { src: "保健", dst: "健檢" },
        { src: "身體檢查", dst: "健檢" },
        { src: "女生", dst: "健檢" },       

        { src: "哺乳室", dst: "哺乳" },
        { src: "要餵奶", dst: "哺乳" },
        { src: "小孩要喝奶", dst: "哺乳" },
        { src: "哪裡有哺乳室", dst: "哺乳" },
        { src: "找哺乳室", dst: "哺乳" },
        { src: "哺乳", dst: "哺乳" },
        { src: "哪裡有哺乳室", dst: "哺乳" },     
        
        { src: "癌症", dst: "癌篩" },
        { src: "癌症檢查", dst: "癌篩" },
        { src: "癌症篩檢", dst: "癌篩" },      
    ];
        
    const fuzzyMap = [
        { src: "_", dst: "健檢", pattern: /(.*)檢查(?!.+)/ },
        { src: "_", dst: "藥局", pattern: /(.*)藥(?!.+)/ },
        { src: "_", dst: "癌篩", pattern: /(.*)癌(?!.+)/ },
    ];

    let arr = cmdMap.filter((item) => {
        return (text == item.src)
    })
    .map((item) => {
        return item.dst
    })
		
    if (!arr[0]) {
        let para = null;
        let cmds = [];

        for (var i = 0; i < fuzzyMap.length; i++) {
            let item = fuzzyMap[i];

            //Regex match
            if (item.pattern) {
                var matches = item.pattern.exec(text);
                if (matches) {
                    if (para == null) {
                        //Regex match取得參數
                        para = matches[1] || '';
                    }
                    cmds.push(item);
                }
            } else {
                //文字開頭match
                var bData = text.indexOf(item.src) == 0
                if (bData) {
                    para = text.replace(item.src, "").trim()
                    cmds.push(item);
                }
            }
        }
				
        arr = cmds.map((item) => {
            return item.dst
        })
    }

    return arr[0] || text;
};

const textEvent = (event) => {
    let inputText = textMap(event.message.text);

    let userData = userHandler.getUserData(event.source.userId);
    const goNext = (valObj, oriHierarchyMenus) => {
        for (let [key, value] of Object.entries(valObj)) {
            let hierarchyMenus = [...oriHierarchyMenus];
            hierarchyMenus.push(key);
            if (inputText == key) {
                userHandler.addOrUpdateUserData(`/${event.source.userId}/hierarchyMenu`, hierarchyMenus );
                return value.result || templateHelper.nowPositionTemlpate.get();
            }
            if (value.next != null) {
                let result = goNext(value.next, hierarchyMenus);
                if (result != null)
                    return result;
            }
        }
        return null;
    }

    let message = goNext(menuObj, []);

    if(message) {
        return message;
    }
    else { //搜索
        let result = [];

        let userData = userHandler.getUserData(event.source.userId);
        if (userData.Lat == null && userData.Lng == null)
            return templateHelper.nowPositionTemlpate.get();
        
        let columnList = [];
        columnList = columnList.concat(medicalHandler.getMedical().map(templateHelper.carouselTemplate.carouselColumnsMap));
        columnList = columnList.concat(pharmacyHandler.getPharmacy().map(templateHelper.carouselTemplate.carouselColumnsMap));
        columnList = columnList.concat(emergencyHandler.getEmergency().map(templateHelper.carouselTemplate.carouselColumnsMap));
        columnList = columnList.concat(preventiveHealthCareHandler.getPreventiveHealthCare().map(templateHelper.carouselTemplate.carouselColumnsMap));
        columnList = columnList.concat(babyHandler.getBaby().map(templateHelper.carouselTemplate.carouselColumnsMap));
        columnList = columnList.concat(medicalHandler.getCancer().map(templateHelper.carouselTemplate.carouselColumnsMap));

        let includeTitleList = [];
        columnList = columnList.filter(x => {
            if(x.title.includes(inputText) && !includeTitleList.includes(x.title)){
                includeTitleList.push(x.title);
                return true;
            } else return false;
        });

        if(columnList.length > 0){
            result.push(
                templateHelper.carouselTemplate.get(columnList, 0)
            );
        }
        else {
            result.push(
                { type: 'text', text: '找不到符合的資料' }
            )
        }

        return result;
    }
}

const mapEvent = (event, index = 0) => {
    if (event.message) {
        let { latitude, longitude } = event.message;
        userHandler.addOrUpdateUserData(`/${event.source.userId}`, { ...userHandler.getUserData(event.source.userId), Lat: latitude, Lng: longitude });
    }
    else if (event.postback) {
        let data = JSON.parse(event.postback.data);
        if (data.type == 'next')
            index = data.index;
    }

    let userData = userHandler.getUserData(event.source.userId);
    if (userData.Lat == null && userData.Lng == null)
        return templateHelper.nowPositionTemlpate.get();

    const carouselColumnsMap = (data, index) => {
        let distance = (data.Distance != null) ? `${data.Distance.toFixed(2)}公里\n` : '';
        let action = null;

        switch(userData.hierarchyMenu[0]){
            case '診所':
                action = {
                    "type": "uri",
                    "label": "詳細資訊",
                    "uri": "https://www.nhi.gov.tw/Query/Query3_Detail.aspx?HospID=" + data.MedicalId
                };
                break;
            case '藥局':
                action = {
                    "type": "uri",
                    "label": "詳細資訊",
                    "uri": "https://www.nhi.gov.tw/Query/Query3_Detail.aspx?HospID=" + data.MedicalId
                };
                break;
            case '急救':
                switch(userData.hierarchyMenu[1]){
                    case '急救醫院':
                        let nameMap = {
                            '國立臺灣大學醫學院附設醫院新竹分院': 'https://reg.ntuh.gov.tw/EmgInfoBoard/NTUHEmgInfoT4.aspx',
                            '南門綜合醫院': 'http://nanmen.com.tw/?aid=8&iid=6',
                            '國軍新竹地區醫院附設民眾診療服務處': 'http://59.124.169.149:8080/his/inpq200.asp',
                            '國泰綜合醫院新竹分院': 'http://med.cgh.org.tw/unit/branch/Pharmacy/ebl/RealTimeInfoHC.html',
                            '馬偕紀念醫院新竹分院': 'https://wapps.mmh.org.tw/WebEMR/WebEMR/Default.aspx?a=HC',
                        };
                        action = {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": nameMap[data.Name]
                        };
                        break;
                    case '急救AED':
                        action = {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "http://tw-aed.mohw.gov.tw/SearchPlace.jsp"
                        };
                        break;
                }
                break;
            case '健檢':
                switch(userData.hierarchyMenu[1]){
                    case '兒童':
                        action = {
                            "type": "postback",
                            "label": "詳細資訊",
                            "data": JSON.stringify({
                                "type": "preHealthDetail",
                                "target": "未滿一歲六個月可檢查四次、一歲六個月以上至未滿2歲可檢查一次、2歲以上至未滿3歲可檢查一次、3歲以上至未滿7歲可檢查一次。",
                                "content": "身體檢查：個人及家族病史查詢、身高、體重、聽力、視力、口腔檢查、生長發育評估等。衛教指導：母乳哺育、營養、幼兒發展、口腔保健、視力保健及事故傷害預防等。",
                            })
                        };
                        break;
                    case '成人':
                        action = {
                            "type": "postback",
                            "label": "詳細資訊",
                            "data": JSON.stringify({
                                "type": "preHealthDetail",
                                "target": "40-65歲，每三年可檢查一次。罹患小兒麻痺且年齡在35歲以上者，每年可檢查一次。55歲以上原住民，每年可檢查一次。",
                                "content": "基本資料：疾病史、家族史、服藥史、健康行為、憂鬱檢測等。檢查項目：身高、體重、血壓、身體質量指數、腰圍、尿液檢查、腎絲球過濾率、GOT、GPT、肌酸酐、血糖、血脂、B型肝炎表面抗原及C型肝炎抗體。健康諮詢：戒菸、節酒、戒檳榔、規律運動、維持正常體重、健康飲食。",
                            })
                        };
                        break;
                    case '長者':
                        action = {
                            "type": "postback",
                            "label": "詳細資訊",
                            "data": JSON.stringify({
                                "type": "preHealthDetail",
                                "target": "65歲以上，每年可檢查一次。罹患小兒麻痺且年齡在35歲以上者，每年可檢查一次。55歲以上原住民，每年可檢查一次。",
                                "content": "基本資料：疾病史、家族史、服藥史、健康行為、憂鬱檢測等。檢查項目：身高、體重、血壓、身體質量指數、腰圍、尿液檢查、腎絲球過濾率、GOT、GPT、肌酸酐、血糖、血脂、B型肝炎表面抗原及C型肝炎抗體。健康諮詢：戒菸、節酒、戒檳榔、規律運動、維持正常體重、健康飲食。",
                            })
                        };
                        break;
                }
            case '哺乳':
                action = {
                    "type": "postback",
                    "label": "詳細資訊",
                    "data": JSON.stringify({ type: 'callPhone', tel: "新竹市24小時母乳哺育諮詢專線03-5353975" })
                };
                break;
            case '癌篩':
                switch(userData.hierarchyMenu[1]){
                    case '口腔癌篩檢':
                        action = {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "http://www.hpa.gov.tw/Pages/List.aspx?nodeid=355"
                        };
                        break;
                    case '乳癌篩檢':
                        action = {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "http://www.hpa.gov.tw/Pages/List.aspx?nodeid=356"
                        };
                        break;
                    case '子宮頸癌篩檢':
                        action = {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "http://www.hpa.gov.tw/Pages/List.aspx?nodeid=357"
                        };
                        break;
                    case '大腸癌篩檢':
                        action = {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "http://www.hpa.gov.tw/Pages/List.aspx?nodeid=354"
                        };
                        break;
                }
                break;
            default:
                action = null;
        }

        return {
            "thumbnailImageUrl": googleMapCommon.getGoogleMapImage(data.Lat, data.Lng),
            "title": data.Name,
            "text": `${distance}${data.MapAddress}`,
            "actions": [
                {
                    "type": "postback",
                    "label": "打電話",
                    "data": JSON.stringify({ type: 'callPhone', tel: data.CallTelephone })
                },
                {
                    "type": "uri",
                    "label": "帶我去",
                    "uri": "https://www.google.com.tw/maps?q=" + data.MapAddress
                },
                action
            ]
        }
    };

    let result = [];
    switch (userData.hierarchyMenu[0]) {
        case '診所':
            if (userData.hierarchyMenu.length < 2)
                return { type: 'text', text: '請重新選擇' };
            let medicalList = medicalHandler
                                .getMedicalOrderByPosition(userData.Lat, userData.Lng)
                                .filter(x => x.Division == hierarchyMenuHelper.getMedicalSearchText(userData.hierarchyMenu[userData.hierarchyMenu.length - 1]))
                                .map(carouselColumnsMap);
            result.push(
                templateHelper.carouselTemplate.get(
                    medicalList,
                    index
                )
            );
            if( index + 5 < medicalList.length)
                result.push(seeMoreMessage(index));
            return result;
        case '藥局':
            let pharmacyList = pharmacyHandler
                                .getPharmacyOrderByPosition(userData.Lat, userData.Lng)
                                .map(carouselColumnsMap);
            result.push(
                templateHelper.carouselTemplate.get(
                    pharmacyList,
                    index
                )
            );
            if(index + 5 < pharmacyList.length)
                result.push(seeMoreMessage(index));
            return result;
        case '急救':
            let emergencyList = emergencyHandler
                                    .getEmergencyOrderByPosition(userData)
                                    .map(carouselColumnsMap);
            result.push(
                templateHelper.carouselTemplate.get(
                    emergencyList,
                    index
                )
            );
            if(index + 5 < emergencyList.length)
                result.push(seeMoreMessage(index));
            return result;
        case '健檢':
            let preventiveHealthCareList = preventiveHealthCareHandler
                                            .getPreventiveHealthCareOrderByPosition(userData)
                                            .map(carouselColumnsMap);
            result.push(
                templateHelper.carouselTemplate.get(
                    preventiveHealthCareList,
                    index
                )
            );
            if(index + 5 < preventiveHealthCareList.length)
                result.push(seeMoreMessage(index));
            return result;
        case '哺乳':
            let babyList = babyHandler
                            .getBabyOrderByPosition(userData.Lat, userData.Lng)
                            .map(carouselColumnsMap);
            result.push(
                templateHelper.carouselTemplate.get(
                    babyList,
                    index
                )
            );
            if(index + 5 < babyList.length)
                result.push(seeMoreMessage(index));
            return result;
        case '癌篩':
            let cancerList = medicalHandler
                                .getCancerOrderByPosition(userData)
                                .map(carouselColumnsMap);
            result.push(
                templateHelper.carouselTemplate.get(
                    cancerList,
                    index
                )
            );
            if(index + 5 < cancerList.length)
                result.push(seeMoreMessage(index));
            return result;
        default:
            return { type: 'text', text: '???' }
    }
}

const howSendPositionEvent = () => {
    return {
        "type": "imagemap",
        "baseUrl": `${host}/image/odlocation.png`,
        "altText": "this is an imagemap",
        "baseSize": {
            "width": 1040,
            "height": 2090
        },
        'actions': [],
    }
}
module.exports = { textEvent, mapEvent, howSendPositionEvent };
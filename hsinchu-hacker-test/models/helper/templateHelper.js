const googleMapCommon = require('../common/googleMap');
module.exports = {
    carouselTemplate: {
        carouselColumnsMap: (data, index) => {
            return {
                "thumbnailImageUrl": googleMapCommon.getGoogleMapImage(data.Lat, data.Lng),
                "title": data.Name,
                "text": `${data.MapAddress}`,
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
                ]
            }
        },
        get: (carouselColumnsArray, index) => {
            return {
                "type": "template",
                "altText": "this is a carousel template",
                "template": {
                    "type": "carousel",
                    "columns": carouselColumnsArray.slice(index, index + 5)
                }
            }
        }
    },
    nowPositionTemlpate: {
        get: () => {
            return {
                "type": "template",
                "altText": "this is a buttons template",
                "template": {
                    "type": "buttons",
                    //"thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
                    "title": "請傳送您的所在位置",
                    "text": "提供您的所在位置，讓我們幫您找到最近的相關機構",
                    "actions": [
                        {
                            "type": "postback",
                            "label": "如何傳送所在位置",
                            "data": JSON.stringify({ type: 'howSendPosition' })
                        },
                        {
                            "type": "postback",
                            "label": "使用上次提供的所在位置",
                            "data": JSON.stringify({ type: 'lastPosition' })
                        }
                    ]
                }
            }
        }
    }
}
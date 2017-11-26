const express = require('express');
const line = require('@line/bot-sdk');
const { port, lineConfig } = require('./models/constant/config');
const app = express();
const async = require('async');
const client = new line.Client(lineConfig);
const inputEventHelper = require('./models/helper/inputEventHelper');

app.use(express.static('public'));

app.get('/a', (req, res) => {
    res.json({ Success: true });
});

app.get('/image/:fileName/:size', async (req, res) => {
    let { fileName, size } = req.params;
    const imageHelper = require('./models/helper/imageHelper');
    // var s = await imageHelper.buildResizeImageInPublicFolder(fileName, parseInt(size));
    imageHelper.buildResizeImageInPublicFolder(fileName, parseInt(size)).then((stream) => {
        if (stream == null)
            res.status(404).send('Not Found');
        else
            stream.pipe(res);
    });
});

app.post('/webhook', line.middleware(lineConfig), (req, res) => {

    async.map(req.body.events,
        async (event) => {
            try {
                switch (event.type) {
                    case 'message':
                        switch (event.message.type) {
                            case 'text':
                                var res = client.replyMessage(event.replyToken, inputEventHelper.textEvent(event));
                                return res;
                            case 'location':
                                var res =  client.replyMessage(event.replyToken, inputEventHelper.mapEvent(event));
                                return res;
                            default:
                                return Promise.resolve(null);
                        }
                    case 'postback':
                        let postbackData = JSON.parse(event.postback.data);
                        switch (postbackData.type) {
                            case 'next':
                            case 'lastPosition':
                                var res = client.replyMessage(event.replyToken, inputEventHelper.mapEvent(event));
                                return res;
                            case 'howSendPosition':
                                return client.replyMessage(event.replyToken, inputEventHelper.howSendPositionEvent());
                            case 'callPhone':
                                return client.replyMessage(event.replyToken, { type: 'text', text: postbackData.tel });
                            case 'preHealthDetail':
                                return client.replyMessage(event.replyToken, [{ type: 'text', text: '服務對象:\n' + postbackData.target }, { type: 'text', text: '服務項目:\n' + postbackData.content }]);
                            default:
                                return Promise.resolve(null);
                        }

                    default:
                        return Promise.resolve(null);
                }
            } catch (e) {
                console.log(e);
            }
        },
        (err, result) => {
            if (err)
                console.error(err);
            return res.json(result);
        }
    )
});

app.listen(port, () => {
    console.log('listen port ' + port + '...');
})
module.exports = { app }
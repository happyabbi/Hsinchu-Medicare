const os = require('os');
module.exports = {
    host : process.env.NODE_ENV.trim() === 'production'? os.hostname() :'https://9d6e3311.ngrok.io',
    port: process.env.PORT || 3000,
    lineConfig: {
        channelAccessToken: 'bIho/4oDlSxDY164aaNMzHJq08v0N01rQ/yvjCQ9SQ3hp0QGviGZpjEx0dx4+jdiS79Gdk1x59M2f+P+TwIKNmcoDz2UKnrhy8nqKrCrBewdwutYGGf7KNoQhiSTr4F9J2plFUx7D4d4ysBheqPqAwdB04t89/1O/w1cDnyilFU=',
        channelSecret: 'b7a883fe5975b33ca3d78f33c2cea90c'
    }
}
/**
 * Created by lzw on 15/11/13.
 */
var router = require('express').Router();
var request = require('request');

router.post('/', function (req, res, next) {
  var messages = req.body;
  console.log('messages recieved: ' + JSON.stringify(messages));

  messages.forEach(function (message) {
    var convId = message.conv.objectId;
    var peerId = message.from;
    Promise.resolve().then(function () {
      var expr = JSON.parse(message.data)._lctext;
      return expr;
    }).then(function (expr) {
      return "嗨";
    }).then(function (result) {
        sendMessage(result, peerId, convId);
      })
      .catch(function (err) {
        sendMessage(formatError(err), peerId, convId);
      });
  });
  res.send('');
});

function sendMessage(content, peerId, convId) {
  console.log('sending message [' + content + '] to peer [' + peerId + ']');
  request.post({
    url: 'https://leancloud.cn/1.1/rtm/messages',
    headers: {
      'X-LC-Id': process.env.LC_APP_ID,
      'X-LC-Key': process.env.LC_APP_MASTER_KEY+ ',master'
    },
    json:true,
    body: {
      'from_peer': '5645c5db00b07eb018258475',
      'message': JSON.stringify({
        '_lctext': content,
        '_lctype': -1
      }),
      'conv_id': convId,
      'to_peers': [peerId],
      'transient': false
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('sended: ' + JSON.stringify(body));
    }
    else {
      console.log('send message error: ' + response.statusCode + JSON.stringify(body));
    }
  });
}

module.exports = router;
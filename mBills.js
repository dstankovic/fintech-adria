var request = require('request');
var sha256 = require('sha256');

var requestURL = 'https://hack.halcom.com/MBillsWS/API/v1/transaction/sale';
var secretKey = '1'

var username = `03ec7443-071c-4668-b310-c3b81e78d0eb.12345678.${Math.floor(new Date() / 1000)}`;
var password = sha256(username + secretKey + requestURL);
var token = "";

console.log(username);
console.log(password);

var pay = function(amount, callback) {

  request({
    method: 'POST',
    url: requestURL,
    auth: {
      user: username,
      pass: password
    },
    headers: {
      'Content-Type': 'application/json'
    },
    body: `{ \"amount\": ${amount * 100},
             \"currency\": \"EUR\",
             \"purpose\": \"Online payment\",
             \"paymentreference\": \"SI0011072015\",
             \"orderid\": \"124134987\",
             \"channelid\": \"eshop1\" }`
  }, function(error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers));
    console.log('Response:', body);

    token = JSON.parse(body).paymenttokennumber;

    callback('mbillsdemo://www.mbills.si/dl/?type=1&token=${token}');
  });

};

var invoice = function() {

}


module.exports = {
  pay: pay,
  invoice: invoice,
  token: function() { return token; }
};

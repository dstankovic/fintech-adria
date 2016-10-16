var mBills = require("./mBills")

console.log(mBills);

mBills.pay(100, function(token) { console.log(mBills.token()); })

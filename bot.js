var bot = require('claudia-bot-builder');
var fbTemplate = bot.fbTemplate;
var fbReply = bot.fbReply;
var inventory = require('./inventory.json');
var mBill = require('./mBills.js');

module.exports = bot(function(request, originalApiRequest) {
	if (request.text === "oj") {
		fbReply(request.sender, "test", originalApiRequest)
	} else if (request.text === "DAILY_MENU") {
		return getItems().get();
	} else if (request.text.indexOf("ORDER") === 0) {
		mBills.pay(100, function() {

		});
	} else if (request.text === "EXIT") {
		return "Have a nice day";
	} else {
		return ["Hi, I'm Tomy Samwich, the guy who sells sandwiches", ,
			new fbTemplate.button("Would you like to eat?")
			.addButton("Yeah, I'm starving!", "DAILY_MENU")
			.addButton("Not now, thanks", "EXIT").get()
		];
	}

});

function getItems() {
	var template = new fbTemplate.generic();
	for (var i = 0; i < inventory.length; i++) {
		template.addBubble(inventory[i].name)
			.addImage("http://www.w3schools.com/html/pic_mountain.jpg")
			.addButton('I want this!', 'ORDER' + i);
	}
	return template;
}
var bot = require('claudia-bot-builder');
var fbTemplate = bot.fbTemplate;
var rp = require('minimal-request-promise');
var inventory = require('./inventory.json');
var mBills = require('./mBills.js');

module.exports = bot(function(request, originalApiRequest) {

	if (request.text === "DAILY_MENU") {
		return getItems().get();
	} else if (request.text.indexOf("ORDER") === 0) {
		return "You will be notified when order is payed."
	} else if (request.text === "EXIT") {
		return "Have a nice day";

	} else if (request.text === ".") {
		return mBills.pay(100).then(function(token) {
			return new fbTemplate.button("Button will open external app for payment purposes")
				.addButton("Confirm purchase", "http://dulerock.com/fintech-adria/?token=" + token + "&amount=100").get()
		});
	} else if (request.text === "h") {
		return new fbTemplate.button("Item is payed, want me to drop it?")
			.addButton("Yep yep", "DROP").get()
	} else if (request.text === "DROP") {
		return rp.get("http://gsiot-egp6-3b0j.try.yaler.io").then(function() {
			return "bon appétit";
		});
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
		template.addBubble(inventory[i].name + ' - ' + inventory[i].price + '€')
			.addImage(inventory[i].image)
			.addButton('I want this!', 'ORDER' + i);
	}
	return template;
}
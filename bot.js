var bot = require('claudia-bot-builder');
var fbTemplate = bot.fbTemplate;
var rp = require('minimal-request-promise');
var inventory = require('./inventory.json');
var mBills = require('./mBills.js');

module.exports = bot(function(request, originalApiRequest) {


	switch (request.text) {
		case "DAILY_MENU":
			{
				return getItems().get();
			}
		case "ORDER":
			{
				return "You will be notified when order is payed."
			}
		case ".":
			{
				return mBills.pay(2.50).then(function(token) {
          console.log("Token value is ", token);

					return new fbTemplate.generic()
						.addBubble('Classic sandwich - 2.50€')
						.addImage("https://raw.githubusercontent.com/dstankovic/fintech-adria/master/assets/img/classic.png")
						.addButton('Pay for the item', "http://dulerock.com/fintech-adria/?type=1&token=" + token).get();
				});
			}
		case "EXIT":
			{
				return "Have a nice day";
			}
		case "DONE":
			{
				return new fbTemplate.receipt("Carefull Mom", "12345678902", "USD", "Visa 2345")
					.addTimestamp(new Date(1428444852))
					.addItem("Classic sandwich")
					.addSubtitle("Juicy slices of ham with slices of cheese and pickles")
					.addQuantity(1)
					.addPrice(2.50)
					.addCurrency("EUR")
					.addImage("https://raw.githubusercontent.com/dstankovic/fintech-adria/master/assets/img/classic.png")
					.addTotal(2.50)
					.get();
			}
		case "DROP":
			{
				return rp.get("http://gsiot-egp6-3b0j.try.yaler.io").then(function() {
					return "bon appétit";
				});
			}
		case "h":
			{
				return new fbTemplate.button("Item is payed, want me to drop it?")
					.addButton("Yep yep", "DROP").get()
			}
		default:
			{
				return ["Hi, I'm Tomy Samwich, the guy who sells sandwiches", ,
					new fbTemplate.button("Would you like to eat something?")
					.addButton("Yeah, I'm starving!", "DAILY_MENU")
					.addButton("Not now, thanks.", "EXIT").get()
				];
			}
	}


});

function getItems() {
	var template = new fbTemplate.generic();
	for (var i = 0; i < inventory.length; i++) {
		template.addBubble(inventory[i].name + ' - ' + inventory[i].price + '€')
			.addImage(inventory[i].image)
			.addButton('I want this!', 'ORDER');
	}
	return template;
}

/* Magic Mirror
 * Node Helper: MMM-OnThisDayWikiApi
 *
 * By Ryan Seeber
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function () {
		console.log("Started node_helper.js for MMM-OnThisDayWikiApi.");
	},

	socketNotificationReceived: function (notification, payload) {
		console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
		if (notification === "ONTHISDAY_FETCH") {
			this.wikiOnThisDayRequest(
				payload.config.apiBase,
				payload.config.language,
				payload.config.feature,
				payload.config.type,
				payload.month,
				payload.day
			);
		}
		else{
			console.log(this.name + " node helper ERROR: received unknown notification.");
		}
	},

	wikiOnThisDayRequest: function (apiBase, language, feature, type, month, day) {
		var self = this;

		const url =
			apiBase + "/"
			+ language + "/"
			+ feature + "/"
			+ type + "/"
			+ month + "/"
			+ day;
		console.log(url);

		var wiki_data = [];
		request({ url: url, method: 'GET' }, function(error, response, body) {
			if(error)
			{
				errorMsg = "UNKNOWN";
				console.error(`Error: ${errorMsg}: ${error}`);
				this.sendSocketNotification("ONTHISDAY_ERROR", { error_type: errorMsg });
			}
			else if (response.statusCode == 200)
			{
				// Success!
				wiki_data = JSON.parse(body);
				items = wiki_data[type];
				if (items.length <= 0) {
					console.log("OnThisDay-Fetcher: No items to broadcast yet.");
					return;
				}
				console.log(`OnThisDay-Fetcher: Broadcasting ${items.length} items.`);
				self.sendSocketNotification('ONTHISDAY_ITEMS', items);
			}
			else if (response.status === 400)
			{
				errorMsg = "Invalid parameter";
				console.error(`Error: ${errorMsg}`);
				this.sendSocketNotification("ONTHISDAY_ERROR", { error_type: errorMsg });
			}
			else if (response.status === 404)
			{
				errorMsg = "No data found for the requested date";
				console.error(`Error: ${errorMsg}`);
				this.sendSocketNotification("ONTHISDAY_ERROR", { error_type: errorMsg });
			}
			else if (response.status === 501)
			{
				errorMsg = "Unsupported language";
				console.error(`Error: ${errorMsg}`);
				this.sendSocketNotification("ONTHISDAY_ERROR", { error_type: errorMsg });
			}
			else
			{
				errorMsg = `Bad response from server: ${response.status}`;
				console.error(`Error: ${errorMsg}`);
				this.sendSocketNotification("ONTHISDAY_ERROR", { error_type: errorMsg });
			}
		});
	}
});

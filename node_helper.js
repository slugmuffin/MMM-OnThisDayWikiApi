/* MagicMirror²
 * Node Helper: MMM-OnThisDayWikiApi
 *
 * By Ryan Seeber
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  // Subclass start method.
  start() {
    console.log("Started node_helper.js for MMM-OnThisDayWikiApi.");
  },

  socketNotificationReceived(notification, payload) {
    console.log(
      `${this.name} node helper received a socket notification: ${notification} - Payload: ${payload}`
    );
    if (notification === "ONTHISDAY_FETCH") {
      this.wikiOnThisDayRequest(
        payload.config.apiBase,
        payload.config.language,
        payload.config.feature,
        payload.config.type,
        payload.month,
        payload.day
      );
    } else {
      console.log(
        `${this.name} node helper ERROR: received unknown notification.`
      );
    }
  },

  async wikiOnThisDayRequest(apiBase, language, feature, type, month, day) {
    const self = this;

    const url = `${apiBase}/${language}/${feature}/${type}/${month}/${day}`;
    console.log(url);

    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) {
        const wikiData = await response.json();
        const items = wikiData[type];
        if (items.length <= 0) {
          console.log("OnThisDay-Fetcher: No items to broadcast yet.");
          return;
        }
        console.log(`OnThisDay-Fetcher: Broadcasting ${items.length} items.`);
        self.sendSocketNotification("ONTHISDAY_ITEMS", items);
      } else if (response.status === 400) {
        const errorMsg = "Invalid parameter";
        console.error(errorMsg);
        self.sendSocketNotification("ONTHISDAY_ERROR", {
          error_type: errorMsg
        });
      } else if (response.status === 404) {
        const errorMsg = "No data found for the requested date";
        console.error(errorMsg);
        self.sendSocketNotification("ONTHISDAY_ERROR", {
          error_type: errorMsg
        });
      } else if (response.status === 501) {
        const errorMsg = "Unsupported language";
        console.error(errorMsg);
        self.sendSocketNotification("ONTHISDAY_ERROR", {
          error_type: errorMsg
        });
      } else {
        const errorMsg = `Bad response from server: ${response.status}`;
        console.error(errorMsg);
        self.sendSocketNotification("ONTHISDAY_ERROR", {
          error_type: errorMsg
        });
      }
    } catch (error) {
      const errorMsg = "Unknown error";
      console.error(errorMsg, error);
      self.sendSocketNotification("ONTHISDAY_ERROR", { error_type: errorMsg });
    }
  }
});

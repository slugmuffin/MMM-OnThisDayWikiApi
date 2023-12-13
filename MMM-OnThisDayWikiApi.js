/* MagicMirror²
 * Module: MMM-OnThisDayWikiApi
 *
 * By Ryan Seeber
 * MIT Licensed.
 */

Module.register("MMM-OnThisDayWikiApi", {
  // Default module config.
  result: [],
  defaults: {
    apiBase: "https://api.wikimedia.org/feed/v1/wikipedia",
    feature: "onthisday",
    language: "en",
    type: "selected",
    showAsList: false,
    maxDisplayList: 4,
    title: "On this day in",
    showTitle: true,
    maxWidth: 400,
    wrapTitle: true,
    hideLoading: true,
    reloadInterval: 60 * 60 * 1000, // ms (1 hour)
    updateInterval: 10 * 1000, // ms (10 seconds)
    animationSpeed: 1000,
    sortItems: true,
    maxItems: 0,
    prohibitedWords: []
  },

  start() {
    Log.info(`Starting module: ${this.name}`);
    const self = this;

    this.loaded = false;
    this.activeItem = 0;
    this.scrollPosition = 0;
    this.onThisDayItems = [];

    const timeStamp = new Date();
    const monthStr = (timeStamp.getMonth() + 1).toString().padStart(2, "0");
    const dayStr = timeStamp.getDate().toString().padStart(2, "0");

    // Set up a fetch for hourly
    setInterval(function () {
      Log.debug(`${this.name} Fetch new OnThisDay data`);

      self.sendSocketNotification("ONTHISDAY_FETCH", {
        config: self.config,
        month: monthStr,
        day: dayStr
      });
    }, this.config.reloadInterval); // perform every hour (3600000 milliseconds)

    // But get it populted right now
    self.sendSocketNotification("ONTHISDAY_FETCH", {
      config: self.config,
      month: monthStr,
      day: dayStr
    });
  },

  /**
   * Schedule visual update.
   */
  scheduleUpdateInterval() {
    this.updateDom(this.config.animationSpeed);

    // #2638 Clear timer if it already exists
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      let incrementValue = 1;
      if (this.config.showAsList) {
        incrementValue = this.config.maxDisplayList;
      }
      this.activeItem += incrementValue;
      Log.debug(`${this.name} this.activeItem = " ${this.activeItem}`);
      this.updateDom(this.config.animationSpeed);
    }, this.config.updateInterval);
  },

  getStyles() {
    return ["MMM-OnThisDayWikiApi.css"];
  },

  // Override fetching of template name
  getTemplate() {
    Log.debug(`${this.name} - getTemplate`);
    return "MMM-OnThisDayWikiApi.njk";
  },

  getHeader() {
    return null;
  },

  // Override template data and return whats used for the current template
  getTemplateData() {
    Log.debug(`${this.name} - getTemplateData`);
    if (this.error) {
      return {
        error: this.error
      };
    }

    if (this.onThisDayItems.length === 0) {
      return {
        empty: true
      };
    }
    if (this.activeItem >= this.onThisDayItems.length) {
      this.activeItem = 0;
      Log.debug(`${this.name} this.activeItem = " ${this.activeItem}`);
    }

    let sliceStart = this.activeItem;
    let sliceEnd = this.activeItem + this.config.maxDisplayList;

    // Always show the same same amount
    if (sliceEnd > this.onThisDayItems.length) {
      sliceEnd = this.onThisDayItems.length;
      sliceStart = this.onThisDayItems.length - this.config.maxDisplayList;
    }

    Log.debug(`${this.name} slice_start: ${sliceStart} slice_end: ${sliceEnd}`);

    const item = this.onThisDayItems[this.activeItem];
    const items = this.onThisDayItems.slice(sliceStart, sliceEnd);
    Log.debug(items);

    return {
      loaded: true,
      empty: false,
      config: this.config,
      activeIndex: this.activeItem,
      activeItem: item,
      items: items
    };
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "MODULE_DOM_CREATED" && this.config.hideLoading) {
      this.hide();
    } else if (notification === "ONTHISDAY_ITEMS") {
      this.generateFeed(payload);

      if (!this.loaded) {
        Log.debug(`${this.name} - wasn't loaded yet.`);
        this.loaded = true;
        this.error = null;

        if (this.config.hideLoading) {
          this.show();
        }
        this.scheduleUpdateInterval();
        Log.debug(`${this.name} - rotation updates scheduled`);
      }

      this.loaded = true;
      this.error = null;
    } else if (notification === "ONTHISDAY_ERROR") {
      this.error = this.translate(payload.error_type);
      Log.error(`${this.name} - ${this.error}`);
      this.scheduleUpdateInterval();
    }
  },

  /**
   * Generate an ordered list of items for this configured module.
   * @param {object} onThisDayItems An object with feeds returned by the node helper.
   */
  generateFeed(onThisDayItems) {
    Log.debug(`${this.name} - generateFeed`);

    if (this.config.sortItems) {
      onThisDayItems.sort(function (a, b) {
        return b.year - a.year;
      });
    }

    if (this.config.maxItems > 0) {
      onThisDayItems = onThisDayItems.slice(0, this.config.maxItems);
    }

    if (this.config.prohibitedWords.length > 0) {
      onThisDayItems = onThisDayItems.filter(function (item) {
        for (const word of this.config.prohibitedWords) {
          if (item.title.toLowerCase().indexOf(word.toLowerCase()) > -1) {
            return false;
          }
        }
        return true;
      }, this);
    }

    this.onThisDayItems = onThisDayItems;
  }
});

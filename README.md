# MMM-OnThisDayWikiApi

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit)

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/). It displays historical events from Wikipedia based on the current date using the free Wikimedia API. The event items will scroll through with the time-based (`updateInterval`).

### Default Configuration:
![Screenshot](screenshot/single_line.png)
### Configured to show as list:
![Screenshot](screenshot/show_as_list.png)

## Install the module

Go to modules folder

```sh
cd modules
```

Clone this module from Github

```sh
git clone https://github.com/slugmuffin/MMM-OnThisDayWikiApi
```

Switch to newly created module folder

```sh
cd MMM-OnThisDayWikiApi
```

Install dependencies

```sh
npm install
```

After adding this module to your config (see below) restart your MagicMirror².

## Update the module

Go to modules folder

```sh
cd modules/MMM-OnThisDayWikiApi
```

Pull changes from Github

```sh
git pull
```

Install new dependencies

```sh
npm install
```

Since this repository ignores the automatically generated `package-lock.json`, pulling changes should always work. If not, try to reset your module with `git reset --hard` before pulling new changes.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
let config = {
    modules: [
        {
            module: 'MMM-OnThisDayWikiApi',
            position: 'bottom_bar', // All available positions
            config: {
                // See below for configurable options, this is optional
            },
        },
    ],
};
```

## Configuration options

All configuration options are *optional* so the module works out of the box.

| Option | Description |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `language` | Language code. <br><br> **Possible values:** <br> **NOTE:** *See below.* [Language](#language) <br> **Default value:** `en` |
| `type` | **Possible values:**<br>`all`: Returns all types<br>`selected`: Curated set of events that occurred on the given date<br>`births`: Notable people born on the given date<br>`deaths`: Notable people who died on the given date<br>`holidays`: Fixed holidays celebrated on the given date<br>`events`: Events that occurred on the given date that are not included in another type <br> **Default value:** `selected`|
| `showAsList` | Display the event items as a list. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false` |
| `maxDisplayList` | Total amount of items to display at once while cycling through (when shown as a list). <br><br> **Possible values:**`1` - `...` <br> **Default value:** `4` |
| `title` | The title to display (when shown as a list), enabled/disabled with `showTitle`. <br><br> **Possible values:** `string` <br> **Default value:** `"On This Day:"` |
| `showTitle` | Display the configured title (when shown as a list). <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true` |
| `maxWidth` | Max width of the displayed events content (when shown as a list).<br>**Possible values:**`0` - `5000` <br> **Default value:**  `400`px |
| `wrapTitle` | Wrap the title of the item to multiple lines. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true` |
| `hideLoading` | Hide module instead of showing LOADING status. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false` |
| `reloadInterval` | How often does the content needs to be fetched? (Milliseconds) <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `3600000` (1 hour) |
| `updateInterval` | How often do you want to display a new event? (Milliseconds) <br><br> **Possible values:**`1000` - `60000` <br> **Default value:** `10000` (10 seconds) |
| `animationSpeed` | Speed of the update animation. (Milliseconds) <br><br> **Possible values:**`0` - `5000` <br> **Default value:** `1000` (1 seconds) |
| `sortItems` | Whether or not to sort the items by year recent->past. <br><br> **Possible values:**`true` - `false` <br> **Default value:** `true` |
| `maxItems` | Limits the total amount of items stored (after sort). (0 for unlimited) <br><br> **Possible values:**`0` - `...` <br> **Default value:** `0` |
| `prohibitedWords` | Remove item if one of these words is found anywhere in the title (case insensitive and greedy matching) <br><br> **Possible values:** `['word']` or `['word1','word2',...]` |

## Language

Supports the same languages as the Wikimedia API.
To translate/customize the `title`, use the `config`.

**Defaults to english.**

Currently supported languages:
| Language | Language | code|
| ------- | ------- | ------| 
| English 	| English 	|en|
| Deutsch 	| German  	|de|
| Français 	| French  	|fr|
| Svenska 	| Swedish 	|sv|
| Português	| Portuguese 	|pt|
| Русский 	| Russian 	|ru|
| Español 	| Spanish 	|es|
| العربية 	| Arabic  	|ar|
| Bosanski 	| Bosnian 	|bs|

## Problems

If you have any problems or questions, feel free to open an issue. There are many possible improvements for this module so please let me know if you miss something.

## License: MIT

See [LICENSE](LICENSE.txt)

## Thanks
Thank you to:
- [MagicMirror²](https://github.com/MichMich/MagicMirror/) (specifically `newsfeed`)
- [MMM-OnThisDay](https://github.com/nkl-kst/MMM-OnThisDay)
- [MMM-DailyBibleVerse](https://github.com/arthurgarzajr/MMM-DailyBibleVerse)
- [on-this-day](https://github.com/elliefairholm/on-this-day)
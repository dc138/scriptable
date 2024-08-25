![logo](/img/scriptable-logo-small.png)

This repository contains a collection of my personal [scriptable.app](https://scriptable.app/) scripts and widgets:
All scripts can be downloaded using [ScriptDude](https://scriptdu.de/), which provides one-click installation and automatic updates to scripts.
Install ScriptDude [here](https://scriptdu.de/#installation).
Alternatively, yo may also download the script `.js` file and place it on your scripts directory directly.

1. [Deribit Markers Widget](/?tab=readme-ov-file#deribit-futures-widget)

## Deribit Futures Widget

Fetches and displays future data for bitcoin and etherium on [Deribit](https://www.deribit.com/).
By default, the graph generated tracks the last 24 hours of price action, but this can be configured by editing the script.
The index 24 hour change and volatility are also shown.

For each future, the table shows:
- the last 24 hour percentage move,
- dollar preium above the index,
- percentage premium above the index,
- annualized basis yield
- and tenor in days or hours.

The currency can be configured by passing either `BTC` or `ETH` to the widget arguments.
The script also supports automatic dark / light mode theme, which can both be customized by editing the script file.
When toggling the system theme between light and dark the widget needs to be rebuilt by running the script manually for the graph to be rendered properly.

*Note: this script communicates with the [Deribit API](https://docs.deribit.com/#deribit-api-v2-1-1) to fetch market data.
Currency logos have been embedded into the script in base64.*

[![Download with ScriptDude](https://scriptdu.de/download.svg)](https://scriptdu.de?name=Deribit%20Futures%20Widget&source=https%3A%2F%2Fgithub.com%2FDarthChungo%2Fscriptable%2Fraw%2Fmain%2FDeribitFuturesWidget.js&docs=https%3A%2F%2Fgithub.com%2FDarthChungo%2Fscriptable%2Ftree%2Fmain%3Ftab%3Dreadme-ov-file%23deribit-futures-widget)

| | Dark Mode | Light Mode |
| - | - | - |
| BTC | ![btc-dark](/img/DeribitFuturesWidget/img-btc-dark.png) | ![btc-light](/img/DeribitFuturesWidget/img-btc-light.png) |
| ETH | ![eth-dark](/img/DeribitFuturesWidget/img-eth-dark.png) | ![eth-light](/img/DeribitFuturesWidget/img-eth-light.png) |

## *More scripts to come™*

### License

All scripts in this repository are release under the MIT license.
Check each file for any additional information.

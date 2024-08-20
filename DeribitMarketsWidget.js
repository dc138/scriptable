// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";

// Widget Creation

const fetchFutureInfo = async (currency) => {
    const platform_time = await new Request(API_URL + "public/get_time")
        .loadJSON()
        .then((response) => response.result);

    const names = await new Request(API_URL + `public/get_instruments?currency=${currency}&expired=false&kind=future`)
        .loadJSON()
        .then((response) =>
            response.result.map((instrument) =>
                instrument.instrument_name
            )
        );

    const futures = await Promise.all(
        names.map(async (name) => {
            const info = {
                ...await new Request(API_URL + `public/ticker?instrument_name=${name}`)
                    .loadJSON()
                    .then((response) => (
                        {
                            price: response.result.mark_price,
                            premium: (response.result.mark_price - response.result.index_price) / response.result.index_price,
                        }
                    )),
                ...await new Request(API_URL + `public/get_instrument?instrument_name=${name}`)
                    .loadJSON()
                    .then((response) => (
                        {
                            tenor: response.result.settlement_period == "perpetual" ? null : response.result.expiration_timestamp - platform_time,
                        }
                    )),
            };

            return {
                name,
                ...info,
                tenor_string: Math.floor(info.tenor / (1000 * 60 * 60 * 24)) + "d" + Math.floor(info.tenor % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) + "h",
                premium_string: (info.premium * 100).toFixed(2) + "%",
                apr_string: ((info.premium * 100 * 1000 * 60 * 60 * 24 * 365) / info.tenor).toFixed(2) + "%",
            }
        })
    );

    return futures;
};

const createFutureStack = async (stack) => {
    const info = await fetchFutureInfo("BTC");
    console.log(info);
};

const createWidget = async () => {
    const widget = new ListWidget();

    const content = widget.addStack();
    content.layoutVertically();

    await createFutureStack(content);

    return widget;
};

const createErrorWidget = async () => {
    const widget = new ListWidget();
    const text = widget.addText("Invalid widget size.");

    text.textColor = ERROR_COLOR;
    text.font = ERROR_FONT;
    text.minimumScaleFactor = 0.5;
    text.centerAlignText();

    return widget;
};

// Script entry point

const main = async () => {
    const widget =
        config.runsInApp || config.widgetFamily == WIDGET_SIZE ?
            await createWidget()
            : await createErrorWidget();

    if (config.runsInWidget) {
        Script.setWidget(widget);

    } else {
        await widget.presentLarge();
    }
};

await main();
Script.complete();

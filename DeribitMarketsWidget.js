// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";

// Widget Creation

const fetchFutureInfo = async (currency) => {
    const names = await new Request(API_URL + `public/get_instruments?currency=${currency}&expired=false&kind=future`)
        .loadJSON()
        .then((response) =>
            response.result.map((instrument) =>
                instrument.instrument_name
            )
        );

    const futures = await Promise.all(
        names.map(async (name) => (
            {
                ...await new Request(API_URL + `public/ticker?instrument_name=${name}`)
                    .loadJSON()
                    .then((response) => (
                        {
                            name: name.split('-')[1],
                            price: response.result.mark_price,
                            premium: (response.result.mark_price - response.result.index_price) / response.result.mark_price,
                        }
                    )),
                ...await new Request(API_URL + `public/get_instrument?instrument_name=${name}`)
                    .loadJSON()
                    .then((response) => (
                        {
                            expiration: response.result.settlement_period == "perpetual" ? null : response.result.expiration_timestamp,
                        }
                    )),
            }
        ))
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

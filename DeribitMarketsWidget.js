// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";

const FUTURES = [
    {
        "name": "BTCP",
        "instrument": "BTC-PERPETUAL",
        "volatility": "btcdvol_usdc",
    },
    {
        "name": "ETHP",
        "instrument": "ETH-PERPETUAL",
        "volatility": "ethdvol_usdc",
    },
];

// Widget Creation

const loadFutureData = async (future) => {
    const instrument_request = new Request(API_URL + `public/ticker?instrument_name=${future.instrument}`);
    const instrument_response = await instrument_request.loadJSON();

    const volatility_request = new Request(API_URL + `public/get_index_price?index_name=${future.volatility}`);
    const volatility_response = await volatility_request.loadJSON();

    return {
        "price": instrument_response.result.mark_price,
        "change": instrument_response.result.stats.price_change,
        "volatility": volatility_response.result.index_price,
    };
}

const createFutureStack = async (content) => {
    content.addText("Futures");

    const stack = content.addStack();
    stack.layoutHorizontally();

    const nameColum = stack.addStack();
    nameColum.layoutVertically();
    stack.addSpacer();

    const priceColum = stack.addStack();
    priceColum.layoutVertically();
    stack.addSpacer();

    const changeColum = stack.addStack();
    changeColum.layoutVertically();
    stack.addSpacer();

    const volatilityColum = stack.addStack();
    volatilityColum.layoutVertically();
    stack.addSpacer();

    for (const future of FUTURES) {
        const data = await loadFutureData(future);

        nameColum.addText(future.name);
        priceColum.addText('$' + data.price.toFixed());
        changeColum.addText(data.change.toPrecision(3) + '%');
        volatilityColum.addText(data.volatility.toPrecision(3));
    }
};

const createWidget = async () => {
    const widget = new ListWidget();

    const content = widget.addStack();
    content.layoutVertically();

    await createFutureStack(content);

    return widget;
}

const createErrorWidget = async () => {
    const widget = new ListWidget();
    const text = widget.addText("Invalid widget size.");

    text.textColor = ERROR_COLOR;
    text.font = ERROR_FONT;
    text.minimumScaleFactor = 0.5;
    text.centerAlignText();

    return widget;
}

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
}

await main();
Script.complete();

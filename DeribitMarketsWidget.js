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

// https://stackoverflow.com/a/45322101
const resolve = (path, obj) =>
    path.split('.')
        .reduce(
            (prev, curr) =>
                prev ? prev[curr] : null,
            obj
        );

const parseJSON = async (url, values) => {
    const response = await new Request(url).loadJSON();
    const content = {};

    for (const [name, path] of Object.entries(values)) {
        content[name] = resolve(path, response);
    }

    return content;
};

const createFutureStack = async (stack) => {
    console.log(await parseJSON(API_URL + "public/ticker?instrument_name=BTC-PERPETUAL", {"price": "result.mark_price"}));
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

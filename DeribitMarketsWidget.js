// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";

// Widget Creation

const fetchFuturesIndex = async (currency) => {
    const ticker = await new Request(API_URL + `public/ticker?instrument_name=${currency}_USDC`)
        .loadJSON()
        .then((response) => (
            {
                price: "$" + response.result.mark_price.toFixed(),
                change: response.result.stats.price_change.toFixed(2) + "%",
            }
        ));

    const volatility = await new Request(API_URL + `public/get_index_price?index_name=${currency.toLowerCase()}dvol_usdc`)
        .loadJSON()
        .then((response) => (
            {
                volatility: response.result.index_price.toFixed(2),
            }
        ));

    return {
        ...ticker,
        ...volatility,
    };
}

const fetchFuturesInfo = async (currency) => {
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

    return await Promise.all(
        names.map(async (name) => {
            const ticker = await new Request(API_URL + `public/ticker?instrument_name=${name}`)
                .loadJSON()
                .then((response) => (
                    {
                        price: response.result.mark_price,
                        premium: (response.result.mark_price - response.result.index_price) / response.result.index_price,
                        change: response.result.stats.price_change,
                        funding: response.result.funding_8h,
                    }
                ));

            const instrument = await new Request(API_URL + `public/get_instrument?instrument_name=${name}`)
                .loadJSON()
                .then((response) => (
                    {
                        tenor: response.result.settlement_period == "perpetual" ? undefined : response.result.expiration_timestamp - platform_time,
                        perpetual: response.result.settlement_period == "perpetual",
                    }
                ));

            return {
                name: name.split("-").slice(-1)[0],
                ...ticker,
                ...instrument,
            };
        })
    );
};

const formatFutureInfo = (info) => {
    const commonInfoFormat = {
        name: info.perpetual ? "PERP" : info.name,
        price: "$" + info.price.toFixed(),
        premium: (info.premium * 100).toFixed(2) + "%",
        change: info.change.toFixed(2) + "%",
    };

    return info.perpetual ? {
        ...commonInfoFormat,
        funding: (info.funding * 100).toFixed(4) + "%",
    } : {
        ...commonInfoFormat,
        tenor: Math.floor(info.tenor / (1000 * 60 * 60 * 24)) + "d"
            + Math.floor(info.tenor % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) + "h",
        apr: ((info.premium * 100 * 1000 * 60 * 60 * 24 * 365) / info.tenor).toFixed(2) + "%",
    };
};

const createFutureStack = async (stack) => {
    const index = (await fetchFuturesIndex("BTC"));
    const futures = (await fetchFuturesInfo("BTC")).map(formatFutureInfo);

    console.log(index);
    console.log(futures);
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

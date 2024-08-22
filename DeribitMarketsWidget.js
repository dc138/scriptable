// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";
const CURRENCY = "BTC";

// Widget Creation

const fetchFuturesIndex = async (currency) => {
    const ticker = await new Request(API_URL + `public/ticker?instrument_name=${currency}_USDC`)
        .loadJSON()
        .then((response) => (
            {
                price: response.result.mark_price.toFixed(),
                change: response.result.stats.price_change.toFixed(2),
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
                        difference: response.result.mark_price - response.result.index_price,
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
        name: info.tenor ? info.name : "PERP",
        difference: info.difference.toFixed(),
        premium: (info.premium * 100).toFixed(2),
        change: info.change.toFixed(2),
    };

    const formatTenor = (tenor) => {
        const days = Math.floor(tenor / (1000 * 60 * 60 * 24));
        return days < 1 ? Math.floor(tenor % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) + "h" : days + "d";
    }

    return info.tenor ? {
        ...commonInfoFormat,
        tenor: formatTenor(info.tenor),
        apr: ((info.premium * 100 * 1000 * 60 * 60 * 24 * 365) / info.tenor).toFixed(2),
    } : {
        ...commonInfoFormat,
        funding: (info.funding * 100).toFixed(4),
    };
};

const createFutureStack = async (stack, currency) => {
    const content = stack.addStack();
    content.layoutHorizontally();

    const [colum3, colum0, colum1, colum2, colum4, colum5] = {
        *[Symbol.iterator]() {
            for (; ;) {
                const colum = content.addStack();
                colum.layoutVertically();
                yield colum;
            }
        }
    };

    const index = await fetchFuturesIndex(currency);

    colum0.addText(currency);
    colum1.addText(index.price);
    colum2.addText(" ");
    colum3.addText(index.change);
    colum4.addText(" ");
    colum5.addText(" ");

    const dated = (await fetchFuturesInfo(currency)).sort((a, b) => (a.tenor || -1) - (b.tenor || -1)).map(formatFutureInfo);
    const perpetual = dated.shift();

    colum0.addText(perpetual.name);
    colum1.addText(perpetual.difference);
    colum2.addText(perpetual.premium);
    colum3.addText(perpetual.change);
    colum4.addText(" ");
    colum5.addText(" ");

    for (const future of dated) {
        colum0.addText(future.name);
        colum1.addText(future.difference);
        colum2.addText(future.premium);
        colum3.addText(future.change);
        colum4.addText(future.apr);
        colum5.addText(future.tenor);
    }

    console.log(index);
    console.log(perpetual);
    console.log(dated);
};

const createWidget = async () => {
    const widget = new ListWidget();

    const content = widget.addStack();
    content.layoutVertically();

    await createFutureStack(content, CURRENCY);

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

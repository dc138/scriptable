// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const REGULAR_FONT = Font.regularMonospacedSystemFont(14);
const HEADER_FONT = Font.semiboldMonospacedSystemFont(14);
const THIN_FONT = Font.lightMonospacedSystemFont(14);

const UP_COLOR = Color.green();
const DOWN_COLOR = Color.red();
const NEUTRAL_COLOR = new Color("a6a6a6");
const SECONDARY_COLOR = new Color("666666");

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
    const formatName = (name, tenor) => {
        const months = {
            "JAN": 1, "FEB": 2, "MAR": 3,
            "APR": 4, "MAY": 5, "JUN": 6,
            "JUL": 7, "AUG": 8, "SEP": 9,
            "OCT": 10, "NOV": 11, "DEC": 12,
        };

        return tenor ?
            name.slice(0, -5) + "/" + months[name.slice(-5, -2)]
            : "PERP";
    }

    const commonInfoFormat = {
        name: formatName(info.name, info.tenor),
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

const addColumn = (content) => {
    const colum = content.addStack();
    colum.layoutVertically();
    return colum;
}

const addText = (element, text, {color, font, opacity, lines, factor, spaceLeft, spaceRight} = {}) => {
    let container = element;

    if (spaceLeft !== undefined || spaceRight !== undefined) {
        container = element.addStack();
        container.layoutHorizontally();
    }

    if (spaceLeft !== undefined) {
        container.addSpacer(spaceLeft);
    }

    const textElement = container.addText(text);

    if (color) textElement.textColor = color;
    if (font) textElement.font = font;
    if (opacity) textElement.textOpacity = opacity;
    if (lines) textElement.lineLimit = lines;
    if (factor) textElement.minimumScaleFactor = factor;

    if (spaceRight !== undefined) {
        container.addSpacer(spaceRight);
    }

    return textElement;
}

const createFutureStack = async (stack, currency) => {
    addText(stack, currency + " Futures", {font: Font.boldMonospacedSystemFont(18)});

    const context = new DrawContext();
    context.size = new Size(200, 1);
    context.respectScreenScale = true;
    context.opaque = false;

    context.setFillColor(SECONDARY_COLOR);
    context.fillRect(new Rect(0, 0, 197, 1));

    const image = context.getImage();
    stack.addSpacer(3);
    stack.addImage(image);
    stack.addSpacer(10);

    const content = stack.addStack();
    content.layoutHorizontally();

    content.addSpacer(null);
    const column2 = addColumn(content);
    const column1 = addColumn(content);
    content.addSpacer(null);
    const column3 = addColumn(content);
    const column4 = addColumn(content);
    const column5 = addColumn(content);
    const column6 = addColumn(content);
    content.addSpacer(null);

    addText(column1, "     d%", {font: HEADER_FONT});
    addText(column2, " ", {font: HEADER_FONT});
    addText(column3, "     Δ$", {font: HEADER_FONT});
    addText(column4, "     Δ%", {font: HEADER_FONT});
    addText(column5, "     y%", {font: HEADER_FONT});
    addText(column6, " ", {font: HEADER_FONT});

    column1.addSpacer(5);
    column2.addSpacer(5);
    column3.addSpacer(5);
    column4.addSpacer(5);
    column5.addSpacer(5);
    column6.addSpacer(5);

    const index = await fetchFuturesIndex(currency);

    addText(column1, index.change, {font: REGULAR_FONT, color: index.change[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column2, currency, {font: HEADER_FONT});
    addText(column3, index.price, {font: REGULAR_FONT, spaceLeft: 1});
    addText(column4, " ", {font: REGULAR_FONT});
    addText(column5, " ", {font: REGULAR_FONT});
    addText(column6, " ", {font: REGULAR_FONT});

    const dated = (await fetchFuturesInfo(currency)).sort((a, b) => (a.tenor || -1) - (b.tenor || -1)).map(formatFutureInfo);
    const perpetual = dated.shift();

    addText(column1, perpetual.change, {font: REGULAR_FONT, color: perpetual.change[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column2, perpetual.name, {font: HEADER_FONT});
    addText(column3, perpetual.difference, {font: REGULAR_FONT, color: perpetual.difference[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column4, perpetual.premium, {font: REGULAR_FONT, color: perpetual.premium[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column5, " ", {font: REGULAR_FONT});
    addText(column6, " ", {font: REGULAR_FONT});

    for (const future of dated) {
        addText(column1, future.change, {font: REGULAR_FONT, color: future.change[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column2, future.name, {font: HEADER_FONT});
        addText(column3, future.difference, {font: REGULAR_FONT, color: future.difference[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column4, future.premium, {font: REGULAR_FONT, color: future.premium[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column5, future.apr, {font: REGULAR_FONT, color: future.apr[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column6, future.tenor, {font: THIN_FONT, color: NEUTRAL_COLOR, spaceLeft: null});
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

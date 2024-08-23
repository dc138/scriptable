// Config

const ERROR_FONT = Font.body();
const ERROR_COLOR = Color.red();

const TITLE_FONT = Font.boldMonospacedSystemFont(18);
const REGULAR_FONT = Font.regularMonospacedSystemFont(14);
const HEADER_FONT = Font.mediumMonospacedSystemFont(14);

const UP_COLOR = Color.green();
const DOWN_COLOR = Color.red();
const NEUTRAL1_COLOR = new Color("a6a6a6");
const NEUTRAL2_COLOR = new Color("666666");

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";
const CURRENCY = "BTC";
const LOGO = "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";

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

const addLine = (stack, color, before, after) => {
    const context = new DrawContext();
    context.size = new Size(200, 1);
    context.respectScreenScale = true;
    context.opaque = false;

    context.setFillColor(color);
    context.fillRect(new Rect(0, 0, 200, 1));

    const image = context.getImage();
    stack.addSpacer(before);
    stack.addImage(image);
    stack.addSpacer(after);

    return image;
}

const createIndexTable = async (stack, currency) => {
    const title = stack.addStack();
    title.layoutHorizontally();
    title.bottomAlignContent();

    addText(title, "Index", {font: TITLE_FONT});
    title.addSpacer();
    title.addSpacer(null);

    const logo = title.addStack();
    logo.layoutVertically();

    const logoData = Image.fromData(Data.fromBase64String(LOGO));
    const logoImage = logo.addImage(logoData);
    logoImage.imageSize = new Size(32, 32);
    logo.addSpacer(null);

    addLine(stack, NEUTRAL2_COLOR, 3, 10);

    const index = await fetchFuturesIndex(currency);

    const list = stack.addStack();
    list.layoutHorizontally();

    addText(list, "$" + index.price, {font: HEADER_FONT});
    list.addSpacer(Math.max(1, 60 - index.price.length * 10));
    addText(list, index.change, {font: REGULAR_FONT, color: index.change[0] == "-" ? DOWN_COLOR : UP_COLOR});
    list.addSpacer(null);
    addText(list, index.volatility + "dv", {font: REGULAR_FONT, color: NEUTRAL1_COLOR});
}

const createFutureTable = async (stack, currency) => {
    addText(stack, "Futures", {font: TITLE_FONT});
    addLine(stack, NEUTRAL2_COLOR, 3, 10);

    const table = stack.addStack();
    table.layoutHorizontally();

    const column1 = addColumn(table);
    table.addSpacer(null);
    const column2 = addColumn(table);
    const column3 = addColumn(table);
    const column4 = addColumn(table);
    const column5 = addColumn(table);
    const column6 = addColumn(table);

    addText(column1, " ", {font: HEADER_FONT});
    addText(column2, "d%", {font: HEADER_FONT, spaceLeft: null});
    addText(column3, "Δ$", {font: HEADER_FONT, spaceLeft: null});
    addText(column4, "Δ%", {font: HEADER_FONT, spaceLeft: null});
    addText(column5, "y%", {font: HEADER_FONT, spaceLeft: null});
    addText(column6, " ", {font: HEADER_FONT});

    column2.addSpacer(5);
    column1.addSpacer(5);
    column3.addSpacer(5);
    column4.addSpacer(5);
    column5.addSpacer(5);
    column6.addSpacer(5);

    const dated = (await fetchFuturesInfo(currency)).sort((a, b) => (a.tenor || -1) - (b.tenor || -1)).map(formatFutureInfo);
    const perpetual = dated.shift();

    addText(column1, perpetual.name, {font: HEADER_FONT});
    addText(column2, perpetual.change, {font: REGULAR_FONT, color: perpetual.change[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column3, perpetual.difference, {font: REGULAR_FONT, color: perpetual.difference[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column4, perpetual.premium, {font: REGULAR_FONT, color: perpetual.premium[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
    addText(column5, " ", {font: REGULAR_FONT});
    addText(column6, " ", {font: REGULAR_FONT});

    for (const future of dated) {
        addText(column1, future.name, {font: HEADER_FONT});
        addText(column2, future.change, {font: REGULAR_FONT, color: future.change[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column3, future.difference, {font: REGULAR_FONT, color: future.difference[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column4, future.premium, {font: REGULAR_FONT, color: future.premium[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column5, future.apr, {font: REGULAR_FONT, color: future.apr[0] == "-" ? DOWN_COLOR : UP_COLOR, spaceLeft: null});
        addText(column6, future.tenor, {font: REGULAR_FONT, color: NEUTRAL1_COLOR, spaceLeft: null});
    }
};

const createWidget = async () => {
    const widget = new ListWidget();

    const content = widget.addStack();
    content.layoutVertically();

    await createIndexTable(content, CURRENCY);
    content.addSpacer(15);
    await createFutureTable(content, CURRENCY);
    content.addSpacer(null);

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

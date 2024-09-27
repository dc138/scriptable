// Deribit Futures Widget, a scriptable.app widget that displays cryptocurrency
// futures market information from Deribit.
//
// Copyright © 2024 Antonio de Haro
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Config

const TITLE_FONT = Font.boldMonospacedSystemFont(18);
const HEADER_FONT = Font.mediumMonospacedSystemFont(14);
const REGULAR_FONT = Font.regularMonospacedSystemFont(14);

const BG_COLOR = Color.dynamic(new Color("#ffffff"), new Color("#1c1c1e"));
const FG_COLOR = Color.dynamic(new Color("#1c1c1e"), new Color("#ffffff"));
const NEUTRAL1_COLOR = Color.dynamic(new Color("#a6a6a6"), new Color("#a6a6a6"));
const NEUTRAL2_COLOR = Color.dynamic(new Color("#666666"), new Color("#666666"));
const ERROR_COLOR = Color.dynamic(new Color("#ff3b30"), new Color("#ff453a"));
const UP1_COLOR = Color.dynamic(new Color("#34c759"), new Color("#30d158"));
const UP2_COLOR = Color.dynamic(new Color("#98b69a"), new Color("#31703d"));
const DOWN1_COLOR = Color.dynamic(new Color("#ff3b30"), new Color("#ff453a"));
const DOWN2_COLOR = Color.dynamic(new Color("#ffa99b"), new Color("#86362f"));

const WIDGET_SIZE = "large";

const API_URL = "https://www.deribit.com/api/v2/";

const GRAPH_TIMEFRAME = "24h"; // "8h", "24h" or "1m";

// Widget Creation

const currency = args.widgetParameter || "BTC";

// Bitcoin and Etherium base64 encoded 48x48 png logos
const base64Logo = {
    "BTC": "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAKFUExURQAAAPeTGviTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGveTGfeYJfeVH/eSGPeWH/zTov3gvPrAeveWIfeUHfeSF/ifNP7x4f////3jw/eWIPigNvzWqPvIivmoRviaKveRF/eRFfmxWf/8+PvLkfeQFPq1Yv/+/vvGhviiOf3kxfzbs/vDgfmtUfibLPvJi//9+vmzX/eQE/vMkvmwWPeRFvq2ZP/69f7t2f706P737vibK/3iwv7w3/q7b/7y4//8+v/+/f706f3oz//58/3gvfigNfq3Zv7u2/716vzRnvmrTPeUHPvOlvvOmPicLfzasf727fmvVvmrTfvEgv/8+fzctPeSGfidMP3nzPq9cvvDf/muUvzSn/vHiP3hv/q6bf/+/P3myveYJP747/mqS/eUG/vQmv7u2v3lyfvOl/q8cPmyXfq2Y//69Pq8cvmtUveaKPvDgP3p0f/79vvGh/737fmpSPicLvmuVPvJjf3q0v/58vvJjPeXI/idL/3nzfeZJ/vEg/737/vKjvmtUPzSoPvEgf705/ikPfmxWvihN/q7bvimQf/9+/mzXf3q0/7z5v/7+P727PilQPeQFfmwV/748PmvVfeYJvmoR/ijPP3lyP7x4v3iwP726/vPmP748f3euP/48frCffieMv7v3veXIv716f7w4P3hvv7r1f7x4P3r1PzXqf/79/vNlPvIi/eVHfibKvifM////vvKj/myW/rAefvQm/3hwPq5a/zYrPzQnFa2groAAAAjdFJOUwAAAAw1baPM5/f+bgEncrvp/LwtkOIVfOM6vwJe5ATz9nHylPAAvgAAAAFiS0dEMdnbHXIAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoCBcQBjJJ1kLeAAADX0lEQVRIx5VW+SMUURyfbbFHdq1rWbdm7ajs8KxiJBQqlSGUKyW1RUpSqVBSulOh0qEDHXTp0H3f9338Pb03LO/NbGo/v+zse9/P+57v+30UNQwZgtzJ2UWhVKnVKqXCZbSTXFik7AJuuGq0bjp3egjuOg+txtU+Ax3k6eVNS+Dt5WlPCVzS+/jSduHro5cw4ILBj/4r/AwihkzmHxBIj4DAAH+cIZMFaYPpERGsDRpmwPO1ISIBo5gRoh3SAc0LkJwfZmLEOgJsfkB/JfaHjx03PoI2szgr0DBAgPH0ExvDREaBaEvMhImxuGl+esSAenxweXOcmePiJyWAyYlJyWAKi+/5IKNgfvF8MVNTUtOmTZ8B0mfOmg0SMjgig56I4OqFr/GZAICsOdkgJyN3LpgXSbru5QoJGqJ+2Lz8AoBQWDS/GCwIZ8m60kCCloyPZWHJImBD6eIlVkKHVkbJPUQRZeKXIgXZxQIlZ1kZzvCQU046cQ7M5VBwecWKlSmViLIqt2p4T+dEObuL5KtWI5Oqw3gubE0pYqzFVLg7Uy5iBdy6LChVAzNm5NYjwgYLtutCKSSENCiUvJFHMU6qhd919Vi6FZTSrgubNvMQDVuQhnIztqukVBIXGqFQ+tZtTdt31OxE8dqF50JFqcUW7c4aTEJ6rfBTvgcvQLWUsBeduq+xeTB1+3OJzKklJgkuHDjY0tp2qBB+HT7STlw+ldjpqqPIhWPHGY4tO9GB4nWygSacJsLKcvGnkAunhVvEnEE6OrtwmxRk4lq7z6JCSj7HC/TzOfDPhR6eSBxWGlUtvQUXL0GZy1cSGSNtvNqHPK/s5onSwIqPbRoM6LW26zE3LPU3o9Gfzn6GKD68vPNuFQ3EHjTfrr5Td1f4TDVhFrnJyQvU3lVyLwoQuN/HkheIuKJGhjc/AB3lvek2+YePrOIrSjYB5vETEP009hl4/uLlq6jXb/qsRnETINsMV/EWvEvsqQTvP3z8FBlnZaVthmxksJQ+ZyZ+AZVfeSPDiFqy0MhErdLY/+17jOkHyI9hpGNFb2uueDNmYJpMP3/9tkiHimGoe0vaPdsQIR0pQ+0eDZTQEPofwAaKMLJCxzgwshwfio6PXccHu+NPh0GKJvS/HycQoyTPH2fp8+cPWPpcMkWryPQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDgtMjNUMTU6NDA6MzIrMDA6MDCNgftvAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTIzVDE1OjQwOjMyKzAwOjAw/NxD0wAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wOC0yM1QxNjowNjo0OSswMDowMKMGUOQAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC",
    "ETH": "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",
}[currency];

const platform_time = await new Request(API_URL + "public/get_time")
    .loadJSON()
    .then((response) => response.result);

const fetchIndexInfo = async (currency) => {
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

    const prices = await new Request(API_URL + `public/get_funding_chart_data?instrument_name=${currency}-PERPETUAL&length=${GRAPH_TIMEFRAME}`)
        .loadJSON()
        .then((response) => (
            {
                prices: response.result.data
                    .map((data) => data.index_price)
                    .filter((_, i) => GRAPH_TIMEFRAME != "24h" || i % 3 == 0)
            }
        ));

    return {
        ...ticker,
        ...volatility,
        ...prices,
    };
};

const fetchFuturesInfo = async (currency) => {
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
        change: info.change ? info.change.toFixed(2) : "",
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
    };
};

const addColumn = (content) => {
    const colum = content.addStack();
    colum.layoutVertically();
    return colum;
}

const addText = (element, text, {color, font, opacity, lines, factor, spaceLeft, spaceRight, align} = {}) => {
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

    if (align == "left") {
        textElement.leftAlignText();

    } else if (align == "center") {
        textElement.centerAlignText();

    } else if (align == "right") {
        textElement.rightAlignText();
    }


    if (spaceRight !== undefined) {
        container.addSpacer(spaceRight);
    }

    return textElement;
}

const addLine = (stack, color, before = 0, after = 0, width = 200) => {
    const context = new DrawContext();
    context.size = new Size(width, 1);
    context.respectScreenScale = true;
    context.opaque = false;

    context.setFillColor(color);
    context.fillRect(new Rect(0, 0, width, 1));

    const image = context.getImage();
    stack.addSpacer(before);
    stack.addImage(image);
    stack.addSpacer(after);

    return image;
}

const createHorizontalDottedLine = (startX, startY, endX, space) => {
    const path = new Path();

    for (let i = startX; i < endX; i += space) {
        if (i % (space * 2) == 0) {
            path.move(new Point(i, startY));

        } else {
            path.addLine(new Point(i, startY));
        }
    }

    return path;
}

const addPriceGraph = async (stack, prices, ratio = .5) => {
    const width = prices.length;
    const height = width * ratio;

    const context = new DrawContext();
    context.size = new Size(width, height);
    context.respectScreenScale = true;
    context.opaque = false;

    const [min, max] = [Math.min(...prices), Math.max(...prices)];

    const points = prices
        .map((price) => (price - min) / (max - min))
        .map((value, i) => new Point(.97 * i, (.97 * (.5 - value) + .5) * height));

    const [first, last] = [points[0], points[points.length - 1]];

    const backgroundFill = new Path();
    backgroundFill.addLines(points);
    backgroundFill.addLine(new Point(.97 * width, height));
    backgroundFill.addLine(new Point(width, height));
    backgroundFill.addLine(new Point(width, 0));
    backgroundFill.addLine(new Point(0, 0));
    backgroundFill.closeSubpath();

    context.setFillColor(BG_COLOR);
    context.addPath(backgroundFill);
    context.fillPath();

    const dottedSpace = Math.floor(width / 50);
    const firstLine = createHorizontalDottedLine(0, first.y, width, dottedSpace);
    const lastLine = createHorizontalDottedLine(0, last.y, width, dottedSpace);

    const [color1, color2] = first.y >= last.y ? [UP1_COLOR, UP2_COLOR] : [DOWN1_COLOR, DOWN2_COLOR];

    context.setStrokeColor(color2);
    context.setLineWidth(width / 130);

    context.addPath(firstLine);
    context.strokePath();
    context.addPath(lastLine);
    context.strokePath();

    const priceLine = new Path();
    priceLine.addLines(points);

    context.setStrokeColor(color1);
    context.setLineWidth(width / 125);
    context.addPath(priceLine);
    context.strokePath();

    const priceGradient = new LinearGradient();
    priceGradient.colors = [color2, BG_COLOR];
    priceGradient.locations = [0, 1];
    priceGradient.startPoint = new Point(0, 0);
    priceGradient.endPoint = new Point(0, 1);

    const image = context.getImage();
    stack.addImage(image);
    stack.backgroundGradient = priceGradient;

    return image;
};

const createIndexTable = async (stack, currency) => {
    const heading = stack.addStack();
    heading.layoutHorizontally();
    heading.bottomAlignContent();

    const title = heading.addStack();
    title.layoutVertically();

    addText(title, "Index", {font: TITLE_FONT, color: FG_COLOR});
    addLine(title, NEUTRAL2_COLOR, 3, 3, 180);

    heading.addSpacer(null);

    const logo = heading.addStack();
    logo.layoutVertically();

    const logoData = Image.fromData(Data.fromBase64String(base64Logo));
    const logoImage = logo.addImage(logoData);
    logoImage.imageSize = new Size(32, 32);

    const index = await fetchIndexInfo(currency);

    const content = stack.addStack();
    content.layoutHorizontally();

    const data = content.addStack();
    data.layoutVertically();

    data.addSpacer(null);
    const price = data.addStack();
    price.layoutHorizontally();

    addText(price, "$" + index.price, {font: HEADER_FONT, spaceRight: Math.max(1, 60 - index.price.length * 10), color: FG_COLOR});
    addText(price, index.change, {font: REGULAR_FONT, color: index.change[0] == "-" ? DOWN1_COLOR : UP1_COLOR});

    addText(data, index.volatility + "dv", {font: REGULAR_FONT, color: NEUTRAL1_COLOR, spaceLeft: 20});
    data.addSpacer(null);
    addText(data, "Futures", {font: TITLE_FONT, color: FG_COLOR});

    const graph = content.addStack();
    content.layoutHorizontally();

    graph.addSpacer(null);
    const centered = graph.addStack();
    centered.layoutVertically();
    centered.centerAlignContent();
    graph.addSpacer(null);

    centered.addSpacer(null);
    const picture = centered.addStack();
    centered.addSpacer(null);

    addPriceGraph(picture, index.prices);
}

const createFutureTable = async (stack, currency) => {
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
    addText(column2, "d%", {font: HEADER_FONT, color: FG_COLOR, spaceLeft: null});
    addText(column3, "Δ$", {font: HEADER_FONT, color: FG_COLOR, spaceLeft: null});
    addText(column4, "Δ%", {font: HEADER_FONT, color: FG_COLOR, spaceLeft: null});
    addText(column5, "y%", {font: HEADER_FONT, color: FG_COLOR, spaceLeft: null});
    addText(column6, " ", {font: HEADER_FONT});

    column1.addSpacer(5);
    column2.addSpacer(5);
    column3.addSpacer(5);
    column4.addSpacer(5);
    column5.addSpacer(5);
    column6.addSpacer(5);

    const dated = (await fetchFuturesInfo(currency)).sort((a, b) => (a.tenor || -1) - (b.tenor || -1)).map(formatFutureInfo);
    const perpetual = dated.shift();

    addText(column1, perpetual.name, {font: HEADER_FONT, color: FG_COLOR});
    addText(column2, perpetual.change, {font: REGULAR_FONT, color: perpetual.change[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
    addText(column3, perpetual.difference, {font: REGULAR_FONT, color: perpetual.difference[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
    addText(column4, perpetual.premium, {font: REGULAR_FONT, color: perpetual.premium[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
    addText(column5, " ", {font: REGULAR_FONT});
    addText(column6, " ", {font: REGULAR_FONT});

    for (const future of dated) {
        addText(column1, future.name, {font: HEADER_FONT, color: FG_COLOR});
        addText(column2, future.change, {font: REGULAR_FONT, color: future.change[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
        addText(column3, future.difference, {font: REGULAR_FONT, color: future.difference[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
        addText(column4, future.premium, {font: REGULAR_FONT, color: future.premium[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
        addText(column5, future.apr, {font: REGULAR_FONT, color: future.apr[0] == "-" ? DOWN1_COLOR : UP1_COLOR, spaceLeft: null});
        addText(column6, future.tenor, {font: REGULAR_FONT, color: NEUTRAL1_COLOR, spaceLeft: null});
    }
};

const createWidget = async () => {
    if (!config.runsInApp && config.widgetFamily != WIDGET_SIZE) {
        throw new Error("Invalid widget size.");
    }

    const widget = new ListWidget();
    widget.backgroundColor = BG_COLOR;

    const content = widget.addStack();
    content.layoutVertically();

    await createIndexTable(content, currency);
    await createFutureTable(content, currency);

    return widget;
};

const createErrorWidget = (text) => {
    const widget = new ListWidget();
    addText(widget, text, {color: ERROR_COLOR, font: HEADER_FONT, factor: .5, align: "center"});

    return widget;
};

// Script entry point

const main = async () => {
    let widget = null;

    try {
        widget = await createWidget();
    } catch ({name, message}) {
        widget = createErrorWidget(`${name}: ${message}`);
    }

    if (config.runsInWidget) {
        Script.setWidget(widget);

    } else {
        await widget.presentLarge();
    }
};

await main();
Script.complete();

let supply = [], demand = [], supply2 = [], demand2 = [];
let price1 = [], price2 = [], price3 = [];
let intercept = [], pfloor = [];

for (let i = 1; i <= 10; i++) {
    price1.push(i);
    demand.push(-(i - 20));
    supply.push(i);
    intercept.push(10);
    pfloor.push(15);
}

for (let i = 11; i < 20; i++) {
    price2.push(i);
    demand2.push(-(i - 20));
    supply2.push(i);
    pfloor.push(15);
}

price3 = price1.concat(price2);

function plot() {
    let supply_line1 = {
        x: price1,
        y: supply,
        name: "Supply",
        type: "scatter",
        legendgroup: "one",
        mode: "lines",
        line: {
            color: "#FF0000"
        }
    };

    let supply_line1_2 = {
        x: price1,
        y: supply,
        showlegend: false,
        type: "scatter",
        mode: "lines",
        line: {
            color: "#FF0000"
        }
    };
    
    let demand_line1 = {
        x: price1,
        y: demand,
        name: "Demand",
        type: "scatter",
        legendgroup: "two",
        mode: "lines",
        line: {
            color: "#0000FF"
        }
    };

    let supply_line2 = {
        x: price2,
        y: supply2,
        name: "Supply",
        type: "scatter",
        showlegend: false,
        mode: "lines",
        line: {
            color: "#FF0000"
        }
    };

    let demand_line2 = {
        x: price2,
        y: demand2,
        type: "scatter",
        name: "Demand",
        showlegend: false,
        mode: "lines",
        line: {
            color: "#0000FF"
        }
    };

    let supply_connect = {
        x: [10, 11],
        y: [10, 11],
        type: "scatter",
        name: "Supply",
        showlegend: false,
        mode: "lines",
        line: {
            color: "#FF0000"
        }
    }

    let demand_connect = {
        x: [10, 11],
        y: [10, 9],
        type: "scatter",
        name: "Demand",
        showlegend: false,
        mode: "lines",
        line: {
            color: "#0000FF"
        }
    }

    let psurplus1 = {
        x: [1, 2, 3, 4, 5],
        y: pfloor,
        type: "scatter",
        fill: "tonexty",
        mode: "lines",
        legendgroup: "one",
        name: "Producer Surplus",
        line: {
            color: "#FF0000"
        }
    }

    let csurplus = {
        x: [1, 2, 3, 4, 5],
        y: [19, 18, 17, 16, 15],
        type: "scatter",
        fill: "tonexty",
        legendgroup: "two",
        name: "Consumer Surplus",
        mode: "lines",
        line: {
            color: "#0000FF"
        }
    }

    let floor = {
        x: price3,
        y: pfloor,
        mode: "lines",
        name: "Price Floor",
        legendgroup: "three",
        line: {
            color: "#000802"
        }
    }

    let qD = {
        x: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        y: [0].concat(price3),
        mode: "lines",
        name: "Quantity Demanded",
        legendgroup: "two",
        line: {
            dash: "dot",
            color: "#0000FF"
        }
    }

    let qS = {
        x: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
        y: [0].concat(price3),
        mode: "lines",
        name: "Quantity Supplied",
        legendgroup: "one",
        line: {
            dash: "dot",
            color: "#FF0000"
        }
    }
    
    let dwl = {
        x: [5, 6, 7, 8, 9, 10],
        y: [5, 6, 7, 8, 9, 10],
        mode: "lines",
        type: "scatter",
        name: "Deadweight Lost",
        fill: "tonexty",
        legendgroup: "three",
        line: {
            color: "#000802"
        }
    }
    
    let segD = {
        x: [5, 6, 7, 8, 9, 10],
        y: [15, 14, 13, 12, 11],
        type: "scatter",
        name: "Demand",
        showlegend: false,
        mode: "lines",
        line: {
            color: "#0000FF"
        }
    }
    
    let sup = {
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 3, 4, 5],
        type: "scatter",
        name: "Supply",
        showlegend: false,
        mode: "lines",
        line: {
            color: "FF0000"
        }
    }
    
    let overlay = {
        x: [5, 6, 7, 8, 9, 10],
        y: [5, 6, 7, 8, 9, 10],
        type: "scatter",
        showlegend: false,
        name: "Supply",
        mode: "lines",
        line: {
            color: "FF0000"
        }
    }
    
    data = [supply_line1, qS, supply_line1_2, demand_line1, supply_line2, demand_line2, supply_connect, demand_connect, qD, floor, csurplus, segD, dwl, sup, psurplus1, overlay];
    Plotly.newPlot("graph", data);
}

plot();

let ant_pos = [];
let windowWidth = window.innerWidth, windowHeight = window.innerHeight;
let lines = 0, path = 0, pLines = 0, mLines = 0;
let visited = new Set();
let nextNode = 0;
let lag = false;

const timer = ms => new Promise(res => setTimeout(res, ms));

function settings() {
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomPosition(n) {
    for (let i = 0; i < n; i++) {
        let pos = [randomIntFromInterval(100, windowWidth - 100), randomIntFromInterval(200, windowHeight - 200)];
        if (ant_pos.includes(pos)) i--;
        else ant_pos[i] = pos;
    }
    ant_pos.sort((a, b) => a[0] - b[0]);
    //ant_pos.forEach(pos => console.log(pos));
}

function placeDots() {
    for (let i = 0; i < ant_pos.length; i++) {
        let div = document.createElement("div");
        div.className = "dot";
        div.id = i;
        div.style.top = `${ant_pos[i][1]}px`;
        div.style.left = `${ant_pos[i][0]}px`;

        document.getElementById("dots").appendChild(div);
    }
}

function drawLine(begin, end, op, p) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('x1', `${begin[0] + 5}`);
    line.setAttribute('x2', `${end[0] + 5}`);
    line.setAttribute('y1', `${begin[1] + 5}`);
    line.setAttribute('y2', `${end[1] + 5}`);
    line.setAttribute('opacity', `${op}`);

    if (p) {
        line.setAttribute('id', `path${path}`);
        path++;
    }
    else line.setAttribute('id', `l${lines}`);

    svg.setAttribute('height', windowHeight);
    svg.setAttribute('width', windowWidth);
    svg.setAttribute('id', `svg${lines}`);
    mLines++;


    svg.appendChild(line);
    document.getElementById("container").appendChild(svg);
    if (!p) lines++;
}

function drawLines(node, set, op) {
    for (let i = 0; i < ant_pos.length; i++) {
        if (i != node && !set.has(i)) drawLine(ant_pos[node], ant_pos[i], op, false);
    }
}

function animateLine(ln) {
    let line = document.getElementById(`l${ln}`);
    let tl = line.getTotalLength();
    line.setAttribute("style", "stroke-dasharray: " + tl + "; stroke-dashoffset: " + tl);

    let style = document.createElement("style");

    // most bs thing i've ever written in my life god help me this took me like 9 years to figure out
    let keyframes = `\
    @keyframes dash${ln}{\ 
        50%{\
            stroke-dashoffset: 0;\
        }\

        75% {\
            stroke-dashoffset: 0;\
        }\

        100%{\
            stroke-dashoffset: ${-tl};\
        }\
    }`;

    let line_prop = `\  
    #l${ln} {\
        animation: dash${ln} .0s linear;\
        animation-fill-mode: forwards;\
    }`;

    document.head.appendChild(style);
    style.sheet.insertRule(line_prop, style.length);
    style.sheet.insertRule(keyframes, style.length);
}

function animatePath(path) {
    let line = document.getElementById(`path${path}`);
    let tl = line.getTotalLength();
    line.setAttribute("style", "stroke-dasharray: " + tl + "; stroke-dashoffset: " + tl);

    let style = document.createElement("style");

    let keyframes = `\
    @keyframes pdash${path}{\ 
        to{\
            stroke-dashoffset: 0;\
        }\
    }`;

    let line_prop = `\  
    #path${path} {\
        animation: pdash${path} .0s linear;\
        animation-fill-mode: forwards;\
    }`;

    document.head.appendChild(style);
    style.sheet.insertRule(line_prop, style.length);
    style.sheet.insertRule(keyframes, style.length);

}

function getCoords(node) {
    let curr = document.getElementById(node);
    let coords = curr.getAttribute("style").split(";");

    let y = coords[0].replace(/\D/g, ""), x = coords[1].replace(/\D/g, "");
    return [x, y];
}

function allDistances(node, set) {
    let distances = {};
    let currCoords = ant_pos[node];

    for (let i = 0; i < ant_pos.length; i++) {
        if (!set.has(i)) {
            let coords = ant_pos[i];
            let distance = Math.sqrt(Math.pow(currCoords[0] - coords[0], 2) + Math.pow(currCoords[1] - coords[1], 2));

            distances[i] = distance;
        }
    }

    //console.log(distances);
    return distances;
}

function weightedRandomPick(distances) {
    let d = [];
    for (let key in distances) {
        d.push([distances[key], key]);
    }

    d.sort((a, b) => a[0] - b[0]);

    let vals = [];
    let f = d[0][0] - 10;
    let prev = 0;
    for (let i = 0; i < d.length; i++) {
        if (i != 0) prev = vals[i - 1][0];

        vals.push([(10000 / Math.pow(d[i][0] - f, 3/2)) + prev, d[i][1]]);
    }

    console.log(vals);
    let n = randomIntFromInterval(0, vals[vals.length - 1][0] | 0);
    for (let i = 0; i < vals.length; i++) {
        if (vals[i][0] >= n) return vals[i][1];
    }
    
    // console.log(n);
}

function moveAnt(node, set) {
    return new Promise((resolve) => {
        let n = weightedRandomPick(allDistances(node, set));
        set.add(parseInt(n));
    
        if (lag) drawLines(node, set, .1);
        drawLine(ant_pos[node], ant_pos[n], .1, true);

        if (lag) {
            for (let i = pLines; i < lines; i++) {
                animateLine(i);
            }
            animatePath(path - 1);
        }

        nextNode = n;
        resolve();
    });
}

function resetLines() {
    for (let i = pLines; i < lines; i++) {
        let ld = document.getElementById(`svg${i}`);
        ld.remove();
    }

    lines = pLines;
}

function setUp() {
    randomPosition(50);
    placeDots();
    settings();

    visited.add(0);
}

async function runApp() {
    for (let i = 0; i < 100; i++) {
        while (visited.size != ant_pos.length) {
            await moveAnt(nextNode, visited);
            //console.log(lines);
            await timer(50);
            resetLines();
        }

        visited.delete(0);
        moveAnt(nextNode, visited);
        await timer(0);

        pLines = mLines;
        lines = mLines;

        visited.clear();
        visited.add(0);
    }
}

console.log("run");

setUp();
runApp();

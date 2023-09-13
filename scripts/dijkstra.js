// for priority queue
let positions = [];
let windowWidth = window.innerWidth, windowHeight = window.innerHeight;
let lines = new Set();
let greenLines = new Set();
let instructions = [];
let stop = false;
let done = true;

const top1 = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

const timer = ms => new Promise(res => setTimeout(res, ms));

/**
 * creates Nodes to act as vertices in dijkstra's algorithm
 * label acts as this.Node's number
 * adjacentNodes will hold Nodes and their weight connected to this.Node
 * pos is the position of the Node on the webpage
 */
class Node {
    constructor(label) {
        this.label = label;
        this.adjacentNodes = new Map();
        this.pos;
        this.prev;
        this.visited = false;
    }

    addAdjacentNode(node, weight) {
        this.adjacentNodes.set(node, weight);
    }

    setPos(pos) {
        this.pos = pos;
    }

    getpos() {
        return this.pos;
    }

    getAdjacent() {
        return this.adjacentNodes;
    }

    getLabel() {
        return this.label;
    }

    setPrev(prev) {
        this.prev = prev;
    }

    getPrev() {
        return this.prev;
    }

    setVisited(bool) {
        this.visited = bool;
    }

    getVisited() {
        return this.visited;
    }
}

// priority queue for dijkstras algorithm
class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
      this._heap = [];
      this._comparator = comparator;
    }

    size() {
        return this._heap.length;
    }

    isEmpty() {
        return this.size() == 0;
    }

    peek() {
        return this._heap[top1];
    }

    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }

    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > top1) {
            this._swap(top1, bottom);
        }

        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    replace(value) {
        const replacedValue = this.peek();
        this._heap[top1] = value;
        this._siftDown();
        return replacedValue;
    }

    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
      let node = this.size() - 1;
      while (node > top1 && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }

    _siftDown() {
      let node = top1;
      while ((left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }

    replaceVal(value) {
        for (let i = 0; i < this._heap.length; i++) {
            if (value[0] == this._heap[i][0]) {
                if (this._comparator(value, this._heap[i])) {
                    this._heap[i] = value;
                    this._siftUp();
                } else {
                    this._heap[i] = value;
                    this._siftDown();
                }

                break;
            }
        }
    }
}

/**
 * @param {int} min minimum value for random number 
 * @param {int} max maximum value for random number
 * @returns {int} create a random int, min to max inclusive
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** 
 * @param {int} num number of Nodes 
 * @returns {void} create num Nodes in the HashMap positions
 */
function setPositions(num) {
    for (let i = 0; i < num; i++) {
        let pos = [randomInt(100, windowWidth - 100), randomInt(125, windowHeight - 200)];
        let node = new Node(i);
        node.setPos(pos);

        positions[i] = node;
    }
}

/**
 * @param {int} probability probability of Nodes being connected, must be from 0 - 1 
 * @returns {void} creates a randomly generated graph from n Nodes 
 */
function generateGraph(probability) {
    let chance = 100 * probability;
    for (let i = 0; i < positions.length; i++) {
        let node1 = positions[i];
        for (let j = i + 1; j < positions.length; j++) {
            let node2 = positions[j];
            let coin = randomInt(1, 100);
            if (coin <= chance) {
                let dist = distance(node1, node2);
                node1.addAdjacentNode(node2, dist);
                node2.addAdjacentNode(node1, dist);
            }
        }
    }
}

/**
 * @param {Node} Node1 start Node
 * @param {Node} Node2 destination Node
 * @returns {int} distance between 2 nodes
 */
function distance(Node1, Node2) {
    let p1 = Node1.getpos();
    let p2 = Node2.getpos();
    return Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2));
}

/**
 * @returns {void} draws a line on webpage from 1 Nodes to another, for all Nodes
 */
function drawLines() {
    lines = new Set();
    for (let i = 0; i < positions.length; i++) {
        let nodeDist = positions[i].getpos();
        let nodesAttached = positions[i].getAdjacent();

        nodesAttached.forEach((value, key) => {
            let lower = Math.min(positions[i].getLabel(), key.getLabel()).toString();
            let higher = Math.max(positions[i].getLabel(), key.getLabel()).toString();
            let code = lower.toString() + "-" + higher.toString();
            if (!lines.has(code)) {
                lines.add(code);
                let node2Dist = key.getpos();
                let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

                svg.setAttribute("class", "svg-con");
                svg.setAttribute("id", `svg${code}`);
                line.setAttribute("class", "line-graph");
                line.setAttribute("id", code);

                line.setAttribute('x1', `${nodeDist[0] + 5}`);
                line.setAttribute('y1', `${nodeDist[1] + 5}`);
                line.setAttribute('x2', `${node2Dist[0] + 5}`);
                line.setAttribute('y2', `${node2Dist[1] + 5}`);
                line.setAttribute('stroke', 'black');
                line.setAttribute('opacity', .4);
                line.setAttribute('stroke-width', 1);

                svg.setAttribute('height', windowHeight);
                svg.setAttribute('width', windowWidth);

                svg.appendChild(line);
                document.getElementById("container").appendChild(svg);
            }
        });
    }
}

/**
 * Nodes can be in any order
 * @param {Node} node1 start node
 * @param {Node} node2 terminal node
 * @return {void} makes line on webpage green
 */
function makeGreenLine(node1, node2) {
    if (node1 != null && node2 != null && !stop) {
        let lower = Math.min(node1.getLabel(), node2.getLabel());
        let higher = Math.max(node1.getLabel(), node2.getLabel());
        let code = lower.toString() + "-" + higher.toString();

        let line = document.getElementById(code);
        if (line != null) {
            line.setAttribute("stroke", "#39f505");
            line.setAttribute("opacity", 1);
            line.setAttribute("stroke-width", 2);
        }
        greenLines.add(code);
    }
}

/**
 * @returns {void} place nodes on webpage
 */
function placeNodes() {
    for (let i = 0; i < positions.length; i++) {
        let node = positions[i];
        let div = document.createElement("div");
        div.className = "node";
        div.id = i;
        div.style.top = `${node.getpos()[1]}px`;
        div.style.left = `${node.getpos()[0]}px`;
        div.style.backgroundColor = "black";

        document.getElementById("nodes").appendChild(div);
    }
}

/** 
 * executes dijkstra's algorithm
 * @param {Node} root starting Node
 * @param {Node} target destination Node
 * @return {Node} returns the end Node
 */
function dijkstra(root, target) {
    let distances = [];
    let explored = new Set();
    let currNode = root;
    let pairQueue = new PriorityQueue((a, b) => a[1] < b[1]);

    instructions.push("node" + root.getLabel());
    document.getElementById(root.getLabel()).style.backgroundColor = 'red';
    document.getElementById(target.getLabel()).style.backgroundColor = '#66ff00';

    for (let i = 0; i < positions.length; i++) {
        distances[i] = Number.MAX_SAFE_INTEGER;
    }

    distances[root.getLabel()] = 0;
    root.prev = null;
    root.visited = true;
    while (currNode.getLabel() != target.getLabel()) {
        // console.log("CURRENTLY ON NODE: " + currNode.getLabel());
        currNode.getAdjacent().forEach((value, key) => {
            if (!explored.has(key)) {
                let distTo = distances[currNode.getLabel()] + value;
                instructions.push(getCode(currNode, key));

                // console.log("visiting node: " + key.getLabel() + ", dist: " + distTo);
                if (!key.getVisited()) {
                    pairQueue.push([key, distTo]);
                    distances[key.getLabel()] = distTo;
                    key.setVisited(true);
                    key.prev = currNode;
                } else if (distances[key.getLabel()] > distTo) {
                    pairQueue.replaceVal([key, distTo]);
                    distances[key.getLabel()] = distTo;
                    key.prev = currNode;
                }
            }
        });
        
        explored.add(currNode);
        currNode = pairQueue.pop()[0];
        instructions.push("node" + currNode.getLabel());
    }

    return currNode;
}

/**
 * @param {Array} params parameters for redoing the graph; must be in order of 
 * [number of Nodes, delay, probability]
 * 
 * creates event listeners for elements in toolbar
 */
function initializeListeners(params) {
    let hidePath = document.getElementById("path-hide");
    let genNew = document.getElementById("gen-new");
    let start = document.getElementById("start");

    hidePath.addEventListener('mouseenter', toggleLines);
    hidePath.addEventListener('mouseleave', toggleLines);

    genNew.addEventListener('click', () => {
        redo(params[0], params[2]);
    }, true);

    start.addEventListener('click', () => {
        if (done) runAnimation(params[1]);
    });
}

/**
 * method for eventListener; hides all lines except for the ones in the shortest path
 */
function toggleLines() {
    lines.forEach((val) => {
        if (!greenLines.has(val)) {
            let line = document.getElementById(val);
            line.classList.toggle('fade');
        }
    });
}

/**
 * Nodes can be in any order
 * @param {Node} node1 first node
 * @param {Node} node2 second node
 * @return {String} code for the line connecting the two nodes
 */
function getCode(node1, node2) {
    let lower = Math.min(node1.getLabel(), node2.getLabel()).toString();
    let higher = Math.max(node1.getLabel(), node2.getLabel()).toString();

    return lower + "-" + higher;
}

/**
 * 
 * @param {Node} target end node
 * @param {int} delayMS delay in ms
 */
async function executeInstructions(target, delayMS) {
    done = false;
    let start = parseInt(instructions[0].substring(4, instructions[0].length));
    let prevNode = document.getElementById(start);
    for (let i = 1; i < instructions.length; i++) {
        if (stop) break;
        let instruct = instructions[i];
        if (!instruct.includes("node")) {
            let line = document.getElementById(instruct);

            line.setAttribute('stroke', 'red');
            line.setAttribute('stroke-width', 2);
            line.setAttribute('opacity', 1);
            await timer(delayMS);

            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', 1);
            line.setAttribute('opacity', .4);
            await timer(delayMS);

        } else {
            let nodeNum = parseInt(instruct.substring(4, instruct.length));
            let node = document.getElementById(nodeNum);

            prevNode.style.backgroundColor = 'yellow';
            if (nodeNum != target.getLabel()) node.style.backgroundColor = 'red';
            prevNode = node;
        }
    }

    if (!stop) {
        let s = document.getElementById(start)
        if (s != null) {
            s.style.backgroundColor = 'red';

            let p = target.prev;
            await timer(delayMS * 2);
            makeGreenLine(target, p);

            while (p != null) {
                console.log(p.getLabel());
                await timer(delayMS * 2);
                makeGreenLine(p, p.prev);
                p = p.prev;
            }
        }
    }
}

/**
 * removes all lines on the webpage
 */
function removeAllLinesNodes() {
    lines.forEach((code) => {
        document.getElementById(code).remove();
        document.getElementById(`svg${code}`).remove();
    });

    for (let i = 0; i < positions.length; i++) {
        document.getElementById(i).remove();
    }
}

/**
 * replaces the existing graph with a new graph
 */
function redo(nNodes, p) {
    stop = true;

    removeAllLinesNodes();

    lines = new Set();
    greenLines = new Set();
    instructions = [];
    positions = [];

    setPositions(nNodes);
    placeNodes();
    generateGraph(p);
    drawLines();

    stop = false;
    done = true;
}

async function runAnimation(delay) {
    let n = dijkstra(positions[0], positions[1]);
    await executeInstructions(n, delay);
}

/**
 * @param {int} nNodes number of nodes to put on webpage
 * @param {int} delay delay in ms 
 * @param {int} prob probability of nodes connection, must be 0 - 1
 */
async function main(nNodes, delay, prob) {
    setPositions(nNodes);
    placeNodes();
    generateGraph(prob);
    initializeListeners([nNodes, delay, prob]);
    drawLines();
}

main(100, 200, .03);
// this code is so bad, please no one read this

let bars = [];
let iterfirst = true;
let flag = false;
let load_run = false;
let first_click = true;
let barsize = 1;
let stored = [];
let htmlShow = true;
let maxbars = Math.floor((window.innerWidth - 200) / (barsize + 2));
let delay = 25;

// await timer in milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms));

// Math.floor((window.innerWidth - 200) / (barsize + 2))
// initialize original values of bars
for (let i = 0; i < maxbars; i++) {
    bars.push(randInterval(10, 900));
}

// returns random int from min to max
function randInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// change bars based on window resize
function windowResizeChanges() {
    let windowWidth = window.innerWidth;
    if (bars.length * (barsize + 2) > windowWidth - 200) {
        let originalBars = bars.length;
        maxbars = Math.floor((windowWidth - 200) / (barsize + 2));
        bars.length = maxbars;
        for (let i = originalBars - 1; i >= maxbars; i--) {
            let test = document.getElementById(i);
            test.remove();
        }
    }

    if (bars.length * (barsize + 2) < windowWidth - 200) {
        maxbars = Math.floor((windowWidth - 200) / (barsize + 2));
    }

    if (barsize < 30) {
        htmlShow = false;
        for (let i = 0; i < bars.length; i++) {
            document.getElementById(i).innerHTML = "";
        }
    }
    else {
        htmlShow = true;
        for (let i = 0; i < bars.length; i++) {
            document.getElementById(i).innerHTML = bars[i];
        }
    }
    document.getElementById("array-size").max = `${maxbars}`;
}
window.addEventListener('resize', windowResizeChanges, true);

function dropdownResize(mousepos) {
    let dropdown = document.getElementById("list-elements");
    let heightChange = document.getElementById("slider-settings").offsetHeight;
    mousepos ? dropdown.style.transform = `translateY(${heightChange}px)` : dropdown.style.transform = `translateY(${heightChange - 5}px)`;
}

// make bars in array
function render() {
    let counter = 0;
    // first time creating bars
    if (iterfirst) {
        bars.forEach(num => {
            let div = document.createElement("div");
            div.className = `bar`;
            div.id = counter;
            div.innerHTML = num;
            div.style.height = `${num}px`;
            div.style.width = `${barsize}px`;
            counter++;

            document.getElementById("arraycontainer").appendChild(div);
        });
        iterfirst = false;
    }
    // after first time creating bars
    else {
        for (let i = 0; i < bars.length; i++) {
            let bar = document.getElementById(`${i}`);
            let int = randInterval(10, 900);
            bars[i] = int;
            bar.className = `bar ${int}`;
            bar.style.height = `${int}px`;
            if (htmlShow) bar.innerHTML = int;
        }
    } 
}

// create new array when pressing button
function generatenew() {
    const button = document.getElementById('generate-new');
    button.addEventListener('click', () => {
        flag = true;
        render();
        load_run = false;
    });
}

// check if array is sorted 
function check_sorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i+1])
            return false;
    }
    return true;
}

// swap two values in array on webpage, changing html, height, and color
// this swap function is so useless
function swap(bar1, bar2, arr, tempval, min) {
    bar2.style.height = `${arr[min]}px`;
    bar1.style.height = `${tempval}px`;
    if (htmlShow) {
        bar1.innerHTML = tempval
        bar2.innerHTML = arr[min];
    }
    
    bar1.style.backgroundColor = "blue";
    bar2.style.backgroundColor = "blue";
}

// load function contains the selection sort algorithm and swapping, change later
// remember to change/implement timers for all sorting algorithms
async function load_selection() {
    if (!load_run) { // prevent from clicking multiple times while sorting
        load_run = true;
        document.getElementById("array-size").disabled = true;
        let tempbar = bars;
        for (let i = 0; i < tempbar.length-1; i++) {

            if (first_click) flag = false;
            if (flag) {
                flag = false;
                break;
            }
            first_click = false; 

            let min_i = i;

            // getting first element of each iteration to turn green
            let found_element = document.getElementById(i);
            found_element.style.backgroundColor = "#34fc08";

            for (let j = i + 1; j < tempbar.length; j++) {
                if (flag) break;
                let selected_bar = document.getElementById(j);
                selected_bar.style.backgroundColor = "#34fc08";
                await timer(delay);
                if (tempbar[j] < tempbar[min_i]) {
                    min_i = j;
                }
                selected_bar.style.backgroundColor = "blue";
            }

            let temp = tempbar[min_i];
            
            // getting the temp values for height and html, as well as element to swap
            let found_element2 = document.getElementById(min_i);
            found_element2.style.backgroundColor = "#ff0000";

            tempbar[min_i] = tempbar[i];
            tempbar[i] = temp;
            await timer(delay);

            // changing the html, height, and color
            swap(found_element, found_element2, tempbar, temp, min_i);
        }
        console.log(check_sorted(tempbar));
        load_run = false;
        document.getElementById("array-size").disabled = false;
        first_click = true;
    }
}

// load function, with insertion sort
let convienence = true;
async function load_insertion() { // i literally have no clue wtf i did in here
    if (!load_run) {
        document.getElementById("array-size").disabled = true;
        load_run = true;
        let tempbar = bars;
        for (let i = 1; i < tempbar.length; i++) {
            if (first_click) flag = false;
            if (flag) {
                flag = false;
                break;
            }
            first_click = false;

            let key = tempbar[i];
            j = i - 1;

            // making element 1 red
            let key_bar = document.getElementById(i);
            key_bar.style.backgroundColor = "red";

            await timer(delay);

            while (j >= 0 && key < tempbar[j]) {
                if (flag) break;
                await timer(delay);
                // making the elements behind that the array is accessing green
                let back_bar = document.getElementById(j);
                back_bar.style.backgroundColor = "#34fc08";

                tempbar[j + 1] = tempbar[j];
                
                // "swapping" elements
                let back = document.getElementById(j + 1);
                back.backgroundColor = "red";
                back.style.height = `${tempbar[j]}px`;
                if (htmlShow) back.innerHTML = tempbar[j];
                j = j - 1;
                await timer(delay);
                // setting bars back to blue
                back.style.backgroundColor = "blue";
                back_bar.style.backgroundColor = "blue";
            }
            
            await timer(delay);

            tempbar[j + 1] = key;

            // brain damage
            let back1 = document.getElementById(j + 1);
            back1.style.height = `${key}px`;
            back1.style.backgroundColor = "blue";
            if (htmlShow) back1.innerHTML = key;
        }
        console.log(check_sorted(tempbar));
        load_run = false;
        document.getElementById("array-size").disabled = false;
        first_click = true;
    }
}

// merge sort
function merge(left, right) { // fuck the comments i dont have the brain power to comprehend what i just did here
    let arr = [];
    //console.log(`left: ${left} right: ${right}`);
    while (left.length && right.length) {
        if (left[0][0] < right[0][0]) {
            arr.push(left.shift());
        }
        else {
            arr.push(right.shift());
        }
    }
    //console.log(`arr: ${arr}`);
    let sorted = [...arr, ...left, ...right];
    // console.log(`sorted: ${sorted}`);
    let temporary = [];
    for(let i = 0; i < sorted.length; i++) {
        temporary.push(sorted[i]);
    }
    stored.push(temporary);
    return sorted;
}

function mergeSort(array) {
    const half = array.length / 2;
    if (array.length < 2) {
        return array;
    }

    const left = array.splice(0, half);
    return merge(mergeSort(left), mergeSort(array)); 
}

async function swapMergeSort(arr) {
    if (!load_run) {
        load_run = true;
        document.getElementById("array-size").disabled = true;
        for (let i = 0; i < arr.length; i++) {
            if (first_click) flag = false;
            if (flag) {
                flag = false;
                break;
            }
            first_click = false;
            let lowest = arr[i][0][1];
            for (let j = 0; j < arr[i].length; j++) {
                if (flag) break;
                if (arr[i][j][1] < lowest) lowest = arr[i][j][1];
            }
            
            for (let j = 0; j < arr[i].length; j++) {
                if (flag) break;
                let bar = document.getElementById(lowest);
                bar.style.backgroundColor = "red";
                
                await timer(delay);

                bar.style.height = `${arr[i][j][0]}px`;
                if (htmlShow) bar.innerHTML = arr[i][j][0];
                bar.style.backgroundColor = "blue";

                lowest++;
            }
        }
    }
    load_run = false;
    first_click = true;
    document.getElementById("array-size").disabled = false;
}

function load_merge() {
    let temp = bars;
    if (!load_run) {
        let tempbars = [];
        let mergeList = [];
        for (let i = 0; i < temp.length; i++) {
            mergeList.push([temp[i], i]);
        }

        for (let i = 0; i < mergeList.length; i++) {
            tempbars.push(mergeList[i]);
        }
        let nums = mergeSort(tempbars);
        swapMergeSort(stored);
        stored = [];
        for (let i = 0; i < temp.length; i++) {
            temp[i] = nums[i][0];
        }
    }
}
// end of merge sort

//let colors = ["#ff0000", "#ff8000", "#ffee00", "#6fff00", "#00ff1e", "#00fffb", "#0051ff", "#9500ff", "#ff00f2", "#ff0077"];
// best sorting algorithm
async function load_bogo() {
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    if (!load_run) {
        document.getElementById("array-size").disabled = true;
        load_run = true;
        let tempbar = bars;
        let sorted = false;
        while (!sorted) {
            if (first_click) flag = false;
            if (flag) {
                flag = false;
                break;
            }
            first_click = false;
            shuffle(tempbar);
            for (let i = 0; i < tempbar.length; i++) {
                if (flag) break;
                let bar = document.getElementById(i);
                bar.style.height = `${tempbar[i]}px`;
                if (htmlShow) bar.innerHTML = tempbar[i];
                //bar.style.backgroundColor = colors[randInterval(0, colors.length-1)];
            }
            await timer(delay);
            if (check_sorted(tempbar)) {
                sorted = true;
                break;
            }
        }
        console.log(tempbar);
        first_click = true;
        load_run = false;
        document.getElementById("array-size").disabled = false;
    }
}

function partition(arr, left, right) {
    let pivot = arr[right];
    let pivotIndex = left;
    for (let i = left; i < right; i++) {
        if (arr[i] < pivot) {
            stored.push([[arr[pivotIndex], pivotIndex], [arr[i], i]]);
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            pivotIndex++;
        }
    }
    // add the swap to a list, acts as instructions on what to swap
    stored.push([[arr[right], right], [arr[pivotIndex], pivotIndex]]);
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    return pivotIndex;
}

function quickSort(arr, left, right) {
    if (left >= right) {
        return;
    }
    let index = partition(arr, left, right);

    quickSort(arr, left, index - 1);
    quickSort(arr, index + 1, right);
}

async function load_quick() {
    if (!load_run) {
        document.getElementById("array-size").disabled = true;
        load_run = true;
        quickSort(bars, 0, bars.length - 1);
        console.log(stored);
        for (let i = 0; i < stored.length; i++) {
            if (first_click) flag = false;
            if (flag) {
                flag = false;
                break;
            }
            first_click = false;
            // get each bar (to swap) and their HTML 
            let bar1 = document.getElementById(stored[i][0][1]);
            let bar1_HTML = `${bar1.style.height}`;
            let bar2 = document.getElementById(stored[i][1][1]);
            let bar2_HTML = `${bar2.style.height}`; // javascript shit language
            
            // change all the bars styles and HTML
            bar1.style.backgroundColor = "#34fc08";
            bar2.style.backgroundColor = "red";
            await timer(delay);

            bar1.style.height = bar2_HTML;
            bar2.style.height = bar1_HTML;
            if (htmlShow) {
                bar1.innerHTML = `${bar2_HTML}`;
                bar2.innerHTML = `${bar1_HTML}`;
            }

            //await timer(0);
            bar1.style.backgroundColor = "blue";
            bar2.style.backgroundColor = "blue";
        }
        // empty stored so it doesn't execute the same instructions
        stored = [];
        load_run = false;
        document.getElementById("array-size").disabled = false;
        first_click = true;
    }
}

function clickSelection() {
    const selectionButton = document.getElementById('selection');
    const insertionButton = document.getElementById('insertion');
    const mergeButton = document.getElementById('merge');
    const bogoButton = document.getElementById('bogo');
    const quickButton = document.getElementById('quick');

    selectionButton.addEventListener('click', load_selection);
    insertionButton.addEventListener('click', load_insertion);
    mergeButton.addEventListener('click', load_merge);
    bogoButton.addEventListener('click', load_bogo);
    quickButton.addEventListener('click', load_quick);
}

function mouseover_settings() {
    const listelements = document.getElementById("list-elements");
    const slidersettings = document.getElementById("slider-settings");

    // when mouse over either the button or list, make the background darker
    // but only if the mouse has left the button and the list will the button background be lighter
    listelements.addEventListener("mouseover", () => {
        slidersettings.style.backgroundColor = "#474745";
        dropdownResize(true);
    });
    slidersettings.addEventListener("mouseover", event => {
        event.target.style.backgroundColor = "#474745";
        dropdownResize(true);
    });
    listelements.addEventListener("mouseleave", () => {
        slidersettings.style.backgroundColor = "gray";
        dropdownResize(false);
    });
    slidersettings.addEventListener("mouseleave", () => {
        slidersettings.style.backgroundColor = "gray";
        dropdownResize(false);
    });
}

function slider_values() {
    const array_size = document.getElementById("array-size");
    const array_speed = document.getElementById("array-speed");
    const bar_size = document.getElementById("bar-size");
    array_size.value = maxbars;
    document.getElementById("arraysize-val").innerHTML = maxbars;

    array_size.addEventListener('input', () => {
        document.getElementById("arraysize-val").innerHTML = array_size.value;
        if (bars.length < array_size.value) {
             // I SHOULDVE MADE A FUNCTION FOR THIS AAAAAAAAAAAAAAAAAAAAAA
            for (let i = bars.length; i < array_size.value; i++) {
                let randInt = randInterval(10, 900);
                let div = document.createElement("div");
                div.className = `bar`;
                div.id = i;
                if (htmlShow) div.innerHTML = randInt;
                div.style.height = `${randInt}px`;
                div.style.width = `${barsize}px`;

                document.getElementById("arraycontainer").appendChild(div);
                bars.push(randInt);
            }
        }
        if (bars.length > array_size.value) {
            for (let i = bars.length - 1; i >= array_size.value; i--) {
                let bar = document.getElementById(i);
                bar.remove();
                bars.pop();
            }
        }
    });
    array_speed.addEventListener('input', () => {
        document.getElementById("arrayspeed-val").innerHTML = array_speed.value;
        delay = array_speed.value;
    });
    bar_size.addEventListener('input', () => {
        document.getElementById("barsize-val").innerHTML = bar_size.value;
        //barsize = bar_size.value;
        if (bar_size.value > barsize) {
            //console.log(bar_size.value);
            barsize = parseInt(bar_size.value);
            maxbars = Math.floor((window.innerWidth - 200) / (barsize + 2));
            for (let i = bars.length - 1; i >= maxbars; i--) {
                let bar = document.getElementById(i);
                bar.remove();
                bars.pop();
            }
            for (let j = 0; j < bars.length; j++) {
                document.getElementById(j).style.width = `${barsize}px`;
            }
        }
        if (bar_size.value < barsize) {
            barsize = parseInt(bar_size.value);
            maxbars = Math.floor((window.innerWidth - 200) / (barsize + 2));
            for (let i = 0; i < bars.length; i++) {
                let bar = document.getElementById(i);
                bar.style.width = `${barsize}px`
            }   
            for (let i = bars.length; i < maxbars; i++) { // making a function for this would have been too smart
                let randInt = randInterval(10, 900);
                let div = document.createElement("div");
                div.className = `bar`;
                div.id = i;
                if (htmlShow) div.innerHTML = randInt;
                div.style.height = `${randInt}px`;
                div.style.width = `${barsize}px`;

                document.getElementById("arraycontainer").appendChild(div);
                bars.push(randInt);
            }
        }
        document.getElementById("arraysize-val").innerHTML = bars.length;
        array_size.max = maxbars;
        array_size.value = bars.length;
    });
}

function runApp() {
    dropdownResize(true);
    clickSelection();
    render();
    generatenew();
    mouseover_settings();
    windowResizeChanges();
    slider_values();
} 

console.log(bars);
runApp();
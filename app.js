if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

// Get the time represented in the
// format of hh:mm:ss(24 hours clock)
const getTimeClock = (showMs) => {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let ms = now.getMilliseconds();
    m = padWithZero(m);
    s = padWithZero(s);
    return showMs ? `${h}:${m}:${s}:${ms}` : `${h}:${m}:${s}`; 
};


// Pad the single digit numbers with zero
const padWithZero = (num) => {
    if (num < 10) {num = "0" + num};
    return num;
}

// Get the delay values for all the colors
let redDelay = document.getElementById("red-delays-id").value;
let greenDelay = document.getElementById("green-delays-id").value;;
let blueDelay = document.getElementById("blue-delays-id").value;;
console.log(`Initial delays: red - ${redDelay}, green - ${greenDelay}, blue - ${blueDelay}`);

// Get the reject flag for all the colors
let rejectRed = document.getElementById("red-error-id").checked;
let rejectGreen = document.getElementById("green-error-id").checked;
let rejectBlue = document.getElementById("blue-error-id").checked;
console.log(`Initial rejections: red - ${rejectRed}, green - ${rejectGreen}, blue - ${rejectBlue}`);

// Retain Logs from LS
let retainLogs = window.localStorage.getItem('promiviz-persist-logs') || false;
document.getElementById('persist-logs').checked = (retainLogs === 'true');

// Call this function when a delay is set for a color
const selectDelay = () => {
    redDelay = document.getElementById("red-delays-id").value;
    greenDelay = document.getElementById("green-delays-id").value;;
    blueDelay = document.getElementById("blue-delays-id").value;;
    console.log(`Delays: red - ${redDelay}, green - ${greenDelay}, blue - ${blueDelay}`);
    selectValue();
}

// Call this function when a reject flag is set for a color
const rejectColor = () => {
    rejectRed = document.getElementById("red-error-id").checked;
    rejectGreen = document.getElementById("green-error-id").checked;
    rejectBlue = document.getElementById("blue-error-id").checked;
    console.log(`Rejections: red - ${rejectRed}, green - ${rejectGreen}, blue - ${rejectBlue}`);
    selectValue();
}

// Call this method when a Promise API is selected
const selectValue = () => {
    clear();
    if (!retainLogs) {
        clearLogs();
    }
    const apiSelectBox = document.getElementById("apis-list-id");
    const selected = apiSelectBox.value;
    console.log(selected);
    switch (selected) {
        case 'all':
            explain(
              `Promise.all takes an <b>array of promises</b> and returns a new promise.
              The new promise resolves when <b>all input promises are resolved</b>. In the
              example below, notice the time when all promises resolve. It will be 
              almost equal to the <b>max time</b> taken by a promise(color).`
            );
            handleAll();
            break;
        case 'any':
            explain(
                `Promise.any takes an <b>array of promises</b> and returns a new promise.
                It resolves when <b>any</b> of the input promises is fulfilled. In the example below,
                 notice <b>any</b> of the promises resolves when you apply the same delay.`
            );
            handleAny();
            break;
        case 'race':
            explain(
                `Promise.race takes <b>an array of promises</b> and returns a new promise. 
                It resolves when the first promise settles(result/error). In the example below,
                notice the promise with the <b>least</b> delay resolves first and in turn, the <b>race</b> is over.`
            );
            handleRace();
            break;
        case 'allSettled':
            explain(
                `Promise.allSettled takes an <b>array of promises</b> and returns a new promise. 
                It resolves when all promises <b> are settled(result/error)</b>. In the
                example below, notice the time when all promises settle. It will be 
                almost equal to the <b>max time</b> taken by a promise(color).`
            );
            handleAllSettled();
            break;
        case 'handleResolve':
            explain(
                `Promise.resolve creates a <b>resolved</b> promise. In the example below, we resolve 
                the promises one by one!`
            );
            handleResolve();
            break
        default:
            explain(``);
            break;
    }
};

// Set the value, color, and animation when a Promise Resolves
const setValues = (color, value, duration) => {
    document.getElementById(`${color}-id`).innerHTML = value;
    document.getElementById(`${color}-id`).parentElement.setAttribute('class', value);
    document.getElementById(`${color}-id`).style.animationName = value;
    document.getElementById(`${color}-id`).style.animationDuration = duration;
}

// Clear all the value, color, animations
const clear = () => {
    const colors = ['red', 'green', 'blue'];
    colors.forEach(color => {
        setValues(color, '', '0s');
    });
}

// Clear all the logs from the log board
const clearLogs = () => {
    const logElem = document.getElementById('log-id');
    logElem.innerHTML = '';
}

const persistLogs = () => {
    const cb = document.getElementById('persist-logs');
    if(cb.checked) { 
        retainLogs = true;
    } else { 
        retainLogs = false; 
    }
    window.localStorage.setItem('promiviz-persist-logs', retainLogs)
    console.log(`Persistence: ${retainLogs}`);
}

// Add logs to the log board
const log = (msg, isError) => {
    const logElem = document.getElementById('log-id');
    const logListElem = document.createElement('li');
    isError ? logListElem.setAttribute('class', 'error') : logListElem.removeAttribute('class');
    logListElem.innerHTML = `<span><b>${getTimeClock()} -</b> ${msg}</span>`;
    logElem.appendChild(logListElem);
}

const setTheme = (theme) => {
    const logElem = document.getElementById('log-container');
    const itemToRemove = logElem.classList.item(1);
    logElem.classList.remove(itemToRemove);
    logElem.classList.add(theme);

    const body = document.body;
    body.classList.remove(itemToRemove);
    body.classList.add(theme);

    const config = document.getElementsByClassName("config");
    config[0].classList.remove(itemToRemove);
    config[0].classList.add(theme);
}

// toggle side nav
const toggleNav = () => {
    const navElem = document.getElementById("sidenav-id");
    if (navElem.classList.contains('active')) {
        navElem.classList.remove('active');
    } else {
        navElem.classList.add('active');
    }
}

// close the nav bar
const closeNav = () => {
    const navElem = document.getElementById("sidenav-id");
    navElem.classList.remove('active');
}

const explain = msg => {
    const explainElem = document.getElementById("explanation-id");
    explainElem.innerHTML = msg;
}

// Handle the Promise.all() API
const handleAll = async () => {
    try {
        log(`🕛 Started handling all the colors using Promise.all([red, green, blue])`);

        const red = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectRed ? reject('red') : resolve('red');
            }, redDelay);
        });
        const green = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectGreen ? reject('green') : resolve('green');
            }, greenDelay);
        });
        const blue = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectBlue ? reject('blue') : resolve('blue');
            }, blueDelay);
        });

        const colors = await Promise.all([red, green, blue]);
        console.log(colors);
        colors.forEach(color => {
            setValues(color, color, '3s');
        })
        log(`✔️ Finished handling all the colors using Promise.all([red, green, blue])`); 
    }catch(err) {
        log(`❌ Rejected the color ${err}. Rejecting All.`, true);
    };
};

// Handle the Promise.any() API
const handleAny = async () => {
    try {
        log(`🕛 Started handling any of the colors using Promise.any([red, green, blue])`); 

        const green = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectGreen ? reject('green') : resolve('green');
            }, greenDelay);
        });

        const red = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectRed ? reject('red') : resolve('red');
            }, redDelay);
        });
        const blue = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectBlue ? reject('blue') : resolve('blue');
            }, blueDelay);
        });

        const color = await Promise.any([red, green, blue]);
        log(`${color} got picked up! Lucky one.`);
        setValues(color, color, '3s');
        log(`✔️Finished handling any of the colors using Promise.any([red, green, blue])`); 
    }catch(err) {
        log(`❌ Rejected the color ${err}.`, true);
    };
};

// Handle the Promise.race() API
const handleRace = async () => {
    try{
        log(`🕛 Started racing of the colors using Promise.race([red, green, blue])`);

        const blue = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectBlue ? reject('blue') : resolve('blue');
            }, blueDelay);
        });
        const red = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectRed ? reject('red') : resolve('red');
            }, redDelay);
        });
        const green = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectGreen ? reject('green') : resolve('green');
            }, greenDelay);
        });

        const color = await Promise.race([ green, red, blue]);
        log(`${color} own the race! Great champ.`);
        setValues(color, color, '3s');
        log(`✔️ Finished racing of the colors using Promise.race([red, green, blue])`);
        
    } catch(err) {
        log(`❌ Rejected the color ${err}. Rejecting All`, true);
    }
};

// Handle the Promise.allSettled() API
const handleAllSettled = async () => {
    log(`🕛 Started settling of the colors using Promise.allSettled([red, green, blue])`); 
    
    const red = new Promise((resolve, reject) => {
        setTimeout(() => {
            rejectRed ? reject('red') : resolve('red');
        }, redDelay);
    });
    
    const green = new Promise((resolve, reject) => {
        setTimeout(() => {
            rejectGreen ? reject('green') : resolve('green');
        }, greenDelay);
    });
    
    const blue = new Promise((resolve, reject) => {
        setTimeout(() => {
            rejectBlue ? reject('blue') : resolve('blue');
        }, blueDelay);
    });

    const colors = await Promise.allSettled([red, green, blue]);

    console.log(colors);

    for (const {status, value, reason} of colors) {
        if (status === 'rejected') {
            log(`❌ Rejected the color ${reason}.`, true);
        } else if (status === 'fulfilled') {
            setValues(value, value, '3s');
        }
    }

    log(`✔️ Finished settling of the colors using Promise.allSettled([red, green, blue])`); 
};

// Handle the Promise.resolve() API
const handleResolve = async () => {
    try {
        log(`🕛 Resolving all colors individually with Promise.resolve(color => red, green, blue)`); 
        const red = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectRed ? reject('red') : resolve('red');
            }, redDelay);
        });
        
        const green = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectGreen ? reject('green') : resolve('green');
            }, greenDelay);
        });
        
        const blue = new Promise((resolve, reject) => {
            setTimeout(() => {
                rejectBlue ? reject('blue') : resolve('blue');
            }, blueDelay);
        });

        const redResolved = await Promise.resolve(red);
        log(`✔️ Finished resolving ${redResolved} using Promise.resolve(${redResolved})`); 
        setValues(redResolved, redResolved, '3s');
        
        const greenResolved = await Promise.resolve(green);
        log(`✔️ Finished resolving ${greenResolved} using Promise.resolve(${greenResolved})`); 
        setValues(greenResolved, greenResolved, '3s');

        const blueResolved = await Promise.resolve(blue);
        log(`✔️ Finished resolving ${blueResolved} using Promise.resolve(${blueResolved})`); 
        setValues(blueResolved, blueResolved, '3s');
    }catch(err) {
        log(`❌ Rejected the color ${err}.`, true);
    };
};

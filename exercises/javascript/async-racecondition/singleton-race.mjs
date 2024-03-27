// singleton pattern
let instance = null;
export async function getInstanceWithRaceCondition() {
    if (!instance) {
        instance = await asyncInitWhichTakesALongTime();
    }
    return instance;
}

// init function
async function asyncInitWhichTakesALongTime() {
    await wait(4000);

    return {
        doSomething() {
            return ""
        }
    }
}

// wait helper
async function wait(ms /* @type {number} */) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();     
        }, ms);
    });
}
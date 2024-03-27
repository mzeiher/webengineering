// instance state: "init" | "instantiate" | "instantiated"
let instanceState = "init";
let instanceStateInitializingCallbacks = [];

let instance = null;
export async function getInstanceWithoutRaceCondition() {
    // this part must NOT use await!! since it should run in ONE task
    if(instanceState === "init") {
        // the first call, we need to instantiate the instance
        instanceState = "instantiate";
    } else if(instanceState === "instantiate") {
        // async call while instantiation is running, create async callback and return early
        return new Promise((resolve) => {
            instanceStateInitializingCallbacks.push(resolve);
        });
    } else if(instanceState === "instantiated") {
        // everything settled, return early
        return instance;
    }
    // async init
    instance = await asyncInitWhichTakesALongTime();

    // set state to instantiated, so that subsequent calls get the actual instance
    instanceState = "instantiated";

    // resolve all pending callbacks
    instanceStateInitializingCallbacks.forEach((resolver) => {
        resolver(instance);
    });

    // clear up promises to be garbage collected
    instanceStateInitializingCallbacks = [];

    // return instance to the caller which first invoked the function
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
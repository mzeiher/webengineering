import { getInstanceWithRaceCondition } from "./singleton-race.mjs";
import { getInstanceWithoutRaceCondition } from "./singleton-racefree.mjs";

(async () => {
    const [instance1, instance2] = await Promise.all([getInstanceWithRaceCondition(), getInstanceWithRaceCondition()]);

    if(instance1 !== instance2) {
        console.log("oh oh race condition on async initializers");
    } else {
        console.log("everything's fine");
    }

    const [instanceRaceFree1, instanceRaceFree2] = await Promise.all([getInstanceWithoutRaceCondition(), getInstanceWithoutRaceCondition()]);

    if(instanceRaceFree1 !== instanceRaceFree2) {
        console.log("oh oh race condition on async initializers");
    } else {
        console.log("everything's fine");
    }
})()

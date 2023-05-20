import { writable } from "svelte/store";
import { SynchronizedCounter } from "./synchronizedCounter";

export let controls = writable({
    replaySpeedMax: 1,
    replaySpeedMin: 0.01,
    replaySpeed: 0.5,
    paused: false
});

export let debugMode = writable(true);

export let selectedParams = writable([]);

export let infoDOM = writable({innerText:''});

export let startSimulation = writable(false);

export let selectedEntity = writable('')

function createGlobalCount() {
    const { subscribe, set, update } = writable(0);
    let arriveCount = 0;
    let arrived = {};
    let numThreads = 0;
    function tryIncrement(id: number) {
        if(!Object.keys(arrived).includes(String(id))) {
            arrived[String(id)] = true;
        }
        arriveCount = Object.keys(arrived).length;
        if (arriveCount == numThreads) {
            update(n => (n+1) % 3600);
            arriveCount = 0;
            arrived = {};
        }
    }
    function tryReset(id: number) {
        if(!Object.keys(arrived).includes(String(id))) {
            arrived[String(id)] = true;
        }
        arriveCount = Object.keys(arrived).length;
        if (arriveCount == numThreads) {
            set(0);
            arriveCount = 0;
            arrived = {};
        }
    }
    function setNumThreads(n: number) {
        console.log("globalCount: set num threads to ", n);
        numThreads = n;
    }
    return {
        subscribe,
        tryIncrement,
        tryReset,
        setNumThreads,
        set
    }
}

export const globalCount = createGlobalCount();
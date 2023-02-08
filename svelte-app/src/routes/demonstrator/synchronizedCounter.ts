export class SynchronizedCounter {
    private paused = false;
    private count = 0;
    private numThreads: number;
    private static arriveCount = 0;
    constructor(numThreads: number) {
        this.numThreads = numThreads;
        console.log("created sync counter", numThreads);
    }
    
    public increment(id: number) {
        let increment_ = (id: number) => {
            if (id == 0) {
                this.count++;
                SynchronizedCounter.arriveCount = 0;
            }
        };
        SynchronizedCounter.arriveCount++;
        let promise = new Promise<number>(async (resolve) => {
            while (!this.paused && SynchronizedCounter.arriveCount < this.numThreads) {
                console.log("waiting...");
                await new Promise(r => setTimeout(r, 10));
            }
            if (!this.paused) increment_(id);
            resolve(this.count);
        });
        return promise;
    }

    public get() {
        return this.count;
    }

    pause() {
        this.paused = true;
    }
    unpause() {
        this.paused = false;
    }
}
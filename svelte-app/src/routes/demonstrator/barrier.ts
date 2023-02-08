export class Barrier {
    // how many processors have entered the barrier
    // initialize to 0
    arriveCounter: number;
    // how many processors have exited the barrier
    // initialize to p
    leaveCounter: number;
    flag: number;
    lock: any; // replace with a TypeScript equivalent of std::mutex
    p: number;
    constructor(numThreads: number) {
        this.p = numThreads;
    }

    // barrier for p processors
    barrier() {
        this.lock.lock();
        if (this.arriveCounter === 0) {
            this.lock.unlock();
            while (this.leaveCounter !== this.p); // wait for all to leave before clearing
            this.lock.lock();
            this.flag = 0; // first arriver clears flag
        }
        this.arriveCounter++;
        if (this.arriveCounter === this.p) { // last arriver sets flag
            this.arriveCounter = 0;
            this.leaveCounter = 0;
            this.flag = 1;
        }
        this.lock.unlock();

        while (this.flag === 0); // wait for flag
        this.lock.lock();
        this.leaveCounter++;
        this.lock.unlock();
    }
}
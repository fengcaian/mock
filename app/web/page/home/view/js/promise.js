const p = 'pending';
const f = 'fulfilled';
const r = 'rejected';
class Promise {
    constructor(executor) {
        this.status = p;
        this.value = null;
        this.reason = null;
        const resolve = value => {
            if (this.status === p) {
                this.status = f;
                this.value = value;
            }
        }
        const reject = reason => {
            if (this.status === p) {
                this.status = r;
                this.reason = reason;
            }
        }
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }
    then(onFulfilled = () => {}, onRejected = () => {}) {
        if (this.status === f) {
            onFulfilled(this.value);
        }
        if (this.status === r) {
            onRejected(this.reason);
        }
    }
};

var p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});
var p2 = new Promise((resolve, reject) => {
    reject('err');
});
p1.then((result) => {
    console.log(111, result);
});
console.log(4444)
p2.then((result) => {
    console.log(result);
}, (err) => {
    console.log(err);
});
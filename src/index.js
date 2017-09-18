const options = {};

const promiseToCall = {
    /**
     * Set the class of the promise to return.
     * 
     * @param UserPromise
     */
    usePromiseClass(UserPromise = Promise) {
        if (UserPromise === Promise) {
            options.Promise = UserPromise;
            return;
        }
        checkExecutorCalledImmediately(UserPromise);
        checkExecutorCalledWith1stArgFunction(UserPromise);
        checkExecutorCalledWith2ndArgFunction(UserPromise);
        options.Promise = UserPromise;
    },

    /**
     * Keep `this` bound to a given object.
     * 
     * $ prefix means the result is a promise.
     *
     * @param object
     * @param method
     * @param params
     * @returns {Promise}
     */
    $callMethod(object, method, ...params) {
        return new options.Promise((resolve, reject) => {
            object[method](...params, (err, data) => (err ? reject(err) : resolve(data)));
        });
    },

    /**
     * Ignore `this`.
     *
     * $ prefix means the result is a promise.
     *
     * @param method
     * @param params
     * @returns {Promise}
     */
    $callFunction(method, ...params) {
        return new options.Promise((resolve, reject) => {
            method(...params, (err, data) => (err ? reject(err) : resolve(data)));
        });
    },
};

promiseToCall.usePromiseClass(Promise);

module.exports = promiseToCall;

// ---

function checkExecutorCalledImmediately(UserPromise) {
    let executorImmediatelyRun = false;
    try {
        const promise = new UserPromise((resolve) => {
            executorImmediatelyRun = true;
            if (typeof resolve === 'function') {
                resolve();
            }
        });
    } catch(e) {
        throw new Error('Expected a new-able `Promise` class');
    }
    if (!executorImmediatelyRun) {
        throw new Error('Expected an immediately called `Promise` executor');
    }
}

function checkExecutorCalledWith1stArgFunction(UserPromise) {
    const promise = new UserPromise(resolve => {
        try {
            resolve();
        } catch(e) {
            throw new Error('Expected a `Promise` executor called with a function as 1st arg');
        }
    });
}

function checkExecutorCalledWith2ndArgFunction(UserPromise) {
    const promise = new UserPromise((resolve, reject) => {
        try {
            reject();
        } catch(e) {
            throw new Error('Expected a `Promise` executor called with a function as 2nd arg');
        }
    });
}

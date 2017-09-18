const options = {};

const promiseToCall = {
    /**
     * Set the class of the promise to return.
     * 
     * @param UserPromise
     */
    usePromiseClass(UserPromise = Promise) {
        if (typeof UserPromise.prototype.then !== 'function') {
            throw new Error('Expected a then-able `Promise` class');
        }
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

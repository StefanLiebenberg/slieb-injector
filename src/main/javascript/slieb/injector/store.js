goog.provide('slieb.injector.Store');
goog.require('goog.Disposable');

/**
 * @constructor
 * @extends {goog.Disposable}
 */
slieb.injector.Store = function () {
    slieb.injector.Store.base(this, 'constructor');

    /**
     * @type {goog.structs.Map.<slieb.injector.Key, Object>}
     */
    this.instanceMap = new goog.structs.Map();
};
goog.inherits(slieb.injector.Store, goog.Disposable);

/**
 * @param {slieb.injector.Key} key
 * @return {boolean}
 */
slieb.injector.Store.prototype.containsKey = function (key) {
    return this.instanceMap.containsKey(key);
};

/**
 *
 * @param {slieb.injector.Key} key
 * @param value
 */
slieb.injector.Store.prototype.updateEntry = function (key, value) {
    this.instanceMap.set(key, value);
};

/**
 * @param {slieb.injector.Key} key
 * @return {Object}
 */
slieb.injector.Store.prototype.getEntry = function (key) {
    return this.instanceMap.get(key);
};
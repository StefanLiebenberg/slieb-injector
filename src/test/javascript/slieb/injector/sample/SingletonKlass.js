goog.provide('slieb.injector.sample.SingletonKlass');
goog.setTestOnly();

/** @constructor */
slieb.injector.sample.SingletonKlass = function () {
};
goog.addSingletonGetter(slieb.injector.sample.SingletonKlass);

/**
 * @return {string}
 */
slieb.injector.sample.SingletonKlass.prototype.toString = function () {
    return "{slieb.injector.sample.SingletonKlass#" + goog.getUid(this) + "}";
};

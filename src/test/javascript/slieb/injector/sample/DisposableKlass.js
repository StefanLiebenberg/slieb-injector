goog.provide('slieb.injector.sample.DisposableKlass');
goog.require('goog.Disposable');
goog.setTestOnly();


/**
 * @constructor
 * @extends {goog.Disposable}
 */
slieb.injector.sample.DisposableKlass = function () {
};
goog.inherits(slieb.injector.sample.DisposableKlass, goog.Disposable);

/**
 * @return {string}
 */
slieb.injector.sample.DisposableKlass.prototype.toString = function () {
    return "{slieb.injector.sample.DisposableKlass#" + goog.getUid(this) + "}";
};



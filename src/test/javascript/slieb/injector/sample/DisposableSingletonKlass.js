goog.provide('slieb.injector.sample.DisposableSingletonKlass');
goog.require('goog.Disposable');
goog.setTestOnly();

/**
 * @constructor
 * @extends {goog.Disposable}
 */
slieb.injector.sample.DisposableSingletonKlass = function () {
    slieb.injector.sample.DisposableSingletonKlass.base(this, 'constructor');
};
goog.inherits(slieb.injector.sample.DisposableSingletonKlass, goog.Disposable);
goog.addSingletonGetter(slieb.injector.sample.DisposableSingletonKlass);

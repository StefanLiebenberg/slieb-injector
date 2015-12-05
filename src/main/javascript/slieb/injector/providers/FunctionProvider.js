goog.provide('slieb.injector.providers.FunctionProvider');
goog.require('goog.Disposable');
goog.require('slieb.injector.Provider');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @implements slieb.injector.Provider
 * @template T
 *
 * @param {slieb.injector.Injector} injector
 * @param {function():T|function(slieb.injector.Injector):T} method
 */
slieb.injector.providers.FunctionProvider = function(injector, method) {
    slieb.injector.providers.FunctionProvider.base(this, 'constructor');
    this.injector = injector;
    this.method = method;
};
goog.inherits(slieb.injector.providers.FunctionProvider, goog.Disposable);


/**
 * @override
 * @return {T}
 */
slieb.injector.providers.FunctionProvider.prototype.get = function() {
    return this.method.call(undefined, this.injector);
};

goog.provide('slieb.injector.providers.SingletonProvider');
goog.require('goog.Disposable');

/**
 * @constructor
 * @extends {goog.Disposable}
 *
 * @implements {slieb.injector.Provider.<T>}
 * @template T
 *
 * @param {slieb.injector.Provider.<T>} provider
 */
slieb.injector.providers.SingletonProvider = function(provider) {
    slieb.injector.providers.SingletonProvider.base(this, 'constructor');
    this.provider = provider;
};
goog.inherits(slieb.injector.providers.SingletonProvider, goog.Disposable);

/**
 * @return {T}
 */
slieb.injector.providers.SingletonProvider.prototype.get = function() {
    if (!goog.isDefAndNotNull(this.instance)) {
        /** @type {T} */
        this.instance = this.provider.get();
    }
    return this.instance;
};

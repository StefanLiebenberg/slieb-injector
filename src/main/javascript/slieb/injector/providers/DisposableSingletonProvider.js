goog.provide('slieb.injector.providers.DisposableSingletonProvider');
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
slieb.injector.providers.DisposableSingletonProvider = function(provider) {
    goog.asserts.assert(provider instanceof goog.Disposable);
    slieb.injector.providers.DisposableSingletonProvider.base(this, 'constructor');
    this.provider = provider;
};
goog.inherits(slieb.injector.providers.DisposableSingletonProvider, goog.Disposable);

/**
 * @return {T}
 */
slieb.injector.providers.DisposableSingletonProvider.prototype.get = function() {
    if (!goog.isDefAndNotNull(this.instance) || (/** @type {goog.Disposable} */ (this.instance)).isDisposed()) {
        /** @type {T} */
        this.instance = this.provider.get();
    }
    return this.instance;
};

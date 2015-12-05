goog.provide('slieb.injector.providers.DisposingProvider');
goog.require('goog.Disposable');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @implements {slieb.injector.Provider<T>}
 * @template T
 *
 * @param {!slieb.injector.Injector} injector
 * @param {!slieb.injector.Provider<T>} provider
 */
slieb.injector.providers.DisposingProvider = function(injector, provider) {
    goog.asserts.assert(injector instanceof slieb.injector.Injector);
    goog.asserts.assert(provider instanceof goog.Disposable);
    slieb.injector.providers.DisposingProvider.base(this, 'constructor');
    this.injector = injector;
    this.provider = provider;
};
goog.inherits(slieb.injector.providers.DisposingProvider, goog.Disposable);

/**  @override */
slieb.injector.providers.DisposingProvider.prototype.get = function() {
    if (this.isDisposed()) throw new Error();
    var item = this.provider.get();
    goog.asserts.assert(item instanceof goog.Disposable);
    this.injector.registerInstance(item);
    return item;
};

goog.provide('slieb.injector.providers.ProviderFactory');
goog.require('slieb.injector.providers.SingletonProvider');
goog.require('slieb.injector.providers.FunctionProvider');
goog.require('slieb.injector.providers.ConstructorProvider');
goog.require('slieb.injector.providers.DisposingProvider');
goog.require('slieb.injector.providers.DisposableSingletonProvider');
goog.require('goog.asserts');
goog.require('slieb.injector.Scope');
goog.require('goog.Disposable');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @param {slieb.injector.Injector} injector
 * */
slieb.injector.providers.ProviderFactory = function (injector) {
    goog.asserts.assert(injector instanceof slieb.injector.Injector);
    slieb.injector.providers.ProviderFactory.base(this, 'constructor');
    this.injector = injector;
};
goog.inherits(slieb.injector.providers.ProviderFactory, goog.Disposable);


/**
 * @param {function(new: T)} ctor
 * @return {slieb.injector.providers.ConstructorProvider.<T>}
 * @template T
 */
slieb.injector.providers.ProviderFactory.prototype.createConstructorProvider = function (ctor) {
    goog.asserts.assert(goog.isFunction(ctor));
    goog.asserts.assert(ctor.length == 0);
    var provider = new slieb.injector.providers.ConstructorProvider(ctor);
    this.registerDisposable(provider);
    return provider;
};
/**
 * @param {T} object
 * @return {slieb.injector.providers.FunctionProvider.<T>}
 * @template T
 */
slieb.injector.providers.ProviderFactory.prototype.createConstantProvider = function (object) {
    return this.createFunctionProvider(goog.functions.constant(object));
};

/**
 * @template T
 * @param {function():T|function(slieb.injector.Injector):T} method
 * @return {slieb.injector.providers.FunctionProvider.<T>}
 */
slieb.injector.providers.ProviderFactory.prototype.createFunctionProvider = function (method) {
    goog.asserts.assert(goog.isFunction(method));
    var provider = new slieb.injector.providers.FunctionProvider(this.injector, method);
    this.registerDisposable(provider);
    return provider;
};

/**
 * @param {slieb.injector.Provider.<T>} provider
 * @return {slieb.injector.providers.SingletonProvider.<T>}
 * @template T
 */
slieb.injector.providers.ProviderFactory.prototype.createSingletonProvider = function (provider) {
    goog.asserts.assert(provider instanceof goog.Disposable);
    var singletonProvider = new slieb.injector.providers.SingletonProvider(provider);
    this.registerDisposable(singletonProvider);
    (/** @type {goog.Disposable} */(provider)).registerDisposable(singletonProvider);
    return singletonProvider;
};

/**
 * @param {slieb.injector.providers.DisposingProvider.<T>} provider
 * @return {slieb.injector.providers.DisposableSingletonProvider.<T>}
 * @template T
 */
slieb.injector.providers.ProviderFactory.prototype.createDisposableSingletonProvider = function (provider) {
    goog.asserts.assert(provider instanceof goog.Disposable);
    var singletonProvider = new slieb.injector.providers.DisposableSingletonProvider(provider);
    this.registerDisposable(singletonProvider);
    (/** @type {goog.Disposable} */(provider)).registerDisposable(singletonProvider);
    return singletonProvider;
};

/**
 * @param {slieb.injector.Provider.<T>} provider
 * @return {slieb.injector.providers.DisposingProvider.<T>}
 * @template T
 */
slieb.injector.providers.ProviderFactory.prototype.createDisposingProvider = function (provider) {
    goog.asserts.assert(provider instanceof goog.Disposable);
    var disposingProvider = new slieb.injector.providers.DisposingProvider(this.injector, provider);
    this.registerDisposable(disposingProvider);
    (/** @type {goog.Disposable} */(provider)).registerDisposable(disposingProvider);
    return disposingProvider;
};

/**
 * @param {slieb.injector.Provider} provider
 * @param {slieb.injector.Scope} scope
 * @return {slieb.injector.Provider}
 */
slieb.injector.providers.ProviderFactory.prototype.createProviderForScope = function (provider, scope) {
    var s = slieb.injector.Scope;
    switch (scope) {
        case s.SINGLETON:
            return this.createSingletonProvider(provider);
        case s.DISPOSABLE_SINGLETON:
            return this.createDisposableSingletonProvider(this.createDisposingProvider(provider));
        case s.DISPOSABLE:
            return this.createDisposingProvider(provider);
        case s.CLASS:
        default:
            return provider;
    }
};

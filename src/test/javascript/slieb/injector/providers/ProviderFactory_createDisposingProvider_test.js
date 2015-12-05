goog.require('goog.testing.jsunit');
goog.require('slieb.injector.providers.ProviderFactory');
goog.require('slieb.injector.Injector');
goog.require('goog.functions');
goog.require('goog.Disposable');

/** @type {slieb.injector.Injector} */
var injector;
/** @type {slieb.injector.providers.ProviderFactory} */
var factory;

goog.exportSymbol("setUp", function () {
    injector = new slieb.injector.Injector();
    factory = injector.getFactory();
});

goog.exportSymbol("test_createDisposingProvider_ErrorWhenProvidingNonDisposableInstances", function () {
    var object = {};
    var objectProvider = factory.createConstantProvider(object);
    var disposingProvider = factory.createDisposingProvider(objectProvider);
    assertThrows("Getting a non-disposable instance from Disposing provider should throw some error", function () {
        disposingProvider.get();
    })
});

goog.exportSymbol("test_createDisposingProvider_ShouldNotErrorWhenInstanceIsDisposed", function () {
    var disposableInstance = new goog.Disposable();
    var disposableProvider = factory.createConstantProvider(disposableInstance);
    var disposingProvider = factory.createDisposingProvider(disposableProvider);
    var disposableKlassInstance = disposingProvider.get();
    assertEquals(disposableKlassInstance, disposableInstance);
    disposableKlassInstance.dispose();
    assertTrue(disposableInstance.isDisposed());
});

goog.exportSymbol("test_createDisposingProvider_ShouldNotDisposeInstanceWhenItsProvidersAreDisposed", function () {
    var disposableInstance = new goog.Disposable();
    var disposableProvider = factory.createConstantProvider(disposableInstance);
    var disposingProvider = factory.createDisposingProvider(disposableProvider);
    var disposableKlassInstance = disposingProvider.get();
    disposingProvider.dispose();
    disposableProvider.dispose();
    assertFalse(disposableKlassInstance.isDisposed());
});

goog.exportSymbol("test_createDisposingProvider_ShouldDisposeWhenPassedProviderIsDisposed", function () {
    var disposableInstance = new goog.Disposable();
    var disposableProvider = factory.createConstantProvider(disposableInstance);
    var disposingProvider = factory.createDisposingProvider(disposableProvider);
    var disposableKlassInstance = disposingProvider.get();
    disposingProvider.dispose();
    disposableProvider.dispose();
    assertFalse(disposableKlassInstance.isDisposed());
});

goog.exportSymbol("test_createDisposingProvider_DisposingShouldErrorIfTryingToProviderAfterDisposed", function () {
    var disposableInstance = new goog.Disposable();
    var disposableProvider = factory.createConstantProvider(disposableInstance);
    var disposingProvider = factory.createDisposingProvider(disposableProvider);
    disposingProvider.dispose();
    assertThrows(function () {
        disposingProvider.get();
    })
});
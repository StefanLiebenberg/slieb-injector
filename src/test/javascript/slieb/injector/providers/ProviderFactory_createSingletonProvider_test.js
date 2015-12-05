goog.require('goog.testing.jsunit');
goog.require('slieb.injector.Injector');
goog.require('slieb.injector.providers.ProviderFactory');
goog.require('goog.functions');

/** @type {slieb.injector.providers.ProviderFactory} */
var factory;
var injector;

goog.exportSymbol("setUp", function () {

    injector = new slieb.injector.Injector();
    factory = injector.getFactory();
});

goog.exportSymbol("test_ReturnsSameInstanceInstance", function () {
    var object = {};
    var objectProvider = factory.createConstantProvider(object);
    var singletonProvider = factory.createSingletonProvider(objectProvider);
    assertEquals(singletonProvider.get(), singletonProvider.get());
});

goog.exportSymbol("test_SingletonFactoryIsDisposedWhenProvidedProviderIs", function () {
    var object = {};
    var objectProvider = factory.createConstantProvider(object);
    var singletonProvider = factory.createSingletonProvider(objectProvider);
    objectProvider.dispose();
    assertTrue(singletonProvider.isDisposed());
});

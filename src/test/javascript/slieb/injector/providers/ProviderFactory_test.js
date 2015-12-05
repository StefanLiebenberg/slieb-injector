goog.require('goog.testing.jsunit');
goog.require('slieb.injector.providers.ProviderFactory');
goog.require('slieb.injector.Injector');

/** @type {slieb.injector.providers.ProviderFactory} */
var factory;
var injector;

goog.exportSymbol("setUp", function () {
    injector = new slieb.injector.Injector();
    factory = injector.getFactory();
});


goog.exportSymbol("test_createFunctionProvider", function () {
    var object = {};
    var functionProvider = factory.createFunctionProvider(goog.functions.constant(object));
    assertEquals(functionProvider.get(), object);
});

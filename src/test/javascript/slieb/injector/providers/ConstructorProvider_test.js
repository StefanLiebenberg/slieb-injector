goog.require('goog.testing.jsunit');
goog.require('slieb.injector.providers.ConstructorProvider');
goog.require('slieb.injector.sample.SimpleKlass');
goog.require('slieb.injector.sample.KlassWithArguments');


goog.exportSymbol("test_ConstructorProvider_constructsInstance", function () {
    var provider = new slieb.injector.providers.ConstructorProvider(slieb.injector.sample.SimpleKlass);
    assertTrue(provider.get() instanceof slieb.injector.sample.SimpleKlass);
});


goog.exportSymbol("test_ConstructorProvider_constructsWithArguments", function () {
    var provider = new slieb.injector.providers.ConstructorProvider(slieb.injector.sample.KlassWithArguments, "a", 10);
    var result = provider.get();
    assertTrue(result instanceof slieb.injector.sample.KlassWithArguments);
    assertEquals("a", result.valueA);
    assertEquals(10, result.valueB);
});

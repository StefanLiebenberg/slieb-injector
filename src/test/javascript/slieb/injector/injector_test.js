goog.require('goog.testing.jsunit');
goog.require('slieb.injector.Injector');
goog.require('slieb.injector.Key');
goog.require('slieb.injector.sample.SingletonKlass');
goog.require('slieb.injector.sample.SimpleKlass');
goog.require('slieb.injector.sample.DisposableKlass');
goog.require('slieb.injector.sample.DisposableSingletonKlass');
goog.require('slieb.injector.sample.KlassWithArguments');


var injector;
goog.exportSymbol("setUp", function () {
    injector = new slieb.injector.Injector();
});

//goog.exportSymbol("tearDown", function () {
//    injector.dispose();
//});


goog.exportSymbol("test_InjectsInstanceOfCorrectClass", function () {
    goog.array.forEach([
        slieb.injector.sample.SimpleKlass,
        slieb.injector.sample.SingletonKlass,
        slieb.injector.sample.DisposableKlass,
        slieb.injector.sample.DisposableSingletonKlass
    ], function (klass) {
        var result = injector.getInstanceOf(klass);
        assertNotNull(result);
        assertTrue("expected instead of " + klass + ", but got " + result, result instanceof klass);
    });
});

goog.exportSymbol("test_AutoDetectScope", function () {
    var s = slieb.injector.Scope;
    assertEquals(s.CLASS, slieb.injector.Injector.autoDetectScope(slieb.injector.sample.SimpleKlass));
    assertEquals(s.DISPOSABLE, slieb.injector.Injector.autoDetectScope(slieb.injector.sample.DisposableKlass));
    assertEquals(s.SINGLETON, slieb.injector.Injector.autoDetectScope(slieb.injector.sample.SingletonKlass));
    assertEquals(s.DISPOSABLE_SINGLETON, slieb.injector.Injector.autoDetectScope(slieb.injector.sample.DisposableSingletonKlass));
});

goog.exportSymbol("test_InjectsInstanceOfDisposable", function () {
    assert(injector.getInstanceOf(slieb.injector.sample.DisposableKlass) instanceof slieb.injector.sample.DisposableKlass);
});

goog.exportSymbol("test_InjectsInstanceOfDisposableSingleton", function () {
    assert(injector.getInstanceOf(slieb.injector.sample.DisposableSingletonKlass) instanceof slieb.injector.sample.DisposableSingletonKlass);
});

goog.exportSymbol("test_NonSingletonClassDoNotCacheInjections", function () {
    var simple1 = injector.getInstanceOf(slieb.injector.sample.SimpleKlass);
    var simple2 = injector.getInstanceOf(slieb.injector.sample.SimpleKlass);
    assertNotEquals(simple1, simple2);

    var disposable1 = injector.getInstanceOf(slieb.injector.sample.DisposableKlass);
    var disposable2 = injector.getInstanceOf(slieb.injector.sample.DisposableKlass);
    assertNotEquals(disposable1, disposable2);
});

goog.exportSymbol("test_SingletonClassCacheInjections", function () {
    var simple1 = injector.getInstanceOf(slieb.injector.sample.SingletonKlass);
    var simple2 = injector.getInstanceOf(slieb.injector.sample.SingletonKlass);
    assertEquals(simple1, simple2);

    var disposable1 = injector.getInstanceOf(slieb.injector.sample.DisposableSingletonKlass);
    var disposable2 = injector.getInstanceOf(slieb.injector.sample.DisposableSingletonKlass);
    assertEquals(disposable1, disposable2);
});

goog.exportSymbol("test_FailureWhenInjectingClassesThatRequireArguments", function () {
    assertNotEquals(0, slieb.injector.sample.KlassWithArguments.length);
    assertThrows(function () {
        injector.getInstanceOf(slieb.injector.sample.KlassWithArguments);
    });
});

goog.exportSymbol("test_BindACustomProvider", function () {
    injector.registerMethod(slieb.injector.sample.KlassWithArguments, function () {
        return new slieb.injector.sample.KlassWithArguments("valueA", 1);
    });
    var instance = injector.getInstanceOf(slieb.injector.sample.KlassWithArguments);
    assertTrue(instance instanceof slieb.injector.sample.KlassWithArguments);
    assertEquals(instance.valueA, "valueA");
    assertEquals(instance.valueB, 1);
});

goog.exportSymbol("test_RegisteringInjectionAsSingleton", function () {
    injector.register(slieb.injector.sample.SimpleKlass, slieb.injector.Scope.SINGLETON);
    var simple1 = injector.getInstanceOf(slieb.injector.sample.SimpleKlass);
    var simple2 = injector.getInstanceOf(slieb.injector.sample.SimpleKlass);
    assertEquals(simple1, simple2);
});

goog.exportSymbol("test_InjectInstancesFromParent", function () {
    var object = new slieb.injector.sample.SimpleKlass();
    injector.registerMethod(slieb.injector.sample.SimpleKlass, goog.functions.constant(object));
    var result = injector.getChildInjector().getInstanceOf(slieb.injector.sample.SimpleKlass);
    assertEquals(result, object);
});

goog.exportSymbol("test_DoNotInjectInstancesInParentWhenRegisteredOnChild", function () {
    var object = new slieb.injector.sample.SimpleKlass();
    injector.getChildInjector().registerMethod(slieb.injector.sample.SimpleKlass, goog.functions.constant(object));
    var result = injector.getInstanceOf(slieb.injector.sample.SimpleKlass);
    assertNotEquals(result, object);
});

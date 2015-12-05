goog.provide('slieb.injector.Scope');

/**
 * @enum {string}
 */
slieb.injector.Scope = {
    DISPOSABLE: 'disposable',
    CLASS: 'class',
    SINGLETON: 'singleton',
    DISPOSABLE_SINGLETON: 'disposable_singleton'
};
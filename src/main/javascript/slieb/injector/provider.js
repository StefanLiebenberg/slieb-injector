goog.provide('slieb.injector.ConstructorProvider');
goog.provide('slieb.injector.Provider');
goog.require('goog.functions');

/**
 * @interface
 * @template T
 */
slieb.injector.Provider = function() {
};

/**
 * @return {T}
 */
slieb.injector.Provider.prototype.get = function() {
};

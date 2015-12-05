goog.provide('slieb.injector.Provider');
goog.provide('slieb.injector.ConstructorProvider');
goog.require('goog.functions');

/**
 * @interface
 * @template T
 */
slieb.injector.Provider = function () {
};

/**
 * @return {T}
 */
slieb.injector.Provider.prototype.get = function () {
};

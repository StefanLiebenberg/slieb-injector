goog.provide('slieb.injector.providers.ConstructorProvider');
goog.require('goog.Disposable');
goog.require('slieb.injector.Provider');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @implements slieb.injector.Provider<T>
 * @template T
 *
 * @param {function(new: T, ...)} ctor
 * @param {...*} var_args
 */
slieb.injector.providers.ConstructorProvider = function (ctor, var_args) {
  this.factory = goog.partial(goog.functions.create, ctor);
  this.args = goog.array.slice(arguments, 1);
};
goog.inherits(slieb.injector.providers.ConstructorProvider, goog.Disposable);

/**
 * @override
 */
slieb.injector.providers.ConstructorProvider.prototype.get = function () {
  return this.isDisposed() ? null : this.factory.apply(null, this.args);
};

/** @override */
slieb.injector.providers.ConstructorProvider.prototype.disposeInternal = function () {
  delete this.args;
  delete this.factory;
};

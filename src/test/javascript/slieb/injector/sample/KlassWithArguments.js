goog.provide('slieb.injector.sample.KlassWithArguments');
goog.setTestOnly();

/**
 * @constructor
 * @param {string} valueA
 * @param {number} valueB
 */
slieb.injector.sample.KlassWithArguments = function (valueA, valueB) {
    this.valueA = valueA;
    this.valueB = valueB;
};
goog.addSingletonGetter(slieb.injector.sample.KlassWithArguments);

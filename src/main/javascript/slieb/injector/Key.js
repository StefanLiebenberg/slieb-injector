goog.provide('slieb.injector.Key');
goog.require('goog.structs.Map');


/**
 * @constructor
 * @param {string} id
 * @param {function(new: T)} klass
 * @template T
 */
slieb.injector.Key = function (id, klass) {
    this.id = id;
    this.keyClass = klass;
};

/**
 * @return {string|*}
 */
slieb.injector.Key.prototype.getId = function () {
    return this.id;
};

/**
 * @return {function(new: T)}
 */
slieb.injector.Key.prototype.getKeyClass = function () {
    return this.keyClass;
};

/**
 * @return {string}
 */
slieb.injector.Key.prototype.toString = function () {
    return "{Key:" + this.id + "}";
};


/**
 * @type {Object.<string, slieb.injector.Key>}
 * @protected
 */
slieb.injector.Key.keys = new goog.structs.Map();


/**
 * @constructor
 */
slieb.injector.KeyBuilder = function () {
    this.ctor = null;
    this.named = null;
};

/**
 * @param {string} name
 * @return {slieb.injector.KeyBuilder}
 */
slieb.injector.KeyBuilder.prototype.withName = function (name) {
    goog.asserts.assert(!goog.isDefAndNotNull(this.named));
    this.named = name;
    return this;
};

/**
 * @param {function(new: Object)} ctor
 * @return {slieb.injector.KeyBuilder}
 */
slieb.injector.KeyBuilder.prototype.withConstructor = function (ctor) {
    goog.asserts.assert(!goog.isDefAndNotNull(this.ctor));
    this.ctor = ctor;
    return this;
};


/**
 * @return {slieb.injector.Key}
 */
slieb.injector.KeyBuilder.prototype.build = function () {
    goog.asserts.assert(this.ctor != null);

    var id = 'ctor_' + goog.getUid(this.ctor);

    if (this.named != null) {
        id += '_named_' + this.named;
    }

    if (!slieb.injector.Key.keys.containsKey(id)) {
        slieb.injector.Key.keys.set(id, new slieb.injector.Key(id, this.ctor));
    }
    return slieb.injector.Key.keys.get(id);
};

/**
 * @return {slieb.injector.KeyBuilder}
 */
slieb.injector.KeyBuilder.aKey = function () {
    return new slieb.injector.KeyBuilder();
};


/**
 * @param {function(new: Object)} ctor
 * @return {slieb.injector.Key}
 */
slieb.injector.Key.fromConstructor = function (ctor) {
    return slieb.injector.KeyBuilder.aKey().withConstructor(ctor).build();
};

/**
 * @param {function(new: Object)} ctor
 * @param {string} name
 * @return {slieb.injector.Key}
 */
slieb.injector.Key.fromConstructorWithName = function (ctor, name) {
    return slieb.injector.KeyBuilder.aKey()
        .withConstructor(ctor)
        .withName(name).build();
};

goog.provide('slieb.injector.Injector');
goog.require('goog.Disposable');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');
goog.require('slieb.injector.Key');
goog.require('slieb.injector.Scope');
goog.require('slieb.injector.providers.ProviderFactory');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @param {slieb.injector.Injector=} opt_parent
 */
slieb.injector.Injector = function(opt_parent) {
    slieb.injector.Injector.base(this, 'constructor');

    /** @type {slieb.injector.Injector} */
    this.parent = opt_parent || null;

    /** @type {goog.structs.Map<slieb.injector.Key, slieb.injector.Injector.Entry>} */
    this.providersAndScopesMap = new goog.structs.Map();

    /** @type {slieb.injector.providers.ProviderFactory} */
    this.factory = new slieb.injector.providers.ProviderFactory(this);

    /**
     * @type {goog.structs.Set.<goog.Disposable>}
     */
    this.disposableInstances = new goog.structs.Set();

    this.addOnDisposeCallback(goog.bind(function() {
        this.lifecycle.dispose();
    }, this));
};
goog.inherits(slieb.injector.Injector, goog.Disposable);


/**
 * @return {slieb.injector.providers.ProviderFactory}
 */
slieb.injector.Injector.prototype.getFactory = function() {
    return this.factory;
};

/**
 *
 */
slieb.injector.Injector.prototype.clear = function() {
    this.lifecycle.dispose();
    this.lifecycle = new goog.Disposable();
};


/**
 * @typedef {{provider: slieb.injector.Provider, scope: slieb.injector.Scope}}
 */
slieb.injector.Injector.Entry;


/**
 * @return {slieb.injector.Injector}
 */
slieb.injector.Injector.prototype.getParentInjector = function() {
    return this.parent;
};

/**
 * @param key
 * @return {boolean}
 */
slieb.injector.Injector.prototype.hasProviderForKey = function(key) {
    return this.providersAndScopesMap.containsKey(key) ||
        (goog.isDefAndNotNull(this.parent) && this.parent.hasProviderForKey(key));
};

/**
 * @param {slieb.injector.Key} key
 * @return {slieb.injector.Provider}
 */
slieb.injector.Injector.prototype.getProviderFromKey = function(key) {
    if (!this.providersAndScopesMap.containsKey(key)) {
        if (goog.isDefAndNotNull(this.parent) && this.parent.hasProviderForKey(key)) {
            return this.parent.getProviderFromKey(key);
        } else if (key.getKeyClass() != null) {
            this.providersAndScopesMap.set(key,
                this.constructProvider(key, this.factory.createConstructorProvider(key.getKeyClass())));
        } else {
            throw new Error("don't know how to construct provider for key");
        }
    }
    return this.providersAndScopesMap.get(key).provider;
};


/**
 * @template T
 * @param {function( new : T, ...) : undefined} klass
 * @return {slieb.injector.Provider<T>}
 */
slieb.injector.Injector.prototype.getProvider = function(klass) {
    return this.getProviderFromKey(slieb.injector.Key.fromConstructor(klass));
};


/**
 * @template T
 * @param {function( new : T) : undefined} klass
 * @return {T}
 */
slieb.injector.Injector.prototype.getInstanceOf = function(klass) {
    return this.getProvider(klass).get();
};

/**
 * @param {slieb.injector.Key} key
 * @return {Object}
 */
slieb.injector.Injector.prototype.getInstanceFromKey = function(key) {
    return this.getProviderFromKey(key).get();
};

/**
 * @param {slieb.injector.Key} key
 * @param {slieb.injector.Provider} provider
 * @param {slieb.injector.Scope=} opt_scope
 * @return {{provider: slieb.injector.Provider, scope: slieb.injector.Scope}}
 */
slieb.injector.Injector.prototype.constructProvider = function(key, provider, opt_scope) {
    var scope = goog.isDefAndNotNull(opt_scope) ? opt_scope : this.autoDetectScope(key);
    var wrappedProvider = this.factory.createProviderForScope(provider, scope);
    return {
        provider: wrappedProvider,
        scope: scope
    };
};


/**
 * @param {slieb.injector.Key|function(new: Object)} keyOrCtor
 * @param {slieb.injector.Provider} provider
 * @param {slieb.injector.Scope=} opt_scope
 */
slieb.injector.Injector.prototype.registerProvider = function(keyOrCtor, provider, opt_scope) {
    var key = this.toKey_(keyOrCtor);

    if (this.providersAndScopesMap.containsKey(key)) {
        throw new Error('already registered key');
    }

    this.providersAndScopesMap.set(key, this.constructProvider(key, provider, opt_scope));
};

/**
 *
 */
slieb.injector.Injector.prototype.disposeInstances = function() {
    goog.structs.forEach(this.disposableInstances, goog.dispose);
    this.disposableInstances.clear();
};

/**
 * @param {goog.Disposable} disposable
 */
slieb.injector.Injector.prototype.registerInstance = function(disposable) {
    if (disposable instanceof goog.Disposable) {
        if (disposable.isDisposed()) {
            return;
        }
        this.disposableInstances.add(disposable);
    }
};

/** @override */
slieb.injector.Injector.prototype.disposeInternal = function() {
    slieb.injector.Injector.base(this, 'disposeInternal');
    this.disposeInstances();
};

/**
 * @param {slieb.injector.Key|function(new: T)} keyOrCtor
 * @param {function():T} method
 * @param {slieb.injector.Scope=} opt_scope
 * @template T
 */
slieb.injector.Injector.prototype.registerMethod = function(keyOrCtor, method, opt_scope) {
    this.registerProvider(keyOrCtor, this.factory.createFunctionProvider(method), opt_scope);
};

/**
 * @param {slieb.injector.Key} key
 * @param {function(new: Object)} ctor
 * @param {slieb.injector.Scope=} opt_scope
 */
slieb.injector.Injector.prototype.registerConstructor = function(key, ctor, opt_scope) {
    this.registerProvider(key, this.factory.createConstructorProvider(ctor), opt_scope);
};

/**
 * @param {function(new: Object)} ctor
 * @param {slieb.injector.Scope=} opt_scope
 */
slieb.injector.Injector.prototype.register = function(ctor, opt_scope) {
    this.registerConstructor(slieb.injector.Key.fromConstructor(ctor), ctor, opt_scope);
};

/**
 * @param {slieb.injector.Key|function(new:Object)} object
 * @return {slieb.injector.Key}
 * @private
 */
slieb.injector.Injector.prototype.toKey_ = function(object) {
    if (object instanceof slieb.injector.Key) {
        return /** @type {slieb.injector.Key} */ (object);
    }
    return slieb.injector.Key.fromConstructor(/** @type {function(new: Object)} */(object));

};

/**
 * @param {slieb.injector.Key} key
 * @return {slieb.injector.Scope}
 */
slieb.injector.Injector.prototype.autoDetectScope = function(key) {
    return slieb.injector.Injector.autoDetectScope(key.getKeyClass());
};


/**
 * @param {Function?} ctor
 * @return {slieb.injector.Scope}
 */
slieb.injector.Injector.autoDetectScope = function(ctor) {
    var s = slieb.injector.Scope;
    if (ctor != null) {
        var disposable = ctor.prototype instanceof goog.Disposable;
        var singleton = goog.isFunction(ctor.getInstance);
        if (singleton) {
            if (disposable) {
                return s.DISPOSABLE_SINGLETON;
            }
            return s.SINGLETON;
        }
        if (disposable) {
            return s.DISPOSABLE;
        }
    }
    return s.CLASS;
};

/**
 * @return {slieb.injector.Injector}
 */
slieb.injector.Injector.prototype.getChildInjector = function() {
    var injector = new slieb.injector.Injector(this);
    this.registerDisposable(injector);
    return injector;
};

/**
 * @return {slieb.injector.Injector}
 */
slieb.injector.Injector.getGlobalInjector = function() {
    if (!goog.isDefAndNotNull(slieb.injector.Injector.global_) || slieb.injector.Injector.global_.isDisposed()) {
        /**
         * @type {slieb.injector.Injector}
         * @private
         */
        slieb.injector.Injector.global_ = new slieb.injector.Injector();
    }
    return slieb.injector.Injector.global_;
};






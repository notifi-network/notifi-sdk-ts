"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../node_modules/localforage/dist/localforage.js
  var require_localforage = __commonJS({
    "../../node_modules/localforage/dist/localforage.js"(exports, module) {
      (function(f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
          module.exports = f();
        } else if (typeof define === "function" && define.amd) {
          define([], f);
        } else {
          var g;
          if (typeof window !== "undefined") {
            g = window;
          } else if (typeof global !== "undefined") {
            g = global;
          } else if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
          g.localforage = f();
        }
      })(function() {
        var define2, module2, exports2;
        return function e(t, n, r) {
          function s(o2, u) {
            if (!n[o2]) {
              if (!t[o2]) {
                var a = typeof __require == "function" && __require;
                if (!u && a)
                  return a(o2, true);
                if (i)
                  return i(o2, true);
                var f = new Error("Cannot find module '" + o2 + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
              }
              var l = n[o2] = { exports: {} };
              t[o2][0].call(l.exports, function(e2) {
                var n2 = t[o2][1][e2];
                return s(n2 ? n2 : e2);
              }, l, l.exports, e, t, n, r);
            }
            return n[o2].exports;
          }
          var i = typeof __require == "function" && __require;
          for (var o = 0; o < r.length; o++)
            s(r[o]);
          return s;
        }({ 1: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
            var scheduleDrain;
            {
              if (Mutation) {
                var called = 0;
                var observer = new Mutation(nextTick);
                var element = global2.document.createTextNode("");
                observer.observe(element, {
                  characterData: true
                });
                scheduleDrain = function() {
                  element.data = called = ++called % 2;
                };
              } else if (!global2.setImmediate && typeof global2.MessageChannel !== "undefined") {
                var channel = new global2.MessageChannel();
                channel.port1.onmessage = nextTick;
                scheduleDrain = function() {
                  channel.port2.postMessage(0);
                };
              } else if ("document" in global2 && "onreadystatechange" in global2.document.createElement("script")) {
                scheduleDrain = function() {
                  var scriptEl = global2.document.createElement("script");
                  scriptEl.onreadystatechange = function() {
                    nextTick();
                    scriptEl.onreadystatechange = null;
                    scriptEl.parentNode.removeChild(scriptEl);
                    scriptEl = null;
                  };
                  global2.document.documentElement.appendChild(scriptEl);
                };
              } else {
                scheduleDrain = function() {
                  setTimeout(nextTick, 0);
                };
              }
            }
            var draining;
            var queue = [];
            function nextTick() {
              draining = true;
              var i, oldQueue;
              var len = queue.length;
              while (len) {
                oldQueue = queue;
                queue = [];
                i = -1;
                while (++i < len) {
                  oldQueue[i]();
                }
                len = queue.length;
              }
              draining = false;
            }
            module3.exports = immediate;
            function immediate(task) {
              if (queue.push(task) === 1 && !draining) {
                scheduleDrain();
              }
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {}], 2: [function(_dereq_, module3, exports3) {
          "use strict";
          var immediate = _dereq_(1);
          function INTERNAL() {
          }
          var handlers = {};
          var REJECTED = ["REJECTED"];
          var FULFILLED = ["FULFILLED"];
          var PENDING = ["PENDING"];
          module3.exports = Promise2;
          function Promise2(resolver) {
            if (typeof resolver !== "function") {
              throw new TypeError("resolver must be a function");
            }
            this.state = PENDING;
            this.queue = [];
            this.outcome = void 0;
            if (resolver !== INTERNAL) {
              safelyResolveThenable(this, resolver);
            }
          }
          Promise2.prototype["catch"] = function(onRejected) {
            return this.then(null, onRejected);
          };
          Promise2.prototype.then = function(onFulfilled, onRejected) {
            if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
              return this;
            }
            var promise = new this.constructor(INTERNAL);
            if (this.state !== PENDING) {
              var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
              unwrap(promise, resolver, this.outcome);
            } else {
              this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
            }
            return promise;
          };
          function QueueItem(promise, onFulfilled, onRejected) {
            this.promise = promise;
            if (typeof onFulfilled === "function") {
              this.onFulfilled = onFulfilled;
              this.callFulfilled = this.otherCallFulfilled;
            }
            if (typeof onRejected === "function") {
              this.onRejected = onRejected;
              this.callRejected = this.otherCallRejected;
            }
          }
          QueueItem.prototype.callFulfilled = function(value) {
            handlers.resolve(this.promise, value);
          };
          QueueItem.prototype.otherCallFulfilled = function(value) {
            unwrap(this.promise, this.onFulfilled, value);
          };
          QueueItem.prototype.callRejected = function(value) {
            handlers.reject(this.promise, value);
          };
          QueueItem.prototype.otherCallRejected = function(value) {
            unwrap(this.promise, this.onRejected, value);
          };
          function unwrap(promise, func, value) {
            immediate(function() {
              var returnValue;
              try {
                returnValue = func(value);
              } catch (e) {
                return handlers.reject(promise, e);
              }
              if (returnValue === promise) {
                handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
              } else {
                handlers.resolve(promise, returnValue);
              }
            });
          }
          handlers.resolve = function(self2, value) {
            var result = tryCatch(getThen, value);
            if (result.status === "error") {
              return handlers.reject(self2, result.value);
            }
            var thenable = result.value;
            if (thenable) {
              safelyResolveThenable(self2, thenable);
            } else {
              self2.state = FULFILLED;
              self2.outcome = value;
              var i = -1;
              var len = self2.queue.length;
              while (++i < len) {
                self2.queue[i].callFulfilled(value);
              }
            }
            return self2;
          };
          handlers.reject = function(self2, error) {
            self2.state = REJECTED;
            self2.outcome = error;
            var i = -1;
            var len = self2.queue.length;
            while (++i < len) {
              self2.queue[i].callRejected(error);
            }
            return self2;
          };
          function getThen(obj) {
            var then = obj && obj.then;
            if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
              return function appyThen() {
                then.apply(obj, arguments);
              };
            }
          }
          function safelyResolveThenable(self2, thenable) {
            var called = false;
            function onError(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.reject(self2, value);
            }
            function onSuccess(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.resolve(self2, value);
            }
            function tryToUnwrap() {
              thenable(onSuccess, onError);
            }
            var result = tryCatch(tryToUnwrap);
            if (result.status === "error") {
              onError(result.value);
            }
          }
          function tryCatch(func, value) {
            var out = {};
            try {
              out.value = func(value);
              out.status = "success";
            } catch (e) {
              out.status = "error";
              out.value = e;
            }
            return out;
          }
          Promise2.resolve = resolve;
          function resolve(value) {
            if (value instanceof this) {
              return value;
            }
            return handlers.resolve(new this(INTERNAL), value);
          }
          Promise2.reject = reject;
          function reject(reason) {
            var promise = new this(INTERNAL);
            return handlers.reject(promise, reason);
          }
          Promise2.all = all;
          function all(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var values = new Array(len);
            var resolved = 0;
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              allResolver(iterable[i], i);
            }
            return promise;
            function allResolver(value, i2) {
              self2.resolve(value).then(resolveFromAll, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
              function resolveFromAll(outValue) {
                values[i2] = outValue;
                if (++resolved === len && !called) {
                  called = true;
                  handlers.resolve(promise, values);
                }
              }
            }
          }
          Promise2.race = race;
          function race(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              resolver(iterable[i]);
            }
            return promise;
            function resolver(value) {
              self2.resolve(value).then(function(response) {
                if (!called) {
                  called = true;
                  handlers.resolve(promise, response);
                }
              }, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
            }
          }
        }, { "1": 1 }], 3: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            if (typeof global2.Promise !== "function") {
              global2.Promise = _dereq_(2);
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "2": 2 }], 4: [function(_dereq_, module3, exports3) {
          "use strict";
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function getIDB() {
            try {
              if (typeof indexedDB !== "undefined") {
                return indexedDB;
              }
              if (typeof webkitIndexedDB !== "undefined") {
                return webkitIndexedDB;
              }
              if (typeof mozIndexedDB !== "undefined") {
                return mozIndexedDB;
              }
              if (typeof OIndexedDB !== "undefined") {
                return OIndexedDB;
              }
              if (typeof msIndexedDB !== "undefined") {
                return msIndexedDB;
              }
            } catch (e) {
              return;
            }
          }
          var idb = getIDB();
          function isIndexedDBValid() {
            try {
              if (!idb || !idb.open) {
                return false;
              }
              var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
              var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
              return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && // some outdated implementations of IDB that appear on Samsung
              // and HTC Android devices <4.4 are missing IDBKeyRange
              // See: https://github.com/mozilla/localForage/issues/128
              // See: https://github.com/mozilla/localForage/issues/272
              typeof IDBKeyRange !== "undefined";
            } catch (e) {
              return false;
            }
          }
          function createBlob(parts, properties) {
            parts = parts || [];
            properties = properties || {};
            try {
              return new Blob(parts, properties);
            } catch (e) {
              if (e.name !== "TypeError") {
                throw e;
              }
              var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
              var builder = new Builder();
              for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
              }
              return builder.getBlob(properties.type);
            }
          }
          if (typeof Promise === "undefined") {
            _dereq_(3);
          }
          var Promise$1 = Promise;
          function executeCallback(promise, callback) {
            if (callback) {
              promise.then(function(result) {
                callback(null, result);
              }, function(error) {
                callback(error);
              });
            }
          }
          function executeTwoCallbacks(promise, callback, errorCallback) {
            if (typeof callback === "function") {
              promise.then(callback);
            }
            if (typeof errorCallback === "function") {
              promise["catch"](errorCallback);
            }
          }
          function normalizeKey(key2) {
            if (typeof key2 !== "string") {
              console.warn(key2 + " used as a key, but it is not a string.");
              key2 = String(key2);
            }
            return key2;
          }
          function getCallback() {
            if (arguments.length && typeof arguments[arguments.length - 1] === "function") {
              return arguments[arguments.length - 1];
            }
          }
          var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
          var supportsBlobs = void 0;
          var dbContexts = {};
          var toString = Object.prototype.toString;
          var READ_ONLY = "readonly";
          var READ_WRITE = "readwrite";
          function _binStringToArrayBuffer(bin) {
            var length2 = bin.length;
            var buf = new ArrayBuffer(length2);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length2; i++) {
              arr[i] = bin.charCodeAt(i);
            }
            return buf;
          }
          function _checkBlobSupportWithoutCaching(idb2) {
            return new Promise$1(function(resolve) {
              var txn = idb2.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
              var blob = createBlob([""]);
              txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
              txn.onabort = function(e) {
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
              };
              txn.oncomplete = function() {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
              };
            })["catch"](function() {
              return false;
            });
          }
          function _checkBlobSupport(idb2) {
            if (typeof supportsBlobs === "boolean") {
              return Promise$1.resolve(supportsBlobs);
            }
            return _checkBlobSupportWithoutCaching(idb2).then(function(value) {
              supportsBlobs = value;
              return supportsBlobs;
            });
          }
          function _deferReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = {};
            deferredOperation.promise = new Promise$1(function(resolve, reject) {
              deferredOperation.resolve = resolve;
              deferredOperation.reject = reject;
            });
            dbContext.deferredOperations.push(deferredOperation);
            if (!dbContext.dbReady) {
              dbContext.dbReady = deferredOperation.promise;
            } else {
              dbContext.dbReady = dbContext.dbReady.then(function() {
                return deferredOperation.promise;
              });
            }
          }
          function _advanceReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.resolve();
              return deferredOperation.promise;
            }
          }
          function _rejectReadiness(dbInfo, err) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.reject(err);
              return deferredOperation.promise;
            }
          }
          function _getConnection(dbInfo, upgradeNeeded) {
            return new Promise$1(function(resolve, reject) {
              dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
              if (dbInfo.db) {
                if (upgradeNeeded) {
                  _deferReadiness(dbInfo);
                  dbInfo.db.close();
                } else {
                  return resolve(dbInfo.db);
                }
              }
              var dbArgs = [dbInfo.name];
              if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
              }
              var openreq = idb.open.apply(idb, dbArgs);
              if (upgradeNeeded) {
                openreq.onupgradeneeded = function(e) {
                  var db = openreq.result;
                  try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                      db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                  } catch (ex) {
                    if (ex.name === "ConstraintError") {
                      console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                      throw ex;
                    }
                  }
                };
              }
              openreq.onerror = function(e) {
                e.preventDefault();
                reject(openreq.error);
              };
              openreq.onsuccess = function() {
                var db = openreq.result;
                db.onversionchange = function(e) {
                  e.target.close();
                };
                resolve(db);
                _advanceReadiness(dbInfo);
              };
            });
          }
          function _getOriginalConnection(dbInfo) {
            return _getConnection(dbInfo, false);
          }
          function _getUpgradedConnection(dbInfo) {
            return _getConnection(dbInfo, true);
          }
          function _isUpgradeNeeded(dbInfo, defaultVersion) {
            if (!dbInfo.db) {
              return true;
            }
            var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
            var isDowngrade = dbInfo.version < dbInfo.db.version;
            var isUpgrade = dbInfo.version > dbInfo.db.version;
            if (isDowngrade) {
              if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + `" can't be downgraded from version ` + dbInfo.db.version + " to version " + dbInfo.version + ".");
              }
              dbInfo.version = dbInfo.db.version;
            }
            if (isUpgrade || isNewStore) {
              if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                  dbInfo.version = incVersion;
                }
              }
              return true;
            }
            return false;
          }
          function _encodeBlob(blob) {
            return new Promise$1(function(resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;
              reader.onloadend = function(e) {
                var base64 = btoa(e.target.result || "");
                resolve({
                  __local_forage_encoded_blob: true,
                  data: base64,
                  type: blob.type
                });
              };
              reader.readAsBinaryString(blob);
            });
          }
          function _decodeBlob(encodedBlob) {
            var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
            return createBlob([arrayBuff], { type: encodedBlob.type });
          }
          function _isEncodedBlob(value) {
            return value && value.__local_forage_encoded_blob;
          }
          function _fullyReady(callback) {
            var self2 = this;
            var promise = self2._initReady().then(function() {
              var dbContext = dbContexts[self2._dbInfo.name];
              if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
              }
            });
            executeTwoCallbacks(promise, callback, callback);
            return promise;
          }
          function _tryReconnect(dbInfo) {
            _deferReadiness(dbInfo);
            var dbContext = dbContexts[dbInfo.name];
            var forages = dbContext.forages;
            for (var i = 0; i < forages.length; i++) {
              var forage = forages[i];
              if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
              }
            }
            dbInfo.db = null;
            return _getOriginalConnection(dbInfo).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              for (var i2 = 0; i2 < forages.length; i2++) {
                forages[i2]._dbInfo.db = db;
              }
            })["catch"](function(err) {
              _rejectReadiness(dbInfo, err);
              throw err;
            });
          }
          function createTransaction(dbInfo, mode, callback, retries) {
            if (retries === void 0) {
              retries = 1;
            }
            try {
              var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
              callback(null, tx);
            } catch (err) {
              if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) {
                return Promise$1.resolve().then(function() {
                  if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    if (dbInfo.db) {
                      dbInfo.version = dbInfo.db.version + 1;
                    }
                    return _getUpgradedConnection(dbInfo);
                  }
                }).then(function() {
                  return _tryReconnect(dbInfo).then(function() {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                  });
                })["catch"](callback);
              }
              callback(err);
            }
          }
          function createDbContext() {
            return {
              // Running localForages sharing a database.
              forages: [],
              // Shared database.
              db: null,
              // Database readiness (promise).
              dbReady: null,
              // Deferred operations on the database.
              deferredOperations: []
            };
          }
          function _initStorage(options) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options) {
              for (var i in options) {
                dbInfo[i] = options[i];
              }
            }
            var dbContext = dbContexts[dbInfo.name];
            if (!dbContext) {
              dbContext = createDbContext();
              dbContexts[dbInfo.name] = dbContext;
            }
            dbContext.forages.push(self2);
            if (!self2._initReady) {
              self2._initReady = self2.ready;
              self2.ready = _fullyReady;
            }
            var initPromises = [];
            function ignoreErrors() {
              return Promise$1.resolve();
            }
            for (var j = 0; j < dbContext.forages.length; j++) {
              var forage = dbContext.forages[j];
              if (forage !== self2) {
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
              }
            }
            var forages = dbContext.forages.slice(0);
            return Promise$1.all(initPromises).then(function() {
              dbInfo.db = dbContext.db;
              return _getOriginalConnection(dbInfo);
            }).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo, self2._defaultConfig.version)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              self2._dbInfo = dbInfo;
              for (var k = 0; k < forages.length; k++) {
                var forage2 = forages[k];
                if (forage2 !== self2) {
                  forage2._dbInfo.db = dbInfo.db;
                  forage2._dbInfo.version = dbInfo.version;
                }
              }
            });
          }
          function getItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.get(key2);
                    req.onsuccess = function() {
                      var value = req.result;
                      if (value === void 0) {
                        value = null;
                      }
                      if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                      }
                      resolve(value);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (cursor) {
                        var value = cursor.value;
                        if (_isEncodedBlob(value)) {
                          value = _decodeBlob(value);
                        }
                        var result = iterator(value, cursor.key, iterationNumber++);
                        if (result !== void 0) {
                          resolve(result);
                        } else {
                          cursor["continue"]();
                        }
                      } else {
                        resolve();
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              var dbInfo;
              self2.ready().then(function() {
                dbInfo = self2._dbInfo;
                if (toString.call(value) === "[object Blob]") {
                  return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                    if (blobSupport) {
                      return value;
                    }
                    return _encodeBlob(value);
                  });
                }
                return value;
              }).then(function(value2) {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    if (value2 === null) {
                      value2 = void 0;
                    }
                    var req = store.put(value2, key2);
                    transaction.oncomplete = function() {
                      if (value2 === void 0) {
                        value2 = null;
                      }
                      resolve(value2);
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store["delete"](key2);
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onerror = function() {
                      reject(req.error);
                    };
                    transaction.onabort = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.clear();
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.count();
                    req.onsuccess = function() {
                      resolve(req.result);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              if (n < 0) {
                resolve(null);
                return;
              }
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(null);
                        return;
                      }
                      if (n === 0) {
                        resolve(cursor.key);
                      } else {
                        if (!advanced) {
                          advanced = true;
                          cursor.advance(n);
                        } else {
                          resolve(cursor.key);
                        }
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys2 = [];
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(keys2);
                        return;
                      }
                      keys2.push(cursor.key);
                      cursor["continue"]();
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance(options, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              var isCurrentDb = options.name === currentConfig.name && self2._dbInfo.db;
              var dbPromise = isCurrentDb ? Promise$1.resolve(self2._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                  forages[i]._dbInfo.db = db;
                }
                return db;
              });
              if (!options.storeName) {
                promise = dbPromise.then(function(db) {
                  _deferReadiness(options);
                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                  }
                  var dropDBPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.deleteDatabase(options.name);
                    req.onerror = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      reject(req.error);
                    };
                    req.onblocked = function() {
                      console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      resolve(db2);
                    };
                  });
                  return dropDBPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var i2 = 0; i2 < forages.length; i2++) {
                      var _forage = forages[i2];
                      _advanceReadiness(_forage._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              } else {
                promise = dbPromise.then(function(db) {
                  if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                  }
                  var newVersion = db.version + 1;
                  _deferReadiness(options);
                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                  }
                  var dropObjectPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.open(options.name, newVersion);
                    req.onerror = function(err) {
                      var db2 = req.result;
                      db2.close();
                      reject(err);
                    };
                    req.onupgradeneeded = function() {
                      var db2 = req.result;
                      db2.deleteObjectStore(options.storeName);
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      db2.close();
                      resolve(db2);
                    };
                  });
                  return dropObjectPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var j = 0; j < forages.length; j++) {
                      var _forage2 = forages[j];
                      _forage2._dbInfo.db = db2;
                      _advanceReadiness(_forage2._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              }
            }
            executeCallback(promise, callback);
            return promise;
          }
          var asyncStorage = {
            _driver: "asyncStorage",
            _initStorage,
            _support: isIndexedDBValid(),
            iterate,
            getItem,
            setItem,
            removeItem,
            clear,
            length,
            key,
            keys,
            dropInstance
          };
          function isWebSQLValid() {
            return typeof openDatabase === "function";
          }
          var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var BLOB_TYPE_PREFIX = "~~local_forage_type~";
          var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
          var SERIALIZED_MARKER = "__lfsc__:";
          var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
          var TYPE_ARRAYBUFFER = "arbf";
          var TYPE_BLOB = "blob";
          var TYPE_INT8ARRAY = "si08";
          var TYPE_UINT8ARRAY = "ui08";
          var TYPE_UINT8CLAMPEDARRAY = "uic8";
          var TYPE_INT16ARRAY = "si16";
          var TYPE_INT32ARRAY = "si32";
          var TYPE_UINT16ARRAY = "ur16";
          var TYPE_UINT32ARRAY = "ui32";
          var TYPE_FLOAT32ARRAY = "fl32";
          var TYPE_FLOAT64ARRAY = "fl64";
          var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
          var toString$1 = Object.prototype.toString;
          function stringToBuffer(serializedString) {
            var bufferLength = serializedString.length * 0.75;
            var len = serializedString.length;
            var i;
            var p = 0;
            var encoded1, encoded2, encoded3, encoded4;
            if (serializedString[serializedString.length - 1] === "=") {
              bufferLength--;
              if (serializedString[serializedString.length - 2] === "=") {
                bufferLength--;
              }
            }
            var buffer = new ArrayBuffer(bufferLength);
            var bytes = new Uint8Array(buffer);
            for (i = 0; i < len; i += 4) {
              encoded1 = BASE_CHARS.indexOf(serializedString[i]);
              encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
              encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
              encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
              bytes[p++] = encoded1 << 2 | encoded2 >> 4;
              bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
              bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
            }
            return buffer;
          }
          function bufferToString(buffer) {
            var bytes = new Uint8Array(buffer);
            var base64String = "";
            var i;
            for (i = 0; i < bytes.length; i += 3) {
              base64String += BASE_CHARS[bytes[i] >> 2];
              base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
              base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
              base64String += BASE_CHARS[bytes[i + 2] & 63];
            }
            if (bytes.length % 3 === 2) {
              base64String = base64String.substring(0, base64String.length - 1) + "=";
            } else if (bytes.length % 3 === 1) {
              base64String = base64String.substring(0, base64String.length - 2) + "==";
            }
            return base64String;
          }
          function serialize(value, callback) {
            var valueType = "";
            if (value) {
              valueType = toString$1.call(value);
            }
            if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
              var buffer;
              var marker = SERIALIZED_MARKER;
              if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
              } else {
                buffer = value.buffer;
                if (valueType === "[object Int8Array]") {
                  marker += TYPE_INT8ARRAY;
                } else if (valueType === "[object Uint8Array]") {
                  marker += TYPE_UINT8ARRAY;
                } else if (valueType === "[object Uint8ClampedArray]") {
                  marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === "[object Int16Array]") {
                  marker += TYPE_INT16ARRAY;
                } else if (valueType === "[object Uint16Array]") {
                  marker += TYPE_UINT16ARRAY;
                } else if (valueType === "[object Int32Array]") {
                  marker += TYPE_INT32ARRAY;
                } else if (valueType === "[object Uint32Array]") {
                  marker += TYPE_UINT32ARRAY;
                } else if (valueType === "[object Float32Array]") {
                  marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === "[object Float64Array]") {
                  marker += TYPE_FLOAT64ARRAY;
                } else {
                  callback(new Error("Failed to get type for BinaryArray"));
                }
              }
              callback(marker + bufferToString(buffer));
            } else if (valueType === "[object Blob]") {
              var fileReader = new FileReader();
              fileReader.onload = function() {
                var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
              };
              fileReader.readAsArrayBuffer(value);
            } else {
              try {
                callback(JSON.stringify(value));
              } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);
                callback(null, e);
              }
            }
          }
          function deserialize(value) {
            if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
              return JSON.parse(value);
            }
            var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
            var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
            var blobType;
            if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
              var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
              blobType = matcher[1];
              serializedString = serializedString.substring(matcher[0].length);
            }
            var buffer = stringToBuffer(serializedString);
            switch (type) {
              case TYPE_ARRAYBUFFER:
                return buffer;
              case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
              case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
              case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
              case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
              case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
              case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
              case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
              case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
              case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
              case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
              default:
                throw new Error("Unkown type: " + type);
            }
          }
          var localforageSerializer = {
            serialize,
            deserialize,
            stringToBuffer,
            bufferToString
          };
          function createDbTable(t, dbInfo, callback, errorCallback) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
          }
          function _initStorage$1(options) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options) {
              for (var i in options) {
                dbInfo[i] = typeof options[i] !== "string" ? options[i].toString() : options[i];
              }
            }
            var dbInfoPromise = new Promise$1(function(resolve, reject) {
              try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
              } catch (e) {
                return reject(e);
              }
              dbInfo.db.transaction(function(t) {
                createDbTable(t, dbInfo, function() {
                  self2._dbInfo = dbInfo;
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              }, reject);
            });
            dbInfo.serializer = localforageSerializer;
            return dbInfoPromise;
          }
          function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
            t.executeSql(sqlStatement, args, callback, function(t2, error) {
              if (error.code === error.SYNTAX_ERR) {
                t2.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t3, results) {
                  if (!results.rows.length) {
                    createDbTable(t3, dbInfo, function() {
                      t3.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                  } else {
                    errorCallback(t3, error);
                  }
                }, errorCallback);
              } else {
                errorCallback(t2, error);
              }
            }, errorCallback);
          }
          function getItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key2], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$1(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t2, results) {
                    var rows = results.rows;
                    var length2 = rows.length;
                    for (var i = 0; i < length2; i++) {
                      var item = rows.item(i);
                      var result = item.value;
                      if (result) {
                        result = dbInfo.serializer.deserialize(result);
                      }
                      result = iterator(result, item.key, i + 1);
                      if (result !== void 0) {
                        resolve(result);
                        return;
                      }
                    }
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function _setItem(key2, value, callback, retriesLeft) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                if (value === void 0) {
                  value = null;
                }
                var originalValue = value;
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    dbInfo.db.transaction(function(t) {
                      tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key2, value2], function() {
                        resolve(originalValue);
                      }, function(t2, error2) {
                        reject(error2);
                      });
                    }, function(sqlError) {
                      if (sqlError.code === sqlError.QUOTA_ERR) {
                        if (retriesLeft > 0) {
                          resolve(_setItem.apply(self2, [key2, originalValue, callback, retriesLeft - 1]));
                          return;
                        }
                        reject(sqlError);
                      }
                    });
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$1(key2, value, callback) {
            return _setItem.apply(this, [key2, value, callback, 1]);
          }
          function removeItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key2], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t2, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$1(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n + 1], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t2, results) {
                    var keys2 = [];
                    for (var i = 0; i < results.rows.length; i++) {
                      keys2.push(results.rows.item(i).key);
                    }
                    resolve(keys2);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getAllStoreNames(db) {
            return new Promise$1(function(resolve, reject) {
              db.transaction(function(t) {
                t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t2, results) {
                  var storeNames = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                  }
                  resolve({
                    db,
                    storeNames
                  });
                }, function(t2, error) {
                  reject(error);
                });
              }, function(sqlError) {
                reject(sqlError);
              });
            });
          }
          function dropInstance$1(options, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                var db;
                if (options.name === currentConfig.name) {
                  db = self2._dbInfo.db;
                } else {
                  db = openDatabase(options.name, "", "", 0);
                }
                if (!options.storeName) {
                  resolve(getAllStoreNames(db));
                } else {
                  resolve({
                    db,
                    storeNames: [options.storeName]
                  });
                }
              }).then(function(operationInfo) {
                return new Promise$1(function(resolve, reject) {
                  operationInfo.db.transaction(function(t) {
                    function dropTable(storeName) {
                      return new Promise$1(function(resolve2, reject2) {
                        t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                          resolve2();
                        }, function(t2, error) {
                          reject2(error);
                        });
                      });
                    }
                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                      operations.push(dropTable(operationInfo.storeNames[i]));
                    }
                    Promise$1.all(operations).then(function() {
                      resolve();
                    })["catch"](function(e) {
                      reject(e);
                    });
                  }, function(sqlError) {
                    reject(sqlError);
                  });
                });
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var webSQLStorage = {
            _driver: "webSQLStorage",
            _initStorage: _initStorage$1,
            _support: isWebSQLValid(),
            iterate: iterate$1,
            getItem: getItem$1,
            setItem: setItem$1,
            removeItem: removeItem$1,
            clear: clear$1,
            length: length$1,
            key: key$1,
            keys: keys$1,
            dropInstance: dropInstance$1
          };
          function isLocalStorageValid() {
            try {
              return typeof localStorage !== "undefined" && "setItem" in localStorage && // in IE8 typeof localStorage.setItem === 'object'
              !!localStorage.setItem;
            } catch (e) {
              return false;
            }
          }
          function _getKeyPrefix(options, defaultConfig) {
            var keyPrefix = options.name + "/";
            if (options.storeName !== defaultConfig.storeName) {
              keyPrefix += options.storeName + "/";
            }
            return keyPrefix;
          }
          function checkIfLocalStorageThrows() {
            var localStorageTestKey = "_localforage_support_test";
            try {
              localStorage.setItem(localStorageTestKey, true);
              localStorage.removeItem(localStorageTestKey);
              return false;
            } catch (e) {
              return true;
            }
          }
          function _isLocalStorageUsable() {
            return !checkIfLocalStorageThrows() || localStorage.length > 0;
          }
          function _initStorage$2(options) {
            var self2 = this;
            var dbInfo = {};
            if (options) {
              for (var i in options) {
                dbInfo[i] = options[i];
              }
            }
            dbInfo.keyPrefix = _getKeyPrefix(options, self2._defaultConfig);
            if (!_isLocalStorageUsable()) {
              return Promise$1.reject();
            }
            self2._dbInfo = dbInfo;
            dbInfo.serializer = localforageSerializer;
            return Promise$1.resolve();
          }
          function clear$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var keyPrefix = self2._dbInfo.keyPrefix;
              for (var i = localStorage.length - 1; i >= 0; i--) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key2);
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result = localStorage.getItem(dbInfo.keyPrefix + key2);
              if (result) {
                result = dbInfo.serializer.deserialize(result);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$2(iterator, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var keyPrefix = dbInfo.keyPrefix;
              var keyPrefixLength = keyPrefix.length;
              var length2 = localStorage.length;
              var iterationNumber = 1;
              for (var i = 0; i < length2; i++) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) !== 0) {
                  continue;
                }
                var value = localStorage.getItem(key2);
                if (value) {
                  value = dbInfo.serializer.deserialize(value);
                }
                value = iterator(value, key2.substring(keyPrefixLength), iterationNumber++);
                if (value !== void 0) {
                  return value;
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$2(n, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result;
              try {
                result = localStorage.key(n);
              } catch (error) {
                result = null;
              }
              if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var length2 = localStorage.length;
              var keys2 = [];
              for (var i = 0; i < length2; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                  keys2.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
              }
              return keys2;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$2(callback) {
            var self2 = this;
            var promise = self2.keys().then(function(keys2) {
              return keys2.length;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              localStorage.removeItem(dbInfo.keyPrefix + key2);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$2(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              if (value === void 0) {
                value = null;
              }
              var originalValue = value;
              return new Promise$1(function(resolve, reject) {
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    try {
                      localStorage.setItem(dbInfo.keyPrefix + key2, value2);
                      resolve(originalValue);
                    } catch (e) {
                      if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                        reject(e);
                      }
                      reject(e);
                    }
                  }
                });
              });
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance$2(options, callback) {
            callback = getCallback.apply(this, arguments);
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              var currentConfig = this.config();
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                if (!options.storeName) {
                  resolve(options.name + "/");
                } else {
                  resolve(_getKeyPrefix(options, self2._defaultConfig));
                }
              }).then(function(keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                  var key2 = localStorage.key(i);
                  if (key2.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key2);
                  }
                }
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var localStorageWrapper = {
            _driver: "localStorageWrapper",
            _initStorage: _initStorage$2,
            _support: isLocalStorageValid(),
            iterate: iterate$2,
            getItem: getItem$2,
            setItem: setItem$2,
            removeItem: removeItem$2,
            clear: clear$2,
            length: length$2,
            key: key$2,
            keys: keys$2,
            dropInstance: dropInstance$2
          };
          var sameValue = function sameValue2(x, y) {
            return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
          };
          var includes = function includes2(array, searchElement) {
            var len = array.length;
            var i = 0;
            while (i < len) {
              if (sameValue(array[i], searchElement)) {
                return true;
              }
              i++;
            }
            return false;
          };
          var isArray = Array.isArray || function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
          };
          var DefinedDrivers = {};
          var DriverSupport = {};
          var DefaultDrivers = {
            INDEXEDDB: asyncStorage,
            WEBSQL: webSQLStorage,
            LOCALSTORAGE: localStorageWrapper
          };
          var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];
          var OptionalDriverMethods = ["dropInstance"];
          var LibraryMethods = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(OptionalDriverMethods);
          var DefaultConfig = {
            description: "",
            driver: DefaultDriverOrder.slice(),
            name: "localforage",
            // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
            // we can use without a prompt.
            size: 4980736,
            storeName: "keyvaluepairs",
            version: 1
          };
          function callWhenReady(localForageInstance, libraryMethod) {
            localForageInstance[libraryMethod] = function() {
              var _args = arguments;
              return localForageInstance.ready().then(function() {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
              });
            };
          }
          function extend() {
            for (var i = 1; i < arguments.length; i++) {
              var arg = arguments[i];
              if (arg) {
                for (var _key in arg) {
                  if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                      arguments[0][_key] = arg[_key].slice();
                    } else {
                      arguments[0][_key] = arg[_key];
                    }
                  }
                }
              }
            }
            return arguments[0];
          }
          var LocalForage = function() {
            function LocalForage2(options) {
              _classCallCheck(this, LocalForage2);
              for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                  var driver = DefaultDrivers[driverTypeKey];
                  var driverName = driver._driver;
                  this[driverTypeKey] = driverName;
                  if (!DefinedDrivers[driverName]) {
                    this.defineDriver(driver);
                  }
                }
              }
              this._defaultConfig = extend({}, DefaultConfig);
              this._config = extend({}, this._defaultConfig, options);
              this._driverSet = null;
              this._initDriver = null;
              this._ready = false;
              this._dbInfo = null;
              this._wrapLibraryMethodsWithReady();
              this.setDriver(this._config.driver)["catch"](function() {
              });
            }
            LocalForage2.prototype.config = function config(options) {
              if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
                if (this._ready) {
                  return new Error("Can't call config() after localforage has been used.");
                }
                for (var i in options) {
                  if (i === "storeName") {
                    options[i] = options[i].replace(/\W/g, "_");
                  }
                  if (i === "version" && typeof options[i] !== "number") {
                    return new Error("Database version must be a number.");
                  }
                  this._config[i] = options[i];
                }
                if ("driver" in options && options.driver) {
                  return this.setDriver(this._config.driver);
                }
                return true;
              } else if (typeof options === "string") {
                return this._config[options];
              } else {
                return this._config;
              }
            };
            LocalForage2.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
              var promise = new Promise$1(function(resolve, reject) {
                try {
                  var driverName = driverObject._driver;
                  var complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                  }
                  var driverMethods = LibraryMethods.concat("_initStorage");
                  for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
                      reject(complianceError);
                      return;
                    }
                  }
                  var configureMissingMethods = function configureMissingMethods2() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory2(methodName) {
                      return function() {
                        var error = new Error("Method " + methodName + " is not implemented by the current driver");
                        var promise2 = Promise$1.reject(error);
                        executeCallback(promise2, arguments[arguments.length - 1]);
                        return promise2;
                      };
                    };
                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                      var optionalDriverMethod = OptionalDriverMethods[_i];
                      if (!driverObject[optionalDriverMethod]) {
                        driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                      }
                    }
                  };
                  configureMissingMethods();
                  var setDriverSupport = function setDriverSupport2(support) {
                    if (DefinedDrivers[driverName]) {
                      console.info("Redefining LocalForage driver: " + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    resolve();
                  };
                  if ("_support" in driverObject) {
                    if (driverObject._support && typeof driverObject._support === "function") {
                      driverObject._support().then(setDriverSupport, reject);
                    } else {
                      setDriverSupport(!!driverObject._support);
                    }
                  } else {
                    setDriverSupport(true);
                  }
                } catch (e) {
                  reject(e);
                }
              });
              executeTwoCallbacks(promise, callback, errorCallback);
              return promise;
            };
            LocalForage2.prototype.driver = function driver() {
              return this._driver || null;
            };
            LocalForage2.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
              var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
              executeTwoCallbacks(getDriverPromise, callback, errorCallback);
              return getDriverPromise;
            };
            LocalForage2.prototype.getSerializer = function getSerializer(callback) {
              var serializerPromise = Promise$1.resolve(localforageSerializer);
              executeTwoCallbacks(serializerPromise, callback);
              return serializerPromise;
            };
            LocalForage2.prototype.ready = function ready(callback) {
              var self2 = this;
              var promise = self2._driverSet.then(function() {
                if (self2._ready === null) {
                  self2._ready = self2._initDriver();
                }
                return self2._ready;
              });
              executeTwoCallbacks(promise, callback, callback);
              return promise;
            };
            LocalForage2.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
              var self2 = this;
              if (!isArray(drivers)) {
                drivers = [drivers];
              }
              var supportedDrivers = this._getSupportedDrivers(drivers);
              function setDriverToConfig() {
                self2._config.driver = self2.driver();
              }
              function extendSelfWithDriver(driver) {
                self2._extend(driver);
                setDriverToConfig();
                self2._ready = self2._initStorage(self2._config);
                return self2._ready;
              }
              function initDriver(supportedDrivers2) {
                return function() {
                  var currentDriverIndex = 0;
                  function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers2.length) {
                      var driverName = supportedDrivers2[currentDriverIndex];
                      currentDriverIndex++;
                      self2._dbInfo = null;
                      self2._ready = null;
                      return self2.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }
                    setDriverToConfig();
                    var error = new Error("No available storage method found.");
                    self2._driverSet = Promise$1.reject(error);
                    return self2._driverSet;
                  }
                  return driverPromiseLoop();
                };
              }
              var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
                return Promise$1.resolve();
              }) : Promise$1.resolve();
              this._driverSet = oldDriverSetDone.then(function() {
                var driverName = supportedDrivers[0];
                self2._dbInfo = null;
                self2._ready = null;
                return self2.getDriver(driverName).then(function(driver) {
                  self2._driver = driver._driver;
                  setDriverToConfig();
                  self2._wrapLibraryMethodsWithReady();
                  self2._initDriver = initDriver(supportedDrivers);
                });
              })["catch"](function() {
                setDriverToConfig();
                var error = new Error("No available storage method found.");
                self2._driverSet = Promise$1.reject(error);
                return self2._driverSet;
              });
              executeTwoCallbacks(this._driverSet, callback, errorCallback);
              return this._driverSet;
            };
            LocalForage2.prototype.supports = function supports(driverName) {
              return !!DriverSupport[driverName];
            };
            LocalForage2.prototype._extend = function _extend(libraryMethodsAndProperties) {
              extend(this, libraryMethodsAndProperties);
            };
            LocalForage2.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
              var supportedDrivers = [];
              for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                  supportedDrivers.push(driverName);
                }
              }
              return supportedDrivers;
            };
            LocalForage2.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
              for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
              }
            };
            LocalForage2.prototype.createInstance = function createInstance(options) {
              return new LocalForage2(options);
            };
            return LocalForage2;
          }();
          var localforage_js = new LocalForage();
          module3.exports = localforage_js;
        }, { "3": 3 }] }, {}, [4])(4);
      });
    }
  });

  // ../../node_modules/cross-fetch/dist/browser-ponyfill.js
  var require_browser_ponyfill = __commonJS({
    "../../node_modules/cross-fetch/dist/browser-ponyfill.js"(exports, module) {
      var global2 = typeof self !== "undefined" ? self : exports;
      var __self__ = function() {
        function F() {
          this.fetch = false;
          this.DOMException = global2.DOMException;
        }
        F.prototype = global2;
        return new F();
      }();
      (function(self2) {
        var irrelevant = function(exports2) {
          var support = {
            searchParams: "URLSearchParams" in self2,
            iterable: "Symbol" in self2 && "iterator" in Symbol,
            blob: "FileReader" in self2 && "Blob" in self2 && function() {
              try {
                new Blob();
                return true;
              } catch (e) {
                return false;
              }
            }(),
            formData: "FormData" in self2,
            arrayBuffer: "ArrayBuffer" in self2
          };
          function isDataView(obj) {
            return obj && DataView.prototype.isPrototypeOf(obj);
          }
          if (support.arrayBuffer) {
            var viewClasses = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]"
            ];
            var isArrayBufferView = ArrayBuffer.isView || function(obj) {
              return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
            };
          }
          function normalizeName(name) {
            if (typeof name !== "string") {
              name = String(name);
            }
            if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
              throw new TypeError("Invalid character in header field name");
            }
            return name.toLowerCase();
          }
          function normalizeValue(value) {
            if (typeof value !== "string") {
              value = String(value);
            }
            return value;
          }
          function iteratorFor(items) {
            var iterator = {
              next: function() {
                var value = items.shift();
                return { done: value === void 0, value };
              }
            };
            if (support.iterable) {
              iterator[Symbol.iterator] = function() {
                return iterator;
              };
            }
            return iterator;
          }
          function Headers3(headers) {
            this.map = {};
            if (headers instanceof Headers3) {
              headers.forEach(function(value, name) {
                this.append(name, value);
              }, this);
            } else if (Array.isArray(headers)) {
              headers.forEach(function(header) {
                this.append(header[0], header[1]);
              }, this);
            } else if (headers) {
              Object.getOwnPropertyNames(headers).forEach(function(name) {
                this.append(name, headers[name]);
              }, this);
            }
          }
          Headers3.prototype.append = function(name, value) {
            name = normalizeName(name);
            value = normalizeValue(value);
            var oldValue = this.map[name];
            this.map[name] = oldValue ? oldValue + ", " + value : value;
          };
          Headers3.prototype["delete"] = function(name) {
            delete this.map[normalizeName(name)];
          };
          Headers3.prototype.get = function(name) {
            name = normalizeName(name);
            return this.has(name) ? this.map[name] : null;
          };
          Headers3.prototype.has = function(name) {
            return this.map.hasOwnProperty(normalizeName(name));
          };
          Headers3.prototype.set = function(name, value) {
            this.map[normalizeName(name)] = normalizeValue(value);
          };
          Headers3.prototype.forEach = function(callback, thisArg) {
            for (var name in this.map) {
              if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
              }
            }
          };
          Headers3.prototype.keys = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push(name);
            });
            return iteratorFor(items);
          };
          Headers3.prototype.values = function() {
            var items = [];
            this.forEach(function(value) {
              items.push(value);
            });
            return iteratorFor(items);
          };
          Headers3.prototype.entries = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push([name, value]);
            });
            return iteratorFor(items);
          };
          if (support.iterable) {
            Headers3.prototype[Symbol.iterator] = Headers3.prototype.entries;
          }
          function consumed(body) {
            if (body.bodyUsed) {
              return Promise.reject(new TypeError("Already read"));
            }
            body.bodyUsed = true;
          }
          function fileReaderReady(reader) {
            return new Promise(function(resolve, reject) {
              reader.onload = function() {
                resolve(reader.result);
              };
              reader.onerror = function() {
                reject(reader.error);
              };
            });
          }
          function readBlobAsArrayBuffer(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsArrayBuffer(blob);
            return promise;
          }
          function readBlobAsText(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsText(blob);
            return promise;
          }
          function readArrayBufferAsText(buf) {
            var view = new Uint8Array(buf);
            var chars = new Array(view.length);
            for (var i = 0; i < view.length; i++) {
              chars[i] = String.fromCharCode(view[i]);
            }
            return chars.join("");
          }
          function bufferClone(buf) {
            if (buf.slice) {
              return buf.slice(0);
            } else {
              var view = new Uint8Array(buf.byteLength);
              view.set(new Uint8Array(buf));
              return view.buffer;
            }
          }
          function Body() {
            this.bodyUsed = false;
            this._initBody = function(body) {
              this._bodyInit = body;
              if (!body) {
                this._bodyText = "";
              } else if (typeof body === "string") {
                this._bodyText = body;
              } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
              } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
              } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
              } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
              } else {
                this._bodyText = body = Object.prototype.toString.call(body);
              }
              if (!this.headers.get("content-type")) {
                if (typeof body === "string") {
                  this.headers.set("content-type", "text/plain;charset=UTF-8");
                } else if (this._bodyBlob && this._bodyBlob.type) {
                  this.headers.set("content-type", this._bodyBlob.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                  this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                }
              }
            };
            if (support.blob) {
              this.blob = function() {
                var rejected = consumed(this);
                if (rejected) {
                  return rejected;
                }
                if (this._bodyBlob) {
                  return Promise.resolve(this._bodyBlob);
                } else if (this._bodyArrayBuffer) {
                  return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                } else if (this._bodyFormData) {
                  throw new Error("could not read FormData body as blob");
                } else {
                  return Promise.resolve(new Blob([this._bodyText]));
                }
              };
              this.arrayBuffer = function() {
                if (this._bodyArrayBuffer) {
                  return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
                } else {
                  return this.blob().then(readBlobAsArrayBuffer);
                }
              };
            }
            this.text = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as text");
              } else {
                return Promise.resolve(this._bodyText);
              }
            };
            if (support.formData) {
              this.formData = function() {
                return this.text().then(decode);
              };
            }
            this.json = function() {
              return this.text().then(JSON.parse);
            };
            return this;
          }
          var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
          function normalizeMethod(method) {
            var upcased = method.toUpperCase();
            return methods.indexOf(upcased) > -1 ? upcased : method;
          }
          function Request(input, options) {
            options = options || {};
            var body = options.body;
            if (input instanceof Request) {
              if (input.bodyUsed) {
                throw new TypeError("Already read");
              }
              this.url = input.url;
              this.credentials = input.credentials;
              if (!options.headers) {
                this.headers = new Headers3(input.headers);
              }
              this.method = input.method;
              this.mode = input.mode;
              this.signal = input.signal;
              if (!body && input._bodyInit != null) {
                body = input._bodyInit;
                input.bodyUsed = true;
              }
            } else {
              this.url = String(input);
            }
            this.credentials = options.credentials || this.credentials || "same-origin";
            if (options.headers || !this.headers) {
              this.headers = new Headers3(options.headers);
            }
            this.method = normalizeMethod(options.method || this.method || "GET");
            this.mode = options.mode || this.mode || null;
            this.signal = options.signal || this.signal;
            this.referrer = null;
            if ((this.method === "GET" || this.method === "HEAD") && body) {
              throw new TypeError("Body not allowed for GET or HEAD requests");
            }
            this._initBody(body);
          }
          Request.prototype.clone = function() {
            return new Request(this, { body: this._bodyInit });
          };
          function decode(body) {
            var form = new FormData();
            body.trim().split("&").forEach(function(bytes) {
              if (bytes) {
                var split = bytes.split("=");
                var name = split.shift().replace(/\+/g, " ");
                var value = split.join("=").replace(/\+/g, " ");
                form.append(decodeURIComponent(name), decodeURIComponent(value));
              }
            });
            return form;
          }
          function parseHeaders(rawHeaders) {
            var headers = new Headers3();
            var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
            preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
              var parts = line.split(":");
              var key = parts.shift().trim();
              if (key) {
                var value = parts.join(":").trim();
                headers.append(key, value);
              }
            });
            return headers;
          }
          Body.call(Request.prototype);
          function Response(bodyInit, options) {
            if (!options) {
              options = {};
            }
            this.type = "default";
            this.status = options.status === void 0 ? 200 : options.status;
            this.ok = this.status >= 200 && this.status < 300;
            this.statusText = "statusText" in options ? options.statusText : "OK";
            this.headers = new Headers3(options.headers);
            this.url = options.url || "";
            this._initBody(bodyInit);
          }
          Body.call(Response.prototype);
          Response.prototype.clone = function() {
            return new Response(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new Headers3(this.headers),
              url: this.url
            });
          };
          Response.error = function() {
            var response = new Response(null, { status: 0, statusText: "" });
            response.type = "error";
            return response;
          };
          var redirectStatuses = [301, 302, 303, 307, 308];
          Response.redirect = function(url, status) {
            if (redirectStatuses.indexOf(status) === -1) {
              throw new RangeError("Invalid status code");
            }
            return new Response(null, { status, headers: { location: url } });
          };
          exports2.DOMException = self2.DOMException;
          try {
            new exports2.DOMException();
          } catch (err) {
            exports2.DOMException = function(message, name) {
              this.message = message;
              this.name = name;
              var error = Error(message);
              this.stack = error.stack;
            };
            exports2.DOMException.prototype = Object.create(Error.prototype);
            exports2.DOMException.prototype.constructor = exports2.DOMException;
          }
          function fetch2(input, init) {
            return new Promise(function(resolve, reject) {
              var request = new Request(input, init);
              if (request.signal && request.signal.aborted) {
                return reject(new exports2.DOMException("Aborted", "AbortError"));
              }
              var xhr = new XMLHttpRequest();
              function abortXhr() {
                xhr.abort();
              }
              xhr.onload = function() {
                var options = {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  headers: parseHeaders(xhr.getAllResponseHeaders() || "")
                };
                options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
                var body = "response" in xhr ? xhr.response : xhr.responseText;
                resolve(new Response(body, options));
              };
              xhr.onerror = function() {
                reject(new TypeError("Network request failed"));
              };
              xhr.ontimeout = function() {
                reject(new TypeError("Network request failed"));
              };
              xhr.onabort = function() {
                reject(new exports2.DOMException("Aborted", "AbortError"));
              };
              xhr.open(request.method, request.url, true);
              if (request.credentials === "include") {
                xhr.withCredentials = true;
              } else if (request.credentials === "omit") {
                xhr.withCredentials = false;
              }
              if ("responseType" in xhr && support.blob) {
                xhr.responseType = "blob";
              }
              request.headers.forEach(function(value, name) {
                xhr.setRequestHeader(name, value);
              });
              if (request.signal) {
                request.signal.addEventListener("abort", abortXhr);
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    request.signal.removeEventListener("abort", abortXhr);
                  }
                };
              }
              xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
            });
          }
          fetch2.polyfill = true;
          if (!self2.fetch) {
            self2.fetch = fetch2;
            self2.Headers = Headers3;
            self2.Request = Request;
            self2.Response = Response;
          }
          exports2.Headers = Headers3;
          exports2.Request = Request;
          exports2.Response = Response;
          exports2.fetch = fetch2;
          Object.defineProperty(exports2, "__esModule", { value: true });
          return exports2;
        }({});
      })(__self__);
      __self__.fetch.ponyfill = true;
      delete __self__.fetch.polyfill;
      var ctx = __self__;
      exports = ctx.fetch;
      exports.default = ctx.fetch;
      exports.fetch = ctx.fetch;
      exports.Headers = ctx.Headers;
      exports.Request = ctx.Request;
      exports.Response = ctx.Response;
      module.exports = exports;
    }
  });

  // ../notifi-frontend-client/lib/configuration/NotifiFrontendConfiguration.ts
  var checkIsConfigWithPublicKeyAndAddress = (config) => {
    return "accountAddress" in config;
  };
  var checkIsConfigWithDelegate = (config) => {
    return "delegatedAddress" in config;
  };
  var checkIsConfigWithOidc = (config) => {
    return config.walletBlockchain === "OFF_CHAIN";
  };
  var evmChains = [
    "ETHEREUM",
    "POLYGON",
    "ARBITRUM",
    "AVALANCHE",
    "BINANCE",
    "OPTIMISM",
    "THE_ROOT_NETWORK",
    "BASE",
    "BLAST",
    "CELO",
    "MANTLE",
    "LINEA",
    "SCROLL",
    "MANTA",
    "MONAD",
    "ZKSYNC",
    "BERACHAIN"
  ];
  var isEvmChain = (chain) => {
    return !!evmChains.find((c) => c === chain);
  };
  var envUrl = (env, endpointType) => {
    if (!env)
      env = "Production";
    let url = "";
    switch (env) {
      case "Development":
        url = "://api.dev.notifi.network/gql";
        break;
      case "Local":
        url = "://localhost:5001/gql";
        break;
      case "Production":
        url = "://api.notifi.network/gql";
        break;
      case "Staging":
        url = "://api.stg.notifi.network/gql";
    }
    return `${endpointType === "websocket" ? "wss" : "https"}${url}`;
  };

  // ../notifi-frontend-client/lib/utils/notNullOrEmpty.ts
  var notNullOrEmpty = (item) => {
    return item !== void 0 && item !== null;
  };

  // ../notifi-frontend-client/lib/utils/packFilterOptions.ts
  var packFilterOptions = (clientOptions) => {
    if (clientOptions === null) {
      return "{}";
    }
    return JSON.stringify(clientOptions);
  };

  // ../notifi-frontend-client/lib/utils/resolveRef.ts
  var createRefResolver = (validator) => {
    return (name, valueOrRef, inputs) => {
      if (valueOrRef.type === "value") {
        return valueOrRef.value;
      } else {
        if (valueOrRef.ref === null) {
          throw new Error(`Invalid configuration: Ref ${name} is null`);
        }
        const runtimeInput = inputs[valueOrRef.ref];
        if (validator(runtimeInput)) {
          return runtimeInput;
        } else {
          throw new Error(`Invalid value provided for ${name}: ${runtimeInput}`);
        }
      }
    };
  };
  var resolveStringRef = createRefResolver(
    (item) => {
      return typeof item === "string";
    }
  );
  var resolveNumberRef = createRefResolver(
    (item) => {
      return typeof item === "number" && !Number.isNaN(item);
    }
  );
  var resolveStringArrayRef = createRefResolver(
    (item) => {
      return Array.isArray(item) && item.every((element) => typeof element === "string");
    }
  );
  var resolveCheckRatioArrayRef = createRefResolver(
    (item) => {
      return Array.isArray(item) && item.every(
        (element) => typeof element === "object" && typeof element.type === "string" && typeof element.ratio === "number" && !Number.isNaN(element.ratio)
      );
    }
  );
  var resolveObjectArrayRef = createRefResolver(
    (item) => {
      return Array.isArray(item) && item.every((element) => typeof element === "object") && item.every((element) => {
        return "label" in element && typeof element.label === "string" && "value" in element && typeof element.value === "string";
      });
    }
  );

  // ../notifi-frontend-client/lib/utils/areIdsEqual.ts
  var areIdsEqual = (ids, items) => {
    const idSet = new Set(ids);
    return items.length === idSet.size && items.every(
      (it) => it !== void 0 && it.id !== void 0 && idSet.has(it.id)
    );
  };

  // ../notifi-frontend-client/lib/client/ensureSource.ts
  var ensureDirectPushSource = async (service, _eventType, _inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    const source = sources == null ? void 0 : sources.find(
      (it) => it !== void 0 && it.type === "DIRECT_PUSH"
    );
    if (source === void 0) {
      throw new Error("Failed to identify direct push source");
    }
    return source;
  };
  var ensureFusionSource = async (service, eventType, inputs) => {
    const address = resolveStringRef(
      eventType.name,
      eventType.sourceAddress,
      inputs
    );
    const eventTypeId = resolveStringRef(
      eventType.name,
      eventType.fusionEventId,
      inputs
    );
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    const existing = sources == null ? void 0 : sources.find(
      (it) => it !== void 0 && it.type === "FUSION_SOURCE" && it.blockchainAddress === address && it.fusionEventTypeId === eventTypeId
    );
    if (existing !== void 0) {
      return existing;
    }
    const createMutation = await service.createSource({
      type: "FUSION_SOURCE",
      blockchainAddress: address,
      fusionEventTypeId: eventTypeId
    });
    const source = createMutation.createSource;
    if (source === void 0) {
      throw new Error("Failed to create source");
    }
    return source;
  };
  var ensureBroadcastSource = async (service, eventType, inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    if (sources === void 0) {
      throw new Error("Failed to fetch sources");
    }
    const address = resolveStringRef(
      eventType.name,
      eventType.broadcastId,
      inputs
    );
    const existing = sources.find(
      (it) => (it == null ? void 0 : it.type) === "BROADCAST" && it.blockchainAddress === address
    );
    if (existing !== void 0) {
      return existing;
    }
    const createMutation = await service.createSource({
      type: "BROADCAST",
      blockchainAddress: address
    });
    const result = createMutation.createSource;
    if (result === void 0) {
      throw new Error("Failed to create source");
    }
    return result;
  };
  var ensureTradingPairSource = async (service, _eventType, _inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    const source = sources == null ? void 0 : sources.find((it) => (it == null ? void 0 : it.type) === "DIRECT_PUSH");
    if (source === void 0) {
      throw new Error("Failed to identify trading pair source (=directPush)");
    }
    return source;
  };
  var ensurePriceChangeSources = async (service, eventType, _inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    if (sources === void 0) {
      throw new Error("Failed to fetch sources");
    }
    const results = [];
    const sourcesToCreate = new Set(eventType.tokenIds);
    sources.forEach((existing) => {
      if ((existing == null ? void 0 : existing.type) === "COIN_PRICE_CHANGES") {
        sourcesToCreate.delete(existing.blockchainAddress);
        results.push(existing);
      }
    });
    if (sourcesToCreate.size > 0) {
      let createSourcePromise = Promise.resolve();
      sourcesToCreate.forEach((tokenId) => {
        createSourcePromise = createSourcePromise.then(async () => {
          const result = await service.createSource({
            type: "COIN_PRICE_CHANGES",
            blockchainAddress: tokenId
          });
          const source = result.createSource;
          if (source !== void 0) {
            results.push(source);
          }
        });
      });
      await createSourcePromise;
    }
    return results;
  };
  var ensureWalletBalanceSources = async (service, _eventType, _inputs) => {
    const connectedWalletsQuery = await service.getConnectedWallets({});
    const connectedWallets = connectedWalletsQuery.connectedWallet;
    if (!connectedWallets) {
      throw new Error("Failed to fetch connected wallets");
    }
    const connectedWalletSources = connectedWallets.map((it) => {
      var _a;
      const sourceType = ((wallet) => {
        switch (wallet) {
          case "ACALA":
            return "ACALA_WALLET";
          case "APTOS":
            return "APTOS_WALLET";
          case "ARBITRUM":
            return "ARBITRUM_WALLET";
          case "AVALANCHE":
            return "AVALANCHE_WALLET";
          case "BINANCE":
            return "BINANCE_WALLET";
          case "ETHEREUM":
            return "ETHEREUM_WALLET";
          case "THE_ROOT_NETWORK":
            return "THE_ROOT_NETWORK";
          case "BASE":
            return "ETHEREUM_WALLET";
          case "BLAST":
            return "BLAST_WALLET";
          case "CELO":
            return "CELO_WALLET";
          case "MANTLE":
            return "MANTLE_WALLET";
          case "LINEA":
            return "LINEA_WALLET";
          case "MONAD":
            return "MONAD_WALLET";
          case "MANTA":
            return "MANTA_WALLET";
          case "SCROLL":
            return "SCROLL_WALLET";
          case "POLYGON":
            return "POLYGON_WALLET";
          case "SOLANA":
            return "SOLANA_WALLET";
          case "OPTIMISM":
            return "OPTIMISM_WALLET";
          case "SUI":
            return "SUI_WALLET";
          case "ZKSYNC":
            return "ZKSYNC_WALLET";
          case "ARCHWAY":
            return "ARCHWAY_WALLET";
          case "ELYS":
            return "ELYS_WALLET";
          case "AXELAR":
            return "AXELAR_WALLET";
          case "NEUTRON":
            return "NEUTRON_WALLET";
          case "BERACHAIN":
            return "BERACHAIN_WALLET";
          case "XION":
            return "XION_WALLET";
          case "AGORIC":
            return "AGORIC_WALLET";
          case "ORAI":
            return "ORAI_WALLET";
          case "KAVA":
            return "KAVA_WALLET";
          case "CELESTIA":
            return "CELESTIA_WALLET";
          case "COSMOS":
            return "COSMOS_WALLET";
          case "DYMENSION":
            return "DYMENSION_WALLET";
          case "PERSISTENCE":
            return "PERSISTENCE_WALLET";
          case "DYDX":
            return "DYDX_WALLET";
          default:
            throw new Error("Unsupported walletType");
        }
      })(it == null ? void 0 : it.walletBlockchain);
      const sourceAddress = (_a = it == null ? void 0 : it.address) != null ? _a : "";
      return {
        name: `${sourceType} ${sourceAddress}`,
        blockchainAddress: sourceAddress,
        type: sourceType
      };
    });
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    if (sources === void 0) {
      throw new Error("Failed to fetch sources");
    }
    const promises = connectedWalletSources.map(async (connectedWalletSource) => {
      const found = sources.find(
        (source) => (source == null ? void 0 : source.name) === connectedWalletSource.name
      );
      if (found) {
        return found;
      }
      const { createSource: newSource } = await service.createSource(
        connectedWalletSource
      );
      if (!newSource) {
        throw new Error(`Failed to create ${connectedWalletSource.type} source`);
      }
      return newSource;
    });
    const ensuredSources = await Promise.all(promises);
    return ensuredSources;
  };
  var normalizeSourceAddress = (sourceType, blockchainAddress) => {
    switch (sourceType) {
      case "ETHEREUM_WALLET":
      case "POLYGON_WALLET":
      case "ARBITRUM_WALLET":
      case "BINANCE_WALLET":
      case "OPTIMISM_WALLET":
      case "AVALANCHE_WALLET":
      case "ZKSYNC_WALLET":
      case "BENQI":
      case "DELTA_PRIME":
      case "DELTA_PRIME_LENDING_RATES":
      case "APTOS_WALLET":
        return normalizeHexString(blockchainAddress);
      default:
        return blockchainAddress;
    }
  };
  var normalizeHexString = (input) => {
    let result = input;
    if (input !== "") {
      result = input.toLowerCase();
      if (!result.startsWith("0x")) {
        result = "0x" + result;
      }
    }
    return result;
  };
  var ensureCustomSources = async (service, eventType, inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    if (sources === void 0) {
      throw new Error("Failed to fetch sources");
    }
    const address = resolveStringRef(
      eventType.name,
      eventType.sourceAddress,
      inputs
    );
    const sourceAddress = normalizeSourceAddress(eventType.sourceType, address);
    const existing = sources.find(
      (it) => (it == null ? void 0 : it.type) === eventType.sourceType && it.blockchainAddress === sourceAddress
    );
    if (existing !== void 0) {
      return existing;
    }
    const createMutation = await service.createSource({
      type: eventType.sourceType,
      blockchainAddress: sourceAddress
    });
    const result = createMutation.createSource;
    if (result === void 0) {
      throw new Error("Failed to create source");
    }
    return result;
  };
  var ensureXMTPSources = async (service, eventType, inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    if (sources === void 0) {
      throw new Error("Failed to fetch sources");
    }
    const XMTPTopics = resolveStringArrayRef(
      eventType.name,
      eventType.XMTPTopics,
      inputs
    );
    const XMTPTopicSources = XMTPTopics.map((topic) => ({
      name: topic,
      blockchainAddress: topic,
      type: "XMTP"
    }));
    const promises = XMTPTopicSources.map(async (source) => {
      const found = sources.find(
        (it) => (it == null ? void 0 : it.type) === "XMTP" && it.name === source.name
      );
      if (found) {
        return found;
      }
      const { createSource: newSource } = await service.createSource(source);
      if (!newSource) {
        throw new Error("Failed to create XMTP source");
      }
      return newSource;
    });
    const ensuredSources = await Promise.all(promises);
    return ensuredSources;
  };
  var ensureHealthCheckSources = async (service, _eventType, _inputs) => {
    const sourcesQuery = await service.getSources({});
    const sources = sourcesQuery.source;
    const source = sources == null ? void 0 : sources.find((it) => (it == null ? void 0 : it.type) === "DIRECT_PUSH");
    if (source === void 0) {
      throw new Error("Failed to identify Health Check source (=directPush)");
    }
    return source;
  };
  var ensureSources = async (service, eventType, inputs) => {
    switch (eventType.type) {
      case "directPush": {
        const source = await ensureDirectPushSource(service, eventType, inputs);
        return [source];
      }
      case "broadcast": {
        const source = await ensureBroadcastSource(service, eventType, inputs);
        return [source];
      }
      case "tradingPair": {
        const source = await ensureTradingPairSource(service, eventType, inputs);
        return [source];
      }
      case "priceChange": {
        const sources = await ensurePriceChangeSources(
          service,
          eventType,
          inputs
        );
        return sources;
      }
      case "walletBalance": {
        const sources = await ensureWalletBalanceSources(
          service,
          eventType,
          inputs
        );
        return sources;
      }
      case "custom": {
        const source = await ensureCustomSources(service, eventType, inputs);
        return [source];
      }
      case "XMTP": {
        const sources = await ensureXMTPSources(service, eventType, inputs);
        return sources;
      }
      case "healthCheck": {
        const source = await ensureHealthCheckSources(service, eventType, inputs);
        return [source];
      }
      case "fusionToggle":
      case "fusion": {
        const source = await ensureFusionSource(service, eventType, inputs);
        return [source];
      }
      case "label": {
        throw new Error("Unsupported event type");
      }
      default:
        throw new Error("Unsupported event type");
    }
  };
  var ensureSourceGroup = async (service, name, sourceIds) => {
    var _a, _b;
    const sourceGroupsQuery = await service.getSourceGroups({});
    const existing = (_a = sourceGroupsQuery.sourceGroup) == null ? void 0 : _a.find(
      (it) => it !== void 0 && it.name === name
    );
    if (existing === void 0) {
      const createMutation = await service.createSourceGroup({
        name,
        sourceIds
      });
      const createResult = createMutation.createSourceGroup;
      if (createResult === void 0) {
        throw new Error("Failed to create source group");
      }
      return createResult;
    }
    if (areIdsEqual(sourceIds, (_b = existing.sources) != null ? _b : [])) {
      return existing;
    }
    const updateMutation = await service.updateSourceGroup({
      id: existing.id,
      name,
      sourceIds
    });
    const updateResult = updateMutation.updateSourceGroup;
    if (updateResult === void 0) {
      throw new Error("Failed to update source group");
    }
    return updateResult;
  };
  var getDirectPushFilter = (source, eventType, inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "DIRECT_TENANT_MESSAGES"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter");
    }
    const type = resolveStringRef(eventType.name, eventType.directPushId, inputs);
    const filterOptions = {
      directMessageType: type
    };
    return {
      filter,
      filterOptions
    };
  };
  var getBroadcastFilter = (source, _eventType, _inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "BROADCAST_MESSAGES"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter");
    }
    return {
      filter,
      filterOptions: {}
    };
  };
  var tradingPairInputsValidator = (inputs) => {
    if (typeof inputs.direction !== "string" || typeof inputs.price !== "number" || typeof inputs.pair !== "string") {
      return false;
    }
    return true;
  };
  var getTradingPairFilter = (source, eventType, inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "DIRECT_TENANT_MESSAGES"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve TradingPair filter (=directMessage)");
    }
    const tradingPairs = resolveStringArrayRef(
      eventType.name,
      eventType.tradingPairs,
      inputs
    );
    if (tradingPairs.length === 0)
      throw new Error("No trading pairs found");
    const tradingPair = tradingPairInputsValidator(inputs) ? inputs.pair : tradingPairs[0];
    const value = tradingPairInputsValidator(inputs) ? inputs.price.toFixed(8) : "1.00000000";
    return {
      filter,
      filterOptions: {
        tradingPair,
        values: {
          and: [
            {
              key: "spotPrice",
              op: inputs.direction === "above" ? "gt" : "lt",
              value
            }
          ]
        }
      }
    };
  };
  var getPriceChangeFilter = (sources, _eventType, _inputs) => {
    const filter = sources.flatMap((it) => {
      var _a;
      return (_a = it.applicableFilters) != null ? _a : [];
    }).find((it) => (it == null ? void 0 : it.filterType) === "COIN_PRICE_CHANGE_EVENTS");
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter");
    }
    return {
      filter,
      filterOptions: {}
    };
  };
  var getWalletBalanceSourceFilter = (source, _eventType, _inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "BALANCE"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter: wallet balance");
    }
    return {
      filter,
      filterOptions: {}
    };
  };
  var getFusionSourceFilter = (source, eventType, inputs) => {
    var _a, _b;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "FUSION_SOURCE"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve fusion source filter");
    }
    let filterOptions = {};
    if (eventType.selectedUIType === "TOGGLE" || eventType.selectedUIType === "MULTI_THRESHOLD") {
      if (eventType.alertFrequency !== void 0) {
        filterOptions = {
          alertFrequency: eventType.alertFrequency
        };
      }
    } else if (eventType.selectedUIType === "HEALTH_CHECK") {
      const healthRatioKey = `${eventType.name}__healthRatio`;
      if (!inputs[healthRatioKey]) {
        inputs[`${eventType.name}__healthRatio`] = eventType.checkRatios[1].ratio;
      }
      const healthRatio = resolveNumberRef(
        healthRatioKey,
        { type: "ref", ref: healthRatioKey },
        inputs
      );
      const thresholdDirectionKey = `${eventType.name}__healthThresholdDirection`;
      if (!inputs[thresholdDirectionKey]) {
        inputs[thresholdDirectionKey] = eventType.checkRatios[0].type === "above" ? "above" : "below";
      }
      const thresholdDirection = (_b = resolveStringRef(
        thresholdDirectionKey,
        { type: "ref", ref: thresholdDirectionKey },
        inputs
      )) != null ? _b : eventType.checkRatios[0].ratio;
      if (!healthRatio || !thresholdDirection) {
        throw new Error("Failed to retrieve health ratio or direction");
      }
      filterOptions = {
        alertFrequency: eventType.alertFrequency,
        threshold: eventType.numberType === "percentage" ? healthRatio / 100 : healthRatio,
        thresholdDirection: thresholdDirection === "above" ? "above" : "below"
      };
    }
    return {
      filter,
      filterOptions
    };
  };
  var getCustomFilterOptions = (eventType, inputs) => {
    var _a, _b;
    switch (eventType.selectedUIType) {
      case "TOGGLE":
        return eventType.filterOptions;
      case "HEALTH_CHECK": {
        const healthRatioKey = `${eventType.name}__healthRatio`;
        const healthRatio = (_a = resolveNumberRef(
          healthRatioKey,
          { type: "ref", ref: healthRatioKey },
          inputs
        )) != null ? _a : eventType.checkRatios[0].ratio;
        const thresholdDirectionKey = `${eventType.name}__healthThresholdDirection`;
        const thresholdDirection = (_b = resolveStringRef(
          thresholdDirectionKey,
          { type: "ref", ref: thresholdDirectionKey },
          inputs
        )) != null ? _b : eventType.checkRatios[0].ratio;
        if (!healthRatio || !thresholdDirection) {
          throw new Error("Failed to retrieve health ratio or direction");
        }
        return {
          alertFrequency: eventType.alertFrequency,
          threshold: eventType.numberType === "percentage" ? healthRatio / 100 : healthRatio,
          thresholdDirection: thresholdDirection === "above" ? "above" : "below"
        };
      }
    }
  };
  var getCustomFilter = (source, eventType, inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === eventType.filterType
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter");
    }
    return {
      filter,
      filterOptions: getCustomFilterOptions(eventType, inputs)
    };
  };
  var getXMTPFilter = (source, _eventType, _inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "WEB3_CHAT_MESSAGES"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter: XMTP");
    }
    return {
      filter,
      filterOptions: {}
    };
  };
  var checkInputsIsWithIndex = (inputs) => {
    if ("index" in inputs) {
      return true;
    }
    return false;
  };
  var getHealthCheckFilter = (source, eventType, inputs) => {
    var _a;
    const filter = (_a = source.applicableFilters) == null ? void 0 : _a.find(
      (it) => (it == null ? void 0 : it.filterType) === "VALUE_THRESHOLD"
    );
    if (filter === void 0) {
      throw new Error("Failed to retrieve filter: healthCheck");
    }
    const checkRatios = resolveCheckRatioArrayRef(
      eventType.name,
      eventType.checkRatios,
      inputs
    );
    let threshold = checkRatios[0].ratio;
    let thresholdDirection = checkRatios[0].type;
    const checkInputsIsWithCustomPercentage = (inputs2) => {
      if ("customPercentage" in inputs2 && "thresholdDirection" in inputs2) {
        return true;
      }
      return false;
    };
    if (checkInputsIsWithIndex(inputs)) {
      threshold = checkRatios[inputs.index].ratio;
      thresholdDirection = checkRatios[inputs.index].type;
    } else if (checkInputsIsWithCustomPercentage(inputs)) {
      threshold = inputs.customPercentage;
      thresholdDirection = inputs.thresholdDirection;
    }
    return {
      filter,
      filterOptions: {
        alertFrequency: eventType.alertFrequency,
        threshold,
        thresholdDirection
      }
    };
  };
  var ensureSourceAndFilters = async (service, eventType, inputs) => {
    const sources = await ensureSources(service, eventType, inputs);
    const sourceGroup = await ensureSourceGroup(
      service,
      eventType.name,
      sources.map((it) => it.id)
    );
    switch (eventType.type) {
      case "directPush": {
        const { filter, filterOptions } = getDirectPushFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "broadcast": {
        const { filter, filterOptions } = getBroadcastFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "tradingPair": {
        if (!tradingPairInputsValidator(inputs)) {
          throw new Error("Invalid tradingPair inputs");
        }
        const { filter, filterOptions } = getTradingPairFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "priceChange": {
        const { filter, filterOptions } = getPriceChangeFilter(
          sources,
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "custom": {
        const { filter, filterOptions } = getCustomFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "XMTP": {
        const { filter, filterOptions } = getXMTPFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "healthCheck": {
        const { filter, filterOptions } = getHealthCheckFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "label": {
        throw new Error("Unsupported event type");
      }
      case "walletBalance": {
        const { filter, filterOptions } = getWalletBalanceSourceFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      case "fusionToggle":
      case "fusion": {
        const { filter, filterOptions } = getFusionSourceFilter(
          sources[0],
          eventType,
          inputs
        );
        return {
          sourceGroup,
          filter,
          filterOptions
        };
      }
      default:
        throw new Error("Unsupported event type");
    }
  };

  // ../notifi-frontend-client/lib/client/ensureTarget.ts
  var ensureTarget = (create, fetch2, identify, valueTransform) => {
    return async (service, value) => {
      if (value === void 0) {
        return void 0;
      }
      const existing = await fetch2(service);
      const transformedValue = valueTransform !== void 0 ? valueTransform(value) : value;
      const found = existing == null ? void 0 : existing.find((it) => identify(it) === transformedValue);
      if (found !== void 0) {
        return found.id;
      }
      const created = await create(service, transformedValue);
      return created.id;
    };
  };
  var ensureEmail = ensureTarget(
    async (service, value) => {
      const mutation = await service.createEmailTarget({
        name: value.toLowerCase(),
        value: value.toLowerCase()
      });
      const result = mutation.createEmailTarget;
      if (result === void 0) {
        throw new Error("Failed to create email target");
      }
      return result;
    },
    async (service) => {
      const query = await service.getEmailTargets({});
      return query.emailTarget;
    },
    (arg) => {
      var _a;
      return (_a = arg == null ? void 0 : arg.emailAddress) == null ? void 0 : _a.toLowerCase();
    },
    (value) => value.toLowerCase()
  );
  var ensureSms = ensureTarget(
    async (service, value) => {
      const mutation = await service.createSmsTarget({
        name: value,
        value
      });
      const result = mutation.createSmsTarget;
      if (result === void 0) {
        throw new Error("Failed to create sms target");
      }
      return result;
    },
    async (service) => {
      const query = await service.getSmsTargets({});
      return query.smsTarget;
    },
    (arg) => arg == null ? void 0 : arg.phoneNumber
  );
  var ensureTelegram = ensureTarget(
    async (service, value) => {
      const mutation = await service.createTelegramTarget({
        name: value.toLowerCase(),
        value: value.toLowerCase()
      });
      const result = mutation.createTelegramTarget;
      if (result === void 0) {
        throw new Error("Failed to create telegramTarget");
      }
      return result;
    },
    async (service) => {
      const query = await service.getTelegramTargets({});
      return query.telegramTarget;
    },
    (arg) => {
      var _a;
      return (_a = arg == null ? void 0 : arg.telegramId) == null ? void 0 : _a.toLowerCase();
    },
    (value) => value.toLowerCase()
  );
  var ensureDiscord = ensureTarget(
    async (service, value) => {
      const mutation = await service.createDiscordTarget({
        name: value,
        value
      });
      const result = mutation.createDiscordTarget;
      if (result === void 0) {
        throw new Error("Failed to create discordTarget");
      }
      return result;
    },
    async (service) => {
      const query = await service.getDiscordTargets({});
      return query.discordTarget;
    },
    (arg) => arg == null ? void 0 : arg.name,
    () => "Default"
  );
  var ensureSlack = ensureTarget(
    async (service, value) => {
      const mutation = await service.createSlackChannelTarget({
        name: value,
        value
      });
      const result = mutation.createSlackChannelTarget.slackChannelTarget;
      if (result === void 0) {
        throw new Error("Failed to create slackTarget");
      }
      return result;
    },
    async (service) => {
      var _a;
      const query = await service.getSlackChannelTargets({});
      return (_a = query.slackChannelTargets) == null ? void 0 : _a.nodes;
    },
    (arg) => arg == null ? void 0 : arg.name,
    () => "Default"
  );
  var ensureWeb3 = ensureTarget(
    async (service, value) => {
      const mutation = await service.createWeb3Target({
        name: value,
        accountId: "",
        walletBlockchain: "OFF_CHAIN",
        web3TargetProtocol: "XMTP"
      });
      const result = mutation.createWeb3Target;
      if (result === void 0 || result.id === void 0) {
        throw new Error("Failed to create web3Target");
      }
      return result;
    },
    async (service) => {
      var _a;
      const query = await service.getWeb3Targets({});
      return (_a = query.web3Targets) == null ? void 0 : _a.nodes;
    },
    (arg) => arg == null ? void 0 : arg.name,
    () => "Default"
  );
  var ensureWebhook = async (service, params) => {
    if (params === void 0) {
      return void 0;
    }
    const query = await service.getWebhookTargets({});
    const existing = query.webhookTarget;
    const found = existing == null ? void 0 : existing.find(
      (it) => (it == null ? void 0 : it.url.toLowerCase()) === params.url.toLowerCase() && (it == null ? void 0 : it.format) === params.format
    );
    if (found !== void 0) {
      return found.id;
    }
    const mutation = await service.createWebhookTarget(__spreadProps(__spreadValues({}, params), {
      name: params.url.toLowerCase(),
      url: params.url.toLowerCase()
    }));
    const created = mutation.createWebhookTarget;
    if (created === void 0) {
      throw new Error("Failed to create webhook target");
    }
    return created.id;
  };

  // ../notifi-frontend-client/lib/storage/InMemoryStorageDriver.ts
  var getEnvPrefix = (env) => {
    if (!env)
      env = "Production";
    switch (env) {
      case "Production":
        return "notifi-jwt";
      case "Development":
        return "notifi-jwt:dev";
      case "Staging":
        return "notifi-jwt:stg";
      case "Local":
        return "notifi-jwt:local";
    }
  };
  var createInMemoryStorageDriver = (config) => {
    let keyPrefix = `${getEnvPrefix(config.env || "Production")}:${config.tenantId}:${config.walletBlockchain}`;
    if (checkIsConfigWithOidc(config)) {
      keyPrefix += `:${config.userAccount}`;
    } else if (checkIsConfigWithPublicKeyAndAddress(config)) {
      keyPrefix += `:${config.accountAddress}:${config.authenticationKey}`;
    } else if (checkIsConfigWithDelegate(config)) {
      keyPrefix += `:${config.delegatorAddress}`;
    } else {
      keyPrefix += `:${config.walletPublicKey}`;
    }
    const storageBackend = {};
    const storageDriver = {
      get: (key) => {
        const newKey = `${keyPrefix}:${key}`;
        let result = null;
        if (newKey in storageBackend) {
          const json = storageBackend[newKey];
          result = JSON.parse(json);
        }
        return Promise.resolve(result);
      },
      set: (key, newValue) => {
        const newKey = `${keyPrefix}:${key}`;
        if (newValue === null) {
          delete storageBackend[newKey];
        } else {
          storageBackend[newKey] = JSON.stringify(newValue);
        }
        return Promise.resolve();
      },
      has: (key) => {
        const newKey = `${keyPrefix}:${key}`;
        return Promise.resolve(newKey in storageBackend);
      }
    };
    return storageDriver;
  };

  // ../notifi-frontend-client/lib/storage/NotifiFrontendStorage.ts
  var KEY_AUTHORIZATION = "authorization";
  var KEY_ROLES = "roles";
  var NotifiFrontendStorage = class {
    constructor(_driver) {
      this._driver = _driver;
    }
    getAuthorization() {
      return this._driver.get(KEY_AUTHORIZATION);
    }
    setAuthorization(newValue) {
      return this._driver.set(KEY_AUTHORIZATION, newValue);
    }
    hasAuthorization() {
      return this._driver.has(KEY_AUTHORIZATION);
    }
    getRoles() {
      return this._driver.get(KEY_ROLES);
    }
    setRoles(newValue) {
      return this._driver.set(KEY_ROLES, newValue);
    }
    hasRoles() {
      return this._driver.has(KEY_ROLES);
    }
  };

  // ../notifi-frontend-client/lib/storage/LocalForageStorageDriver.ts
  var import_localforage = __toESM(require_localforage());
  import_localforage.default.config({
    name: "notifi"
  });
  var getEnvPrefix2 = (env) => {
    if (!env)
      env = "Production";
    switch (env) {
      case "Production":
        return "notifi-jwt";
      case "Development":
        return "notifi-jwt:dev";
      case "Staging":
        return "notifi-jwt:stg";
      case "Local":
        return "notifi-jwt:local";
    }
  };
  var createLocalForageStorageDriver = (config) => {
    let keyPrefix = `${getEnvPrefix2(config.env)}:${config.tenantId}:${config.walletBlockchain}`;
    if (checkIsConfigWithOidc(config)) {
      keyPrefix += `:${config.userAccount}`;
    } else if (checkIsConfigWithPublicKeyAndAddress(config)) {
      keyPrefix += `:${config.accountAddress}:${config.authenticationKey}`;
    } else if (checkIsConfigWithDelegate(config)) {
      keyPrefix += `:${config.delegatorAddress}`;
    } else {
      keyPrefix += `:${config.walletPublicKey}`;
    }
    const storageDriver = {
      get: async (key) => {
        const item = await import_localforage.default.getItem(`${keyPrefix}:${key}`);
        return item;
      },
      set: async (key, newValue) => {
        await import_localforage.default.setItem(`${keyPrefix}:${key}`, newValue);
      },
      has: async (key) => {
        const keys = await import_localforage.default.keys();
        return keys.indexOf(`${keyPrefix}:${key}`) >= 0;
      }
    };
    return storageDriver;
  };

  // ../notifi-frontend-client/lib/client/NotifiFrontendClient.ts
  var SIGNING_MESSAGE = `Sign in with Notifi 

    No password needed or gas is needed. 

    Clicking \u201CApprove\u201D only means you have proved this wallet is owned by you! 

    This request will not trigger any transaction or cost any gas fees. 

    Use of our website and service is subject to our terms of service and privacy policy. 
 
 'Nonce:' `;
  var NotifiFrontendClient = class {
    constructor(_configuration, _service, _storage) {
      this._configuration = _configuration;
      this._service = _service;
      this._storage = _storage;
      this._clientRandomUuid = null;
      this._userState = null;
    }
    get userState() {
      return this._userState;
    }
    async initialize() {
      const [storedAuthorization, roles] = await Promise.all([
        this._storage.getAuthorization(),
        this._storage.getRoles()
      ]);
      let authorization = storedAuthorization;
      if (authorization === null) {
        this._service.setJwt(void 0);
        const logOutStatus = {
          status: "loggedOut"
        };
        this._userState = logOutStatus;
        return logOutStatus;
      }
      const expiryDate = new Date(authorization.expiry);
      const now = /* @__PURE__ */ new Date();
      if (expiryDate <= now) {
        this._service.setJwt(void 0);
        const expiredStatus = {
          status: "expired",
          authorization
        };
        this._userState = expiredStatus;
        return expiredStatus;
      }
      const refreshTime = /* @__PURE__ */ new Date();
      refreshTime.setDate(now.getDate() + 7);
      if (expiryDate < refreshTime) {
        try {
          const refreshMutation = await this._service.refreshAuthorization({});
          const newAuthorization = refreshMutation.refreshAuthorization;
          if (newAuthorization !== void 0) {
            this._storage.setAuthorization(newAuthorization);
            authorization = newAuthorization;
          }
        } catch (e) {
          await this.logOut();
          console.log("Failed to refresh Notifi token:", e);
        }
      }
      this._service.setJwt(authorization.token);
      const userState = {
        status: "authenticated",
        authorization,
        roles: roles != null ? roles : []
      };
      this._userState = userState;
      return userState;
    }
    async logOut() {
      await Promise.all([
        this._storage.setAuthorization(null),
        this._storage.setRoles(null),
        this._service.logOut()
      ]);
      return {
        status: "loggedOut"
      };
    }
    async logInWithWeb3(signMessageParams) {
      let user = void 0;
      if (this._configuration.walletBlockchain !== "XION" || signMessageParams.walletBlockchain !== "XION") {
        throw new Error("Wallet blockchain must be XION for loginWithWeb3");
      }
      if (checkIsConfigWithDelegate(this._configuration)) {
        const { delegatedAddress, delegatedPublicKey, delegatorAddress } = this._configuration;
        const { nonce } = await this.beginLogInWithWeb3({
          authAddress: delegatorAddress,
          authType: "COSMOS_AUTHZ_GRANT"
        });
        const message = `${SIGNING_MESSAGE}${nonce}}`;
        const params = {
          walletBlockchain: "XION",
          message,
          signMessage: signMessageParams.signMessage
        };
        const signature = await this._authenticate({
          signMessageParams: params,
          timestamp: Math.round(Date.now() / 1e3)
        });
        if (typeof signature !== "string")
          throw new Error(
            "logInWith Web3 - WithDelegate : Invalid signature - expected string"
          );
        const { completeLogInWithWeb3 } = await this.completeLogInWithWeb3({
          nonce,
          signature,
          signedMessage: message,
          signingAddress: delegatedAddress,
          signingPubkey: delegatedPublicKey
        });
        user = completeLogInWithWeb3.user;
      } else if (checkIsConfigWithPublicKeyAndAddress(this._configuration)) {
        const { authenticationKey, accountAddress } = this._configuration;
        const { nonce } = await this.beginLogInWithWeb3({
          authAddress: accountAddress,
          authType: "COSMOS_ADR36"
        });
        const message = `${SIGNING_MESSAGE}${nonce}}`;
        const params = {
          walletBlockchain: "XION",
          message,
          signMessage: signMessageParams.signMessage
        };
        const signature = await this._authenticate({
          signMessageParams: params,
          timestamp: Math.round(Date.now() / 1e3)
        });
        if (typeof signature !== "string")
          throw new Error(
            "logInWith Web3 - PublicKeyAndAddress : Invalid signature - expected string"
          );
        const { completeLogInWithWeb3 } = await this.completeLogInWithWeb3({
          nonce,
          signature,
          signedMessage: message,
          signingAddress: accountAddress,
          signingPubkey: authenticationKey
        });
        user = completeLogInWithWeb3.user;
      }
      if (user === void 0) {
        return Promise.reject("Failed to login");
      }
      await this._handleLogInResult(user);
      return user;
    }
    async logIn(signMessageParams) {
      const timestamp = Math.round(Date.now() / 1e3);
      const { tenantId, walletBlockchain } = this._configuration;
      const signature = await this._authenticate({
        signMessageParams,
        timestamp
      });
      if (walletBlockchain === "XION" && signMessageParams.walletBlockchain === "XION") {
        return this.logInWithWeb3(signMessageParams);
      }
      let loginResult = void 0;
      switch (walletBlockchain) {
        case "BLAST":
        case "BERACHAIN":
        case "CELO":
        case "MANTLE":
        case "LINEA":
        case "SCROLL":
        case "MANTA":
        case "MONAD":
        case "BASE":
        case "THE_ROOT_NETWORK":
        case "ETHEREUM":
        case "POLYGON":
        case "ARBITRUM":
        case "AVALANCHE":
        case "BINANCE":
        case "OPTIMISM":
        case "ZKSYNC":
        case "EVMOS":
        case "SOLANA": {
          if (typeof signature !== "string")
            throw new Error(
              `logIn - Invalid signature - expected string, but got ${signature}`
            );
          const result = await this._service.logInFromDapp({
            walletBlockchain,
            walletPublicKey: this._configuration.walletPublicKey,
            dappAddress: tenantId,
            timestamp,
            signature
          });
          loginResult = result.logInFromDapp;
          break;
        }
        case "SUI":
        case "ACALA":
        case "NEAR":
        case "INJECTIVE":
        case "OSMOSIS":
        case "ELYS":
        case "ARCHWAY":
        case "AXELAR":
        case "AGORIC":
        case "CELESTIA":
        case "COSMOS":
        case "DYMENSION":
        case "PERSISTENCE":
        case "DYDX":
        case "ORAI":
        case "KAVA":
        case "NEUTRON":
        case "NIBIRU":
        case "APTOS": {
          if (typeof signature !== "string")
            throw new Error(
              `logIn - Invalid signature - expected string, but got ${signature}`
            );
          const result = await this._service.logInFromDapp({
            walletBlockchain,
            walletPublicKey: this._configuration.authenticationKey,
            accountId: this._configuration.accountAddress,
            dappAddress: tenantId,
            timestamp,
            signature
          });
          loginResult = result.logInFromDapp;
          break;
        }
        case "OFF_CHAIN": {
          if (typeof signature === "string")
            throw new Error(
              `logIn - Invalid signature - expected OidcCredentials, but got string: ${signature}`
            );
          if (!("oidcProvider" in signature))
            throw new Error(
              `logIn - Invalid signature - expected OidcCredentials, but got invalid object ${signature}`
            );
          const { oidcProvider, jwt } = signature;
          const result = await this._service.logInByOidc({
            dappId: tenantId,
            oidcProvider,
            idToken: jwt
          });
          loginResult = result.logInByOidc.user;
        }
      }
      if (loginResult === void 0) {
        return Promise.reject("Failed to login");
      }
      await this._handleLogInResult(loginResult);
      return loginResult;
    }
    async _authenticate({
      signMessageParams,
      timestamp
    }) {
      if (this._configuration.walletBlockchain !== signMessageParams.walletBlockchain) {
        throw new Error(
          "Sign message params and configuration must have the same blockchain"
        );
      }
      switch (signMessageParams.walletBlockchain) {
        case "ETHEREUM":
        case "BERACHAIN":
        case "POLYGON":
        case "ARBITRUM":
        case "AVALANCHE":
        case "BINANCE":
        case "BASE":
        case "BLAST":
        case "CELO":
        case "MANTLE":
        case "LINEA":
        case "SCROLL":
        case "MANTA":
        case "MONAD":
        case "EVMOS":
        case "THE_ROOT_NETWORK":
        case "OPTIMISM": {
          const { walletPublicKey, tenantId } = this._configuration;
          const messageBuffer = new TextEncoder().encode(
            `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`
          );
          const signedBuffer = await signMessageParams.signMessage(messageBuffer);
          const signature = normalizeHexString(
            Buffer.from(signedBuffer).toString("hex")
          );
          return signature;
        }
        case "OSMOSIS":
        case "ZKSYNC":
        case "ELYS":
        case "NEUTRON":
        case "NIBIRU":
        case "ARCHWAY":
        case "AXELAR":
        case "AGORIC":
        case "CELESTIA":
        case "COSMOS":
        case "DYMENSION":
        case "PERSISTENCE":
        case "DYDX":
        case "ORAI":
        case "KAVA":
        case "INJECTIVE": {
          const { authenticationKey, tenantId } = this._configuration;
          const messageBuffer = new TextEncoder().encode(
            `${SIGNING_MESSAGE}${authenticationKey}${tenantId}${timestamp.toString()}`
          );
          const signedBuffer = await signMessageParams.signMessage(messageBuffer);
          const signature = Buffer.from(signedBuffer).toString("base64");
          return signature;
        }
        case "SOLANA": {
          const { walletPublicKey, tenantId } = this._configuration;
          const messageBuffer = new TextEncoder().encode(
            `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`
          );
          const signedBuffer = await signMessageParams.signMessage(messageBuffer);
          const signature = Buffer.from(signedBuffer).toString("base64");
          return signature;
        }
        case "XION": {
          const { message } = signMessageParams;
          const messageBuffer = new TextEncoder().encode(message);
          const signedBuffer = await signMessageParams.signMessage(messageBuffer);
          const signature = Buffer.from(signedBuffer).toString("base64");
          return signature;
        }
        case "ACALA": {
          const { accountAddress, tenantId } = this._configuration;
          const message = `${SIGNING_MESSAGE}${accountAddress}${tenantId}${timestamp.toString()}`;
          const signedBuffer = await signMessageParams.signMessage(
            accountAddress,
            message
          );
          return signedBuffer;
        }
        case "APTOS": {
          const signature = await signMessageParams.signMessage(
            SIGNING_MESSAGE,
            timestamp
          );
          return signature;
        }
        case "SUI": {
          const { accountAddress, tenantId } = this._configuration;
          const messageBuffer = new TextEncoder().encode(
            `${SIGNING_MESSAGE}${accountAddress}${tenantId}${timestamp.toString()}`
          );
          const signedBuffer = await signMessageParams.signMessage(messageBuffer);
          const signature = signedBuffer.toString();
          return signature;
        }
        case "NEAR": {
          const { authenticationKey, accountAddress, tenantId } = this._configuration;
          const message = `${`ed25519:` + authenticationKey}${tenantId}${accountAddress}${timestamp.toString()}`;
          const textAsBuffer = new TextEncoder().encode(message);
          const hashBuffer = await window.crypto.subtle.digest(
            "SHA-256",
            textAsBuffer
          );
          const messageBuffer = new Uint8Array(hashBuffer);
          const signedBuffer = await signMessageParams.signMessage(messageBuffer);
          const signature = Buffer.from(signedBuffer).toString("base64");
          return signature;
        }
        case "OFF_CHAIN": {
          const oidcCredentials = await signMessageParams.signIn();
          if (!oidcCredentials) {
            throw new Error("._authenticate: OIDC login failed");
          }
          return oidcCredentials;
        }
        default:
          return "Chain not yet supported";
      }
    }
    async _handleLogInResult(user) {
      const authorization = user == null ? void 0 : user.authorization;
      const saveAuthorizationPromise = authorization !== void 0 ? this._storage.setAuthorization(authorization) : Promise.resolve();
      const roles = user == null ? void 0 : user.roles;
      const saveRolesPromise = roles !== void 0 ? this._storage.setRoles(roles.filter(notNullOrEmpty)) : Promise.resolve();
      if (authorization && roles) {
        const userState = {
          status: "authenticated",
          authorization,
          roles: roles.filter((role) => !!role)
        };
        this._userState = userState;
      }
      await Promise.all([saveAuthorizationPromise, saveRolesPromise]);
    }
    /** @deprecated use fetchFusionData instead. This is for legacy  */
    async fetchData() {
      return this._service.fetchData({});
    }
    async fetchFusionData() {
      return this._service.fetchFusionData({});
    }
    async beginLoginViaTransaction({
      walletBlockchain,
      walletAddress
    }) {
      const { tenantId } = this._configuration;
      const result = await this._service.beginLogInByTransaction({
        walletAddress,
        walletBlockchain,
        dappAddress: tenantId
      });
      const nonce = result.beginLogInByTransaction.nonce;
      if (nonce === null) {
        throw new Error("Failed to begin login process");
      }
      const ruuid = crypto.randomUUID();
      this._clientRandomUuid = ruuid;
      const encoder = new TextEncoder();
      const data = encoder.encode(nonce + ruuid);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const logValue = "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return { nonce: logValue };
    }
    async completeLoginViaTransaction({
      walletBlockchain,
      walletAddress,
      transactionSignature
    }) {
      const { tenantId } = this._configuration;
      const clientRandomUuid = this._clientRandomUuid;
      this._clientRandomUuid = null;
      if (clientRandomUuid === null) {
        throw new Error(
          "BeginLoginViaTransaction is required to be called first"
        );
      }
      const result = await this._service.completeLogInByTransaction({
        walletAddress,
        walletBlockchain,
        dappAddress: tenantId,
        randomUuid: clientRandomUuid,
        transactionSignature
      });
      await this._handleLogInResult(result.completeLogInByTransaction);
      return result;
    }
    async beginLogInWithWeb3({
      authType,
      authAddress,
      walletPubkey
    }) {
      const { tenantId } = this._configuration;
      const result = await this._service.beginLogInWithWeb3({
        dappAddress: tenantId,
        authAddress,
        blockchainType: this._configuration.walletBlockchain,
        authType,
        walletPubkey
      });
      if (!result.beginLogInWithWeb3.beginLogInWithWeb3Response) {
        throw new Error("Failed to begin login process");
      }
      return result.beginLogInWithWeb3.beginLogInWithWeb3Response;
    }
    async completeLogInWithWeb3(input) {
      const result = await this._service.completeLogInWithWeb3(__spreadValues({
        signingPubkey: ""
      }, input));
      return result;
    }
    async getTargetGroups() {
      var _a, _b;
      const query = await this._service.getTargetGroups({});
      const results = (_b = (_a = query.targetGroup) == null ? void 0 : _a.filter(notNullOrEmpty)) != null ? _b : [];
      return results;
    }
    async ensureTargetGroup({
      name,
      emailAddress,
      phoneNumber,
      telegramId,
      webhook,
      discordId,
      slackId,
      walletId,
      webPushTargetIds
    }) {
      var _a, _b, _c;
      const [
        targetGroupsQuery,
        emailTargetId,
        smsTargetId,
        telegramTargetId,
        webhookTargetId,
        discordTargetId,
        slackTargetId,
        web3TargetId
      ] = await Promise.all([
        this._service.getTargetGroups({}),
        ensureEmail(this._service, emailAddress),
        ensureSms(this._service, phoneNumber),
        ensureTelegram(this._service, telegramId),
        ensureWebhook(this._service, webhook),
        ensureDiscord(this._service, discordId),
        ensureSlack(this._service, slackId),
        ensureWeb3(this._service, walletId)
      ]);
      const emailTargetIds = emailTargetId === void 0 ? [] : [emailTargetId];
      const smsTargetIds = smsTargetId === void 0 ? [] : [smsTargetId];
      const telegramTargetIds = telegramTargetId === void 0 ? [] : [telegramTargetId];
      const webhookTargetIds = webhookTargetId === void 0 ? [] : [webhookTargetId];
      const discordTargetIds = discordTargetId === void 0 ? [] : [discordTargetId];
      const slackChannelTargetIds = slackTargetId === void 0 ? [] : [slackTargetId];
      const web3TargetIds = web3TargetId === void 0 ? [] : [web3TargetId];
      const existing = (_a = targetGroupsQuery.targetGroup) == null ? void 0 : _a.find(
        (it) => (it == null ? void 0 : it.name) === name
      );
      if (existing !== void 0) {
        if (!webPushTargetIds) {
          webPushTargetIds = (_c = (_b = existing.webPushTargets) == null ? void 0 : _b.map((target) => {
            var _a2;
            return (_a2 = target == null ? void 0 : target.id) != null ? _a2 : "";
          })) != null ? _c : [];
        }
        return this._updateTargetGroup({
          existing,
          emailTargetIds,
          smsTargetIds,
          telegramTargetIds,
          webhookTargetIds,
          discordTargetIds,
          slackChannelTargetIds,
          web3TargetIds,
          webPushTargetIds
        });
      }
      const createMutation = await this._service.createTargetGroup({
        name,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
        webhookTargetIds,
        discordTargetIds,
        slackChannelTargetIds,
        web3TargetIds,
        webPushTargetIds: webPushTargetIds != null ? webPushTargetIds : []
      });
      if (createMutation.createTargetGroup === void 0) {
        throw new Error("Failed to create target group");
      }
      return createMutation.createTargetGroup;
    }
    async _updateTargetGroup({
      existing,
      emailTargetIds,
      smsTargetIds,
      telegramTargetIds,
      webhookTargetIds,
      discordTargetIds,
      slackChannelTargetIds,
      web3TargetIds,
      webPushTargetIds
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      if (areIdsEqual(emailTargetIds, (_a = existing.emailTargets) != null ? _a : []) && areIdsEqual(smsTargetIds, (_b = existing.smsTargets) != null ? _b : []) && areIdsEqual(telegramTargetIds, (_c = existing.telegramTargets) != null ? _c : []) && areIdsEqual(webhookTargetIds, (_d = existing.webhookTargets) != null ? _d : []) && areIdsEqual(discordTargetIds, (_e = existing.discordTargets) != null ? _e : []) && areIdsEqual(slackChannelTargetIds, (_f = existing.slackChannelTargets) != null ? _f : []) && areIdsEqual(web3TargetIds, (_g = existing.web3Targets) != null ? _g : []) && areIdsEqual(webPushTargetIds, (_h = existing.webPushTargets) != null ? _h : [])) {
        return existing;
      }
      const updateMutation = await this._service.updateTargetGroup({
        id: existing.id,
        name: (_i = existing.name) != null ? _i : existing.id,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
        webhookTargetIds,
        discordTargetIds,
        slackChannelTargetIds,
        web3TargetIds,
        webPushTargetIds
      });
      const updated = updateMutation.updateTargetGroup;
      if (updated === void 0) {
        throw new Error("Failed to update target group");
      }
      return updated;
    }
    async getSourceGroups() {
      var _a, _b;
      const query = await this._service.getSourceGroups({});
      const results = (_b = (_a = query.sourceGroup) == null ? void 0 : _a.filter(notNullOrEmpty)) != null ? _b : [];
      return results;
    }
    async getAlerts() {
      var _a, _b;
      const query = await this._service.getAlerts({});
      return (_b = (_a = query.alert) == null ? void 0 : _a.filter(notNullOrEmpty)) != null ? _b : [];
    }
    async ensureAlert({
      eventType,
      inputs,
      targetGroupName = "Default"
    }) {
      var _a, _b;
      const [alertsQuery, targetGroupsQuery, sourceAndFilters] = await Promise.all([
        this._service.getAlerts({}),
        this._service.getTargetGroups({}),
        ensureSourceAndFilters(this._service, eventType, inputs)
      ]);
      const targetGroup = (_a = targetGroupsQuery.targetGroup) == null ? void 0 : _a.find(
        (it) => (it == null ? void 0 : it.name) === targetGroupName
      );
      if (targetGroup === void 0) {
        throw new Error("Target group does not exist");
      }
      const { sourceGroup, filter, filterOptions } = sourceAndFilters;
      const packedOptions = packFilterOptions(filterOptions);
      const existing = (_b = alertsQuery.alert) == null ? void 0 : _b.find(
        (it) => it !== void 0 && it.name === eventType.name
      );
      if (existing !== void 0) {
        if (existing.sourceGroup.id === sourceGroup.id && existing.targetGroup.id === targetGroup.id && existing.filter.id === filter.id && existing.filterOptions === packedOptions) {
          return existing;
        }
        await this.deleteAlert({
          id: existing.id
        });
      }
      const mutation = await this._service.createAlert({
        name: eventType.name,
        sourceGroupId: sourceGroup.id,
        filterId: filter.id,
        targetGroupId: targetGroup.id,
        filterOptions: packedOptions,
        groupName: "managed"
      });
      const created = mutation.createAlert;
      if (created === void 0) {
        throw new Error("Failed to create alert");
      }
      return created;
    }
    async ensureFusionAlerts(input) {
      const inputAlertsNames = new Set(input.alerts.map((alert) => alert.name));
      const query = await this._service.getAlerts({});
      const existingAlerts = new Set(query.alert);
      const duplicateAlerts = [...existingAlerts].filter(
        (alert) => inputAlertsNames.has(alert == null ? void 0 : alert.name)
      );
      const duplicateAlertsIds = duplicateAlerts.map((alert) => alert == null ? void 0 : alert.id).filter((id) => !!id);
      for (const id of duplicateAlertsIds) {
        await this.deleteAlert({ id });
      }
      const mutation = await this._service.createFusionAlerts({ input });
      return mutation.createFusionAlerts;
    }
    async deleteAlert({
      id
    }) {
      var _a;
      const mutation = await this._service.deleteAlert({ id });
      const result = (_a = mutation.deleteAlert) == null ? void 0 : _a.id;
      if (result === void 0) {
        throw new Error("Failed to delete alert");
      }
    }
    async updateWallets() {
      const walletEventTypeItem = {
        name: "User Wallets",
        type: "walletBalance"
      };
      const result = await ensureSourceAndFilters(
        this._service,
        walletEventTypeItem,
        {}
      );
      return result;
    }
    /**
     *@deprecated
     *@description Use getFusionNotificationHistory instead
     */
    async getNotificationHistory(variables) {
      var _a, _b;
      const query = await this._service.getNotificationHistory(variables);
      const nodes = (_a = query.notificationHistory) == null ? void 0 : _a.nodes;
      const pageInfo = (_b = query.notificationHistory) == null ? void 0 : _b.pageInfo;
      if (nodes === void 0 || pageInfo === void 0) {
        throw new Error("Failed to fetch notification history");
      }
      return { pageInfo, nodes };
    }
    async getUnreadNotificationHistoryCount() {
      const query = await this._service.getUnreadNotificationHistoryCount({});
      const result = query.unreadNotificationHistoryCount;
      if (!result) {
        throw new Error("Failed to fetch unread notification history count");
      }
      return result;
    }
    async subscribeNotificationHistoryStateChanged(onMessageReceived, onError, onComplete) {
      this._service.subscribeNotificationHistoryStateChanged(
        onMessageReceived,
        onError,
        onComplete
      );
    }
    async wsDispose() {
      this._service.wsDispose();
    }
    async getUserSettings() {
      const query = await this._service.getUserSettings({});
      const result = query.userSettings;
      if (!result) {
        throw new Error("Failed to fetch user settings");
      }
      return result;
    }
    async getFusionNotificationHistory(variables) {
      var _a, _b;
      const query = await this._service.getFusionNotificationHistory(variables);
      const nodes = (_a = query.fusionNotificationHistory) == null ? void 0 : _a.nodes;
      const pageInfo = (_b = query.fusionNotificationHistory) == null ? void 0 : _b.pageInfo;
      if (nodes === void 0 || pageInfo === void 0) {
        throw new Error("Failed to fetch notification history");
      }
      return { pageInfo, nodes };
    }
    /**@deprecated for legacy infra, use fetchTenantConfig instead for new infra (fusionEvent)  */
    async fetchSubscriptionCard(variables) {
      const query = await this._service.findTenantConfig({
        input: __spreadProps(__spreadValues({}, variables), {
          tenant: this._configuration.tenantId
        })
      });
      const result = query.findTenantConfig;
      if (result === void 0) {
        throw new Error("Failed to find tenant config");
      }
      const value = result.dataJson;
      if (value === void 0) {
        throw new Error("Invalid config data");
      }
      const obj = JSON.parse(value);
      let card = void 0;
      switch (obj.version) {
        case "v1": {
          card = obj;
          break;
        }
        default: {
          throw new Error("Unsupported config version");
        }
      }
      if (card === void 0) {
        throw new Error("Unsupported config format");
      }
      return card;
    }
    async fetchTenantConfig(variables) {
      const query = await this._service.findTenantConfig({
        input: __spreadProps(__spreadValues({}, variables), {
          tenant: this._configuration.tenantId
        })
      });
      const result = query.findTenantConfig;
      if (result === void 0 || !result.dataJson || !result.fusionEvents) {
        throw new Error("Failed to find tenant config");
      }
      const tenantConfigJsonString = result.dataJson;
      if (tenantConfigJsonString === void 0) {
        throw new Error("Invalid config data");
      }
      const cardConfig = JSON.parse(tenantConfigJsonString);
      const fusionEventDescriptors = result.fusionEvents;
      if (!cardConfig || cardConfig.version !== "v1" || !fusionEventDescriptors)
        throw new Error("Unsupported config format");
      const fusionEventDescriptorMap = new Map(fusionEventDescriptors.map((item) => {
        var _a;
        return [(_a = item == null ? void 0 : item.name) != null ? _a : "", item != null ? item : {}];
      }));
      fusionEventDescriptorMap.delete("");
      const fusionEventTopics = cardConfig.eventTypes.map((eventType) => {
        if (eventType.type === "fusion") {
          const fusionEventDescriptor = fusionEventDescriptorMap.get(
            eventType.name
          );
          return {
            uiConfig: eventType,
            fusionEventDescriptor
          };
        }
      }).filter((item) => !!item);
      return { cardConfig, fusionEventTopics };
    }
    async copyAuthorization(config) {
      var _a;
      const auth = await this._storage.getAuthorization();
      const roles = await this._storage.getRoles();
      const driver = ((_a = config.storageOption) == null ? void 0 : _a.driverType) === "InMemory" ? createInMemoryStorageDriver(config) : createLocalForageStorageDriver(config);
      const otherStorage = new NotifiFrontendStorage(driver);
      await Promise.all([
        otherStorage.setAuthorization(auth),
        otherStorage.setRoles(roles)
      ]);
    }
    async sendEmailTargetVerification({
      targetId
    }) {
      var _a;
      const emailTarget = await this._service.sendEmailTargetVerificationRequest({
        targetId
      });
      const id = (_a = emailTarget.sendEmailTargetVerificationRequest) == null ? void 0 : _a.id;
      if (id === void 0) {
        throw new Error(`Unknown error requesting verification`);
      }
      return id;
    }
    async subscribeWallet(params) {
      if (params.walletParams.walletBlockchain === "OFF_CHAIN")
        throw new Error(
          "ERROR: subscribeWallet - OFF_CHAIN OIDC login does not support wallet connection"
        );
      const { walletBlockchain, signMessage, walletPublicKey } = params.walletParams;
      const signMessageParams = {
        walletBlockchain,
        signMessage
      };
      if (this._userState && this._userState.status === "authenticated") {
        await this.logIn(signMessageParams);
      }
      const timestamp = Math.round(Date.now() / 1e3);
      const signature = await this._authenticate({
        signMessageParams,
        timestamp
      });
      if (typeof signature !== "string")
        throw new Error("subscribeWallet - Invalid signature - expected string");
      const connectedWallet = await this._service.connectWallet({
        walletBlockchain,
        walletPublicKey,
        accountId: walletBlockchain === "APTOS" || walletBlockchain === "ACALA" || walletBlockchain === "NEAR" || walletBlockchain === "SUI" ? params.walletParams.accountAddress : void 0,
        signature,
        timestamp,
        connectWalletConflictResolutionTechnique: params.connectWalletConflictResolutionTechnique
      });
      return connectedWallet;
    }
    async createDiscordTarget(input) {
      const mutation = await this._service.createDiscordTarget({
        name: input,
        value: input
      });
      return mutation.createDiscordTarget;
    }
    async markFusionNotificationHistoryAsRead(input) {
      const mutation = await this._service.markFusionNotificationHistoryAsRead(
        input
      );
      return mutation;
    }
    async updateUserSettings(input) {
      const mutation = await this._service.updateUserSettings(input);
      return mutation;
    }
    async verifyXmtpTarget(input) {
      const mutation = await this._service.verifyXmtpTarget(input);
      return mutation;
    }
    async verifyCbwTarget(input) {
      const mutation = await this._service.verifyCbwTarget(input);
      return mutation;
    }
    async verifyXmtpTargetViaXip42(input) {
      const mutation = await this._service.verifyXmtpTargetViaXip42(input);
      return mutation;
    }
    async createWebPushTarget(input) {
      const mutation = await this._service.createWebPushTarget(input);
      return mutation;
    }
    async updateWebPushTarget(input) {
      const mutation = await this._service.updateWebPushTarget(input);
      return mutation;
    }
    async deleteWebPushTarget(input) {
      const mutation = await this._service.deleteWebPushTarget(input);
      return mutation;
    }
    async getWebPushTargets(input) {
      const query = await this._service.getWebPushTargets(input);
      const result = query.webPushTargets;
      if (!result) {
        throw new Error("Failed to fetch webpush targets");
      }
      return result;
    }
  };

  // ../../node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // ../../node_modules/uuid/dist/esm-browser/regex.js
  var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  // ../../node_modules/uuid/dist/esm-browser/validate.js
  function validate(uuid) {
    return typeof uuid === "string" && regex_default.test(uuid);
  }
  var validate_default = validate;

  // ../../node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  var i;
  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!validate_default(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var stringify_default = stringify;

  // ../../node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return stringify_default(rnds);
  }
  var v4_default = v4;

  // ../notifi-graphql/package.json
  var version = "1.1.2";

  // ../../node_modules/graphql-ws/lib/utils.mjs
  function extendedTypeof(val) {
    if (val === null) {
      return "null";
    }
    if (Array.isArray(val)) {
      return "array";
    }
    return typeof val;
  }
  function isObject(val) {
    return extendedTypeof(val) === "object";
  }
  function areGraphQLErrors(obj) {
    return Array.isArray(obj) && // must be at least one error
    obj.length > 0 && // error has at least a message
    obj.every((ob) => "message" in ob);
  }
  function limitCloseReason(reason, whenTooLong) {
    return reason.length < 124 ? reason : whenTooLong;
  }

  // ../../node_modules/graphql-ws/lib/common.mjs
  var GRAPHQL_TRANSPORT_WS_PROTOCOL = "graphql-transport-ws";
  var CloseCode;
  (function(CloseCode2) {
    CloseCode2[CloseCode2["InternalServerError"] = 4500] = "InternalServerError";
    CloseCode2[CloseCode2["InternalClientError"] = 4005] = "InternalClientError";
    CloseCode2[CloseCode2["BadRequest"] = 4400] = "BadRequest";
    CloseCode2[CloseCode2["BadResponse"] = 4004] = "BadResponse";
    CloseCode2[CloseCode2["Unauthorized"] = 4401] = "Unauthorized";
    CloseCode2[CloseCode2["Forbidden"] = 4403] = "Forbidden";
    CloseCode2[CloseCode2["SubprotocolNotAcceptable"] = 4406] = "SubprotocolNotAcceptable";
    CloseCode2[CloseCode2["ConnectionInitialisationTimeout"] = 4408] = "ConnectionInitialisationTimeout";
    CloseCode2[CloseCode2["ConnectionAcknowledgementTimeout"] = 4504] = "ConnectionAcknowledgementTimeout";
    CloseCode2[CloseCode2["SubscriberAlreadyExists"] = 4409] = "SubscriberAlreadyExists";
    CloseCode2[CloseCode2["TooManyInitialisationRequests"] = 4429] = "TooManyInitialisationRequests";
  })(CloseCode || (CloseCode = {}));
  var MessageType;
  (function(MessageType2) {
    MessageType2["ConnectionInit"] = "connection_init";
    MessageType2["ConnectionAck"] = "connection_ack";
    MessageType2["Ping"] = "ping";
    MessageType2["Pong"] = "pong";
    MessageType2["Subscribe"] = "subscribe";
    MessageType2["Next"] = "next";
    MessageType2["Error"] = "error";
    MessageType2["Complete"] = "complete";
  })(MessageType || (MessageType = {}));
  function validateMessage(val) {
    if (!isObject(val)) {
      throw new Error(`Message is expected to be an object, but got ${extendedTypeof(val)}`);
    }
    if (!val.type) {
      throw new Error(`Message is missing the 'type' property`);
    }
    if (typeof val.type !== "string") {
      throw new Error(`Message is expects the 'type' property to be a string, but got ${extendedTypeof(val.type)}`);
    }
    switch (val.type) {
      case MessageType.ConnectionInit:
      case MessageType.ConnectionAck:
      case MessageType.Ping:
      case MessageType.Pong: {
        if (val.payload != null && !isObject(val.payload)) {
          throw new Error(`"${val.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${val.payload}"`);
        }
        break;
      }
      case MessageType.Subscribe: {
        if (typeof val.id !== "string") {
          throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
        }
        if (!val.id) {
          throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
        }
        if (!isObject(val.payload)) {
          throw new Error(`"${val.type}" message expects the 'payload' property to be an object, but got ${extendedTypeof(val.payload)}`);
        }
        if (typeof val.payload.query !== "string") {
          throw new Error(`"${val.type}" message payload expects the 'query' property to be a string, but got ${extendedTypeof(val.payload.query)}`);
        }
        if (val.payload.variables != null && !isObject(val.payload.variables)) {
          throw new Error(`"${val.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${extendedTypeof(val.payload.variables)}`);
        }
        if (val.payload.operationName != null && extendedTypeof(val.payload.operationName) !== "string") {
          throw new Error(`"${val.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${extendedTypeof(val.payload.operationName)}`);
        }
        if (val.payload.extensions != null && !isObject(val.payload.extensions)) {
          throw new Error(`"${val.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${extendedTypeof(val.payload.extensions)}`);
        }
        break;
      }
      case MessageType.Next: {
        if (typeof val.id !== "string") {
          throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
        }
        if (!val.id) {
          throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
        }
        if (!isObject(val.payload)) {
          throw new Error(`"${val.type}" message expects the 'payload' property to be an object, but got ${extendedTypeof(val.payload)}`);
        }
        break;
      }
      case MessageType.Error: {
        if (typeof val.id !== "string") {
          throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
        }
        if (!val.id) {
          throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
        }
        if (!areGraphQLErrors(val.payload)) {
          throw new Error(`"${val.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(val.payload)}`);
        }
        break;
      }
      case MessageType.Complete: {
        if (typeof val.id !== "string") {
          throw new Error(`"${val.type}" message expects the 'id' property to be a string, but got ${extendedTypeof(val.id)}`);
        }
        if (!val.id) {
          throw new Error(`"${val.type}" message requires a non-empty 'id' property`);
        }
        break;
      }
      default:
        throw new Error(`Invalid message 'type' property "${val.type}"`);
    }
    return val;
  }
  function parseMessage(data, reviver) {
    return validateMessage(typeof data === "string" ? JSON.parse(data, reviver) : data);
  }
  function stringifyMessage(msg, replacer) {
    validateMessage(msg);
    return JSON.stringify(msg, replacer);
  }

  // ../../node_modules/graphql-ws/lib/client.mjs
  var __await = function(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  };
  var __asyncGenerator = function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n])
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  };
  function createClient(options) {
    const {
      url,
      connectionParams,
      lazy = true,
      onNonLazyError = console.error,
      lazyCloseTimeout: lazyCloseTimeoutMs = 0,
      keepAlive = 0,
      disablePong,
      connectionAckWaitTimeout = 0,
      retryAttempts = 5,
      retryWait = async function randomisedExponentialBackoff(retries2) {
        let retryDelay = 1e3;
        for (let i = 0; i < retries2; i++) {
          retryDelay *= 2;
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay + // add random timeout from 300ms to 3s
        Math.floor(Math.random() * (3e3 - 300) + 300)));
      },
      shouldRetry = isLikeCloseEvent,
      isFatalConnectionProblem,
      on,
      webSocketImpl,
      /**
       * Generates a v4 UUID to be used as the ID using `Math`
       * as the random number generator. Supply your own generator
       * in case you need more uniqueness.
       *
       * Reference: https://gist.github.com/jed/982883
       */
      generateID = function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      },
      jsonMessageReplacer: replacer,
      jsonMessageReviver: reviver
    } = options;
    let ws;
    if (webSocketImpl) {
      if (!isWebSocket(webSocketImpl)) {
        throw new Error("Invalid WebSocket implementation provided");
      }
      ws = webSocketImpl;
    } else if (typeof WebSocket !== "undefined") {
      ws = WebSocket;
    } else if (typeof global !== "undefined") {
      ws = global.WebSocket || // @ts-expect-error: Support more browsers
      global.MozWebSocket;
    } else if (typeof window !== "undefined") {
      ws = window.WebSocket || // @ts-expect-error: Support more browsers
      window.MozWebSocket;
    }
    if (!ws)
      throw new Error("WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`");
    const WebSocketImpl = ws;
    const emitter = (() => {
      const message = (() => {
        const listeners2 = {};
        return {
          on(id, listener) {
            listeners2[id] = listener;
            return () => {
              delete listeners2[id];
            };
          },
          emit(message2) {
            var _a;
            if ("id" in message2)
              (_a = listeners2[message2.id]) === null || _a === void 0 ? void 0 : _a.call(listeners2, message2);
          }
        };
      })();
      const listeners = {
        connecting: (on === null || on === void 0 ? void 0 : on.connecting) ? [on.connecting] : [],
        opened: (on === null || on === void 0 ? void 0 : on.opened) ? [on.opened] : [],
        connected: (on === null || on === void 0 ? void 0 : on.connected) ? [on.connected] : [],
        ping: (on === null || on === void 0 ? void 0 : on.ping) ? [on.ping] : [],
        pong: (on === null || on === void 0 ? void 0 : on.pong) ? [on.pong] : [],
        message: (on === null || on === void 0 ? void 0 : on.message) ? [message.emit, on.message] : [message.emit],
        closed: (on === null || on === void 0 ? void 0 : on.closed) ? [on.closed] : [],
        error: (on === null || on === void 0 ? void 0 : on.error) ? [on.error] : []
      };
      return {
        onMessage: message.on,
        on(event, listener) {
          const l = listeners[event];
          l.push(listener);
          return () => {
            l.splice(l.indexOf(listener), 1);
          };
        },
        emit(event, ...args) {
          for (const listener of [...listeners[event]]) {
            listener(...args);
          }
        }
      };
    })();
    function errorOrClosed(cb) {
      const listening = [
        // errors are fatal and more critical than close events, throw them first
        emitter.on("error", (err) => {
          listening.forEach((unlisten) => unlisten());
          cb(err);
        }),
        // closes can be graceful and not fatal, throw them second (if error didnt throw)
        emitter.on("closed", (event) => {
          listening.forEach((unlisten) => unlisten());
          cb(event);
        })
      ];
    }
    let connecting, locks = 0, lazyCloseTimeout, retrying = false, retries = 0, disposed = false;
    async function connect() {
      clearTimeout(lazyCloseTimeout);
      const [socket, throwOnClose] = await (connecting !== null && connecting !== void 0 ? connecting : connecting = new Promise((connected, denied) => (async () => {
        if (retrying) {
          await retryWait(retries);
          if (!locks) {
            connecting = void 0;
            return denied({ code: 1e3, reason: "All Subscriptions Gone" });
          }
          retries++;
        }
        emitter.emit("connecting", retrying);
        const socket2 = new WebSocketImpl(typeof url === "function" ? await url() : url, GRAPHQL_TRANSPORT_WS_PROTOCOL);
        let connectionAckTimeout, queuedPing;
        function enqueuePing() {
          if (isFinite(keepAlive) && keepAlive > 0) {
            clearTimeout(queuedPing);
            queuedPing = setTimeout(() => {
              if (socket2.readyState === WebSocketImpl.OPEN) {
                socket2.send(stringifyMessage({ type: MessageType.Ping }));
                emitter.emit("ping", false, void 0);
              }
            }, keepAlive);
          }
        }
        errorOrClosed((errOrEvent) => {
          connecting = void 0;
          clearTimeout(connectionAckTimeout);
          clearTimeout(queuedPing);
          denied(errOrEvent);
          if (errOrEvent instanceof TerminatedCloseEvent) {
            socket2.close(4499, "Terminated");
            socket2.onerror = null;
            socket2.onclose = null;
          }
        });
        socket2.onerror = (err) => emitter.emit("error", err);
        socket2.onclose = (event) => emitter.emit("closed", event);
        socket2.onopen = async () => {
          try {
            emitter.emit("opened", socket2);
            const payload = typeof connectionParams === "function" ? await connectionParams() : connectionParams;
            if (socket2.readyState !== WebSocketImpl.OPEN)
              return;
            socket2.send(stringifyMessage(payload ? {
              type: MessageType.ConnectionInit,
              payload
            } : {
              type: MessageType.ConnectionInit
              // payload is completely absent if not provided
            }, replacer));
            if (isFinite(connectionAckWaitTimeout) && connectionAckWaitTimeout > 0) {
              connectionAckTimeout = setTimeout(() => {
                socket2.close(CloseCode.ConnectionAcknowledgementTimeout, "Connection acknowledgement timeout");
              }, connectionAckWaitTimeout);
            }
            enqueuePing();
          } catch (err) {
            emitter.emit("error", err);
            socket2.close(CloseCode.InternalClientError, limitCloseReason(err instanceof Error ? err.message : new Error(err).message, "Internal client error"));
          }
        };
        let acknowledged = false;
        socket2.onmessage = ({ data }) => {
          try {
            const message = parseMessage(data, reviver);
            emitter.emit("message", message);
            if (message.type === "ping" || message.type === "pong") {
              emitter.emit(message.type, true, message.payload);
              if (message.type === "pong") {
                enqueuePing();
              } else if (!disablePong) {
                socket2.send(stringifyMessage(message.payload ? {
                  type: MessageType.Pong,
                  payload: message.payload
                } : {
                  type: MessageType.Pong
                  // payload is completely absent if not provided
                }));
                emitter.emit("pong", false, message.payload);
              }
              return;
            }
            if (acknowledged)
              return;
            if (message.type !== MessageType.ConnectionAck)
              throw new Error(`First message cannot be of type ${message.type}`);
            clearTimeout(connectionAckTimeout);
            acknowledged = true;
            emitter.emit("connected", socket2, message.payload, retrying);
            retrying = false;
            retries = 0;
            connected([
              socket2,
              new Promise((_, reject) => errorOrClosed(reject))
            ]);
          } catch (err) {
            socket2.onmessage = null;
            emitter.emit("error", err);
            socket2.close(CloseCode.BadResponse, limitCloseReason(err instanceof Error ? err.message : new Error(err).message, "Bad response"));
          }
        };
      })()));
      if (socket.readyState === WebSocketImpl.CLOSING)
        await throwOnClose;
      let release = () => {
      };
      const released = new Promise((resolve) => release = resolve);
      return [
        socket,
        release,
        Promise.race([
          // wait for
          released.then(() => {
            if (!locks) {
              const complete = () => socket.close(1e3, "Normal Closure");
              if (isFinite(lazyCloseTimeoutMs) && lazyCloseTimeoutMs > 0) {
                lazyCloseTimeout = setTimeout(() => {
                  if (socket.readyState === WebSocketImpl.OPEN)
                    complete();
                }, lazyCloseTimeoutMs);
              } else {
                complete();
              }
            }
          }),
          // or
          throwOnClose
        ])
      ];
    }
    function shouldRetryConnectOrThrow(errOrCloseEvent) {
      if (isLikeCloseEvent(errOrCloseEvent) && (isFatalInternalCloseCode(errOrCloseEvent.code) || [
        CloseCode.InternalServerError,
        CloseCode.InternalClientError,
        CloseCode.BadRequest,
        CloseCode.BadResponse,
        CloseCode.Unauthorized,
        // CloseCode.Forbidden, might grant access out after retry
        CloseCode.SubprotocolNotAcceptable,
        // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
        // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
        CloseCode.SubscriberAlreadyExists,
        CloseCode.TooManyInitialisationRequests
        // 4499, // Terminated, probably because the socket froze, we want to retry
      ].includes(errOrCloseEvent.code)))
        throw errOrCloseEvent;
      if (disposed)
        return false;
      if (isLikeCloseEvent(errOrCloseEvent) && errOrCloseEvent.code === 1e3)
        return locks > 0;
      if (!retryAttempts || retries >= retryAttempts)
        throw errOrCloseEvent;
      if (!shouldRetry(errOrCloseEvent))
        throw errOrCloseEvent;
      if (isFatalConnectionProblem === null || isFatalConnectionProblem === void 0 ? void 0 : isFatalConnectionProblem(errOrCloseEvent))
        throw errOrCloseEvent;
      return retrying = true;
    }
    if (!lazy) {
      (async () => {
        locks++;
        for (; ; ) {
          try {
            const [, , throwOnClose] = await connect();
            await throwOnClose;
          } catch (errOrCloseEvent) {
            try {
              if (!shouldRetryConnectOrThrow(errOrCloseEvent))
                return;
            } catch (errOrCloseEvent2) {
              return onNonLazyError === null || onNonLazyError === void 0 ? void 0 : onNonLazyError(errOrCloseEvent2);
            }
          }
        }
      })();
    }
    function subscribe(payload, sink) {
      const id = generateID(payload);
      let done = false, errored = false, releaser = () => {
        locks--;
        done = true;
      };
      (async () => {
        locks++;
        for (; ; ) {
          try {
            const [socket, release, waitForReleaseOrThrowOnClose] = await connect();
            if (done)
              return release();
            const unlisten = emitter.onMessage(id, (message) => {
              switch (message.type) {
                case MessageType.Next: {
                  sink.next(message.payload);
                  return;
                }
                case MessageType.Error: {
                  errored = true, done = true;
                  sink.error(message.payload);
                  releaser();
                  return;
                }
                case MessageType.Complete: {
                  done = true;
                  releaser();
                  return;
                }
              }
            });
            socket.send(stringifyMessage({
              id,
              type: MessageType.Subscribe,
              payload
            }, replacer));
            releaser = () => {
              if (!done && socket.readyState === WebSocketImpl.OPEN)
                socket.send(stringifyMessage({
                  id,
                  type: MessageType.Complete
                }, replacer));
              locks--;
              done = true;
              release();
            };
            await waitForReleaseOrThrowOnClose.finally(unlisten);
            return;
          } catch (errOrCloseEvent) {
            if (!shouldRetryConnectOrThrow(errOrCloseEvent))
              return;
          }
        }
      })().then(() => {
        if (!errored)
          sink.complete();
      }).catch((err) => {
        sink.error(err);
      });
      return () => {
        if (!done)
          releaser();
      };
    }
    return {
      on: emitter.on,
      subscribe,
      iterate(request) {
        const pending = [];
        const deferred = {
          done: false,
          error: null,
          resolve: () => {
          }
        };
        const dispose = subscribe(request, {
          next(val) {
            pending.push(val);
            deferred.resolve();
          },
          error(err) {
            deferred.done = true;
            deferred.error = err;
            deferred.resolve();
          },
          complete() {
            deferred.done = true;
            deferred.resolve();
          }
        });
        const iterator = function iterator2() {
          return __asyncGenerator(this, arguments, function* iterator_1() {
            for (; ; ) {
              if (!pending.length) {
                yield __await(new Promise((resolve) => deferred.resolve = resolve));
              }
              while (pending.length) {
                yield yield __await(pending.shift());
              }
              if (deferred.error) {
                throw deferred.error;
              }
              if (deferred.done) {
                return yield __await(void 0);
              }
            }
          });
        }();
        iterator.throw = async (err) => {
          if (!deferred.done) {
            deferred.done = true;
            deferred.error = err;
            deferred.resolve();
          }
          return { done: true, value: void 0 };
        };
        iterator.return = async () => {
          dispose();
          return { done: true, value: void 0 };
        };
        return iterator;
      },
      async dispose() {
        disposed = true;
        if (connecting) {
          const [socket] = await connecting;
          socket.close(1e3, "Normal Closure");
        }
      },
      terminate() {
        if (connecting) {
          emitter.emit("closed", new TerminatedCloseEvent());
        }
      }
    };
  }
  var TerminatedCloseEvent = class extends Error {
    constructor() {
      super(...arguments);
      this.name = "TerminatedCloseEvent";
      this.message = "4499: Terminated";
      this.code = 4499;
      this.reason = "Terminated";
      this.wasClean = false;
    }
  };
  function isLikeCloseEvent(val) {
    return isObject(val) && "code" in val && "reason" in val;
  }
  function isFatalInternalCloseCode(code) {
    if ([
      1e3,
      1001,
      1006,
      1005,
      1012,
      1013,
      1014
      // Bad Gateway
    ].includes(code))
      return false;
    return code >= 1e3 && code <= 1999;
  }
  function isWebSocket(val) {
    return typeof val === "function" && "constructor" in val && "CLOSED" in val && "CLOSING" in val && "CONNECTING" in val && "OPEN" in val;
  }

  // ../../node_modules/graphql/jsutils/devAssert.mjs
  function devAssert(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
      throw new Error(message);
    }
  }

  // ../../node_modules/graphql/jsutils/isObjectLike.mjs
  function isObjectLike(value) {
    return typeof value == "object" && value !== null;
  }

  // ../../node_modules/graphql/jsutils/invariant.mjs
  function invariant(condition, message) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
      throw new Error(
        message != null ? message : "Unexpected invariant triggered."
      );
    }
  }

  // ../../node_modules/graphql/language/location.mjs
  var LineRegExp = /\r\n|[\n\r]/g;
  function getLocation(source, position) {
    let lastLineStart = 0;
    let line = 1;
    for (const match of source.body.matchAll(LineRegExp)) {
      typeof match.index === "number" || invariant(false);
      if (match.index >= position) {
        break;
      }
      lastLineStart = match.index + match[0].length;
      line += 1;
    }
    return {
      line,
      column: position + 1 - lastLineStart
    };
  }

  // ../../node_modules/graphql/language/printLocation.mjs
  function printLocation(location) {
    return printSourceLocation(
      location.source,
      getLocation(location.source, location.start)
    );
  }
  function printSourceLocation(source, sourceLocation) {
    const firstLineColumnOffset = source.locationOffset.column - 1;
    const body = "".padStart(firstLineColumnOffset) + source.body;
    const lineIndex = sourceLocation.line - 1;
    const lineOffset = source.locationOffset.line - 1;
    const lineNum = sourceLocation.line + lineOffset;
    const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
    const columnNum = sourceLocation.column + columnOffset;
    const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
    const lines = body.split(/\r\n|[\n\r]/g);
    const locationLine = lines[lineIndex];
    if (locationLine.length > 120) {
      const subLineIndex = Math.floor(columnNum / 80);
      const subLineColumnNum = columnNum % 80;
      const subLines = [];
      for (let i = 0; i < locationLine.length; i += 80) {
        subLines.push(locationLine.slice(i, i + 80));
      }
      return locationStr + printPrefixedLines([
        [`${lineNum} |`, subLines[0]],
        ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
        ["|", "^".padStart(subLineColumnNum)],
        ["|", subLines[subLineIndex + 1]]
      ]);
    }
    return locationStr + printPrefixedLines([
      // Lines specified like this: ["prefix", "string"],
      [`${lineNum - 1} |`, lines[lineIndex - 1]],
      [`${lineNum} |`, locationLine],
      ["|", "^".padStart(columnNum)],
      [`${lineNum + 1} |`, lines[lineIndex + 1]]
    ]);
  }
  function printPrefixedLines(lines) {
    const existingLines = lines.filter(([_, line]) => line !== void 0);
    const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
    return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
  }

  // ../../node_modules/graphql/error/GraphQLError.mjs
  function toNormalizedOptions(args) {
    const firstArg = args[0];
    if (firstArg == null || "kind" in firstArg || "length" in firstArg) {
      return {
        nodes: firstArg,
        source: args[1],
        positions: args[2],
        path: args[3],
        originalError: args[4],
        extensions: args[5]
      };
    }
    return firstArg;
  }
  var GraphQLError = class extends Error {
    /**
     * An array of `{ line, column }` locations within the source GraphQL document
     * which correspond to this error.
     *
     * Errors during validation often contain multiple locations, for example to
     * point out two things with the same name. Errors during execution include a
     * single location, the field which produced the error.
     *
     * Enumerable, and appears in the result of JSON.stringify().
     */
    /**
     * An array describing the JSON-path into the execution response which
     * corresponds to this error. Only included for errors during execution.
     *
     * Enumerable, and appears in the result of JSON.stringify().
     */
    /**
     * An array of GraphQL AST Nodes corresponding to this error.
     */
    /**
     * The source GraphQL document for the first location of this error.
     *
     * Note that if this Error represents more than one node, the source may not
     * represent nodes after the first node.
     */
    /**
     * An array of character offsets within the source GraphQL document
     * which correspond to this error.
     */
    /**
     * The original error thrown from a field resolver during execution.
     */
    /**
     * Extension fields to add to the formatted error.
     */
    /**
     * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
     */
    constructor(message, ...rawArgs) {
      var _this$nodes, _nodeLocations$, _ref;
      const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
      super(message);
      this.name = "GraphQLError";
      this.path = path !== null && path !== void 0 ? path : void 0;
      this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
      this.nodes = undefinedIfEmpty(
        Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0
      );
      const nodeLocations = undefinedIfEmpty(
        (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null)
      );
      this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
      this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
      this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
      const originalExtensions = isObjectLike(
        originalError === null || originalError === void 0 ? void 0 : originalError.extensions
      ) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
      this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : /* @__PURE__ */ Object.create(null);
      Object.defineProperties(this, {
        message: {
          writable: true,
          enumerable: true
        },
        name: {
          enumerable: false
        },
        nodes: {
          enumerable: false
        },
        source: {
          enumerable: false
        },
        positions: {
          enumerable: false
        },
        originalError: {
          enumerable: false
        }
      });
      if (originalError !== null && originalError !== void 0 && originalError.stack) {
        Object.defineProperty(this, "stack", {
          value: originalError.stack,
          writable: true,
          configurable: true
        });
      } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, GraphQLError);
      } else {
        Object.defineProperty(this, "stack", {
          value: Error().stack,
          writable: true,
          configurable: true
        });
      }
    }
    get [Symbol.toStringTag]() {
      return "GraphQLError";
    }
    toString() {
      let output = this.message;
      if (this.nodes) {
        for (const node of this.nodes) {
          if (node.loc) {
            output += "\n\n" + printLocation(node.loc);
          }
        }
      } else if (this.source && this.locations) {
        for (const location of this.locations) {
          output += "\n\n" + printSourceLocation(this.source, location);
        }
      }
      return output;
    }
    toJSON() {
      const formattedError = {
        message: this.message
      };
      if (this.locations != null) {
        formattedError.locations = this.locations;
      }
      if (this.path != null) {
        formattedError.path = this.path;
      }
      if (this.extensions != null && Object.keys(this.extensions).length > 0) {
        formattedError.extensions = this.extensions;
      }
      return formattedError;
    }
  };
  function undefinedIfEmpty(array) {
    return array === void 0 || array.length === 0 ? void 0 : array;
  }

  // ../../node_modules/graphql/error/syntaxError.mjs
  function syntaxError(source, position, description) {
    return new GraphQLError(`Syntax Error: ${description}`, {
      source,
      positions: [position]
    });
  }

  // ../../node_modules/graphql/language/ast.mjs
  var Location = class {
    /**
     * The character offset at which this Node begins.
     */
    /**
     * The character offset at which this Node ends.
     */
    /**
     * The Token at which this Node begins.
     */
    /**
     * The Token at which this Node ends.
     */
    /**
     * The Source document the AST represents.
     */
    constructor(startToken, endToken, source) {
      this.start = startToken.start;
      this.end = endToken.end;
      this.startToken = startToken;
      this.endToken = endToken;
      this.source = source;
    }
    get [Symbol.toStringTag]() {
      return "Location";
    }
    toJSON() {
      return {
        start: this.start,
        end: this.end
      };
    }
  };
  var Token = class {
    /**
     * The kind of Token.
     */
    /**
     * The character offset at which this Node begins.
     */
    /**
     * The character offset at which this Node ends.
     */
    /**
     * The 1-indexed line number on which this Token appears.
     */
    /**
     * The 1-indexed column number at which this Token begins.
     */
    /**
     * For non-punctuation tokens, represents the interpreted value of the token.
     *
     * Note: is undefined for punctuation tokens, but typed as string for
     * convenience in the parser.
     */
    /**
     * Tokens exist as nodes in a double-linked-list amongst all tokens
     * including ignored tokens. <SOF> is always the first node and <EOF>
     * the last.
     */
    constructor(kind, start, end, line, column, value) {
      this.kind = kind;
      this.start = start;
      this.end = end;
      this.line = line;
      this.column = column;
      this.value = value;
      this.prev = null;
      this.next = null;
    }
    get [Symbol.toStringTag]() {
      return "Token";
    }
    toJSON() {
      return {
        kind: this.kind,
        value: this.value,
        line: this.line,
        column: this.column
      };
    }
  };
  var QueryDocumentKeys = {
    Name: [],
    Document: ["definitions"],
    OperationDefinition: [
      "name",
      "variableDefinitions",
      "directives",
      "selectionSet"
    ],
    VariableDefinition: ["variable", "type", "defaultValue", "directives"],
    Variable: ["name"],
    SelectionSet: ["selections"],
    Field: ["alias", "name", "arguments", "directives", "selectionSet"],
    Argument: ["name", "value"],
    FragmentSpread: ["name", "directives"],
    InlineFragment: ["typeCondition", "directives", "selectionSet"],
    FragmentDefinition: [
      "name",
      // Note: fragment variable definitions are deprecated and will removed in v17.0.0
      "variableDefinitions",
      "typeCondition",
      "directives",
      "selectionSet"
    ],
    IntValue: [],
    FloatValue: [],
    StringValue: [],
    BooleanValue: [],
    NullValue: [],
    EnumValue: [],
    ListValue: ["values"],
    ObjectValue: ["fields"],
    ObjectField: ["name", "value"],
    Directive: ["name", "arguments"],
    NamedType: ["name"],
    ListType: ["type"],
    NonNullType: ["type"],
    SchemaDefinition: ["description", "directives", "operationTypes"],
    OperationTypeDefinition: ["type"],
    ScalarTypeDefinition: ["description", "name", "directives"],
    ObjectTypeDefinition: [
      "description",
      "name",
      "interfaces",
      "directives",
      "fields"
    ],
    FieldDefinition: ["description", "name", "arguments", "type", "directives"],
    InputValueDefinition: [
      "description",
      "name",
      "type",
      "defaultValue",
      "directives"
    ],
    InterfaceTypeDefinition: [
      "description",
      "name",
      "interfaces",
      "directives",
      "fields"
    ],
    UnionTypeDefinition: ["description", "name", "directives", "types"],
    EnumTypeDefinition: ["description", "name", "directives", "values"],
    EnumValueDefinition: ["description", "name", "directives"],
    InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
    DirectiveDefinition: ["description", "name", "arguments", "locations"],
    SchemaExtension: ["directives", "operationTypes"],
    ScalarTypeExtension: ["name", "directives"],
    ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
    InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
    UnionTypeExtension: ["name", "directives", "types"],
    EnumTypeExtension: ["name", "directives", "values"],
    InputObjectTypeExtension: ["name", "directives", "fields"]
  };
  var kindValues = new Set(Object.keys(QueryDocumentKeys));
  function isNode(maybeNode) {
    const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
    return typeof maybeKind === "string" && kindValues.has(maybeKind);
  }
  var OperationTypeNode;
  (function(OperationTypeNode2) {
    OperationTypeNode2["QUERY"] = "query";
    OperationTypeNode2["MUTATION"] = "mutation";
    OperationTypeNode2["SUBSCRIPTION"] = "subscription";
  })(OperationTypeNode || (OperationTypeNode = {}));

  // ../../node_modules/graphql/language/directiveLocation.mjs
  var DirectiveLocation;
  (function(DirectiveLocation2) {
    DirectiveLocation2["QUERY"] = "QUERY";
    DirectiveLocation2["MUTATION"] = "MUTATION";
    DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
    DirectiveLocation2["FIELD"] = "FIELD";
    DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
    DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
    DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
    DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
    DirectiveLocation2["SCHEMA"] = "SCHEMA";
    DirectiveLocation2["SCALAR"] = "SCALAR";
    DirectiveLocation2["OBJECT"] = "OBJECT";
    DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
    DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
    DirectiveLocation2["INTERFACE"] = "INTERFACE";
    DirectiveLocation2["UNION"] = "UNION";
    DirectiveLocation2["ENUM"] = "ENUM";
    DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
    DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
    DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
  })(DirectiveLocation || (DirectiveLocation = {}));

  // ../../node_modules/graphql/language/kinds.mjs
  var Kind;
  (function(Kind2) {
    Kind2["NAME"] = "Name";
    Kind2["DOCUMENT"] = "Document";
    Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
    Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
    Kind2["SELECTION_SET"] = "SelectionSet";
    Kind2["FIELD"] = "Field";
    Kind2["ARGUMENT"] = "Argument";
    Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
    Kind2["INLINE_FRAGMENT"] = "InlineFragment";
    Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
    Kind2["VARIABLE"] = "Variable";
    Kind2["INT"] = "IntValue";
    Kind2["FLOAT"] = "FloatValue";
    Kind2["STRING"] = "StringValue";
    Kind2["BOOLEAN"] = "BooleanValue";
    Kind2["NULL"] = "NullValue";
    Kind2["ENUM"] = "EnumValue";
    Kind2["LIST"] = "ListValue";
    Kind2["OBJECT"] = "ObjectValue";
    Kind2["OBJECT_FIELD"] = "ObjectField";
    Kind2["DIRECTIVE"] = "Directive";
    Kind2["NAMED_TYPE"] = "NamedType";
    Kind2["LIST_TYPE"] = "ListType";
    Kind2["NON_NULL_TYPE"] = "NonNullType";
    Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
    Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
    Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
    Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
    Kind2["FIELD_DEFINITION"] = "FieldDefinition";
    Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
    Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
    Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
    Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
    Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
    Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
    Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
    Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
    Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
    Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
    Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
    Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
    Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
    Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
  })(Kind || (Kind = {}));

  // ../../node_modules/graphql/language/characterClasses.mjs
  function isWhiteSpace(code) {
    return code === 9 || code === 32;
  }
  function isDigit(code) {
    return code >= 48 && code <= 57;
  }
  function isLetter(code) {
    return code >= 97 && code <= 122 || // A-Z
    code >= 65 && code <= 90;
  }
  function isNameStart(code) {
    return isLetter(code) || code === 95;
  }
  function isNameContinue(code) {
    return isLetter(code) || isDigit(code) || code === 95;
  }

  // ../../node_modules/graphql/language/blockString.mjs
  function dedentBlockStringLines(lines) {
    var _firstNonEmptyLine2;
    let commonIndent = Number.MAX_SAFE_INTEGER;
    let firstNonEmptyLine = null;
    let lastNonEmptyLine = -1;
    for (let i = 0; i < lines.length; ++i) {
      var _firstNonEmptyLine;
      const line = lines[i];
      const indent2 = leadingWhitespace(line);
      if (indent2 === line.length) {
        continue;
      }
      firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i;
      lastNonEmptyLine = i;
      if (i !== 0 && indent2 < commonIndent) {
        commonIndent = indent2;
      }
    }
    return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(
      (_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0,
      lastNonEmptyLine + 1
    );
  }
  function leadingWhitespace(str) {
    let i = 0;
    while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
      ++i;
    }
    return i;
  }
  function printBlockString(value, options) {
    const escapedValue = value.replace(/"""/g, '\\"""');
    const lines = escapedValue.split(/\r\n|[\n\r]/g);
    const isSingleLine = lines.length === 1;
    const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
    const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
    const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
    const hasTrailingSlash = value.endsWith("\\");
    const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
    const printAsMultipleLines = !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
    (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
    let result = "";
    const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
    if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
      result += "\n";
    }
    result += escapedValue;
    if (printAsMultipleLines || forceTrailingNewline) {
      result += "\n";
    }
    return '"""' + result + '"""';
  }

  // ../../node_modules/graphql/language/tokenKind.mjs
  var TokenKind;
  (function(TokenKind2) {
    TokenKind2["SOF"] = "<SOF>";
    TokenKind2["EOF"] = "<EOF>";
    TokenKind2["BANG"] = "!";
    TokenKind2["DOLLAR"] = "$";
    TokenKind2["AMP"] = "&";
    TokenKind2["PAREN_L"] = "(";
    TokenKind2["PAREN_R"] = ")";
    TokenKind2["SPREAD"] = "...";
    TokenKind2["COLON"] = ":";
    TokenKind2["EQUALS"] = "=";
    TokenKind2["AT"] = "@";
    TokenKind2["BRACKET_L"] = "[";
    TokenKind2["BRACKET_R"] = "]";
    TokenKind2["BRACE_L"] = "{";
    TokenKind2["PIPE"] = "|";
    TokenKind2["BRACE_R"] = "}";
    TokenKind2["NAME"] = "Name";
    TokenKind2["INT"] = "Int";
    TokenKind2["FLOAT"] = "Float";
    TokenKind2["STRING"] = "String";
    TokenKind2["BLOCK_STRING"] = "BlockString";
    TokenKind2["COMMENT"] = "Comment";
  })(TokenKind || (TokenKind = {}));

  // ../../node_modules/graphql/language/lexer.mjs
  var Lexer = class {
    /**
     * The previously focused non-ignored token.
     */
    /**
     * The currently focused non-ignored token.
     */
    /**
     * The (1-indexed) line containing the current token.
     */
    /**
     * The character offset at which the current line begins.
     */
    constructor(source) {
      const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
      this.source = source;
      this.lastToken = startOfFileToken;
      this.token = startOfFileToken;
      this.line = 1;
      this.lineStart = 0;
    }
    get [Symbol.toStringTag]() {
      return "Lexer";
    }
    /**
     * Advances the token stream to the next non-ignored token.
     */
    advance() {
      this.lastToken = this.token;
      const token = this.token = this.lookahead();
      return token;
    }
    /**
     * Looks ahead and returns the next non-ignored token, but does not change
     * the state of Lexer.
     */
    lookahead() {
      let token = this.token;
      if (token.kind !== TokenKind.EOF) {
        do {
          if (token.next) {
            token = token.next;
          } else {
            const nextToken = readNextToken(this, token.end);
            token.next = nextToken;
            nextToken.prev = token;
            token = nextToken;
          }
        } while (token.kind === TokenKind.COMMENT);
      }
      return token;
    }
  };
  function isPunctuatorTokenKind(kind) {
    return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
  }
  function isUnicodeScalarValue(code) {
    return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
  }
  function isSupplementaryCodePoint(body, location) {
    return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
  }
  function isLeadingSurrogate(code) {
    return code >= 55296 && code <= 56319;
  }
  function isTrailingSurrogate(code) {
    return code >= 56320 && code <= 57343;
  }
  function printCodePointAt(lexer, location) {
    const code = lexer.source.body.codePointAt(location);
    if (code === void 0) {
      return TokenKind.EOF;
    } else if (code >= 32 && code <= 126) {
      const char = String.fromCodePoint(code);
      return char === '"' ? `'"'` : `"${char}"`;
    }
    return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
  }
  function createToken(lexer, kind, start, end, value) {
    const line = lexer.line;
    const col = 1 + start - lexer.lineStart;
    return new Token(kind, start, end, line, col, value);
  }
  function readNextToken(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      switch (code) {
        case 65279:
        case 9:
        case 32:
        case 44:
          ++position;
          continue;
        case 10:
          ++position;
          ++lexer.line;
          lexer.lineStart = position;
          continue;
        case 13:
          if (body.charCodeAt(position + 1) === 10) {
            position += 2;
          } else {
            ++position;
          }
          ++lexer.line;
          lexer.lineStart = position;
          continue;
        case 35:
          return readComment(lexer, position);
        case 33:
          return createToken(lexer, TokenKind.BANG, position, position + 1);
        case 36:
          return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
        case 38:
          return createToken(lexer, TokenKind.AMP, position, position + 1);
        case 40:
          return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
        case 41:
          return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
        case 46:
          if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
            return createToken(lexer, TokenKind.SPREAD, position, position + 3);
          }
          break;
        case 58:
          return createToken(lexer, TokenKind.COLON, position, position + 1);
        case 61:
          return createToken(lexer, TokenKind.EQUALS, position, position + 1);
        case 64:
          return createToken(lexer, TokenKind.AT, position, position + 1);
        case 91:
          return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
        case 93:
          return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
        case 123:
          return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
        case 124:
          return createToken(lexer, TokenKind.PIPE, position, position + 1);
        case 125:
          return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
        case 34:
          if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
            return readBlockString(lexer, position);
          }
          return readString(lexer, position);
      }
      if (isDigit(code) || code === 45) {
        return readNumber(lexer, position, code);
      }
      if (isNameStart(code)) {
        return readName(lexer, position);
      }
      throw syntaxError(
        lexer.source,
        position,
        code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`
      );
    }
    return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
  }
  function readComment(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 10 || code === 13) {
        break;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        break;
      }
    }
    return createToken(
      lexer,
      TokenKind.COMMENT,
      start,
      position,
      body.slice(start + 1, position)
    );
  }
  function readNumber(lexer, start, firstCode) {
    const body = lexer.source.body;
    let position = start;
    let code = firstCode;
    let isFloat = false;
    if (code === 45) {
      code = body.charCodeAt(++position);
    }
    if (code === 48) {
      code = body.charCodeAt(++position);
      if (isDigit(code)) {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid number, unexpected digit after 0: ${printCodePointAt(
            lexer,
            position
          )}.`
        );
      }
    } else {
      position = readDigits(lexer, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 46) {
      isFloat = true;
      code = body.charCodeAt(++position);
      position = readDigits(lexer, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 69 || code === 101) {
      isFloat = true;
      code = body.charCodeAt(++position);
      if (code === 43 || code === 45) {
        code = body.charCodeAt(++position);
      }
      position = readDigits(lexer, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 46 || isNameStart(code)) {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid number, expected digit but got: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
    return createToken(
      lexer,
      isFloat ? TokenKind.FLOAT : TokenKind.INT,
      start,
      position,
      body.slice(start, position)
    );
  }
  function readDigits(lexer, start, firstCode) {
    if (!isDigit(firstCode)) {
      throw syntaxError(
        lexer.source,
        start,
        `Invalid number, expected digit but got: ${printCodePointAt(
          lexer,
          start
        )}.`
      );
    }
    const body = lexer.source.body;
    let position = start + 1;
    while (isDigit(body.charCodeAt(position))) {
      ++position;
    }
    return position;
  }
  function readString(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    let chunkStart = position;
    let value = "";
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 34) {
        value += body.slice(chunkStart, position);
        return createToken(lexer, TokenKind.STRING, start, position + 1, value);
      }
      if (code === 92) {
        value += body.slice(chunkStart, position);
        const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
        value += escape.value;
        position += escape.size;
        chunkStart = position;
        continue;
      }
      if (code === 10 || code === 13) {
        break;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid character within String: ${printCodePointAt(
            lexer,
            position
          )}.`
        );
      }
    }
    throw syntaxError(lexer.source, position, "Unterminated string.");
  }
  function readEscapedUnicodeVariableWidth(lexer, position) {
    const body = lexer.source.body;
    let point = 0;
    let size = 3;
    while (size < 12) {
      const code = body.charCodeAt(position + size++);
      if (code === 125) {
        if (size < 5 || !isUnicodeScalarValue(point)) {
          break;
        }
        return {
          value: String.fromCodePoint(point),
          size
        };
      }
      point = point << 4 | readHexDigit(code);
      if (point < 0) {
        break;
      }
    }
    throw syntaxError(
      lexer.source,
      position,
      `Invalid Unicode escape sequence: "${body.slice(
        position,
        position + size
      )}".`
    );
  }
  function readEscapedUnicodeFixedWidth(lexer, position) {
    const body = lexer.source.body;
    const code = read16BitHexCode(body, position + 2);
    if (isUnicodeScalarValue(code)) {
      return {
        value: String.fromCodePoint(code),
        size: 6
      };
    }
    if (isLeadingSurrogate(code)) {
      if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
        const trailingCode = read16BitHexCode(body, position + 8);
        if (isTrailingSurrogate(trailingCode)) {
          return {
            value: String.fromCodePoint(code, trailingCode),
            size: 12
          };
        }
      }
    }
    throw syntaxError(
      lexer.source,
      position,
      `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`
    );
  }
  function read16BitHexCode(body, position) {
    return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
  }
  function readHexDigit(code) {
    return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
  }
  function readEscapedCharacter(lexer, position) {
    const body = lexer.source.body;
    const code = body.charCodeAt(position + 1);
    switch (code) {
      case 34:
        return {
          value: '"',
          size: 2
        };
      case 92:
        return {
          value: "\\",
          size: 2
        };
      case 47:
        return {
          value: "/",
          size: 2
        };
      case 98:
        return {
          value: "\b",
          size: 2
        };
      case 102:
        return {
          value: "\f",
          size: 2
        };
      case 110:
        return {
          value: "\n",
          size: 2
        };
      case 114:
        return {
          value: "\r",
          size: 2
        };
      case 116:
        return {
          value: "	",
          size: 2
        };
    }
    throw syntaxError(
      lexer.source,
      position,
      `Invalid character escape sequence: "${body.slice(
        position,
        position + 2
      )}".`
    );
  }
  function readBlockString(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let lineStart = lexer.lineStart;
    let position = start + 3;
    let chunkStart = position;
    let currentLine = "";
    const blockLines = [];
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
        currentLine += body.slice(chunkStart, position);
        blockLines.push(currentLine);
        const token = createToken(
          lexer,
          TokenKind.BLOCK_STRING,
          start,
          position + 3,
          // Return a string of the lines joined with U+000A.
          dedentBlockStringLines(blockLines).join("\n")
        );
        lexer.line += blockLines.length - 1;
        lexer.lineStart = lineStart;
        return token;
      }
      if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
        currentLine += body.slice(chunkStart, position);
        chunkStart = position + 1;
        position += 4;
        continue;
      }
      if (code === 10 || code === 13) {
        currentLine += body.slice(chunkStart, position);
        blockLines.push(currentLine);
        if (code === 13 && body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        currentLine = "";
        chunkStart = position;
        lineStart = position;
        continue;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid character within String: ${printCodePointAt(
            lexer,
            position
          )}.`
        );
      }
    }
    throw syntaxError(lexer.source, position, "Unterminated string.");
  }
  function readName(lexer, start) {
    const body = lexer.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (isNameContinue(code)) {
        ++position;
      } else {
        break;
      }
    }
    return createToken(
      lexer,
      TokenKind.NAME,
      start,
      position,
      body.slice(start, position)
    );
  }

  // ../../node_modules/graphql/jsutils/inspect.mjs
  var MAX_ARRAY_LENGTH = 10;
  var MAX_RECURSIVE_DEPTH = 2;
  function inspect(value) {
    return formatValue(value, []);
  }
  function formatValue(value, seenValues) {
    switch (typeof value) {
      case "string":
        return JSON.stringify(value);
      case "function":
        return value.name ? `[function ${value.name}]` : "[function]";
      case "object":
        return formatObjectValue(value, seenValues);
      default:
        return String(value);
    }
  }
  function formatObjectValue(value, previouslySeenValues) {
    if (value === null) {
      return "null";
    }
    if (previouslySeenValues.includes(value)) {
      return "[Circular]";
    }
    const seenValues = [...previouslySeenValues, value];
    if (isJSONable(value)) {
      const jsonValue = value.toJSON();
      if (jsonValue !== value) {
        return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
      }
    } else if (Array.isArray(value)) {
      return formatArray(value, seenValues);
    }
    return formatObject(value, seenValues);
  }
  function isJSONable(value) {
    return typeof value.toJSON === "function";
  }
  function formatObject(object, seenValues) {
    const entries = Object.entries(object);
    if (entries.length === 0) {
      return "{}";
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
      return "[" + getObjectTag(object) + "]";
    }
    const properties = entries.map(
      ([key, value]) => key + ": " + formatValue(value, seenValues)
    );
    return "{ " + properties.join(", ") + " }";
  }
  function formatArray(array, seenValues) {
    if (array.length === 0) {
      return "[]";
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
      return "[Array]";
    }
    const len = Math.min(MAX_ARRAY_LENGTH, array.length);
    const remaining = array.length - len;
    const items = [];
    for (let i = 0; i < len; ++i) {
      items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
      items.push("... 1 more item");
    } else if (remaining > 1) {
      items.push(`... ${remaining} more items`);
    }
    return "[" + items.join(", ") + "]";
  }
  function getObjectTag(object) {
    const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
    if (tag === "Object" && typeof object.constructor === "function") {
      const name = object.constructor.name;
      if (typeof name === "string" && name !== "") {
        return name;
      }
    }
    return tag;
  }

  // ../../node_modules/graphql/jsutils/instanceOf.mjs
  var instanceOf = (
    /* c8 ignore next 6 */
    // FIXME: https://github.com/graphql/graphql-js/issues/2317
    globalThis.process && globalThis.process.env.NODE_ENV === "production" ? function instanceOf2(value, constructor) {
      return value instanceof constructor;
    } : function instanceOf3(value, constructor) {
      if (value instanceof constructor) {
        return true;
      }
      if (typeof value === "object" && value !== null) {
        var _value$constructor;
        const className = constructor.prototype[Symbol.toStringTag];
        const valueClassName = (
          // We still need to support constructor's name to detect conflicts with older versions of this library.
          Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name
        );
        if (className === valueClassName) {
          const stringifiedValue = inspect(value);
          throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
        }
      }
      return false;
    }
  );

  // ../../node_modules/graphql/language/source.mjs
  var Source = class {
    constructor(body, name = "GraphQL request", locationOffset = {
      line: 1,
      column: 1
    }) {
      typeof body === "string" || devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
      this.body = body;
      this.name = name;
      this.locationOffset = locationOffset;
      this.locationOffset.line > 0 || devAssert(
        false,
        "line in locationOffset is 1-indexed and must be positive."
      );
      this.locationOffset.column > 0 || devAssert(
        false,
        "column in locationOffset is 1-indexed and must be positive."
      );
    }
    get [Symbol.toStringTag]() {
      return "Source";
    }
  };
  function isSource(source) {
    return instanceOf(source, Source);
  }

  // ../../node_modules/graphql/language/parser.mjs
  function parse(source, options) {
    const parser = new Parser(source, options);
    return parser.parseDocument();
  }
  var Parser = class {
    constructor(source, options = {}) {
      const sourceObj = isSource(source) ? source : new Source(source);
      this._lexer = new Lexer(sourceObj);
      this._options = options;
      this._tokenCounter = 0;
    }
    /**
     * Converts a name lex token into a name parse node.
     */
    parseName() {
      const token = this.expectToken(TokenKind.NAME);
      return this.node(token, {
        kind: Kind.NAME,
        value: token.value
      });
    }
    // Implements the parsing rules in the Document section.
    /**
     * Document : Definition+
     */
    parseDocument() {
      return this.node(this._lexer.token, {
        kind: Kind.DOCUMENT,
        definitions: this.many(
          TokenKind.SOF,
          this.parseDefinition,
          TokenKind.EOF
        )
      });
    }
    /**
     * Definition :
     *   - ExecutableDefinition
     *   - TypeSystemDefinition
     *   - TypeSystemExtension
     *
     * ExecutableDefinition :
     *   - OperationDefinition
     *   - FragmentDefinition
     *
     * TypeSystemDefinition :
     *   - SchemaDefinition
     *   - TypeDefinition
     *   - DirectiveDefinition
     *
     * TypeDefinition :
     *   - ScalarTypeDefinition
     *   - ObjectTypeDefinition
     *   - InterfaceTypeDefinition
     *   - UnionTypeDefinition
     *   - EnumTypeDefinition
     *   - InputObjectTypeDefinition
     */
    parseDefinition() {
      if (this.peek(TokenKind.BRACE_L)) {
        return this.parseOperationDefinition();
      }
      const hasDescription = this.peekDescription();
      const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
      if (keywordToken.kind === TokenKind.NAME) {
        switch (keywordToken.value) {
          case "schema":
            return this.parseSchemaDefinition();
          case "scalar":
            return this.parseScalarTypeDefinition();
          case "type":
            return this.parseObjectTypeDefinition();
          case "interface":
            return this.parseInterfaceTypeDefinition();
          case "union":
            return this.parseUnionTypeDefinition();
          case "enum":
            return this.parseEnumTypeDefinition();
          case "input":
            return this.parseInputObjectTypeDefinition();
          case "directive":
            return this.parseDirectiveDefinition();
        }
        if (hasDescription) {
          throw syntaxError(
            this._lexer.source,
            this._lexer.token.start,
            "Unexpected description, descriptions are supported only on type definitions."
          );
        }
        switch (keywordToken.value) {
          case "query":
          case "mutation":
          case "subscription":
            return this.parseOperationDefinition();
          case "fragment":
            return this.parseFragmentDefinition();
          case "extend":
            return this.parseTypeSystemExtension();
        }
      }
      throw this.unexpected(keywordToken);
    }
    // Implements the parsing rules in the Operations section.
    /**
     * OperationDefinition :
     *  - SelectionSet
     *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
     */
    parseOperationDefinition() {
      const start = this._lexer.token;
      if (this.peek(TokenKind.BRACE_L)) {
        return this.node(start, {
          kind: Kind.OPERATION_DEFINITION,
          operation: OperationTypeNode.QUERY,
          name: void 0,
          variableDefinitions: [],
          directives: [],
          selectionSet: this.parseSelectionSet()
        });
      }
      const operation = this.parseOperationType();
      let name;
      if (this.peek(TokenKind.NAME)) {
        name = this.parseName();
      }
      return this.node(start, {
        kind: Kind.OPERATION_DEFINITION,
        operation,
        name,
        variableDefinitions: this.parseVariableDefinitions(),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * OperationType : one of query mutation subscription
     */
    parseOperationType() {
      const operationToken = this.expectToken(TokenKind.NAME);
      switch (operationToken.value) {
        case "query":
          return OperationTypeNode.QUERY;
        case "mutation":
          return OperationTypeNode.MUTATION;
        case "subscription":
          return OperationTypeNode.SUBSCRIPTION;
      }
      throw this.unexpected(operationToken);
    }
    /**
     * VariableDefinitions : ( VariableDefinition+ )
     */
    parseVariableDefinitions() {
      return this.optionalMany(
        TokenKind.PAREN_L,
        this.parseVariableDefinition,
        TokenKind.PAREN_R
      );
    }
    /**
     * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
     */
    parseVariableDefinition() {
      return this.node(this._lexer.token, {
        kind: Kind.VARIABLE_DEFINITION,
        variable: this.parseVariable(),
        type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
        defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
        directives: this.parseConstDirectives()
      });
    }
    /**
     * Variable : $ Name
     */
    parseVariable() {
      const start = this._lexer.token;
      this.expectToken(TokenKind.DOLLAR);
      return this.node(start, {
        kind: Kind.VARIABLE,
        name: this.parseName()
      });
    }
    /**
     * ```
     * SelectionSet : { Selection+ }
     * ```
     */
    parseSelectionSet() {
      return this.node(this._lexer.token, {
        kind: Kind.SELECTION_SET,
        selections: this.many(
          TokenKind.BRACE_L,
          this.parseSelection,
          TokenKind.BRACE_R
        )
      });
    }
    /**
     * Selection :
     *   - Field
     *   - FragmentSpread
     *   - InlineFragment
     */
    parseSelection() {
      return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
    }
    /**
     * Field : Alias? Name Arguments? Directives? SelectionSet?
     *
     * Alias : Name :
     */
    parseField() {
      const start = this._lexer.token;
      const nameOrAlias = this.parseName();
      let alias;
      let name;
      if (this.expectOptionalToken(TokenKind.COLON)) {
        alias = nameOrAlias;
        name = this.parseName();
      } else {
        name = nameOrAlias;
      }
      return this.node(start, {
        kind: Kind.FIELD,
        alias,
        name,
        arguments: this.parseArguments(false),
        directives: this.parseDirectives(false),
        selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
      });
    }
    /**
     * Arguments[Const] : ( Argument[?Const]+ )
     */
    parseArguments(isConst) {
      const item = isConst ? this.parseConstArgument : this.parseArgument;
      return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
    }
    /**
     * Argument[Const] : Name : Value[?Const]
     */
    parseArgument(isConst = false) {
      const start = this._lexer.token;
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      return this.node(start, {
        kind: Kind.ARGUMENT,
        name,
        value: this.parseValueLiteral(isConst)
      });
    }
    parseConstArgument() {
      return this.parseArgument(true);
    }
    // Implements the parsing rules in the Fragments section.
    /**
     * Corresponds to both FragmentSpread and InlineFragment in the spec.
     *
     * FragmentSpread : ... FragmentName Directives?
     *
     * InlineFragment : ... TypeCondition? Directives? SelectionSet
     */
    parseFragment() {
      const start = this._lexer.token;
      this.expectToken(TokenKind.SPREAD);
      const hasTypeCondition = this.expectOptionalKeyword("on");
      if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
        return this.node(start, {
          kind: Kind.FRAGMENT_SPREAD,
          name: this.parseFragmentName(),
          directives: this.parseDirectives(false)
        });
      }
      return this.node(start, {
        kind: Kind.INLINE_FRAGMENT,
        typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * FragmentDefinition :
     *   - fragment FragmentName on TypeCondition Directives? SelectionSet
     *
     * TypeCondition : NamedType
     */
    parseFragmentDefinition() {
      const start = this._lexer.token;
      this.expectKeyword("fragment");
      if (this._options.allowLegacyFragmentVariables === true) {
        return this.node(start, {
          kind: Kind.FRAGMENT_DEFINITION,
          name: this.parseFragmentName(),
          variableDefinitions: this.parseVariableDefinitions(),
          typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet()
        });
      }
      return this.node(start, {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * FragmentName : Name but not `on`
     */
    parseFragmentName() {
      if (this._lexer.token.value === "on") {
        throw this.unexpected();
      }
      return this.parseName();
    }
    // Implements the parsing rules in the Values section.
    /**
     * Value[Const] :
     *   - [~Const] Variable
     *   - IntValue
     *   - FloatValue
     *   - StringValue
     *   - BooleanValue
     *   - NullValue
     *   - EnumValue
     *   - ListValue[?Const]
     *   - ObjectValue[?Const]
     *
     * BooleanValue : one of `true` `false`
     *
     * NullValue : `null`
     *
     * EnumValue : Name but not `true`, `false` or `null`
     */
    parseValueLiteral(isConst) {
      const token = this._lexer.token;
      switch (token.kind) {
        case TokenKind.BRACKET_L:
          return this.parseList(isConst);
        case TokenKind.BRACE_L:
          return this.parseObject(isConst);
        case TokenKind.INT:
          this.advanceLexer();
          return this.node(token, {
            kind: Kind.INT,
            value: token.value
          });
        case TokenKind.FLOAT:
          this.advanceLexer();
          return this.node(token, {
            kind: Kind.FLOAT,
            value: token.value
          });
        case TokenKind.STRING:
        case TokenKind.BLOCK_STRING:
          return this.parseStringLiteral();
        case TokenKind.NAME:
          this.advanceLexer();
          switch (token.value) {
            case "true":
              return this.node(token, {
                kind: Kind.BOOLEAN,
                value: true
              });
            case "false":
              return this.node(token, {
                kind: Kind.BOOLEAN,
                value: false
              });
            case "null":
              return this.node(token, {
                kind: Kind.NULL
              });
            default:
              return this.node(token, {
                kind: Kind.ENUM,
                value: token.value
              });
          }
        case TokenKind.DOLLAR:
          if (isConst) {
            this.expectToken(TokenKind.DOLLAR);
            if (this._lexer.token.kind === TokenKind.NAME) {
              const varName = this._lexer.token.value;
              throw syntaxError(
                this._lexer.source,
                token.start,
                `Unexpected variable "$${varName}" in constant value.`
              );
            } else {
              throw this.unexpected(token);
            }
          }
          return this.parseVariable();
        default:
          throw this.unexpected();
      }
    }
    parseConstValueLiteral() {
      return this.parseValueLiteral(true);
    }
    parseStringLiteral() {
      const token = this._lexer.token;
      this.advanceLexer();
      return this.node(token, {
        kind: Kind.STRING,
        value: token.value,
        block: token.kind === TokenKind.BLOCK_STRING
      });
    }
    /**
     * ListValue[Const] :
     *   - [ ]
     *   - [ Value[?Const]+ ]
     */
    parseList(isConst) {
      const item = () => this.parseValueLiteral(isConst);
      return this.node(this._lexer.token, {
        kind: Kind.LIST,
        values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
      });
    }
    /**
     * ```
     * ObjectValue[Const] :
     *   - { }
     *   - { ObjectField[?Const]+ }
     * ```
     */
    parseObject(isConst) {
      const item = () => this.parseObjectField(isConst);
      return this.node(this._lexer.token, {
        kind: Kind.OBJECT,
        fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
      });
    }
    /**
     * ObjectField[Const] : Name : Value[?Const]
     */
    parseObjectField(isConst) {
      const start = this._lexer.token;
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      return this.node(start, {
        kind: Kind.OBJECT_FIELD,
        name,
        value: this.parseValueLiteral(isConst)
      });
    }
    // Implements the parsing rules in the Directives section.
    /**
     * Directives[Const] : Directive[?Const]+
     */
    parseDirectives(isConst) {
      const directives = [];
      while (this.peek(TokenKind.AT)) {
        directives.push(this.parseDirective(isConst));
      }
      return directives;
    }
    parseConstDirectives() {
      return this.parseDirectives(true);
    }
    /**
     * ```
     * Directive[Const] : @ Name Arguments[?Const]?
     * ```
     */
    parseDirective(isConst) {
      const start = this._lexer.token;
      this.expectToken(TokenKind.AT);
      return this.node(start, {
        kind: Kind.DIRECTIVE,
        name: this.parseName(),
        arguments: this.parseArguments(isConst)
      });
    }
    // Implements the parsing rules in the Types section.
    /**
     * Type :
     *   - NamedType
     *   - ListType
     *   - NonNullType
     */
    parseTypeReference() {
      const start = this._lexer.token;
      let type;
      if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
        const innerType = this.parseTypeReference();
        this.expectToken(TokenKind.BRACKET_R);
        type = this.node(start, {
          kind: Kind.LIST_TYPE,
          type: innerType
        });
      } else {
        type = this.parseNamedType();
      }
      if (this.expectOptionalToken(TokenKind.BANG)) {
        return this.node(start, {
          kind: Kind.NON_NULL_TYPE,
          type
        });
      }
      return type;
    }
    /**
     * NamedType : Name
     */
    parseNamedType() {
      return this.node(this._lexer.token, {
        kind: Kind.NAMED_TYPE,
        name: this.parseName()
      });
    }
    // Implements the parsing rules in the Type Definition section.
    peekDescription() {
      return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
    }
    /**
     * Description : StringValue
     */
    parseDescription() {
      if (this.peekDescription()) {
        return this.parseStringLiteral();
      }
    }
    /**
     * ```
     * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
     * ```
     */
    parseSchemaDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("schema");
      const directives = this.parseConstDirectives();
      const operationTypes = this.many(
        TokenKind.BRACE_L,
        this.parseOperationTypeDefinition,
        TokenKind.BRACE_R
      );
      return this.node(start, {
        kind: Kind.SCHEMA_DEFINITION,
        description,
        directives,
        operationTypes
      });
    }
    /**
     * OperationTypeDefinition : OperationType : NamedType
     */
    parseOperationTypeDefinition() {
      const start = this._lexer.token;
      const operation = this.parseOperationType();
      this.expectToken(TokenKind.COLON);
      const type = this.parseNamedType();
      return this.node(start, {
        kind: Kind.OPERATION_TYPE_DEFINITION,
        operation,
        type
      });
    }
    /**
     * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
     */
    parseScalarTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("scalar");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.SCALAR_TYPE_DEFINITION,
        description,
        name,
        directives
      });
    }
    /**
     * ObjectTypeDefinition :
     *   Description?
     *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
     */
    parseObjectTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("type");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      return this.node(start, {
        kind: Kind.OBJECT_TYPE_DEFINITION,
        description,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * ImplementsInterfaces :
     *   - implements `&`? NamedType
     *   - ImplementsInterfaces & NamedType
     */
    parseImplementsInterfaces() {
      return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : [];
    }
    /**
     * ```
     * FieldsDefinition : { FieldDefinition+ }
     * ```
     */
    parseFieldsDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseFieldDefinition,
        TokenKind.BRACE_R
      );
    }
    /**
     * FieldDefinition :
     *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
     */
    parseFieldDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseName();
      const args = this.parseArgumentDefs();
      this.expectToken(TokenKind.COLON);
      const type = this.parseTypeReference();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.FIELD_DEFINITION,
        description,
        name,
        arguments: args,
        type,
        directives
      });
    }
    /**
     * ArgumentsDefinition : ( InputValueDefinition+ )
     */
    parseArgumentDefs() {
      return this.optionalMany(
        TokenKind.PAREN_L,
        this.parseInputValueDef,
        TokenKind.PAREN_R
      );
    }
    /**
     * InputValueDefinition :
     *   - Description? Name : Type DefaultValue? Directives[Const]?
     */
    parseInputValueDef() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      const type = this.parseTypeReference();
      let defaultValue;
      if (this.expectOptionalToken(TokenKind.EQUALS)) {
        defaultValue = this.parseConstValueLiteral();
      }
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.INPUT_VALUE_DEFINITION,
        description,
        name,
        type,
        defaultValue,
        directives
      });
    }
    /**
     * InterfaceTypeDefinition :
     *   - Description? interface Name Directives[Const]? FieldsDefinition?
     */
    parseInterfaceTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("interface");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      return this.node(start, {
        kind: Kind.INTERFACE_TYPE_DEFINITION,
        description,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * UnionTypeDefinition :
     *   - Description? union Name Directives[Const]? UnionMemberTypes?
     */
    parseUnionTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("union");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const types = this.parseUnionMemberTypes();
      return this.node(start, {
        kind: Kind.UNION_TYPE_DEFINITION,
        description,
        name,
        directives,
        types
      });
    }
    /**
     * UnionMemberTypes :
     *   - = `|`? NamedType
     *   - UnionMemberTypes | NamedType
     */
    parseUnionMemberTypes() {
      return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
    }
    /**
     * EnumTypeDefinition :
     *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
     */
    parseEnumTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("enum");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const values = this.parseEnumValuesDefinition();
      return this.node(start, {
        kind: Kind.ENUM_TYPE_DEFINITION,
        description,
        name,
        directives,
        values
      });
    }
    /**
     * ```
     * EnumValuesDefinition : { EnumValueDefinition+ }
     * ```
     */
    parseEnumValuesDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseEnumValueDefinition,
        TokenKind.BRACE_R
      );
    }
    /**
     * EnumValueDefinition : Description? EnumValue Directives[Const]?
     */
    parseEnumValueDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseEnumValueName();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.ENUM_VALUE_DEFINITION,
        description,
        name,
        directives
      });
    }
    /**
     * EnumValue : Name but not `true`, `false` or `null`
     */
    parseEnumValueName() {
      if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
        throw syntaxError(
          this._lexer.source,
          this._lexer.token.start,
          `${getTokenDesc(
            this._lexer.token
          )} is reserved and cannot be used for an enum value.`
        );
      }
      return this.parseName();
    }
    /**
     * InputObjectTypeDefinition :
     *   - Description? input Name Directives[Const]? InputFieldsDefinition?
     */
    parseInputObjectTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("input");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const fields = this.parseInputFieldsDefinition();
      return this.node(start, {
        kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
        description,
        name,
        directives,
        fields
      });
    }
    /**
     * ```
     * InputFieldsDefinition : { InputValueDefinition+ }
     * ```
     */
    parseInputFieldsDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseInputValueDef,
        TokenKind.BRACE_R
      );
    }
    /**
     * TypeSystemExtension :
     *   - SchemaExtension
     *   - TypeExtension
     *
     * TypeExtension :
     *   - ScalarTypeExtension
     *   - ObjectTypeExtension
     *   - InterfaceTypeExtension
     *   - UnionTypeExtension
     *   - EnumTypeExtension
     *   - InputObjectTypeDefinition
     */
    parseTypeSystemExtension() {
      const keywordToken = this._lexer.lookahead();
      if (keywordToken.kind === TokenKind.NAME) {
        switch (keywordToken.value) {
          case "schema":
            return this.parseSchemaExtension();
          case "scalar":
            return this.parseScalarTypeExtension();
          case "type":
            return this.parseObjectTypeExtension();
          case "interface":
            return this.parseInterfaceTypeExtension();
          case "union":
            return this.parseUnionTypeExtension();
          case "enum":
            return this.parseEnumTypeExtension();
          case "input":
            return this.parseInputObjectTypeExtension();
        }
      }
      throw this.unexpected(keywordToken);
    }
    /**
     * ```
     * SchemaExtension :
     *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
     *  - extend schema Directives[Const]
     * ```
     */
    parseSchemaExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("schema");
      const directives = this.parseConstDirectives();
      const operationTypes = this.optionalMany(
        TokenKind.BRACE_L,
        this.parseOperationTypeDefinition,
        TokenKind.BRACE_R
      );
      if (directives.length === 0 && operationTypes.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.SCHEMA_EXTENSION,
        directives,
        operationTypes
      });
    }
    /**
     * ScalarTypeExtension :
     *   - extend scalar Name Directives[Const]
     */
    parseScalarTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("scalar");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      if (directives.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.SCALAR_TYPE_EXTENSION,
        name,
        directives
      });
    }
    /**
     * ObjectTypeExtension :
     *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
     *  - extend type Name ImplementsInterfaces? Directives[Const]
     *  - extend type Name ImplementsInterfaces
     */
    parseObjectTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("type");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.OBJECT_TYPE_EXTENSION,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * InterfaceTypeExtension :
     *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
     *  - extend interface Name ImplementsInterfaces? Directives[Const]
     *  - extend interface Name ImplementsInterfaces
     */
    parseInterfaceTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("interface");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.INTERFACE_TYPE_EXTENSION,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * UnionTypeExtension :
     *   - extend union Name Directives[Const]? UnionMemberTypes
     *   - extend union Name Directives[Const]
     */
    parseUnionTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("union");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const types = this.parseUnionMemberTypes();
      if (directives.length === 0 && types.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.UNION_TYPE_EXTENSION,
        name,
        directives,
        types
      });
    }
    /**
     * EnumTypeExtension :
     *   - extend enum Name Directives[Const]? EnumValuesDefinition
     *   - extend enum Name Directives[Const]
     */
    parseEnumTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("enum");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const values = this.parseEnumValuesDefinition();
      if (directives.length === 0 && values.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.ENUM_TYPE_EXTENSION,
        name,
        directives,
        values
      });
    }
    /**
     * InputObjectTypeExtension :
     *   - extend input Name Directives[Const]? InputFieldsDefinition
     *   - extend input Name Directives[Const]
     */
    parseInputObjectTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("input");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const fields = this.parseInputFieldsDefinition();
      if (directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
        name,
        directives,
        fields
      });
    }
    /**
     * ```
     * DirectiveDefinition :
     *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
     * ```
     */
    parseDirectiveDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("directive");
      this.expectToken(TokenKind.AT);
      const name = this.parseName();
      const args = this.parseArgumentDefs();
      const repeatable = this.expectOptionalKeyword("repeatable");
      this.expectKeyword("on");
      const locations = this.parseDirectiveLocations();
      return this.node(start, {
        kind: Kind.DIRECTIVE_DEFINITION,
        description,
        name,
        arguments: args,
        repeatable,
        locations
      });
    }
    /**
     * DirectiveLocations :
     *   - `|`? DirectiveLocation
     *   - DirectiveLocations | DirectiveLocation
     */
    parseDirectiveLocations() {
      return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
    }
    /*
     * DirectiveLocation :
     *   - ExecutableDirectiveLocation
     *   - TypeSystemDirectiveLocation
     *
     * ExecutableDirectiveLocation : one of
     *   `QUERY`
     *   `MUTATION`
     *   `SUBSCRIPTION`
     *   `FIELD`
     *   `FRAGMENT_DEFINITION`
     *   `FRAGMENT_SPREAD`
     *   `INLINE_FRAGMENT`
     *
     * TypeSystemDirectiveLocation : one of
     *   `SCHEMA`
     *   `SCALAR`
     *   `OBJECT`
     *   `FIELD_DEFINITION`
     *   `ARGUMENT_DEFINITION`
     *   `INTERFACE`
     *   `UNION`
     *   `ENUM`
     *   `ENUM_VALUE`
     *   `INPUT_OBJECT`
     *   `INPUT_FIELD_DEFINITION`
     */
    parseDirectiveLocation() {
      const start = this._lexer.token;
      const name = this.parseName();
      if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
        return name;
      }
      throw this.unexpected(start);
    }
    // Core parsing utility functions
    /**
     * Returns a node that, if configured to do so, sets a "loc" field as a
     * location object, used to identify the place in the source that created a
     * given parsed object.
     */
    node(startToken, node) {
      if (this._options.noLocation !== true) {
        node.loc = new Location(
          startToken,
          this._lexer.lastToken,
          this._lexer.source
        );
      }
      return node;
    }
    /**
     * Determines if the next token is of a given kind
     */
    peek(kind) {
      return this._lexer.token.kind === kind;
    }
    /**
     * If the next token is of the given kind, return that token after advancing the lexer.
     * Otherwise, do not change the parser state and throw an error.
     */
    expectToken(kind) {
      const token = this._lexer.token;
      if (token.kind === kind) {
        this.advanceLexer();
        return token;
      }
      throw syntaxError(
        this._lexer.source,
        token.start,
        `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`
      );
    }
    /**
     * If the next token is of the given kind, return "true" after advancing the lexer.
     * Otherwise, do not change the parser state and return "false".
     */
    expectOptionalToken(kind) {
      const token = this._lexer.token;
      if (token.kind === kind) {
        this.advanceLexer();
        return true;
      }
      return false;
    }
    /**
     * If the next token is a given keyword, advance the lexer.
     * Otherwise, do not change the parser state and throw an error.
     */
    expectKeyword(value) {
      const token = this._lexer.token;
      if (token.kind === TokenKind.NAME && token.value === value) {
        this.advanceLexer();
      } else {
        throw syntaxError(
          this._lexer.source,
          token.start,
          `Expected "${value}", found ${getTokenDesc(token)}.`
        );
      }
    }
    /**
     * If the next token is a given keyword, return "true" after advancing the lexer.
     * Otherwise, do not change the parser state and return "false".
     */
    expectOptionalKeyword(value) {
      const token = this._lexer.token;
      if (token.kind === TokenKind.NAME && token.value === value) {
        this.advanceLexer();
        return true;
      }
      return false;
    }
    /**
     * Helper function for creating an error when an unexpected lexed token is encountered.
     */
    unexpected(atToken) {
      const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
      return syntaxError(
        this._lexer.source,
        token.start,
        `Unexpected ${getTokenDesc(token)}.`
      );
    }
    /**
     * Returns a possibly empty list of parse nodes, determined by the parseFn.
     * This list begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    any(openKind, parseFn, closeKind) {
      this.expectToken(openKind);
      const nodes = [];
      while (!this.expectOptionalToken(closeKind)) {
        nodes.push(parseFn.call(this));
      }
      return nodes;
    }
    /**
     * Returns a list of parse nodes, determined by the parseFn.
     * It can be empty only if open token is missing otherwise it will always return non-empty list
     * that begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    optionalMany(openKind, parseFn, closeKind) {
      if (this.expectOptionalToken(openKind)) {
        const nodes = [];
        do {
          nodes.push(parseFn.call(this));
        } while (!this.expectOptionalToken(closeKind));
        return nodes;
      }
      return [];
    }
    /**
     * Returns a non-empty list of parse nodes, determined by the parseFn.
     * This list begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    many(openKind, parseFn, closeKind) {
      this.expectToken(openKind);
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    /**
     * Returns a non-empty list of parse nodes, determined by the parseFn.
     * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
     * Advances the parser to the next lex token after last item in the list.
     */
    delimitedMany(delimiterKind, parseFn) {
      this.expectOptionalToken(delimiterKind);
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (this.expectOptionalToken(delimiterKind));
      return nodes;
    }
    advanceLexer() {
      const { maxTokens } = this._options;
      const token = this._lexer.advance();
      if (maxTokens !== void 0 && token.kind !== TokenKind.EOF) {
        ++this._tokenCounter;
        if (this._tokenCounter > maxTokens) {
          throw syntaxError(
            this._lexer.source,
            token.start,
            `Document contains more that ${maxTokens} tokens. Parsing aborted.`
          );
        }
      }
    }
  };
  function getTokenDesc(token) {
    const value = token.value;
    return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
  }
  function getTokenKindDesc(kind) {
    return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
  }

  // ../../node_modules/graphql/language/printString.mjs
  function printString(str) {
    return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
  }
  var escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
  function escapedReplacer(str) {
    return escapeSequences[str.charCodeAt(0)];
  }
  var escapeSequences = [
    "\\u0000",
    "\\u0001",
    "\\u0002",
    "\\u0003",
    "\\u0004",
    "\\u0005",
    "\\u0006",
    "\\u0007",
    "\\b",
    "\\t",
    "\\n",
    "\\u000B",
    "\\f",
    "\\r",
    "\\u000E",
    "\\u000F",
    "\\u0010",
    "\\u0011",
    "\\u0012",
    "\\u0013",
    "\\u0014",
    "\\u0015",
    "\\u0016",
    "\\u0017",
    "\\u0018",
    "\\u0019",
    "\\u001A",
    "\\u001B",
    "\\u001C",
    "\\u001D",
    "\\u001E",
    "\\u001F",
    "",
    "",
    '\\"',
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 2F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 3F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 4F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "\\\\",
    "",
    "",
    "",
    // 5F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // 6F
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "\\u007F",
    "\\u0080",
    "\\u0081",
    "\\u0082",
    "\\u0083",
    "\\u0084",
    "\\u0085",
    "\\u0086",
    "\\u0087",
    "\\u0088",
    "\\u0089",
    "\\u008A",
    "\\u008B",
    "\\u008C",
    "\\u008D",
    "\\u008E",
    "\\u008F",
    "\\u0090",
    "\\u0091",
    "\\u0092",
    "\\u0093",
    "\\u0094",
    "\\u0095",
    "\\u0096",
    "\\u0097",
    "\\u0098",
    "\\u0099",
    "\\u009A",
    "\\u009B",
    "\\u009C",
    "\\u009D",
    "\\u009E",
    "\\u009F"
  ];

  // ../../node_modules/graphql/language/visitor.mjs
  var BREAK = Object.freeze({});
  function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
    const enterLeaveMap = /* @__PURE__ */ new Map();
    for (const kind of Object.values(Kind)) {
      enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
    }
    let stack = void 0;
    let inArray = Array.isArray(root);
    let keys = [root];
    let index = -1;
    let edits = [];
    let node = root;
    let key = void 0;
    let parent = void 0;
    const path = [];
    const ancestors = [];
    do {
      index++;
      const isLeaving = index === keys.length;
      const isEdited = isLeaving && edits.length !== 0;
      if (isLeaving) {
        key = ancestors.length === 0 ? void 0 : path[path.length - 1];
        node = parent;
        parent = ancestors.pop();
        if (isEdited) {
          if (inArray) {
            node = node.slice();
            let editOffset = 0;
            for (const [editKey, editValue] of edits) {
              const arrayKey = editKey - editOffset;
              if (editValue === null) {
                node.splice(arrayKey, 1);
                editOffset++;
              } else {
                node[arrayKey] = editValue;
              }
            }
          } else {
            node = Object.defineProperties(
              {},
              Object.getOwnPropertyDescriptors(node)
            );
            for (const [editKey, editValue] of edits) {
              node[editKey] = editValue;
            }
          }
        }
        index = stack.index;
        keys = stack.keys;
        edits = stack.edits;
        inArray = stack.inArray;
        stack = stack.prev;
      } else if (parent) {
        key = inArray ? index : keys[index];
        node = parent[key];
        if (node === null || node === void 0) {
          continue;
        }
        path.push(key);
      }
      let result;
      if (!Array.isArray(node)) {
        var _enterLeaveMap$get, _enterLeaveMap$get2;
        isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
        const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
        result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
        if (result === BREAK) {
          break;
        }
        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== void 0) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
      if (result === void 0 && isEdited) {
        edits.push([key, node]);
      }
      if (isLeaving) {
        path.pop();
      } else {
        var _node$kind;
        stack = {
          inArray,
          index,
          keys,
          edits,
          prev: stack
        };
        inArray = Array.isArray(node);
        keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
        index = -1;
        edits = [];
        if (parent) {
          ancestors.push(parent);
        }
        parent = node;
      }
    } while (stack !== void 0);
    if (edits.length !== 0) {
      return edits[edits.length - 1][1];
    }
    return root;
  }
  function getEnterLeaveForKind(visitor, kind) {
    const kindVisitor = visitor[kind];
    if (typeof kindVisitor === "object") {
      return kindVisitor;
    } else if (typeof kindVisitor === "function") {
      return {
        enter: kindVisitor,
        leave: void 0
      };
    }
    return {
      enter: visitor.enter,
      leave: visitor.leave
    };
  }

  // ../../node_modules/graphql/language/printer.mjs
  function print(ast) {
    return visit(ast, printDocASTReducer);
  }
  var MAX_LINE_LENGTH = 80;
  var printDocASTReducer = {
    Name: {
      leave: (node) => node.value
    },
    Variable: {
      leave: (node) => "$" + node.name
    },
    // Document
    Document: {
      leave: (node) => join(node.definitions, "\n\n")
    },
    OperationDefinition: {
      leave(node) {
        const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
        const prefix = join(
          [
            node.operation,
            join([node.name, varDefs]),
            join(node.directives, " ")
          ],
          " "
        );
        return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
      }
    },
    VariableDefinition: {
      leave: ({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "))
    },
    SelectionSet: {
      leave: ({ selections }) => block(selections)
    },
    Field: {
      leave({ alias, name, arguments: args, directives, selectionSet }) {
        const prefix = wrap("", alias, ": ") + name;
        let argsLine = prefix + wrap("(", join(args, ", "), ")");
        if (argsLine.length > MAX_LINE_LENGTH) {
          argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
        }
        return join([argsLine, join(directives, " "), selectionSet], " ");
      }
    },
    Argument: {
      leave: ({ name, value }) => name + ": " + value
    },
    // Fragments
    FragmentSpread: {
      leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " "))
    },
    InlineFragment: {
      leave: ({ typeCondition, directives, selectionSet }) => join(
        [
          "...",
          wrap("on ", typeCondition),
          join(directives, " "),
          selectionSet
        ],
        " "
      )
    },
    FragmentDefinition: {
      leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => (
        // or removed in the future.
        `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
      )
    },
    // Value
    IntValue: {
      leave: ({ value }) => value
    },
    FloatValue: {
      leave: ({ value }) => value
    },
    StringValue: {
      leave: ({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value)
    },
    BooleanValue: {
      leave: ({ value }) => value ? "true" : "false"
    },
    NullValue: {
      leave: () => "null"
    },
    EnumValue: {
      leave: ({ value }) => value
    },
    ListValue: {
      leave: ({ values }) => "[" + join(values, ", ") + "]"
    },
    ObjectValue: {
      leave: ({ fields }) => "{" + join(fields, ", ") + "}"
    },
    ObjectField: {
      leave: ({ name, value }) => name + ": " + value
    },
    // Directive
    Directive: {
      leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")")
    },
    // Type
    NamedType: {
      leave: ({ name }) => name
    },
    ListType: {
      leave: ({ type }) => "[" + type + "]"
    },
    NonNullType: {
      leave: ({ type }) => type + "!"
    },
    // Type System Definitions
    SchemaDefinition: {
      leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " ")
    },
    OperationTypeDefinition: {
      leave: ({ operation, type }) => operation + ": " + type
    },
    ScalarTypeDefinition: {
      leave: ({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " ")
    },
    ObjectTypeDefinition: {
      leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
        [
          "type",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    FieldDefinition: {
      leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "))
    },
    InputValueDefinition: {
      leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join(
        [name + ": " + type, wrap("= ", defaultValue), join(directives, " ")],
        " "
      )
    },
    InterfaceTypeDefinition: {
      leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
        [
          "interface",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    UnionTypeDefinition: {
      leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join(
        ["union", name, join(directives, " "), wrap("= ", join(types, " | "))],
        " "
      )
    },
    EnumTypeDefinition: {
      leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " ")
    },
    EnumValueDefinition: {
      leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ")
    },
    InputObjectTypeDefinition: {
      leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " ")
    },
    DirectiveDefinition: {
      leave: ({ description, name, arguments: args, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ")
    },
    SchemaExtension: {
      leave: ({ directives, operationTypes }) => join(
        ["extend schema", join(directives, " "), block(operationTypes)],
        " "
      )
    },
    ScalarTypeExtension: {
      leave: ({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " ")
    },
    ObjectTypeExtension: {
      leave: ({ name, interfaces, directives, fields }) => join(
        [
          "extend type",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    InterfaceTypeExtension: {
      leave: ({ name, interfaces, directives, fields }) => join(
        [
          "extend interface",
          name,
          wrap("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields)
        ],
        " "
      )
    },
    UnionTypeExtension: {
      leave: ({ name, directives, types }) => join(
        [
          "extend union",
          name,
          join(directives, " "),
          wrap("= ", join(types, " | "))
        ],
        " "
      )
    },
    EnumTypeExtension: {
      leave: ({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " ")
    },
    InputObjectTypeExtension: {
      leave: ({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " ")
    }
  };
  function join(maybeArray, separator = "") {
    var _maybeArray$filter$jo;
    return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
  }
  function block(array) {
    return wrap("{\n", indent(join(array, "\n")), "\n}");
  }
  function wrap(start, maybeString, end = "") {
    return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
  }
  function indent(str) {
    return wrap("  ", str.replace(/\n/g, "\n  "));
  }
  function hasMultilineItems(maybeArray) {
    var _maybeArray$some;
    return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
  }

  // ../notifi-graphql/lib/NotifiSubscriptionService.ts
  var NotifiSubscriptionService = class {
    constructor(wsurl) {
      this.wsurl = wsurl;
      this.disposeClient = () => {
        if (this.wsClient) {
          this.jwt = void 0;
          this.wsClient.terminate();
          this.wsClient.dispose();
        }
      };
      this.subscribe = (jwt, subscriptionQuery, onMessageReceived, onError, onComplete) => {
        var _a;
        this.jwt = jwt;
        this.initializeClientIfUndefined();
        (_a = this.wsClient) == null ? void 0 : _a.subscribe(
          {
            query: subscriptionQuery,
            extensions: {
              type: "start"
            }
          },
          {
            next: (data) => {
              if (onMessageReceived) {
                onMessageReceived(data);
              }
            },
            error: (error) => {
              if (onError) {
                onError(error);
              }
            },
            complete: () => {
              if (onComplete) {
                onComplete();
              }
            }
          }
        );
      };
      this.initializeClientIfUndefined = () => {
        if (!this.wsClient) {
          this.initializeClient();
        }
      };
      this.initializeClient = () => {
        this.wsClient = createClient({
          url: this.wsurl,
          connectionParams: {
            Authorization: `Bearer ${this.jwt}`
          }
        });
      };
    }
  };
  var SubscriptionQueries = {
    StateChanged: `subscription {
    stateChanged {
      __typename
    }
  }`
  };

  // ../../node_modules/tslib/tslib.es6.js
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };

  // ../../node_modules/graphql-tag/lib/index.js
  var docCache = /* @__PURE__ */ new Map();
  var fragmentSourceMap = /* @__PURE__ */ new Map();
  var printFragmentWarnings = true;
  var experimentalFragmentVariables = false;
  function normalize(string) {
    return string.replace(/[\s,]+/g, " ").trim();
  }
  function cacheKeyFromLoc(loc) {
    return normalize(loc.source.body.substring(loc.start, loc.end));
  }
  function processFragments(ast) {
    var seenKeys = /* @__PURE__ */ new Set();
    var definitions = [];
    ast.definitions.forEach(function(fragmentDefinition) {
      if (fragmentDefinition.kind === "FragmentDefinition") {
        var fragmentName = fragmentDefinition.name.value;
        var sourceKey = cacheKeyFromLoc(fragmentDefinition.loc);
        var sourceKeySet = fragmentSourceMap.get(fragmentName);
        if (sourceKeySet && !sourceKeySet.has(sourceKey)) {
          if (printFragmentWarnings) {
            console.warn("Warning: fragment with name " + fragmentName + " already exists.\ngraphql-tag enforces all fragment names across your application to be unique; read more about\nthis in the docs: http://dev.apollodata.com/core/fragments.html#unique-names");
          }
        } else if (!sourceKeySet) {
          fragmentSourceMap.set(fragmentName, sourceKeySet = /* @__PURE__ */ new Set());
        }
        sourceKeySet.add(sourceKey);
        if (!seenKeys.has(sourceKey)) {
          seenKeys.add(sourceKey);
          definitions.push(fragmentDefinition);
        }
      } else {
        definitions.push(fragmentDefinition);
      }
    });
    return __assign(__assign({}, ast), { definitions });
  }
  function stripLoc(doc) {
    var workSet = new Set(doc.definitions);
    workSet.forEach(function(node) {
      if (node.loc)
        delete node.loc;
      Object.keys(node).forEach(function(key) {
        var value = node[key];
        if (value && typeof value === "object") {
          workSet.add(value);
        }
      });
    });
    var loc = doc.loc;
    if (loc) {
      delete loc.startToken;
      delete loc.endToken;
    }
    return doc;
  }
  function parseDocument(source) {
    var cacheKey = normalize(source);
    if (!docCache.has(cacheKey)) {
      var parsed = parse(source, {
        experimentalFragmentVariables,
        allowLegacyFragmentVariables: experimentalFragmentVariables
      });
      if (!parsed || parsed.kind !== "Document") {
        throw new Error("Not a valid GraphQL document.");
      }
      docCache.set(cacheKey, stripLoc(processFragments(parsed)));
    }
    return docCache.get(cacheKey);
  }
  function gql(literals) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (typeof literals === "string") {
      literals = [literals];
    }
    var result = literals[0];
    args.forEach(function(arg, i) {
      if (arg && arg.kind === "Document") {
        result += arg.loc.source.body;
      } else {
        result += arg;
      }
      result += literals[i + 1];
    });
    return parseDocument(result);
  }
  function resetCaches() {
    docCache.clear();
    fragmentSourceMap.clear();
  }
  function disableFragmentWarnings() {
    printFragmentWarnings = false;
  }
  function enableExperimentalFragmentVariables() {
    experimentalFragmentVariables = true;
  }
  function disableExperimentalFragmentVariables() {
    experimentalFragmentVariables = false;
  }
  var extras = {
    gql,
    resetCaches,
    disableFragmentWarnings,
    enableExperimentalFragmentVariables,
    disableExperimentalFragmentVariables
  };
  (function(gql_1) {
    gql_1.gql = extras.gql, gql_1.resetCaches = extras.resetCaches, gql_1.disableFragmentWarnings = extras.disableFragmentWarnings, gql_1.enableExperimentalFragmentVariables = extras.enableExperimentalFragmentVariables, gql_1.disableExperimentalFragmentVariables = extras.disableExperimentalFragmentVariables;
  })(gql || (gql = {}));
  gql["default"] = gql;
  var lib_default = gql;

  // ../notifi-graphql/lib/gql/generated.ts
  var FilterFragmentFragmentDoc = lib_default`
    fragment FilterFragment on Filter {
  id
  name
  filterType
}
    `;
  var SourceFragmentFragmentDoc = lib_default`
    fragment SourceFragment on Source {
  id
  name
  type
  blockchainAddress
  fusionEventTypeId
  applicableFilters {
    ...FilterFragment
  }
}
    ${FilterFragmentFragmentDoc}`;
  var SourceGroupFragmentFragmentDoc = lib_default`
    fragment SourceGroupFragment on SourceGroup {
  id
  name
  sources {
    ...SourceFragment
  }
}
    ${SourceFragmentFragmentDoc}`;
  var EmailTargetFragmentFragmentDoc = lib_default`
    fragment EmailTargetFragment on EmailTarget {
  emailAddress
  id
  isConfirmed
  name
}
    `;
  var SmsTargetFragmentFragmentDoc = lib_default`
    fragment SmsTargetFragment on SmsTarget {
  id
  isConfirmed
  name
  phoneNumber
}
    `;
  var TelegramTargetFragmentFragmentDoc = lib_default`
    fragment TelegramTargetFragment on TelegramTarget {
  id
  isConfirmed
  name
  telegramId
  confirmationUrl
}
    `;
  var WebhookTargetFragmentFragmentDoc = lib_default`
    fragment WebhookTargetFragment on WebhookTarget {
  id
  url
  status
  format
  headers {
    key
    value
  }
  name
}
    `;
  var DiscordTargetFragmentFragmentDoc = lib_default`
    fragment DiscordTargetFragment on DiscordTarget {
  id
  discordAccountId
  discriminator
  isConfirmed
  username
  name
  userStatus
  verificationLink
  discordServerInviteLink
}
    `;
  var SlackChannelTargetFragmentFragmentDoc = lib_default`
    fragment SlackChannelTargetFragment on SlackChannelTarget {
  id
  name
  slackChannelName
  slackWorkspaceName
  verificationLink
  webhookVerificationLink
  verificationStatus
}
    `;
  var Web3TargetFragmentFragmentDoc = lib_default`
    fragment Web3TargetFragment on Web3Target {
  id
  name
  accountId
  walletBlockchain
  targetProtocol
  isConfirmed
  senderAddress
}
    `;
  var WebPushTargetFragmentFragmentDoc = lib_default`
    fragment WebPushTargetFragment on WebPushTarget {
  id
  createdDate
  name
}
    `;
  var TargetGroupFragmentFragmentDoc = lib_default`
    fragment TargetGroupFragment on TargetGroup {
  id
  name
  emailTargets {
    ...EmailTargetFragment
  }
  smsTargets {
    ...SmsTargetFragment
  }
  telegramTargets {
    ...TelegramTargetFragment
  }
  webhookTargets {
    ...WebhookTargetFragment
  }
  discordTargets {
    ...DiscordTargetFragment
  }
  slackChannelTargets {
    ...SlackChannelTargetFragment
  }
  web3Targets {
    ...Web3TargetFragment
  }
  webPushTargets {
    ...WebPushTargetFragment
  }
}
    ${EmailTargetFragmentFragmentDoc}
${SmsTargetFragmentFragmentDoc}
${TelegramTargetFragmentFragmentDoc}
${WebhookTargetFragmentFragmentDoc}
${DiscordTargetFragmentFragmentDoc}
${SlackChannelTargetFragmentFragmentDoc}
${Web3TargetFragmentFragmentDoc}
${WebPushTargetFragmentFragmentDoc}`;
  var AlertFragmentFragmentDoc = lib_default`
    fragment AlertFragment on Alert {
  id
  groupName
  name
  filterOptions
  filter {
    ...FilterFragment
  }
  sourceGroup {
    ...SourceGroupFragment
  }
  targetGroup {
    ...TargetGroupFragment
  }
}
    ${FilterFragmentFragmentDoc}
${SourceGroupFragmentFragmentDoc}
${TargetGroupFragmentFragmentDoc}`;
  var ConnectedWalletFragmentFragmentDoc = lib_default`
    fragment ConnectedWalletFragment on ConnectedWallet {
  address
  walletBlockchain
}
    `;
  var FusionNotificationHistoryEntryFragmentFragmentDoc = lib_default`
    fragment FusionNotificationHistoryEntryFragment on FusionNotificationHistoryEntry {
  __typename
  id
  createdDate
  read
  fusionEventVariables
  detail {
    __typename
    ... on AccountBalanceChangedEventDetails {
      walletBlockchain
      direction
      newValue
      previousValue
      tokenSymbol
      isWhaleWatch
    }
    ... on BroadcastMessageEventDetails {
      messageType: type
      subject
      message
      messageHtml
    }
    ... on DirectTenantMessageEventDetails {
      tenantName
      targetTemplatesJson
      templateVariablesJson
    }
    ... on NftCollectionsReportEventDetails {
      type
      providerName
      sourceLink
      collections {
        collectionId
        name
        imgUrl
        volume1Day
        volume1DayChange
      }
    }
    ... on DAOProposalChangedEventDetails {
      tenantName
      proposalTitle: title
      description
      state
      daoUrl
      proposalUrl
    }
    ... on NftAuctionChangedEventDetails {
      auctionTitle: title
      auctionUrl
      walletBlockchain
      highBidAmount
      highBidSymbol
      imageUrl
    }
    ... on WalletsActivityReportEventDetails {
      providerName
      sourceLink
      walletActivityType: type
      wallets {
        address
        volume1Day
        maxPurchase1Day
        maxPurchaseName
        maxPurchaseImgUrl
        maxPurchaseTokenAddress
      }
    }
    ... on HealthValueOverThresholdEventDetails {
      name
      value
      threshold
      url
    }
    ... on GenericEventDetails {
      sourceName
      notificationTypeName
      genericMessage: message
      genericMessageHtml: messageHtml
      eventDetailsJson
      action {
        name
        url
      }
      icon
      customIconUrl
    }
  }
}
    `;
  var NotificationHistoryEntryFragmentFragmentDoc = lib_default`
    fragment NotificationHistoryEntryFragment on NotificationHistoryEntry {
  __typename
  id
  createdDate
  eventId
  read
  sourceAddress
  category
  transactionSignature
  targets {
    type
    name
  }
  detail {
    __typename
    ... on AccountBalanceChangedEventDetails {
      walletBlockchain
      direction
      newValue
      previousValue
      tokenSymbol
      isWhaleWatch
    }
    ... on BroadcastMessageEventDetails {
      messageType: type
      subject
      message
      messageHtml
    }
    ... on DirectTenantMessageEventDetails {
      tenantName
      targetTemplatesJson
      templateVariablesJson
    }
    ... on NftCollectionsReportEventDetails {
      type
      providerName
      sourceLink
      collections {
        collectionId
        name
        imgUrl
        volume1Day
        volume1DayChange
      }
    }
    ... on DAOProposalChangedEventDetails {
      tenantName
      proposalTitle: title
      description
      state
      daoUrl
      proposalUrl
    }
    ... on NftAuctionChangedEventDetails {
      auctionTitle: title
      auctionUrl
      walletBlockchain
      highBidAmount
      highBidSymbol
      imageUrl
    }
    ... on WalletsActivityReportEventDetails {
      providerName
      sourceLink
      walletActivityType: type
      wallets {
        address
        volume1Day
        maxPurchase1Day
        maxPurchaseName
        maxPurchaseImgUrl
        maxPurchaseTokenAddress
      }
    }
    ... on HealthValueOverThresholdEventDetails {
      name
      value
      threshold
      url
    }
    ... on GenericEventDetails {
      sourceName
      notificationTypeName
      genericMessage: message
      genericMessageHtml: messageHtml
      eventDetailsJson
      action {
        name
        url
      }
      icon
    }
  }
}
    `;
  var PageInfoFragmentFragmentDoc = lib_default`
    fragment PageInfoFragment on PageInfo {
  hasNextPage
  endCursor
}
    `;
  var CreateSlackChannelTargetResponseFragmentFragmentDoc = lib_default`
    fragment CreateSlackChannelTargetResponseFragment on CreateSlackChannelTargetResponse {
  slackChannelTarget {
    id
    name
    slackChannelName
    slackWorkspaceName
    verificationLink
    webhookVerificationLink
    verificationStatus
  }
}
    `;
  var GetSlackChannelTargetsResponseFragmentFragmentDoc = lib_default`
    fragment GetSlackChannelTargetsResponseFragment on SlackChannelTargetsConnection {
  edges {
    cursor
  }
  pageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
  nodes {
    id
    name
    slackChannelName
    slackWorkspaceName
    verificationLink
    webhookVerificationLink
    verificationStatus
  }
}
    `;
  var TenantConfigFragmentFragmentDoc = lib_default`
    fragment TenantConfigFragment on TenantConfig {
  id
  type
  dataJson
  fusionEvents {
    id
    metadata
    name
  }
}
    `;
  var TenantUserAlertFragmentFragmentDoc = lib_default`
    fragment TenantUserAlertFragment on TenantUserAlert {
  id
  name
  groupName
  filterOptions
  filter {
    ...FilterFragment
  }
  sourceGroup {
    ...SourceGroupFragment
  }
  targetGroup {
    hasVerifiedFcm
    hasVerifiedSms
    hasVerifiedWeb3
    hasVerifiedEmails
    hasVerifiedWebhook
    hasVerifiedDiscord
    hasVerifiedTelegram
  }
}
    ${FilterFragmentFragmentDoc}
${SourceGroupFragmentFragmentDoc}`;
  var TenantConnectedWalletFragmentFragmentDoc = lib_default`
    fragment TenantConnectedWalletFragment on TenantConnectedWallet {
  address
  walletBlockchain
}
    `;
  var TenantUserFragmentFragmentDoc = lib_default`
    fragment TenantUserFragment on TenantUser {
  id
  alerts {
    ...TenantUserAlertFragment
  }
  connectedWallets {
    ...TenantConnectedWalletFragment
  }
}
    ${TenantUserAlertFragmentFragmentDoc}
${TenantConnectedWalletFragmentFragmentDoc}`;
  var AuthorizationFragmentFragmentDoc = lib_default`
    fragment AuthorizationFragment on Authorization {
  token
  expiry
}
    `;
  var UserFragmentFragmentDoc = lib_default`
    fragment UserFragment on User {
  email
  emailConfirmed
  authorization {
    ...AuthorizationFragment
  }
  roles
}
    ${AuthorizationFragmentFragmentDoc}`;
  var UserTopicFragmentFragmentDoc = lib_default`
    fragment UserTopicFragment on UserTopic {
  name
  topicName
  targetCollections
  targetTemplate
}
    `;
  var GetWeb3TargetResponseFragmentFragmentDoc = lib_default`
    fragment GetWeb3TargetResponseFragment on Web3TargetsConnection {
  edges {
    cursor
  }
  pageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
  nodes {
    id
    name
    accountId
    walletBlockchain
    targetProtocol
    isConfirmed
    senderAddress
  }
}
    `;
  var VerifyXmtpTargetResponseFragmentFragmentDoc = lib_default`
    fragment VerifyXmtpTargetResponseFragment on VerifyXmtpTargetResponse {
  web3Target {
    id
    name
    accountId
    walletBlockchain
    targetProtocol
    isConfirmed
    senderAddress
  }
}
    `;
  var VerifyCbwTargetResponseFragmentFragmentDoc = lib_default`
    fragment VerifyCbwTargetResponseFragment on VerifyCbwTargetResponse {
  web3Target {
    id
    name
    accountId
    walletBlockchain
    targetProtocol
    isConfirmed
    senderAddress
  }
}
    `;
  var VerifyXmtpTargetViaXip42ResponseFragmentFragmentDoc = lib_default`
    fragment VerifyXmtpTargetViaXip42ResponseFragment on VerifyXmtpTargetViaXip42Response {
  web3Target {
    id
    name
    accountId
    walletBlockchain
    targetProtocol
    isConfirmed
    senderAddress
  }
}
    `;
  var AddSourceToSourceGroupDocument = lib_default`
    mutation addSourceToSourceGroup($input: AddSourceToSourceGroupInput!) {
  addSourceToSourceGroup(addSourceToSourceGroupInput: $input) {
    ...SourceGroupFragment
  }
}
    ${SourceGroupFragmentFragmentDoc}`;
  var BeginLogInByTransactionDocument = lib_default`
    mutation beginLogInByTransaction($walletAddress: String!, $walletBlockchain: WalletBlockchain!, $dappAddress: String!) {
  beginLogInByTransaction(
    beginLogInByTransactionInput: {walletAddress: $walletAddress, walletBlockchain: $walletBlockchain, dappAddress: $dappAddress}
  ) {
    nonce
  }
}
    `;
  var BeginLogInWithWeb3Document = lib_default`
    mutation beginLogInWithWeb3($authAddress: String!, $blockchainType: WalletBlockchain!, $dappAddress: String!, $authType: Web3AuthType!, $walletPubkey: String) {
  beginLogInWithWeb3(
    beginLogInWithWeb3Input: {authAddress: $authAddress, blockchainType: $blockchainType, dappAddress: $dappAddress, authType: $authType, walletPubkey: $walletPubkey}
  ) {
    beginLogInWithWeb3Response {
      nonce
    }
  }
}
    `;
  var BroadcastMessageDocument = lib_default`
    mutation broadcastMessage($idempotencyKey: String, $topicName: String!, $targetTemplates: [KeyValuePairOfTargetTypeAndStringInput!], $variables: [KeyValuePairOfStringAndStringInput!], $timestamp: Long!, $walletBlockchain: WalletBlockchain!, $signature: String!) {
  broadcastMessage(
    broadcastMessageInput: {idempotencyKey: $idempotencyKey, sourceAddress: $topicName, targetTemplates: $targetTemplates, variables: $variables, timestamp: $timestamp, walletBlockchain: $walletBlockchain}
    signature: $signature
  ) {
    id
  }
}
    `;
  var CompleteLogInByTransactionDocument = lib_default`
    mutation completeLogInByTransaction($walletAddress: String!, $walletBlockchain: WalletBlockchain!, $dappAddress: String!, $randomUuid: String!, $transactionSignature: String!) {
  completeLogInByTransaction(
    completeLogInByTransactionInput: {walletAddress: $walletAddress, walletBlockchain: $walletBlockchain, dappAddress: $dappAddress, randomUuid: $randomUuid, transactionSignature: $transactionSignature}
  ) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
  var CompleteLogInWithWeb3Document = lib_default`
    mutation completeLogInWithWeb3($nonce: String!, $signature: String!, $signedMessage: String!, $signingAddress: String!, $signingPubkey: String!) {
  completeLogInWithWeb3(
    completeLogInWithWeb3Input: {nonce: $nonce, signature: $signature, signedMessage: $signedMessage, signingAddress: $signingAddress, signingPubkey: $signingPubkey}
  ) {
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;
  var ConnectWalletDocument = lib_default`
    mutation connectWallet($walletPublicKey: String!, $timestamp: Long!, $signature: String!, $walletBlockchain: WalletBlockchain!, $accountId: String, $connectWalletConflictResolutionTechnique: ConnectWalletConflictResolutionTechnique) {
  connectWallet(
    connectWalletInput: {walletPublicKey: $walletPublicKey, timestamp: $timestamp, walletBlockchain: $walletBlockchain, accountId: $accountId, connectWalletConflictResolutionTechnique: $connectWalletConflictResolutionTechnique}
    signature: $signature
  ) {
    ...ConnectedWalletFragment
  }
}
    ${ConnectedWalletFragmentFragmentDoc}`;
  var CreateAlertDocument = lib_default`
    mutation createAlert($name: String!, $sourceGroupId: String!, $filterId: String!, $targetGroupId: String!, $filterOptions: String!, $groupName: String!) {
  createAlert(
    alertInput: {name: $name, sourceGroupId: $sourceGroupId, filterId: $filterId, targetGroupId: $targetGroupId, filterOptions: $filterOptions, groupName: $groupName}
  ) {
    ...AlertFragment
  }
}
    ${AlertFragmentFragmentDoc}`;
  var CreateDirectPushAlertDocument = lib_default`
    mutation createDirectPushAlert($input: CreateDirectPushAlertInput!) {
  createDirectPushAlert(createDirectPushAlertInput: $input) {
    ...AlertFragment
  }
}
    ${AlertFragmentFragmentDoc}`;
  var CreateDiscordTargetDocument = lib_default`
    mutation createDiscordTarget($name: String!, $value: String!) {
  createDiscordTarget(createTargetInput: {name: $name, value: $value}) {
    ...DiscordTargetFragment
  }
}
    ${DiscordTargetFragmentFragmentDoc}`;
  var CreateEmailTargetDocument = lib_default`
    mutation createEmailTarget($name: String!, $value: String!) {
  createEmailTarget(createTargetInput: {name: $name, value: $value}) {
    ...EmailTargetFragment
  }
}
    ${EmailTargetFragmentFragmentDoc}`;
  var CreateFusionAlertsDocument = lib_default`
    mutation createFusionAlerts($input: CreateFusionAlertsInput!) {
  createFusionAlerts(input: $input) {
    alerts {
      groupName
      id
      name
      filterOptions
    }
    errors {
      ... on ArgumentError {
        __typename
        message
        paramName
      }
      ... on ArgumentNullError {
        __typename
        message
        paramName
      }
      ... on ArgumentOutOfRangeError {
        __typename
        message
        paramName
      }
    }
  }
}
    `;
  var CreateSlackChannelTargetDocument = lib_default`
    mutation createSlackChannelTarget($name: String!, $value: String!) {
  createSlackChannelTarget(input: {name: $name, value: $value}) {
    ...CreateSlackChannelTargetResponseFragment
  }
}
    ${CreateSlackChannelTargetResponseFragmentFragmentDoc}`;
  var CreateSmsTargetDocument = lib_default`
    mutation createSmsTarget($name: String!, $value: String!) {
  createSmsTarget(createTargetInput: {name: $name, value: $value}) {
    ...SmsTargetFragment
  }
}
    ${SmsTargetFragmentFragmentDoc}`;
  var CreateSourceDocument = lib_default`
    mutation createSource($name: String, $blockchainAddress: String!, $type: SourceType!, $fusionEventTypeId: String) {
  createSource(
    createSourceInput: {name: $name, blockchainAddress: $blockchainAddress, type: $type, fusionEventTypeId: $fusionEventTypeId}
  ) {
    ...SourceFragment
  }
}
    ${SourceFragmentFragmentDoc}`;
  var CreateSourceGroupDocument = lib_default`
    mutation createSourceGroup($name: String!, $sourceIds: [String!]!) {
  createSourceGroup(sourceGroupInput: {name: $name, sourceIds: $sourceIds}) {
    ...SourceGroupFragment
  }
}
    ${SourceGroupFragmentFragmentDoc}`;
  var CreateTargetGroupDocument = lib_default`
    mutation createTargetGroup($name: String!, $emailTargetIds: [String!]!, $smsTargetIds: [String!]!, $telegramTargetIds: [String!]!, $webhookTargetIds: [String!]!, $discordTargetIds: [String!]!, $slackChannelTargetIds: [String!]!, $web3TargetIds: [String!]!, $webPushTargetIds: [String!]!) {
  createTargetGroup(
    targetGroupInput: {name: $name, emailTargetIds: $emailTargetIds, smsTargetIds: $smsTargetIds, telegramTargetIds: $telegramTargetIds, webhookTargetIds: $webhookTargetIds, discordTargetIds: $discordTargetIds, slackChannelTargetIds: $slackChannelTargetIds, web3TargetIds: $web3TargetIds, webPushTargetIds: $webPushTargetIds}
  ) {
    ...TargetGroupFragment
  }
}
    ${TargetGroupFragmentFragmentDoc}`;
  var CreateTelegramTargetDocument = lib_default`
    mutation createTelegramTarget($name: String!, $value: String!) {
  createTelegramTarget(createTargetInput: {name: $name, value: $value}) {
    ...TelegramTargetFragment
  }
}
    ${TelegramTargetFragmentFragmentDoc}`;
  var CreateTenantUserDocument = lib_default`
    mutation createTenantUser($input: CreateTenantUserInput!) {
  createTenantUser(createTenantUserInput: $input) {
    ...TenantUserFragment
  }
}
    ${TenantUserFragmentFragmentDoc}`;
  var CreateWeb3TargetDocument = lib_default`
    mutation createWeb3Target($name: String!, $accountId: String!, $walletBlockchain: WalletBlockchain!, $web3TargetProtocol: Web3TargetProtocol!) {
  createWeb3Target(
    createWeb3TargetInput: {name: $name, accountId: $accountId, walletBlockchain: $walletBlockchain, protocol: $web3TargetProtocol}
  ) {
    ...Web3TargetFragment
  }
}
    ${Web3TargetFragmentFragmentDoc}`;
  var CreateWebPushTargetDocument = lib_default`
    mutation createWebPushTarget($vapidPublicKey: String!, $endpoint: String!, $auth: String!, $p256dh: String!) {
  createWebPushTarget(
    input: {vapidPublicKey: $vapidPublicKey, endpoint: $endpoint, auth: $auth, p256dh: $p256dh}
  ) {
    webPushTarget {
      ...WebPushTargetFragment
    }
    errors {
      ... on TargetLimitExceededError {
        message
      }
      ... on UnexpectedError {
        message
      }
    }
  }
}
    ${WebPushTargetFragmentFragmentDoc}`;
  var CreateWebhookTargetDocument = lib_default`
    mutation createWebhookTarget($name: String!, $url: String!, $format: WebhookPayloadFormat!, $headers: [KeyValuePairOfStringAndStringInput!]!) {
  createWebhookTarget(
    createTargetInput: {name: $name, url: $url, format: $format, headers: $headers}
  ) {
    ...WebhookTargetFragment
  }
}
    ${WebhookTargetFragmentFragmentDoc}`;
  var DeleteAlertDocument = lib_default`
    mutation deleteAlert($id: String!) {
  deleteAlert(alertId: $id) {
    id
  }
}
    `;
  var DeleteDirectPushAlertDocument = lib_default`
    mutation deleteDirectPushAlert($input: DeleteDirectPushAlertInput!) {
  deleteDirectPushAlert(deleteDirectPushAlertInput: $input) {
    id
  }
}
    `;
  var DeleteSourceGroupDocument = lib_default`
    mutation deleteSourceGroup($id: String!) {
  deleteSourceGroup(sourceGroupInput: {id: $id}) {
    id
  }
}
    `;
  var DeleteTargetGroupDocument = lib_default`
    mutation deleteTargetGroup($id: String!) {
  deleteTargetGroup(targetGroupInput: {id: $id}) {
    id
  }
}
    `;
  var DeleteUserAlertDocument = lib_default`
    mutation deleteUserAlert($alertId: String!) {
  deleteUserAlert(alertId: $alertId) {
    id
  }
}
    `;
  var DeleteWebPushTargetDocument = lib_default`
    mutation deleteWebPushTarget($id: String!) {
  deleteWebPushTarget(input: {id: $id}) {
    success
    errors {
      ... on TargetDoesNotExistError {
        message
      }
      ... on UnexpectedError {
        message
      }
    }
  }
}
    `;
  var DeleteWebhookTargetDocument = lib_default`
    mutation deleteWebhookTarget($id: String!) {
  deleteWebhookTarget(deleteTargetInput: {id: $id}) {
    id
  }
}
    `;
  var LogInByOidcDocument = lib_default`
    mutation logInByOidc($dappId: String!, $oidcProvider: OidcProvider!, $idToken: String!) {
  logInByOidc(
    input: {dappId: $dappId, oidcProvider: $oidcProvider, idToken: $idToken}
  ) {
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;
  var LogInFromDappDocument = lib_default`
    mutation logInFromDapp($walletBlockchain: WalletBlockchain!, $walletPublicKey: String!, $dappAddress: String!, $timestamp: Long!, $signature: String!, $accountId: String) {
  logInFromDapp(
    dappLogInInput: {walletBlockchain: $walletBlockchain, walletPublicKey: $walletPublicKey, dappAddress: $dappAddress, timestamp: $timestamp, accountId: $accountId}
    signature: $signature
  ) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
  var LogInFromServiceDocument = lib_default`
    mutation logInFromService($input: ServiceLogInInput!) {
  logInFromService(serviceLogInInput: $input) {
    ...AuthorizationFragment
  }
}
    ${AuthorizationFragmentFragmentDoc}`;
  var MarkFusionNotificationHistoryAsReadDocument = lib_default`
    mutation markFusionNotificationHistoryAsRead($ids: [String!]!, $beforeId: String, $readState: NotificationHistoryReadState) {
  markFusionNotificationHistoryAsRead(
    input: {ids: $ids, beforeId: $beforeId, readState: $readState}
  )
}
    `;
  var PublishFusionMessageDocument = lib_default`
    mutation publishFusionMessage($eventTypeId: String!, $variablesJson: String!, $specificWallets: [KeyValuePairOfStringAndWalletBlockchainInput!]) {
  publishFusionMessage(
    publishFusionMessageInput: {eventTypeId: $eventTypeId, variablesJson: $variablesJson, specificWallets: $specificWallets}
  ) {
    eventUuid
  }
}
    `;
  var RefreshAuthorizationDocument = lib_default`
    mutation refreshAuthorization {
  refreshAuthorization {
    ...AuthorizationFragment
  }
}
    ${AuthorizationFragmentFragmentDoc}`;
  var RemoveSourceFromSourceGroupDocument = lib_default`
    mutation removeSourceFromSourceGroup($input: RemoveSourceFromSourceGroupInput!) {
  removeSourceFromSourceGroup(removeSourceFromSourceGroupInput: $input) {
    ...SourceGroupFragment
  }
}
    ${SourceGroupFragmentFragmentDoc}`;
  var SendEmailTargetVerificationRequestDocument = lib_default`
    mutation sendEmailTargetVerificationRequest($targetId: String!) {
  sendEmailTargetVerificationRequest(
    sendTargetConfirmationRequestInput: {targetId: $targetId}
  ) {
    ...EmailTargetFragment
  }
}
    ${EmailTargetFragmentFragmentDoc}`;
  var SendMessageDocument = lib_default`
    mutation sendMessage($input: SendMessageInput!) {
  sendMessage(sendMessageInput: $input)
}
    `;
  var UpdateSourceGroupDocument = lib_default`
    mutation updateSourceGroup($id: String!, $name: String!, $sourceIds: [String!]!) {
  updateSourceGroup: createSourceGroup(
    sourceGroupInput: {id: $id, name: $name, sourceIds: $sourceIds}
  ) {
    ...SourceGroupFragment
  }
}
    ${SourceGroupFragmentFragmentDoc}`;
  var UpdateTargetGroupDocument = lib_default`
    mutation updateTargetGroup($id: String!, $name: String!, $emailTargetIds: [String!]!, $smsTargetIds: [String!]!, $telegramTargetIds: [String!]!, $webhookTargetIds: [String!]!, $discordTargetIds: [String!]!, $slackChannelTargetIds: [String!]!, $web3TargetIds: [String!]!, $webPushTargetIds: [String!]!) {
  updateTargetGroup: createTargetGroup(
    targetGroupInput: {id: $id, name: $name, emailTargetIds: $emailTargetIds, smsTargetIds: $smsTargetIds, telegramTargetIds: $telegramTargetIds, webhookTargetIds: $webhookTargetIds, discordTargetIds: $discordTargetIds, slackChannelTargetIds: $slackChannelTargetIds, web3TargetIds: $web3TargetIds, webPushTargetIds: $webPushTargetIds}
  ) {
    ...TargetGroupFragment
  }
}
    ${TargetGroupFragmentFragmentDoc}`;
  var UpdateUserSettingsDocument = lib_default`
    mutation updateUserSettings($input: UserSettingsInput!) {
  updateUserSettings(userSettings: $input) {
    detailedAlertHistoryEnabled
    userHasChatEnabled
    ftuStage
  }
}
    `;
  var UpdateWebPushTargetDocument = lib_default`
    mutation updateWebPushTarget($id: String!, $endpoint: String!, $auth: String!, $p256dh: String!) {
  updateWebPushTarget(
    input: {id: $id, endpoint: $endpoint, auth: $auth, p256dh: $p256dh}
  ) {
    webPushTarget {
      ...WebPushTargetFragment
    }
    errors {
      ... on TargetDoesNotExistError {
        message
      }
      ... on UnexpectedError {
        message
      }
    }
  }
}
    ${WebPushTargetFragmentFragmentDoc}`;
  var VerifyCbwTargetDocument = lib_default`
    mutation verifyCbwTarget($input: VerifyCbwTargetInput!) {
  verifyCbwTarget(input: $input) {
    ...VerifyCbwTargetResponseFragment
  }
}
    ${VerifyCbwTargetResponseFragmentFragmentDoc}`;
  var VerifyXmtpTargetDocument = lib_default`
    mutation verifyXmtpTarget($input: VerifyXmtpTargetInput!) {
  verifyXmtpTarget(input: $input) {
    ...VerifyXmtpTargetResponseFragment
  }
}
    ${VerifyXmtpTargetResponseFragmentFragmentDoc}`;
  var VerifyXmtpTargetViaXip42Document = lib_default`
    mutation verifyXmtpTargetViaXip42($input: VerifyXmtpTargetViaXip42Input!) {
  verifyXmtpTargetViaXip42(input: $input) {
    ...VerifyXmtpTargetViaXip42ResponseFragment
  }
}
    ${VerifyXmtpTargetViaXip42ResponseFragmentFragmentDoc}`;
  var FetchDataDocument = lib_default`
    query fetchData {
  alert {
    ...AlertFragment
  }
  sourceGroup {
    ...SourceGroupFragment
  }
  connectedWallet {
    ...ConnectedWalletFragment
  }
  source {
    ...SourceFragment
  }
  targetGroup {
    ...TargetGroupFragment
  }
  emailTarget {
    ...EmailTargetFragment
  }
  smsTarget {
    ...SmsTargetFragment
  }
  telegramTarget {
    ...TelegramTargetFragment
  }
  discordTarget {
    ...DiscordTargetFragment
  }
  filter {
    ...FilterFragment
  }
}
    ${AlertFragmentFragmentDoc}
${SourceGroupFragmentFragmentDoc}
${ConnectedWalletFragmentFragmentDoc}
${SourceFragmentFragmentDoc}
${TargetGroupFragmentFragmentDoc}
${EmailTargetFragmentFragmentDoc}
${SmsTargetFragmentFragmentDoc}
${TelegramTargetFragmentFragmentDoc}
${DiscordTargetFragmentFragmentDoc}
${FilterFragmentFragmentDoc}`;
  var FetchFusionDataDocument = lib_default`
    query fetchFusionData {
  alert {
    ...AlertFragment
  }
  connectedWallet {
    ...ConnectedWalletFragment
  }
  targetGroup {
    ...TargetGroupFragment
  }
}
    ${AlertFragmentFragmentDoc}
${ConnectedWalletFragmentFragmentDoc}
${TargetGroupFragmentFragmentDoc}`;
  var FindTenantConfigDocument = lib_default`
    query findTenantConfig($input: FindTenantConfigInput!) {
  findTenantConfig(findTenantConfigInput: $input) {
    ...TenantConfigFragment
  }
}
    ${TenantConfigFragmentFragmentDoc}`;
  var GetAlertsDocument = lib_default`
    query getAlerts {
  alert {
    ...AlertFragment
  }
}
    ${AlertFragmentFragmentDoc}`;
  var GetConfigurationForDappDocument = lib_default`
    query getConfigurationForDapp($dappAddress: String!) {
  configurationForDapp(getConfigurationForDappInput: {dappAddress: $dappAddress}) {
    supportedSmsCountryCodes
    supportedTargetTypes
  }
}
    `;
  var GetConnectedWalletsDocument = lib_default`
    query getConnectedWallets {
  connectedWallet {
    ...ConnectedWalletFragment
  }
}
    ${ConnectedWalletFragmentFragmentDoc}`;
  var GetDiscordTargetsDocument = lib_default`
    query getDiscordTargets {
  discordTarget {
    ...DiscordTargetFragment
  }
}
    ${DiscordTargetFragmentFragmentDoc}`;
  var GetEmailTargetsDocument = lib_default`
    query getEmailTargets {
  emailTarget {
    ...EmailTargetFragment
  }
}
    ${EmailTargetFragmentFragmentDoc}`;
  var GetFiltersDocument = lib_default`
    query getFilters {
  filter {
    ...FilterFragment
  }
}
    ${FilterFragmentFragmentDoc}`;
  var GetFusionNotificationHistoryDocument = lib_default`
    query getFusionNotificationHistory($after: String, $first: Int, $includeHidden: Boolean) {
  fusionNotificationHistory(
    after: $after
    first: $first
    includeHidden: $includeHidden
  ) {
    nodes {
      ...FusionNotificationHistoryEntryFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${FusionNotificationHistoryEntryFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;
  var GetNotificationHistoryDocument = lib_default`
    query getNotificationHistory($after: String, $first: Int) {
  notificationHistory(after: $after, first: $first) {
    nodes {
      ...NotificationHistoryEntryFragment
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}
    ${NotificationHistoryEntryFragmentFragmentDoc}
${PageInfoFragmentFragmentDoc}`;
  var GetSlackChannelTargetsDocument = lib_default`
    query getSlackChannelTargets($after: String, $first: Int, $ids: [String!]) {
  slackChannelTargets(input: {after: $after, first: $first, ids: $ids}) {
    ...GetSlackChannelTargetsResponseFragment
  }
}
    ${GetSlackChannelTargetsResponseFragmentFragmentDoc}`;
  var GetSmsTargetsDocument = lib_default`
    query getSmsTargets {
  smsTarget {
    ...SmsTargetFragment
  }
}
    ${SmsTargetFragmentFragmentDoc}`;
  var GetSourceConnectionDocument = lib_default`
    query getSourceConnection($input: GetSourcesInput, $first: Int, $after: String) {
  sources(getSourcesInput: $input, first: $first, after: $after) {
    pageInfo {
      ...PageInfoFragment
    }
    nodes {
      ...SourceFragment
    }
  }
}
    ${PageInfoFragmentFragmentDoc}
${SourceFragmentFragmentDoc}`;
  var GetSourceGroupsDocument = lib_default`
    query getSourceGroups {
  sourceGroup {
    ...SourceGroupFragment
  }
}
    ${SourceGroupFragmentFragmentDoc}`;
  var GetSourcesDocument = lib_default`
    query getSources {
  source {
    ...SourceFragment
  }
}
    ${SourceFragmentFragmentDoc}`;
  var GetTargetGroupsDocument = lib_default`
    query getTargetGroups {
  targetGroup {
    ...TargetGroupFragment
  }
}
    ${TargetGroupFragmentFragmentDoc}`;
  var GetTelegramTargetsDocument = lib_default`
    query getTelegramTargets {
  telegramTarget {
    ...TelegramTargetFragment
  }
}
    ${TelegramTargetFragmentFragmentDoc}`;
  var GetTenantConnectedWalletDocument = lib_default`
    query getTenantConnectedWallet($input: GetTenantConnectedWalletInput, $first: Int, $after: String) {
  tenantConnectedWallet(
    getTenantConnectedWalletInput: $input
    first: $first
    after: $after
  ) {
    pageInfo {
      ...PageInfoFragment
    }
    nodes {
      ...TenantConnectedWalletFragment
      user {
        ...TenantUserFragment
      }
    }
  }
}
    ${PageInfoFragmentFragmentDoc}
${TenantConnectedWalletFragmentFragmentDoc}
${TenantUserFragmentFragmentDoc}`;
  var GetTenantUserDocument = lib_default`
    query getTenantUser($first: Int, $after: String) {
  tenantUser(first: $first, after: $after) {
    pageInfo {
      ...PageInfoFragment
    }
    nodes {
      ...TenantUserFragment
    }
  }
}
    ${PageInfoFragmentFragmentDoc}
${TenantUserFragmentFragmentDoc}`;
  var GetTopicsDocument = lib_default`
    query getTopics {
  topics {
    nodes {
      ...UserTopicFragment
    }
  }
}
    ${UserTopicFragmentFragmentDoc}`;
  var GetUnreadNotificationHistoryCountDocument = lib_default`
    query getUnreadNotificationHistoryCount {
  unreadNotificationHistoryCount {
    count
  }
}
    `;
  var GetUserSettingsDocument = lib_default`
    query getUserSettings {
  userSettings {
    detailedAlertHistoryEnabled
    userHasChatEnabled
    ftuStage
  }
}
    `;
  var GetWeb3TargetsDocument = lib_default`
    query getWeb3Targets {
  web3Targets {
    ...GetWeb3TargetResponseFragment
  }
}
    ${GetWeb3TargetResponseFragmentFragmentDoc}`;
  var GetWebPushTargetsDocument = lib_default`
    query getWebPushTargets($ids: [String!], $first: Int, $after: String) {
  webPushTargets(
    input: {ids: $ids, first: $first, after: $after}
    first: $first
    after: $after
  ) {
    pageInfo {
      ...PageInfoFragment
    }
    nodes {
      ...WebPushTargetFragment
    }
    edges {
      cursor
      node {
        ...WebPushTargetFragment
      }
    }
  }
}
    ${PageInfoFragmentFragmentDoc}
${WebPushTargetFragmentFragmentDoc}`;
  var GetWebhookTargetsDocument = lib_default`
    query getWebhookTargets {
  webhookTarget {
    ...WebhookTargetFragment
  }
}
    ${WebhookTargetFragmentFragmentDoc}`;
  var defaultWrapper = (action, _operationName, _operationType) => action();
  function getSdk(client2, withWrapper = defaultWrapper) {
    return {
      addSourceToSourceGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(AddSourceToSourceGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "addSourceToSourceGroup", "mutation");
      },
      beginLogInByTransaction(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(BeginLogInByTransactionDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "beginLogInByTransaction", "mutation");
      },
      beginLogInWithWeb3(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(BeginLogInWithWeb3Document, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "beginLogInWithWeb3", "mutation");
      },
      broadcastMessage(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(BroadcastMessageDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "broadcastMessage", "mutation");
      },
      completeLogInByTransaction(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CompleteLogInByTransactionDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "completeLogInByTransaction", "mutation");
      },
      completeLogInWithWeb3(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CompleteLogInWithWeb3Document, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "completeLogInWithWeb3", "mutation");
      },
      connectWallet(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(ConnectWalletDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "connectWallet", "mutation");
      },
      createAlert(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateAlertDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createAlert", "mutation");
      },
      createDirectPushAlert(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateDirectPushAlertDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createDirectPushAlert", "mutation");
      },
      createDiscordTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateDiscordTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createDiscordTarget", "mutation");
      },
      createEmailTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateEmailTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createEmailTarget", "mutation");
      },
      createFusionAlerts(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateFusionAlertsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createFusionAlerts", "mutation");
      },
      createSlackChannelTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateSlackChannelTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createSlackChannelTarget", "mutation");
      },
      createSmsTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateSmsTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createSmsTarget", "mutation");
      },
      createSource(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateSourceDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createSource", "mutation");
      },
      createSourceGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateSourceGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createSourceGroup", "mutation");
      },
      createTargetGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateTargetGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createTargetGroup", "mutation");
      },
      createTelegramTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateTelegramTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createTelegramTarget", "mutation");
      },
      createTenantUser(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateTenantUserDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createTenantUser", "mutation");
      },
      createWeb3Target(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateWeb3TargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createWeb3Target", "mutation");
      },
      createWebPushTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateWebPushTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createWebPushTarget", "mutation");
      },
      createWebhookTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(CreateWebhookTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "createWebhookTarget", "mutation");
      },
      deleteAlert(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteAlertDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteAlert", "mutation");
      },
      deleteDirectPushAlert(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteDirectPushAlertDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteDirectPushAlert", "mutation");
      },
      deleteSourceGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteSourceGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteSourceGroup", "mutation");
      },
      deleteTargetGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteTargetGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteTargetGroup", "mutation");
      },
      deleteUserAlert(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteUserAlertDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteUserAlert", "mutation");
      },
      deleteWebPushTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteWebPushTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteWebPushTarget", "mutation");
      },
      deleteWebhookTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(DeleteWebhookTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "deleteWebhookTarget", "mutation");
      },
      logInByOidc(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(LogInByOidcDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "logInByOidc", "mutation");
      },
      logInFromDapp(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(LogInFromDappDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "logInFromDapp", "mutation");
      },
      logInFromService(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(LogInFromServiceDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "logInFromService", "mutation");
      },
      markFusionNotificationHistoryAsRead(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(MarkFusionNotificationHistoryAsReadDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "markFusionNotificationHistoryAsRead", "mutation");
      },
      publishFusionMessage(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(PublishFusionMessageDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "publishFusionMessage", "mutation");
      },
      refreshAuthorization(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(RefreshAuthorizationDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "refreshAuthorization", "mutation");
      },
      removeSourceFromSourceGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(RemoveSourceFromSourceGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "removeSourceFromSourceGroup", "mutation");
      },
      sendEmailTargetVerificationRequest(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(SendEmailTargetVerificationRequestDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "sendEmailTargetVerificationRequest", "mutation");
      },
      sendMessage(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(SendMessageDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "sendMessage", "mutation");
      },
      updateSourceGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(UpdateSourceGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "updateSourceGroup", "mutation");
      },
      updateTargetGroup(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(UpdateTargetGroupDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "updateTargetGroup", "mutation");
      },
      updateUserSettings(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(UpdateUserSettingsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "updateUserSettings", "mutation");
      },
      updateWebPushTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(UpdateWebPushTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "updateWebPushTarget", "mutation");
      },
      verifyCbwTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(VerifyCbwTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "verifyCbwTarget", "mutation");
      },
      verifyXmtpTarget(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(VerifyXmtpTargetDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "verifyXmtpTarget", "mutation");
      },
      verifyXmtpTargetViaXip42(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(VerifyXmtpTargetViaXip42Document, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "verifyXmtpTargetViaXip42", "mutation");
      },
      fetchData(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(FetchDataDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "fetchData", "query");
      },
      fetchFusionData(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(FetchFusionDataDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "fetchFusionData", "query");
      },
      findTenantConfig(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(FindTenantConfigDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "findTenantConfig", "query");
      },
      getAlerts(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetAlertsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getAlerts", "query");
      },
      getConfigurationForDapp(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetConfigurationForDappDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getConfigurationForDapp", "query");
      },
      getConnectedWallets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetConnectedWalletsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getConnectedWallets", "query");
      },
      getDiscordTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetDiscordTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getDiscordTargets", "query");
      },
      getEmailTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetEmailTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getEmailTargets", "query");
      },
      getFilters(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetFiltersDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getFilters", "query");
      },
      getFusionNotificationHistory(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetFusionNotificationHistoryDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getFusionNotificationHistory", "query");
      },
      getNotificationHistory(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetNotificationHistoryDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getNotificationHistory", "query");
      },
      getSlackChannelTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetSlackChannelTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getSlackChannelTargets", "query");
      },
      getSmsTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetSmsTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getSmsTargets", "query");
      },
      getSourceConnection(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetSourceConnectionDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getSourceConnection", "query");
      },
      getSourceGroups(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetSourceGroupsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getSourceGroups", "query");
      },
      getSources(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetSourcesDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getSources", "query");
      },
      getTargetGroups(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetTargetGroupsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getTargetGroups", "query");
      },
      getTelegramTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetTelegramTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getTelegramTargets", "query");
      },
      getTenantConnectedWallet(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetTenantConnectedWalletDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getTenantConnectedWallet", "query");
      },
      getTenantUser(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetTenantUserDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getTenantUser", "query");
      },
      getTopics(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetTopicsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getTopics", "query");
      },
      getUnreadNotificationHistoryCount(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetUnreadNotificationHistoryCountDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getUnreadNotificationHistoryCount", "query");
      },
      getUserSettings(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetUserSettingsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getUserSettings", "query");
      },
      getWeb3Targets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetWeb3TargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getWeb3Targets", "query");
      },
      getWebPushTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetWebPushTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getWebPushTargets", "query");
      },
      getWebhookTargets(variables, requestHeaders) {
        return withWrapper((wrappedRequestHeaders) => client2.request(GetWebhookTargetsDocument, variables, __spreadValues(__spreadValues({}, requestHeaders), wrappedRequestHeaders)), "getWebhookTargets", "query");
      }
    };
  }

  // ../notifi-graphql/lib/NotifiService.ts
  var NotifiService = class {
    constructor(graphQLClient, _notifiSubService) {
      this._notifiSubService = _notifiSubService;
      this._typedClient = getSdk(graphQLClient);
    }
    setJwt(jwt) {
      this._jwt = jwt;
    }
    async logOut() {
      this._jwt = void 0;
    }
    async addSourceToSourceGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.addSourceToSourceGroup(variables, headers);
    }
    async beginLogInByTransaction(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.beginLogInByTransaction(variables, headers);
    }
    async broadcastMessage(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.broadcastMessage(variables, headers);
    }
    async completeLogInByTransaction(variables) {
      var _a, _b;
      const headers = this._requestHeaders();
      const result = await this._typedClient.completeLogInByTransaction(
        variables,
        headers
      );
      const token = (_b = (_a = result.completeLogInByTransaction) == null ? void 0 : _a.authorization) == null ? void 0 : _b.token;
      if (token !== void 0) {
        this._jwt = token;
      }
      return result;
    }
    async connectWallet(variables) {
      const headers = this._requestHeaders();
      return await this._typedClient.connectWallet(variables, headers);
    }
    async createAlert(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createAlert(variables, headers);
    }
    async createFusionAlerts(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createFusionAlerts(variables, headers);
    }
    async createDirectPushAlert(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createDirectPushAlert(variables, headers);
    }
    async createEmailTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createEmailTarget(variables, headers);
    }
    async createDiscordTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createDiscordTarget(variables, headers);
    }
    async createSlackChannelTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createSlackChannelTarget(variables, headers);
    }
    async createWeb3Target(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createWeb3Target(variables, headers);
    }
    async createSmsTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createSmsTarget(variables, headers);
    }
    async createSource(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createSource(variables, headers);
    }
    async createSourceGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createSourceGroup(variables, headers);
    }
    async createTargetGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createTargetGroup(variables, headers);
    }
    async createTenantUser(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createTenantUser(variables, headers);
    }
    async createWebhookTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createWebhookTarget(variables, headers);
    }
    async createTelegramTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createTelegramTarget(variables, headers);
    }
    async deleteAlert(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteAlert(variables, headers);
    }
    async DeleteDirectPushAlert(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteDirectPushAlert(variables, headers);
    }
    async deleteUserAlert(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteUserAlert(variables, headers);
    }
    async deleteSourceGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteSourceGroup(variables, headers);
    }
    async deleteTargetGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteTargetGroup(variables, headers);
    }
    async deleteWebhookTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteWebhookTarget(variables, headers);
    }
    /** @deprecated use fetchFusionData instead. This is for legacy  */
    async fetchData(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.fetchData(variables, headers);
    }
    async fetchFusionData(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.fetchFusionData(variables, headers);
    }
    async findTenantConfig(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.findTenantConfig(variables, headers);
    }
    async getAlerts(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getAlerts(variables, headers);
    }
    async getConfigurationForDapp(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getConfigurationForDapp(variables, headers);
    }
    async getConnectedWallets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getConnectedWallets(variables, headers);
    }
    async getEmailTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getEmailTargets(variables, headers);
    }
    async getDiscordTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getDiscordTargets(variables, headers);
    }
    async getSlackChannelTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getSlackChannelTargets(variables, headers);
    }
    async getWeb3Targets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getWeb3Targets(variables, headers);
    }
    async getFilters(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getFilters(variables, headers);
    }
    async getFusionNotificationHistory(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getFusionNotificationHistory(variables, headers);
    }
    /**
     * @deprecated Use getFusionNotificationHistory instead
     */
    async getNotificationHistory(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getNotificationHistory(variables, headers);
    }
    async getSmsTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getSmsTargets(variables, headers);
    }
    async getSourceConnection(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getSourceConnection(variables, headers);
    }
    async getSourceGroups(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getSourceGroups(variables, headers);
    }
    async getSources(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getSources(variables, headers);
    }
    async getTargetGroups(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getTargetGroups(variables, headers);
    }
    async getTelegramTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getTelegramTargets(variables, headers);
    }
    async getTenantConnectedWallets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getTenantConnectedWallet(variables, headers);
    }
    async getTenantUser(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getTenantUser(variables, headers);
    }
    async getTopics(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getTopics(variables, headers);
    }
    async getUnreadNotificationHistoryCount(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getUnreadNotificationHistoryCount(
        variables,
        headers
      );
    }
    async subscribeNotificationHistoryStateChanged(onMessageReceived, onError, onComplete) {
      this._notifiSubService.subscribe(
        this._jwt,
        SubscriptionQueries.StateChanged,
        onMessageReceived,
        onError,
        onComplete
      );
    }
    async wsDispose() {
      this._notifiSubService.disposeClient();
    }
    async getUserSettings(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getUserSettings(variables, headers);
    }
    async getWebhookTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getWebhookTargets(variables, headers);
    }
    async logInFromDapp(variables) {
      var _a, _b;
      const headers = this._requestHeaders();
      const result = await this._typedClient.logInFromDapp(variables, headers);
      const token = (_b = (_a = result.logInFromDapp) == null ? void 0 : _a.authorization) == null ? void 0 : _b.token;
      if (token !== void 0) {
        this._jwt = token;
      }
      return result;
    }
    async logInFromService(variables) {
      var _a;
      const headers = this._requestHeaders();
      const result = await this._typedClient.logInFromService(variables, headers);
      const token = (_a = result.logInFromService) == null ? void 0 : _a.token;
      if (token !== void 0) {
        this._jwt = token;
      }
      return result;
    }
    async logInByOidc(variables) {
      var _a, _b, _c;
      const headers = this._requestHeaders();
      const result = await this._typedClient.logInByOidc(variables, headers);
      const token = (_c = (_b = (_a = result.logInByOidc) == null ? void 0 : _a.user) == null ? void 0 : _b.authorization) == null ? void 0 : _c.token;
      if (token !== void 0) {
        this._jwt = token;
      }
      return result;
    }
    async markFusionNotificationHistoryAsRead(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.markFusionNotificationHistoryAsRead(
        variables,
        headers
      );
    }
    async updateUserSettings(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.updateUserSettings(variables, headers);
    }
    async refreshAuthorization(variables) {
      var _a;
      const headers = this._requestHeaders();
      const result = await this._typedClient.refreshAuthorization(
        variables,
        headers
      );
      const token = (_a = result.refreshAuthorization) == null ? void 0 : _a.token;
      if (token !== void 0) {
        this._jwt = token;
      }
      return result;
    }
    async removeSourceFromSourceGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.removeSourceFromSourceGroup(variables, headers);
    }
    async sendEmailTargetVerificationRequest(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.sendEmailTargetVerificationRequest(
        variables,
        headers
      );
    }
    async sendMessage(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.sendMessage(variables, headers);
    }
    async updateSourceGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.updateSourceGroup(variables, headers);
    }
    async updateTargetGroup(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.updateTargetGroup(variables, headers);
    }
    async beginLogInWithWeb3(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.beginLogInWithWeb3(variables, headers);
    }
    async completeLogInWithWeb3(variables) {
      var _a, _b, _c;
      const headers = this._requestHeaders();
      const result = await this._typedClient.completeLogInWithWeb3(
        variables,
        headers
      );
      const token = (_c = (_b = (_a = result == null ? void 0 : result.completeLogInWithWeb3) == null ? void 0 : _a.user) == null ? void 0 : _b.authorization) == null ? void 0 : _c.token;
      if (token !== void 0) {
        this._jwt = token;
      }
      return result;
    }
    async verifyCbwTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.verifyCbwTarget(variables, headers);
    }
    async verifyXmtpTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.verifyXmtpTarget(variables, headers);
    }
    async verifyXmtpTargetViaXip42(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.verifyXmtpTargetViaXip42(variables, headers);
    }
    async createWebPushTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.createWebPushTarget(variables, headers);
    }
    async updateWebPushTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.updateWebPushTarget(variables, headers);
    }
    async deleteWebPushTarget(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.deleteWebPushTarget(variables, headers);
    }
    async getWebPushTargets(variables) {
      const headers = this._requestHeaders();
      return this._typedClient.getWebPushTargets(variables, headers);
    }
    _requestHeaders() {
      const requestId = v4_default();
      const headers = {
        "X-Request-Id": requestId,
        "X-Notifi-Client-Version": version
      };
      if (this._jwt !== void 0) {
        headers["Authorization"] = `Bearer ${this._jwt}`;
      }
      return headers;
    }
  };

  // ../../node_modules/graphql-request/build/esm/defaultJsonSerializer.js
  var defaultJsonSerializer = JSON;

  // ../../node_modules/graphql-request/build/esm/helpers.js
  var uppercase = (str) => str.toUpperCase();
  var HeadersInstanceToPlainObject = (headers) => {
    const o = {};
    headers.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  };

  // ../../node_modules/graphql-request/build/esm/parseArgs.js
  var parseRequestArgs = (documentOrOptions, variables, requestHeaders) => {
    return documentOrOptions.document ? documentOrOptions : {
      document: documentOrOptions,
      variables,
      requestHeaders,
      signal: void 0
    };
  };
  var parseRawRequestArgs = (queryOrOptions, variables, requestHeaders) => {
    return queryOrOptions.query ? queryOrOptions : {
      query: queryOrOptions,
      variables,
      requestHeaders,
      signal: void 0
    };
  };
  var parseBatchRequestArgs = (documentsOrOptions, requestHeaders) => {
    return documentsOrOptions.documents ? documentsOrOptions : {
      documents: documentsOrOptions,
      requestHeaders,
      signal: void 0
    };
  };

  // ../../node_modules/graphql-request/build/esm/resolveRequestDocument.js
  var extractOperationName = (document) => {
    let operationName = void 0;
    const operationDefinitions = document.definitions.filter((definition) => definition.kind === `OperationDefinition`);
    if (operationDefinitions.length === 1) {
      operationName = operationDefinitions[0]?.name?.value;
    }
    return operationName;
  };
  var resolveRequestDocument = (document) => {
    if (typeof document === `string`) {
      let operationName2 = void 0;
      try {
        const parsedDocument = parse(document);
        operationName2 = extractOperationName(parsedDocument);
      } catch (err) {
      }
      return { query: document, operationName: operationName2 };
    }
    const operationName = extractOperationName(document);
    return { query: print(document), operationName };
  };

  // ../../node_modules/graphql-request/build/esm/types.js
  var ClientError = class extends Error {
    constructor(response, request) {
      const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
        response,
        request
      })}`;
      super(message);
      Object.setPrototypeOf(this, ClientError.prototype);
      this.response = response;
      this.request = request;
      if (typeof Error.captureStackTrace === `function`) {
        Error.captureStackTrace(this, ClientError);
      }
    }
    static extractMessage(response) {
      return response.errors?.[0]?.message ?? `GraphQL Error (Code: ${response.status})`;
    }
  };

  // ../../node_modules/graphql-request/build/esm/index.js
  var CrossFetch = __toESM(require_browser_ponyfill(), 1);

  // ../../node_modules/graphql-request/build/esm/graphql-ws.js
  var CONNECTION_INIT = `connection_init`;
  var CONNECTION_ACK = `connection_ack`;
  var PING = `ping`;
  var PONG = `pong`;
  var SUBSCRIBE = `subscribe`;
  var NEXT = `next`;
  var ERROR = `error`;
  var COMPLETE = `complete`;
  var GraphQLWebSocketMessage = class {
    get type() {
      return this._type;
    }
    get id() {
      return this._id;
    }
    get payload() {
      return this._payload;
    }
    constructor(type, payload, id) {
      this._type = type;
      this._payload = payload;
      this._id = id;
    }
    get text() {
      const result = { type: this.type };
      if (this.id != null && this.id != void 0)
        result.id = this.id;
      if (this.payload != null && this.payload != void 0)
        result.payload = this.payload;
      return JSON.stringify(result);
    }
    static parse(data, f) {
      const { type, payload, id } = JSON.parse(data);
      return new GraphQLWebSocketMessage(type, f(payload), id);
    }
  };
  var GraphQLWebSocketClient = class {
    constructor(socket, { onInit, onAcknowledged, onPing, onPong }) {
      this.socketState = { acknowledged: false, lastRequestId: 0, subscriptions: {} };
      this.socket = socket;
      socket.addEventListener(`open`, async (e) => {
        this.socketState.acknowledged = false;
        this.socketState.subscriptions = {};
        socket.send(ConnectionInit(onInit ? await onInit() : null).text);
      });
      socket.addEventListener(`close`, (e) => {
        this.socketState.acknowledged = false;
        this.socketState.subscriptions = {};
      });
      socket.addEventListener(`error`, (e) => {
        console.error(e);
      });
      socket.addEventListener(`message`, (e) => {
        try {
          const message = parseMessage2(e.data);
          switch (message.type) {
            case CONNECTION_ACK: {
              if (this.socketState.acknowledged) {
                console.warn(`Duplicate CONNECTION_ACK message ignored`);
              } else {
                this.socketState.acknowledged = true;
                if (onAcknowledged)
                  onAcknowledged(message.payload);
              }
              return;
            }
            case PING: {
              if (onPing)
                onPing(message.payload).then((r) => socket.send(Pong(r).text));
              else
                socket.send(Pong(null).text);
              return;
            }
            case PONG: {
              if (onPong)
                onPong(message.payload);
              return;
            }
          }
          if (!this.socketState.acknowledged) {
            return;
          }
          if (message.id === void 0 || message.id === null || !this.socketState.subscriptions[message.id]) {
            return;
          }
          const { query, variables, subscriber } = this.socketState.subscriptions[message.id];
          switch (message.type) {
            case NEXT: {
              if (!message.payload.errors && message.payload.data) {
                subscriber.next && subscriber.next(message.payload.data);
              }
              if (message.payload.errors) {
                subscriber.error && subscriber.error(new ClientError({ ...message.payload, status: 200 }, { query, variables }));
              } else {
              }
              return;
            }
            case ERROR: {
              subscriber.error && subscriber.error(new ClientError({ errors: message.payload, status: 200 }, { query, variables }));
              return;
            }
            case COMPLETE: {
              subscriber.complete && subscriber.complete();
              delete this.socketState.subscriptions[message.id];
              return;
            }
          }
        } catch (e2) {
          console.error(e2);
          socket.close(1006);
        }
        socket.close(4400, `Unknown graphql-ws message.`);
      });
    }
    makeSubscribe(query, operationName, subscriber, variables) {
      const subscriptionId = (this.socketState.lastRequestId++).toString();
      this.socketState.subscriptions[subscriptionId] = { query, variables, subscriber };
      this.socket.send(Subscribe(subscriptionId, { query, operationName, variables }).text);
      return () => {
        this.socket.send(Complete(subscriptionId).text);
        delete this.socketState.subscriptions[subscriptionId];
      };
    }
    rawRequest(query, variables) {
      return new Promise((resolve, reject) => {
        let result;
        this.rawSubscribe(query, {
          next: (data, extensions) => result = { data, extensions },
          error: reject,
          complete: () => resolve(result)
        }, variables);
      });
    }
    request(document, variables) {
      return new Promise((resolve, reject) => {
        let result;
        this.subscribe(document, {
          next: (data) => result = data,
          error: reject,
          complete: () => resolve(result)
        }, variables);
      });
    }
    subscribe(document, subscriber, variables) {
      const { query, operationName } = resolveRequestDocument(document);
      return this.makeSubscribe(query, operationName, subscriber, variables);
    }
    rawSubscribe(query, subscriber, variables) {
      return this.makeSubscribe(query, void 0, subscriber, variables);
    }
    ping(payload) {
      this.socket.send(Ping(payload).text);
    }
    close() {
      this.socket.close(1e3);
    }
  };
  GraphQLWebSocketClient.PROTOCOL = `graphql-transport-ws`;
  function parseMessage2(data, f = (a) => a) {
    const m = GraphQLWebSocketMessage.parse(data, f);
    return m;
  }
  function ConnectionInit(payload) {
    return new GraphQLWebSocketMessage(CONNECTION_INIT, payload);
  }
  function Ping(payload) {
    return new GraphQLWebSocketMessage(PING, payload, void 0);
  }
  function Pong(payload) {
    return new GraphQLWebSocketMessage(PONG, payload, void 0);
  }
  function Subscribe(id, payload) {
    return new GraphQLWebSocketMessage(SUBSCRIBE, payload, id);
  }
  function Complete(id) {
    return new GraphQLWebSocketMessage(COMPLETE, void 0, id);
  }

  // ../../node_modules/graphql-request/build/esm/index.js
  var resolveHeaders = (headers) => {
    let oHeaders = {};
    if (headers) {
      if (typeof Headers !== `undefined` && headers instanceof Headers || CrossFetch && CrossFetch.Headers && headers instanceof CrossFetch.Headers) {
        oHeaders = HeadersInstanceToPlainObject(headers);
      } else if (Array.isArray(headers)) {
        headers.forEach(([name, value]) => {
          if (name && value !== void 0) {
            oHeaders[name] = value;
          }
        });
      } else {
        oHeaders = headers;
      }
    }
    return oHeaders;
  };
  var cleanQuery = (str) => str.replace(/([\s,]|#[^\n\r]+)+/g, ` `).trim();
  var buildRequestConfig = (params) => {
    if (!Array.isArray(params.query)) {
      const params_2 = params;
      const search = [`query=${encodeURIComponent(cleanQuery(params_2.query))}`];
      if (params.variables) {
        search.push(`variables=${encodeURIComponent(params_2.jsonSerializer.stringify(params_2.variables))}`);
      }
      if (params_2.operationName) {
        search.push(`operationName=${encodeURIComponent(params_2.operationName)}`);
      }
      return search.join(`&`);
    }
    if (typeof params.variables !== `undefined` && !Array.isArray(params.variables)) {
      throw new Error(`Cannot create query with given variable type, array expected`);
    }
    const params_ = params;
    const payload = params.query.reduce((acc, currentQuery, index) => {
      acc.push({
        query: cleanQuery(currentQuery),
        variables: params_.variables ? params_.jsonSerializer.stringify(params_.variables[index]) : void 0
      });
      return acc;
    }, []);
    return `query=${encodeURIComponent(params_.jsonSerializer.stringify(payload))}`;
  };
  var createHttpMethodFetcher = (method) => async (params) => {
    const { url, query, variables, operationName, fetch: fetch2, fetchOptions, middleware } = params;
    const headers = { ...params.headers };
    let queryParams = ``;
    let body = void 0;
    if (method === `POST`) {
      body = createRequestBody(query, variables, operationName, fetchOptions.jsonSerializer);
      if (typeof body === `string`) {
        headers[`Content-Type`] = `application/json`;
      }
    } else {
      queryParams = buildRequestConfig({
        query,
        variables,
        operationName,
        jsonSerializer: fetchOptions.jsonSerializer ?? defaultJsonSerializer
      });
    }
    const init = {
      method,
      headers,
      body,
      ...fetchOptions
    };
    let urlResolved = url;
    let initResolved = init;
    if (middleware) {
      const result = await Promise.resolve(middleware({ ...init, url, operationName, variables }));
      const { url: urlNew, ...initNew } = result;
      urlResolved = urlNew;
      initResolved = initNew;
    }
    if (queryParams) {
      urlResolved = `${urlResolved}?${queryParams}`;
    }
    return await fetch2(urlResolved, initResolved);
  };
  var GraphQLClient = class {
    constructor(url, requestConfig = {}) {
      this.url = url;
      this.requestConfig = requestConfig;
      this.rawRequest = async (...args) => {
        const [queryOrOptions, variables, requestHeaders] = args;
        const rawRequestOptions = parseRawRequestArgs(queryOrOptions, variables, requestHeaders);
        const { headers, fetch: fetch2 = CrossFetch.default, method = `POST`, requestMiddleware, responseMiddleware, ...fetchOptions } = this.requestConfig;
        const { url: url2 } = this;
        if (rawRequestOptions.signal !== void 0) {
          fetchOptions.signal = rawRequestOptions.signal;
        }
        const { operationName } = resolveRequestDocument(rawRequestOptions.query);
        return makeRequest({
          url: url2,
          query: rawRequestOptions.query,
          variables: rawRequestOptions.variables,
          headers: {
            ...resolveHeaders(callOrIdentity(headers)),
            ...resolveHeaders(rawRequestOptions.requestHeaders)
          },
          operationName,
          fetch: fetch2,
          method,
          fetchOptions,
          middleware: requestMiddleware
        }).then((response) => {
          if (responseMiddleware) {
            responseMiddleware(response);
          }
          return response;
        }).catch((error) => {
          if (responseMiddleware) {
            responseMiddleware(error);
          }
          throw error;
        });
      };
    }
    async request(documentOrOptions, ...variablesAndRequestHeaders) {
      const [variables, requestHeaders] = variablesAndRequestHeaders;
      const requestOptions = parseRequestArgs(documentOrOptions, variables, requestHeaders);
      const { headers, fetch: fetch2 = CrossFetch.default, method = `POST`, requestMiddleware, responseMiddleware, ...fetchOptions } = this.requestConfig;
      const { url } = this;
      if (requestOptions.signal !== void 0) {
        fetchOptions.signal = requestOptions.signal;
      }
      const { query, operationName } = resolveRequestDocument(requestOptions.document);
      return makeRequest({
        url,
        query,
        variables: requestOptions.variables,
        headers: {
          ...resolveHeaders(callOrIdentity(headers)),
          ...resolveHeaders(requestOptions.requestHeaders)
        },
        operationName,
        fetch: fetch2,
        method,
        fetchOptions,
        middleware: requestMiddleware
      }).then((response) => {
        if (responseMiddleware) {
          responseMiddleware(response);
        }
        return response.data;
      }).catch((error) => {
        if (responseMiddleware) {
          responseMiddleware(error);
        }
        throw error;
      });
    }
    // prettier-ignore
    batchRequests(documentsOrOptions, requestHeaders) {
      const batchRequestOptions = parseBatchRequestArgs(documentsOrOptions, requestHeaders);
      const { headers, ...fetchOptions } = this.requestConfig;
      if (batchRequestOptions.signal !== void 0) {
        fetchOptions.signal = batchRequestOptions.signal;
      }
      const queries = batchRequestOptions.documents.map(({ document }) => resolveRequestDocument(document).query);
      const variables = batchRequestOptions.documents.map(({ variables: variables2 }) => variables2);
      return makeRequest({
        url: this.url,
        query: queries,
        // @ts-expect-error TODO reconcile batch variables into system.
        variables,
        headers: {
          ...resolveHeaders(callOrIdentity(headers)),
          ...resolveHeaders(batchRequestOptions.requestHeaders)
        },
        operationName: void 0,
        fetch: this.requestConfig.fetch ?? CrossFetch.default,
        method: this.requestConfig.method || `POST`,
        fetchOptions,
        middleware: this.requestConfig.requestMiddleware
      }).then((response) => {
        if (this.requestConfig.responseMiddleware) {
          this.requestConfig.responseMiddleware(response);
        }
        return response.data;
      }).catch((error) => {
        if (this.requestConfig.responseMiddleware) {
          this.requestConfig.responseMiddleware(error);
        }
        throw error;
      });
    }
    setHeaders(headers) {
      this.requestConfig.headers = headers;
      return this;
    }
    /**
     * Attach a header to the client. All subsequent requests will have this header.
     */
    setHeader(key, value) {
      const { headers } = this.requestConfig;
      if (headers) {
        headers[key] = value;
      } else {
        this.requestConfig.headers = { [key]: value };
      }
      return this;
    }
    /**
     * Change the client endpoint. All subsequent requests will send to this endpoint.
     */
    setEndpoint(value) {
      this.url = value;
      return this;
    }
  };
  var makeRequest = async (params) => {
    const { query, variables, fetchOptions } = params;
    const fetcher = createHttpMethodFetcher(uppercase(params.method ?? `post`));
    const isBatchingQuery = Array.isArray(params.query);
    const response = await fetcher(params);
    const result = await getResult(response, fetchOptions.jsonSerializer ?? defaultJsonSerializer);
    const successfullyReceivedData = Array.isArray(result) ? !result.some(({ data }) => !data) : Boolean(result.data);
    const successfullyPassedErrorPolicy = Array.isArray(result) || !result.errors || Array.isArray(result.errors) && !result.errors.length || fetchOptions.errorPolicy === `all` || fetchOptions.errorPolicy === `ignore`;
    if (response.ok && successfullyPassedErrorPolicy && successfullyReceivedData) {
      const { errors: _, ...rest } = Array.isArray(result) ? result : result;
      const data = fetchOptions.errorPolicy === `ignore` ? rest : result;
      const dataEnvelope = isBatchingQuery ? { data } : data;
      return {
        ...dataEnvelope,
        headers: response.headers,
        status: response.status
      };
    } else {
      const errorResult = typeof result === `string` ? {
        error: result
      } : result;
      throw new ClientError(
        // @ts-expect-error TODO
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      );
    }
  };
  var createRequestBody = (query, variables, operationName, jsonSerializer) => {
    const jsonSerializer_ = jsonSerializer ?? defaultJsonSerializer;
    if (!Array.isArray(query)) {
      return jsonSerializer_.stringify({ query, variables, operationName });
    }
    if (typeof variables !== `undefined` && !Array.isArray(variables)) {
      throw new Error(`Cannot create request body with given variable type, array expected`);
    }
    const payload = query.reduce((acc, currentQuery, index) => {
      acc.push({ query: currentQuery, variables: variables ? variables[index] : void 0 });
      return acc;
    }, []);
    return jsonSerializer_.stringify(payload);
  };
  var getResult = async (response, jsonSerializer) => {
    let contentType;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === `content-type`) {
        contentType = value;
      }
    });
    if (contentType && (contentType.toLowerCase().startsWith(`application/json`) || contentType.toLowerCase().startsWith(`application/graphql+json`) || contentType.toLowerCase().startsWith(`application/graphql-response+json`))) {
      return jsonSerializer.parse(await response.text());
    } else {
      return response.text();
    }
  };
  var callOrIdentity = (value) => {
    return typeof value === `function` ? value() : value;
  };

  // ../notifi-frontend-client/lib/client/clientFactory.ts
  var newNotifiStorage = (config) => {
    var _a;
    const driver = ((_a = config.storageOption) == null ? void 0 : _a.driverType) === "InMemory" ? createInMemoryStorageDriver(config) : createLocalForageStorageDriver(config);
    return new NotifiFrontendStorage(driver);
  };
  var newNotifiService = (config, gqlClientRequestConfig) => {
    const url = envUrl(config.env, "http");
    const wsurl = envUrl(config.env, "websocket");
    const client2 = new GraphQLClient(url, gqlClientRequestConfig);
    const subService = new NotifiSubscriptionService(wsurl);
    return new NotifiService(client2, subService);
  };
  var instantiateFrontendClient = (tenantId, params, env, storageOption, gqlClientRequestConfig) => {
    let config = null;
    if ("accountAddress" in params) {
      config = {
        tenantId,
        env,
        walletBlockchain: params.walletBlockchain,
        authenticationKey: params.walletPublicKey,
        // NOTE: authenticationKey is a legacy field used to standardize the key name for indexedDB key. Now we directly add check condition when create storage driver
        accountAddress: params.accountAddress,
        storageOption
      };
    } else if ("signingPubkey" in params) {
      config = {
        tenantId,
        env,
        walletBlockchain: params.walletBlockchain,
        delegatedAddress: params.signingAddress,
        delegatedPublicKey: params.walletPublicKey,
        delegatorAddress: params.signingPubkey,
        storageOption
      };
    } else if ("userAccount" in params) {
      config = {
        tenantId,
        env,
        userAccount: params.userAccount,
        storageOption,
        walletBlockchain: params.walletBlockchain
      };
    } else {
      config = {
        tenantId,
        env,
        walletBlockchain: params.walletBlockchain,
        walletPublicKey: isEvmChain(params.walletBlockchain) ? params.walletPublicKey.toLowerCase() : params.walletPublicKey,
        storageOption
      };
    }
    if (!config) {
      throw new Error("ERROR - instantiateFrontendClient: Invalid UserParams");
    }
    const service = newNotifiService(config, gqlClientRequestConfig);
    const storage = newNotifiStorage(config);
    return new NotifiFrontendClient(config, service, storage);
  };

  // lib/notifi-service-worker.js
  var client;
  self.addEventListener("install", function(event) {
    self.skipWaiting();
  });
  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    var rawData = self.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  async function createWebPushTarget(subscription, vapidPublicKey) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    try {
      const subscriptionJson = subscription.toJSON();
      const targetGroups = await client.getTargetGroups();
      const defaultTargetGroup = targetGroups.find((targetGroup) => targetGroup.name === "Default");
      const webPushTargetIds = (_b = (_a = defaultTargetGroup == null ? void 0 : defaultTargetGroup.webPushTargets) == null ? void 0 : _a.map((t) => t == null ? void 0 : t.id)) != null ? _b : [];
      console.log(defaultTargetGroup == null ? void 0 : defaultTargetGroup.webPushTargets);
      const webPushTargetResponse = await client.createWebPushTarget({
        vapidPublicKey,
        endpoint: subscriptionJson.endpoint,
        auth: subscriptionJson.keys.auth,
        p256dh: subscriptionJson.keys.p256dh
      });
      console.log(webPushTargetResponse.createWebPushTarget.webPushTarget);
      if (!webPushTargetResponse.createWebPushTarget.webPushTarget || !((_c = webPushTargetResponse.createWebPushTarget.webPushTarget) == null ? void 0 : _c.id)) {
        console.error("Failed to create web push target. CreateWebPushTargetMutation failed.");
        return;
      }
      webPushTargetIds.push((_d = webPushTargetResponse.createWebPushTarget.webPushTarget) == null ? void 0 : _d.id);
      await client.ensureTargetGroup({
        name: "Default",
        emailAddress: (_e = defaultTargetGroup == null ? void 0 : defaultTargetGroup.emailTargets[0]) == null ? void 0 : _e.emailAddress,
        phoneNumber: (_f = defaultTargetGroup == null ? void 0 : defaultTargetGroup.smsTargets[0]) == null ? void 0 : _f.phoneNumber,
        telegramId: (_g = defaultTargetGroup == null ? void 0 : defaultTargetGroup.telegramTargets[0]) == null ? void 0 : _g.telegramId,
        discordId: (_h = defaultTargetGroup == null ? void 0 : defaultTargetGroup.discordTargets[0]) == null ? void 0 : _h.name,
        slackId: (_i = defaultTargetGroup == null ? void 0 : defaultTargetGroup.slackChannelTargets[0]) == null ? void 0 : _i.name,
        walletId: (_j = defaultTargetGroup == null ? void 0 : defaultTargetGroup.web3Targets[0]) == null ? void 0 : _j.name,
        webPushTargetIds
      });
    } catch (err) {
      console.error(err, "Failed to create web push target.");
    }
  }
  function GetSubsciption(userAccount, dappId, env) {
    if (Notification.permission !== "granted") {
      console.log("Notification permissions not granted");
      return;
    }
    if (!userAccount || !dappId || !env || userAccount == "" || dappId == "" || env == "") {
      console.log("UserAccount, Notifi dappId, or env not found. Skipping subscription instantiation.");
      return;
    }
    client = instantiateFrontendClient(
      dappId,
      {
        walletBlockchain: "OFF_CHAIN",
        userAccount
      },
      env,
      void 0,
      { fetch }
    );
    client.initialize().then((userState) => {
      if (userState.status == "authenticated") {
        let vapidPublicKey = "BBw1aI15zN4HFMIlbWoV2E390hxgY47-mBjN41Ewr2YCNGPdoR3-Q1vI-LAyfut8rqwSOWrcBA5sA5aC4gHcFjA";
        if (Notification.permission === "granted") {
          self.registration.pushManager.getSubscription().then(async (subscription) => {
            if (subscription) {
              console.log("subscription already exists");
              return subscription;
            }
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            return await self.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey
            });
          }).then(async (subscription) => {
            await createWebPushTarget(subscription, vapidPublicKey);
          });
        }
      }
    });
  }
  self.addEventListener("push", async function(event) {
    var _a;
    let payload = event.data ? JSON.parse(event.data.text()) : {
      Subject: "No Payload",
      Message: "No payload"
    };
    event.waitUntil(
      self.registration.showNotification(payload.Subject, {
        body: payload.Message,
        icon: (_a = payload.Icon) != null ? _a : "https://notifi.network/logo.png"
      })
    );
  });
  self.addEventListener("notificationclick", async function(event) {
  });
  self.addEventListener("notificationclose", async function(event) {
  });
  self.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type == "NotifiCheckSubscription") {
        GetSubsciption(payload.userAccount, payload.dappId, payload.env);
      }
    } catch (e) {
      console.error(e, "Error parsing message data");
    }
  });
})();
/*! Bundled license information:

localforage/dist/localforage.js:
  (*!
      localForage -- Offline Storage, Improved
      Version 1.10.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  *)
*/

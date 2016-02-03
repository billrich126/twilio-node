'use strict';

var _ = require('lodash');
var Q = require('q');
var InstanceContext = require('../../../../base/InstanceContext');
var InstanceResource = require('../../../../base/InstanceResource');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var AuthorizedConnectAppPage;
var AuthorizedConnectAppList;
var AuthorizedConnectAppInstance;
var AuthorizedConnectAppContext;

/**
 * @constructor Twilio.Api.V2010.AccountContext.AuthorizedConnectAppPage
 * @augments Page
 * @description Initialize the AuthorizedConnectAppPage
 *
 * @param {V2010} version - Version that contains the resource
 * @param {object} response - Response from the API
 * @param {string} accountSid - The unique sid that identifies this account
 *
 * @returns AuthorizedConnectAppPage
 */
function AuthorizedConnectAppPage(version, response, accountSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    accountSid: accountSid
  };
}

_.extend(AuthorizedConnectAppPage.prototype, Page.prototype);
AuthorizedConnectAppPage.prototype.constructor = AuthorizedConnectAppPage;

/**
 * Build an instance of AuthorizedConnectAppInstance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns AuthorizedConnectAppInstance
 */
AuthorizedConnectAppPage.prototype.getInstance = function getInstance(payload) {
  return new AuthorizedConnectAppInstance(
    this._version,
    payload,
    this._solution.accountSid
  );
};


/**
 * @constructor Twilio.Api.V2010.AccountContext.AuthorizedConnectAppList
 * @description Initialize the AuthorizedConnectAppList
 *
 * @param {V2010} version - Version that contains the resource
 * @param {string} accountSid - The unique sid that identifies this account
 *
 * @returns {function} - AuthorizedConnectAppListInstance
 */
function AuthorizedConnectAppList(version, accountSid) {
  /**
   * @memberof Twilio.Api.V2010.AccountContext.AuthorizedConnectAppList
   *
   * @param {string} sid - sid of instance
   *
   * @returns AuthorizedConnectAppContext
   */
  function AuthorizedConnectAppListInstance(sid) {
    return AuthorizedConnectAppListInstance.get(sid);
  }

  AuthorizedConnectAppListInstance._version = version;
  // Path Solution
  AuthorizedConnectAppListInstance._solution = {
    accountSid: accountSid
  };
  AuthorizedConnectAppListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/AuthorizedConnectApps.json' // jshint ignore:line
  )(AuthorizedConnectAppListInstance._solution);
  /**
   * @memberof AuthorizedConnectAppList
   *
   * @description Streams AuthorizedConnectAppInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         list() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  AuthorizedConnectAppListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /**
   * @memberof AuthorizedConnectAppList
   *
   * @description Lists AuthorizedConnectAppInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  AuthorizedConnectAppListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource) {
      allResources.push(resource);
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /**
   * @memberof AuthorizedConnectAppList
   *
   * @description Retrieve a single page of AuthorizedConnectAppInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  AuthorizedConnectAppListInstance.page = function page(opts, callback) {
    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new AuthorizedConnectAppPage(
        this._version,
        payload,
        this._solution.accountSid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /**
   * @memberof Twilio.Api.V2010.AccountContext.AuthorizedConnectAppList
   *
   * @description Constructs a AuthorizedConnectAppContext
   *
   * @param {string} connectAppSid - The connect_app_sid
   *
   * @returns AuthorizedConnectAppContext
   */
  AuthorizedConnectAppListInstance.get = function get(connectAppSid) {
    return new AuthorizedConnectAppContext(
      this._version,
      this._solution.accountSid,
      connectAppSid
    );
  };

  return AuthorizedConnectAppListInstance;
}


/**
 * @constructor Twilio.Api.V2010.AccountContext.AuthorizedConnectAppInstance
 * @augments InstanceResource
 * @description Initialize the AuthorizedConnectAppContext
 *
 * @property {string} accountSid - The unique sid that identifies this account
 * @property {string} connectAppCompanyName -
 *          The company name set for this Connect App.
 * @property {string} connectAppDescription - Human readable description of the app
 * @property {string} connectAppFriendlyName -
 *          A human readable name for the Connect App.
 * @property {string} connectAppHomepageUrl - The public URL for this Connect App.
 * @property {string} connectAppSid - A string that uniquely identifies this app
 * @property {Date} dateCreated - The date this resource was created
 * @property {Date} dateUpdated - The date this resource was last updated
 * @property {authorized_connect_app.permission} permissions -
 *          Permissions authorized to this app
 * @property {string} uri - The URI for this resource
 *
 * @param {V2010} version - Version that contains the resource
 * @param {object} payload - The instance payload
 * @param {sid} accountSid - The account_sid
 * @param {sid} connectAppSid - The connect_app_sid
 */
function AuthorizedConnectAppInstance(version, payload, accountSid,
                                       connectAppSid) {
  InstanceResource.prototype.constructor.call(this, version);

  // Marshaled Properties
  this._properties = {
    accountSid: payload.account_sid, // jshint ignore:line,
    connectAppCompanyName: payload.connect_app_company_name, // jshint ignore:line,
    connectAppDescription: payload.connect_app_description, // jshint ignore:line,
    connectAppFriendlyName: payload.connect_app_friendly_name, // jshint ignore:line,
    connectAppHomepageUrl: payload.connect_app_homepage_url, // jshint ignore:line,
    connectAppSid: payload.connect_app_sid, // jshint ignore:line,
    dateCreated: deserialize.rfc2822DateTime(payload.date_created), // jshint ignore:line,
    dateUpdated: deserialize.rfc2822DateTime(payload.date_updated), // jshint ignore:line,
    permissions: payload.permissions, // jshint ignore:line,
    uri: payload.uri, // jshint ignore:line,
  };

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
    connectAppSid: connectAppSid || this._properties.connectAppSid,
  };
}

_.extend(AuthorizedConnectAppInstance.prototype, InstanceResource.prototype);
AuthorizedConnectAppInstance.prototype.constructor = AuthorizedConnectAppInstance;

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new AuthorizedConnectAppContext(
        this._version,
        this._solution.accountSid,
        this._solution.connectAppSid
      );
    }

    return this._context;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'accountSid', {
  get: function() {
    return this._properties.accountSid;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'connectAppCompanyName', {
  get: function() {
    return this._properties.connectAppCompanyName;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'connectAppDescription', {
  get: function() {
    return this._properties.connectAppDescription;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'connectAppFriendlyName', {
  get: function() {
    return this._properties.connectAppFriendlyName;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'connectAppHomepageUrl', {
  get: function() {
    return this._properties.connectAppHomepageUrl;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'connectAppSid', {
  get: function() {
    return this._properties.connectAppSid;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'dateCreated', {
  get: function() {
    return this._properties.dateCreated;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'dateUpdated', {
  get: function() {
    return this._properties.dateUpdated;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'permissions', {
  get: function() {
    return this._properties.permissions;
  },
});

Object.defineProperty(AuthorizedConnectAppInstance.prototype,
  'uri', {
  get: function() {
    return this._properties.uri;
  },
});

/**
 * @description Fetch a AuthorizedConnectAppInstance
 *
 * @param {function} [callback] - Callback to handle fetched record
 *
 * @returns {Promise} Resolves to fetched AuthorizedConnectAppInstance
 */
AuthorizedConnectAppInstance.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new AuthorizedConnectAppInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.connectAppSid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};


/**
 * @constructor Twilio.Api.V2010.AccountContext.AuthorizedConnectAppContext
 * @augments InstanceContext
 * @description Initialize the AuthorizedConnectAppContext
 *
 * @param {V2010} version - Version that contains the resource
 * @param {sid} accountSid - The account_sid
 * @param {sid} connectAppSid - The connect_app_sid
 */
function AuthorizedConnectAppContext(version, accountSid, connectAppSid) {
  InstanceContext.prototype.constructor.call(this, version);

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    connectAppSid: connectAppSid,
  };
  this._uri = _.template(
    '/Accounts/<%= accountSid %>/AuthorizedConnectApps/<%= connectAppSid %>.json' // jshint ignore:line
  )(this._solution);
}

_.extend(AuthorizedConnectAppContext.prototype, InstanceContext.prototype);
AuthorizedConnectAppContext.prototype.constructor = AuthorizedConnectAppContext;

/**
 * @description Fetch a AuthorizedConnectAppInstance
 *
 * @param {function} [callback] - Callback to handle fetched record
 *
 * @returns {Promise} Resolves to fetched AuthorizedConnectAppInstance
 */
AuthorizedConnectAppContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new AuthorizedConnectAppInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.connectAppSid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  AuthorizedConnectAppPage: AuthorizedConnectAppPage,
  AuthorizedConnectAppList: AuthorizedConnectAppList,
  AuthorizedConnectAppInstance: AuthorizedConnectAppInstance,
  AuthorizedConnectAppContext: AuthorizedConnectAppContext
};
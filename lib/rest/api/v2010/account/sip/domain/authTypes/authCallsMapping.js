'use strict';

/* jshint ignore:start */
/**
 * This code was generated by
 * \ / _    _  _|   _  _
 *  | (_)\/(_)(_|\/| |(/_  v1.0.0
 *       /       /
 */
/* jshint ignore:end */

var _ = require('lodash');  /* jshint ignore:line */
var AuthCallsCredentialListMappingList = require(
    './authCallsMapping/authCallsCredentialListMapping').AuthCallsCredentialListMappingList;
var AuthCallsIpAccessControlListMappingList = require(
    './authCallsMapping/authCallsIpAccessControlListMapping').AuthCallsIpAccessControlListMappingList;

var AuthTypeCallsList;

/* jshint ignore:start */
/**
 * @description Initialize the AuthTypeCallsList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid -
 *          The unique id of the account responsible for this domain
 * @param {string} domainSid - A string that uniquely identifies the SIP Domain
 */
/* jshint ignore:end */
AuthTypeCallsList = function AuthTypeCallsList(version, accountSid, domainSid) {
  /* jshint ignore:start */
  /**
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.SipContext.DomainContext.AuthTypesContext.AuthTypeCallsContext}
   */
  /* jshint ignore:end */
  function AuthTypeCallsListInstance(sid) {
    return AuthTypeCallsListInstance.get(sid);
  }

  AuthTypeCallsListInstance._version = version;
  // Path Solution
  AuthTypeCallsListInstance._solution = {accountSid: accountSid, domainSid: domainSid};

  // Components
  AuthTypeCallsListInstance._credentialListMappings = undefined;
  AuthTypeCallsListInstance._ipAccessControlListMappings = undefined;

  Object.defineProperty(AuthTypeCallsListInstance,
    'credentialListMappings', {
    get: function credentialListMappings() {
      if (!this._credentialListMappings) {
        this._credentialListMappings = new AuthCallsCredentialListMappingList(
          this._version,
          this._solution.accountSid,
          this._solution.domainSid
        );
      }

      return this._credentialListMappings;
    }
  });

  Object.defineProperty(AuthTypeCallsListInstance,
    'ipAccessControlListMappings', {
    get: function ipAccessControlListMappings() {
      if (!this._ipAccessControlListMappings) {
        this._ipAccessControlListMappings = new AuthCallsIpAccessControlListMappingList(
          this._version,
          this._solution.accountSid,
          this._solution.domainSid
        );
      }

      return this._ipAccessControlListMappings;
    }
  });

  return AuthTypeCallsListInstance;
};

module.exports = {
  AuthTypeCallsList: AuthTypeCallsList
};

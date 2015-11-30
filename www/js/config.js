(function() {
  'use strict';

  var app = angular.module('babyTracker');

  var dbUrls = {
    base: 'https://bertid-babytracker.firebaseio.com/',
    auth: 'https://bertid-babytracker.firebaseio.com/users'
  };
  var debug = true;
  var version = "0.0.1";
  /*var childFollowerRoles = {
    "mother": {
      "relationship": "parent",
      "nl": "moeder"
    },
    "father": {
      "relationship": "parent",
      "nl": "vader"
    },
    "uncle": {
      "relationship": "family",
      "nl": "oom"
    },
    "aunt": {
      "relationship": "family",
      "nl": "tante"
    },
    "godfather": {
      "relationship": "familyDegree2",
      "nl": "peter"
    },
    "godmother": {
      "relationship": "familyDegree2",
      "nl": "meter"
    },
    "brother": {
      "relationship": "familyDegree2",
      "nl": "broer"
    },
    "sister": {
      "relationship": "familyDegree2",
      "nl": "zus"
    },
    "grandfather": {
      "relationship": "familyDegree2",
      "nl": "grootvader"
    },
    "grandmother": {
      "relationship": "familyDegree2",
      "nl": "grootmoeder"
    },
    "family": {
      "relationship": "parent",
      "nl": "moeder"
    },
    "friend": {
      "value": "noFamily",
      "nl": "vriend"
    }
  };*/
  /*var childFollowerRoles = ["mother", "father", "uncle", "aunt", "godfather", "godmother", "brother", "sister", "grandfather", "grandmother", "family", "friend"];
  var childFollowerRolesLang = ["moeder", "vader", "oom", "tante", "peter", "meter", "broer", "zus", "grootvader", "grootmoeder", "familie(ver)", "vriend"];
  */
  var config = {
    dbUrls: dbUrls,
    debug: debug,
    version: version
  };
  app.value('config', config);
})();

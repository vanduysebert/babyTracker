(function() {
  'use strict';

  var app = angular.module('babyTracker');

  var dbUrls = {
    base: 'https://bertid-babytracker.firebaseio.com/',
    auth: 'https://bertid-babytracker.firebaseio.com/users'
  };
  var debug = true;
  var version = "0.0.1";

  var emergencyNumbersBelgium = [
    {
      name: "Kind & Gezin",
      phone: "078150100",
      website: "www.kindengezin.be",
      thumbnail: "img/kindGezinThumb.png"
    },
    {
      name: "Antigifcentrum",
      phone: "070245245",
      website: "www.poisoncentre.be",
      thumbnail: "img/AntigifcentrumThumb.jpg"
    }
  ]
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
    emergencyNumbers: emergencyNumbersBelgium,
    dbUrls: dbUrls,
    debug: debug,
    version: version
  };
  app.value('config', config);
})();

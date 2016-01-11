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
      thumbnail: "img/LogoKG.jpg"
    },
    {
      name: "Antigifcentrum",
      phone: "070245245",
      website: "www.poisoncentre.be",
      thumbnail: "img/AntigifcentrumThumb.jpg"
    }
  ]

  var appLink = "https://itunes.apple.com/be/app/babytracker/id310633997?l=nl&mt=8";

  var config = {
    emergencyNumbers: emergencyNumbersBelgium,
    dbUrls: dbUrls,
    debug: debug,
    version: version,
    appLink: appLink
  };
  app.value('config', config);
})();

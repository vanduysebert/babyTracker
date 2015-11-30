(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('loggingService', loggingService);

    loggingService.$inject = ['$cordovaToast', '$log', 'config'];

    function loggingService($cordovaToast, $log, config) {
        var service = {
            showError: showError,
            showSuccess: showSuccess,
            showWarning: showWarning,
            showInfo: showSuccess
        };

        return service;

        function showError(mess, obj, mod, showToast) {
          if(config.debug) {
            mod = mod ? '[' + mod + ']' : '';
            $log.error(mod, mess, obj);
          }
          if(showToast) {
            showToastMess(mess);
          }
        }

        function showSuccess(mess, obj, mod, showToast) {
            if(config.debug) {
                mod = mod ? '[' + mod + ']' : '';

                $log.info(mod, mess, obj);
            }
            if(showToast) {
              showToastMess(mess);
            }
        }

        function showWarning(mess,obj, mod, showToast) {
            if(config.debug) {
                mod = mod ? '[' + mod + ']' : '';

                $log.warn(mod, mess, obj);
            }
            if(showToast) {
              showToastMess(mess);
            }
        }



        function showToastMess(message) {
            var mess = "";
            if(angular.isObject(message)) {
                if(angular.isObject(message.data.message)) {
                    mess = message.data.message;
                }
            } else {
              mess = message;
            }
            $cordovaToast.showShortTop(mess).then(function(success) {
            }, function(err) {
              $log.error("Toast not shown: ", err);
            })
        }
    }
})();

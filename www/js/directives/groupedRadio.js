(function() {
  'use strict';

  angular
    .module('babyTracker')
    .directive('groupedRadio', groupedRadio);

  function groupedRadio() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        value: '=groupedRadio'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-positive');
        if (newVal === scope.value) {
          element.addClass('button-positive');
        }
      });
      }
    }


})();

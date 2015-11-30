(function() {
    'use strict';

    angular
        .module('babyTracker')
        .directive('btCompareTo', btCompareTo);

    function btCompareTo() {
        // Usage:
        //      <btCompareTo></btCompareTo>
        var directive = {
            require: "ngModel",
            scope: {
              compareValue: "=btCompareTo"
            },
            link: link
        };

        return directive;

        function link(scope, el, attr, ctrl) {
            ctrl.$validators.compareTo = function (modelValue) {
              return modelValue === scope.compareValue;
            };

            scope.$watch("compareValue", function() {
              ctrl.$validate();
            });
        }
    }
})();

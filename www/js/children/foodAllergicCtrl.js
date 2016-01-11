(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('foodAllergicCtrl', foodAllergicCtrl);

  foodAllergicCtrl.$inject = ['foodSvc', '$q', 'Child', '$state', 'childSvc']

  function foodAllergicCtrl(foodSvc, $q, Child, $state, childSvc) {
    var vm = this;
    vm.ingredients = [];
    vm.getMonths = getMonths;
    vm.allergics = [];
    vm.foodAllergics = childSvc.bindFoodAllergics(Child.$id);
    vm.saveAllergics = saveAllergics;
    vm.setAllergics = setAllergics;
    vm.ingr = {
      checked : false
    }
    vm.getIngredients = getIngredients;
    vm.foodCategories = [ {
      value: 'fruits',
      nl: 'Fruitpap',
      id: "2"
    }, {
      value: "vegetables",
      nl: 'Groentenpap',
      id: "3"
    }, {
      value: 'meat',
      nl: 'Vlees - vis - ei - vegetarisch',
      id: "4"
    }, {
      value: 'bread',
      nl: 'Brood',
      id: "5"
    }, {
      value: 'snack',
      nl: 'Tussendoortje',
      id: "6"
    }]
    activate();

    function activate() {
      angular.forEach(vm.foodCategories, function(cat) {
          getIngredients(cat).then(function(ingr) {
            console.log(cat);
            console.log(ingr);
            vm.ingredients[cat.id] = ingr;
            console.log(vm.ingredients);
          });
      });
    }

    function getMonths(cat) {
      var deferred = $q.defer();
      if (cat == 'fruits') {
        deferred.resolve(["4", "6", "12"]);
      } else if (cat == 'vegetables') {
        deferred.resolve(["4", "6", "8", "12"])
      } else if (cat == 'meat') {
        deferred.resolve(["6", "8", "12"]);
      } else if (cat == 'bread') {
        deferred.resolve(["8"]);
      } else if (cat == 'snack') {
        deferred.resolve(["12"]);
      } else {
        deferred.resolve(["0"]);
      }
      return deferred.promise;

    }

    function getIngredients(cat) {
      var deferred = $q.defer();
      var ingredients = [];
      getMonths(cat.value).then(function(months) {
        vm.months = months;
        var i = 0;
        angular.forEach(months, function(m) {

          var time = "from" + m + "Months";
          foodSvc.getIngredients(cat.value, time).then(function(ingr) {
            angular.forEach(ingr, function(ing) {
              angular.forEach(vm.foodAllergics, function(food) {
                if(ing.name == food.name) {
                  ing.checked = true;
                  vm.allergics.push(ing);
                }
              });
              ingredients.push(ing);
              deferred.resolve(ingredients);
            });

          }, function(err) {
            deferred.reject(err);
          });
        });
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function setAllergics(ingr) {
      console.log(ingr);
      if(ingr.checked) {
        vm.allergics.push(ingr);
      } else {
        var index = 0;
        angular.forEach(vm.allergics, function(i) {
          if(i.name === ingr.name) {
            vm.allergics.splice(index, 1);
          }
          index++;
        });
      }
      console.log(vm.allergics);
    }

    function saveAllergics() {
      console.log("test");
      childSvc.saveFoodAllergics(Child.$id, vm.allergics);
      console.log("test");
      $state.go("child.profile", {
        childId: Child.$id
      });
    }

  }
})();

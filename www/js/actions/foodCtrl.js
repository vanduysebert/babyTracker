(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('foodCtrl', foodCtrl);

  foodCtrl.$inject = ['foodSvc', '$ionicModal', '$scope', '$q', 'Child', 'childSvc', 'postSvc', 'userDataSvc', '$state', '$ionicScrollDelegate'];

  function foodCtrl(foodSvc, $ionicModal, $scope, $q, Child, childSvc, postSvc, userDataSvc, $state, $ionicScrollDelegate) {
    var vm = this;
    vm.foodData = {
      category: "",
      ingredients: [],
      amount: ""
    };
    vm.resizeWindow = resizeWindow;
    vm.childAge = "";
    vm.showSummary = showSummary;
    vm.months = [];
    vm.foodAllergics = childSvc.bindFoodAllergics(Child.$id);
    vm.deleteItem = deleteItem;
    vm.ingredients = {};
    vm.data = "";
    vm.setIngredients = setIngredients;
    vm.showIngredients = showIngredients;
    vm.foodCategories = [{
      value: 'milk',
      nl: 'Melkvoeding'
    }, {
      value: 'fruits',
      nl: 'Fruitpap'
    }, {
      value: 'vegetables',
      nl: 'Groentenpap'
    }, {
      value: 'meat',
      nl: 'Vlees - vis - ei - vegetarisch'
    }, {
      value: 'bread',
      nl: 'Brood'
    }, {
      value: 'snack',
      nl: 'Tussendoortje'
    }]
    vm.selectFood = selectFood;
    vm.foodCat = "";
    activate();

    function activate() {
      childSvc.getChildAgeMonths(Child.$id).then(function(age) {
        vm.childAge = age;
        console.log(age);
      });
    }

    function resizeWindow() {
            $ionicScrollDelegate.resize();
        }

    function selectFood(animation) {
      $ionicModal.fromTemplateUrl('templates/modals/selectFoodCategory.html', {
        scope: $scope,
        animation: 'animated ' + animation,
        hideDelay: 20
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.foodCats = vm.foodCategories;
        $scope.data = {
          cat: ''
        }
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });

        $scope.setFoodSelected = function() {
          console.log($scope.data.cat);
          angular.forEach(vm.foodCategories, function(c) {
            if (c.value == $scope.data.cat) {
              vm.foodData.category = c;
              getIngredients(c.value).then(function(ingredients) {
                vm.ingredients = ingredients;
                $scope.modal.hide();
              });
            }
          });
        }
      });

    };

    function showSummary(animation) {
      $ionicModal.fromTemplateUrl('templates/modals/summaryFood.html', {
        scope: $scope,
        animation: 'animated ' + animation,
        hideDelay: 20
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.foodData = vm.foodData;
        $scope.emo = {
          happy: false,
          normal: true,
          sad: false,
        };
        $scope.remark = "";
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });

        $scope.postFood = function() {
          $scope.foodData.emo = $scope.emo;
          postSvc.postFood($scope.foodData, Child.$id, userDataSvc.uid).then(function(data) {
            vm.foodData = {
              category: "",
              ingredients: [],
              amount: ""
            };

            $scope.foodData = {};
            $scope.modal.remove();
            $state.go('child.posts');
          }, function(err) {

          });
        }

        $scope.setFoodSelected = function() {
          console.log($scope.data.cat);
          angular.forEach(vm.foodCategories, function(c) {
            if (c.value == $scope.data.cat) {
              vm.foodData.category = c;
              getIngredients(c.value).then(function(ingredients) {
                console.log("test");
                vm.ingredients = ingredients;
                $scope.modal.hide();
              });
            }
          });
        }
      });
    };

    function showIngredients(animation) {

      $ionicModal.fromTemplateUrl('templates/modals/selectFoodIngredients.html', {
        scope: $scope,
        animation: 'animated ' + animation,
        hideDelay: 20
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.ingredients = vm.ingredients;
        $scope.months = vm.months;
        $scope.resizeWindow = resizeWindow();
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });



        $scope.setIngredients = function(ingr, index) {
          if(ingr.checked) {
            vm.foodData.ingredients.push(ingr);
          } else {
            var index = 0;
            angular.forEach(vm.foodData.ingredients, function(i) {
              if(i.name === ingr.name) {
                vm.foodData.ingredients.splice(index, 1);
              }
              index++;
            });
          }
        }
      });
    }

    function getMonths(cat) {
      var deferred = $q.defer();
      if (cat == 'fruits' ) {
        deferred.resolve(["4", "6", "12"]);
      } else if(cat == 'vegetables') {
        deferred.resolve(["4", "6", "8", "12"])
      }
        else if (cat == 'meat') {
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
      getMonths(cat).then(function(months) {
        vm.months = months;
        var i = 0;

        angular.forEach(months, function(m) {
          var isAge = false;
          var t = parseInt(m);
          if(t <= vm.childAge) {
            isAge = true;
          }
          var time = "from" + m + "Months";
          foodSvc.getIngredients(cat, time).then(function(ingr) {
            var i = [];
            angular.forEach(ingr, function(ing) {
              angular.forEach(vm.foodAllergics, function(food) {
                if(ing.name == food.name) {
                  ing.disabled = true;
                }
              });
              i.push(ing);
            });
            ingredients[m] =
              {
                  ingr: i,
                  show: isAge
              }
              deferred.resolve(ingredients);
          }, function(err) {
            deferred.reject(err);
          });
        });
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function setIngredients(ingr, index) {
      if(ingr.checked) {
        vm.foodData.ingredients.push(ingr);
      } else {
        var index = 0;
        angular.forEach(vm.foodData.ingredients, function(i) {
          if(i.name === ingr.name) {
            vm.foodData.ingredients.splice(index, 1);
          }
          index++;
        });
      }
    }

    function deleteItem(index, ingr) {
      vm.foodData.ingredients.splice(index, 1);
      angular.forEach(vm.ingredients, function(m) {
        angular.forEach(m, function(i) {
          angular.forEach(i, function(r) {
            if(r.name == ingr.name) {
              r.checked = false;
            }
          })
        })
      })
    }

  }
})();

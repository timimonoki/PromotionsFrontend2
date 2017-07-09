
angular.module("jumboClient").controller('NewItemController', function($scope, close) {

  $scope.item={};
  $scope.close = function(action) {
    if(action==='Save'){
        close($scope.item, 500); // close, but give 500ms for bootstrap to animate
    } else close('Cancel', 500);
  };

});

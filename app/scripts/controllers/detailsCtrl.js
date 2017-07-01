'use strict';
angular.module('jumboClient').controller('DetailsCtrl', ['$state', '$scope', '$stateParams', '$http', function ($state, $scope, $stateParams, $http) {


  $scope.items="AICI SUNT DETALII ID:"+$stateParams.id;

        function get(id) {
          return $http.get('/links/'+id);
        }
get(6);



}]);

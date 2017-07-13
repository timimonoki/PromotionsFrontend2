'use strict';
angular.module('jumboClient').service('PaginationService', ['$q', '$http', function($q, $http) {

    this.getSortedShops = function(pageNumber, pageSize){
        var deferred = $q.defer();
        $http({
              method: 'GET',
              url: 'http://localhost:8093/lidl/findShops',
              headers: {'Content-Type':'application/json'}
              }).then(function successCallback(response.data){
                   deferred.resolve(response);
                },
                   function errorCallback(error){
              }
                );
        	       return deferred.promise;
     }



}]);
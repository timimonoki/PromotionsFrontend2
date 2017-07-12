'use strict';
angular.module('jumboClient').service('PaginationService', ['$q', '$http', function($q, $http) {

    this.getSortedShops = function(pageNumber, pageSize){
        var deferred = $q.defer();
        $http({
              method: 'GET',
              url: 'http://localhost:8093/lidl/',
              headers: {'Content-Type':'application/json'}
              }).then(function successCallback(response){
                   deffered.resolve(response);
                },
                   function errorCallback(error){
              }
                );
        	       return deferred.promise;
        	}


}]);
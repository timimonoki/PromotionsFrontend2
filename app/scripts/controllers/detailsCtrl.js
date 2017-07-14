'use strict';
angular.module('jumboClient').controller('DetailsCtrl', ['$state', '$scope', '$stateParams', '$http', function ($state, $scope, $stateParams, $http) {

$scope.images = [];
var catalogs;
getCurrentCatalogsAndImages();

function getCurrentCatalogsAndImages(){
    $http({
        method: 'GET',
        url: 'http://localhost:8093/lidl/currentCatalogs/'+$stateParams.id,
    }).then(function successCallback(result){
        console.log("Current catalogs are: ", result.data);
        catalogs = result.data;
        getImagesForCatalog(catalogs);
    },
        function errorCallback(error){}
    );
}

function getImagesForCatalog(catalogs){
//    for(int i=0; i<catalogs.length; i++){
        $http({
                method: 'GET',
                url: 'http://localhost:8093/lidl/catalogImages/'+catalogs[0].id
            }).then(function successCallback(result){
                console.log("Images: ", result);
                $scope.images.push(result);
            },
                function errorCallback(error){}
            );
//    }
}

}]);

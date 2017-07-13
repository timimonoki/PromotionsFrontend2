'use strict';
angular.module('jumboClient').controller('HomeCtrl', ['$http', 'Geocoder','uiGmapGoogleMapApi', 'User', 'GeoItem', '$state', '$scope', '$log', 'Notification',
  'ModalService', 'SweetAlert',
	function ($http, Geocoder,uiGmapGoogleMapApi, User, GeoItem, $state, $scope, $log, Notification, ModalService, SweetAlert) {


/* A.UTH */
$scope.isLoggedIn = User.isLoggedIn;

$scope.markers2 = [];
$scope.items = [];
$scope.map = { center: { latitude: 	46.7952336, longitude: 24.03165279999996}, zoom: 10};
$scope.map.infoWindow ={show:false, coords:null};

if(User.isLoggedIn){
    getShops();
    getAllCategories();
}

var paginationOptions = {
            pageNumber: 1,
            pageSize: 5,
            sort: null
        };

uiGmapGoogleMapApi.then(function(maps) {
  // at this point the map is loaded
});

/* MODAL FOR NEW ITEM */
$scope.show = function() {
     ModalService.showModal({
         templateUrl: '../views/hello/modal.html',
         controller: "NewItemController"
     }).then(function(modal) {
         modal.element.modal();
         modal.close.then(function(response) {
            if(typeof response ==='string' && response==='Cancel'){
                //this is cancel
              } else { //object -> save
                save(response);
              }
         });
     });
};

$scope.goToDetails = function(id){
  $state.transitionTo('main.details', {id:1});
}

/* ITEMS MANAGEMENT */

$scope.items = [];
$scope.item = {'title':'', 'lat':'', 'lon':'', 'createdBy':''};

$scope.remove =function(id){

    SweetAlert.swal({
        title: "Are you sure you want to delete this item?",
        text: "You will not be able to recover it afterwards",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true},
    function(isConfirm){
        if (isConfirm) {
            GeoItem.remove(id).then(function(data){
                Notification.info('Item deleted');
                getItems();
            },
            function(error){
            SweetAlert.swal("Item could not be deleted", "", "warning")
        });
        }
    });
}

function geocodeAddress(address, shop){
    var geocodingPromise = Geocoder.geocodeAddress(address);
        geocodingPromise.then(
          function (result) {
             $scope.items.push({id:shop.id, title: shop.name, lat: result.lat, lon: result.lng, description: address});
             console.log("Scope items: ", $scope.items);
             getMarkers($scope.items);
          },
          function (err) {
            $scope.geocodingResult = err.message;
          });
}

function getShops(){
   $http({
          method: 'GET',
          url: 'http://localhost:8093/lidl/findShops',
          headers: {'Content-Type':'application/json'}
          }).then(function successCallback(result){
             $scope.allShops = result.data;
             var shops = $scope.allShops;
             console.log("All shops",shops);
             for(var i=0; i<shops.length; i++){
                for(var j=0; j<shops[i].shopDetails.length; j++){
                    var address = shops[i].shopDetails[j].street + ' ' + shops[i].shopDetails[j].streetNumber + ' ' +shops[i].shopDetails[j].city + ' ' + shops[i].shopDetails[j].zipcode + ' ' + shops[i].shopDetails[j].country.name;
                    geocodeAddress(address, shops[i]);
                }
             }
          },
              function errorCallback(error){
             }
          );

}

function getAllCategories(){
    $http({
        method: 'GET',
        url: 'http://localhost:8093/lidl/categories',
        headers: {'Content-Type':'application/json'}
    }).then(function successCallback(result){
        console.log("All categories", result.data);
        $scope.alLCategories = result.data;
    },
        function errorCallback(){}
    );
}


/* MARKERS MANAGEMENT */
$scope.onMarkerClicked = onMarkerClicked;

var onMarkerClicked = function (marker) {
      console.log("CLICK");
      marker.showWindow = true;
      $scope.$apply();
      window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
};


$scope.markers2Events = {
    clicked: function (marker, eventName, model, args) {
    console.log("SOMETHIGN FINALLY HAPPENED!!");
      model.options.labelContent = "Dragged lat: " + model.latitude + " lon: " + model.longitude;
    }
  };


function getMarkers(items){
  $scope.markers2 = [];

  for (var i=0; i<items.length; i++){
    var newMarker =
    {
          id: items[i].id,
          latitude: items[i].lat,
          longitude: items[i].lon,
          showWindow: false,
          text: items[i].description,
          title: items[i].title,
          options: {
            labelContent: items[i].title,
            labelAnchor: "22 0",
            labelClass: "marker-labels"
          }
        };
      $scope.markers2.push(newMarker);
  }
  console.log("Markers size is: ",$scope.markers2.length);
}


}]);

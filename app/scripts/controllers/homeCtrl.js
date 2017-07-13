'use strict';
angular.module('jumboClient').controller('HomeCtrl', ['$http', 'Geocoder','uiGmapGoogleMapApi', 'User', 'GeoItem', '$state', '$scope', '$log', 'Notification',
  'ModalService', 'SweetAlert',
	function ($http, Geocoder,uiGmapGoogleMapApi, User, GeoItem, $state, $scope, $log, Notification, ModalService, SweetAlert) {


/* A.UTH */
$scope.isLoggedIn = User.isLoggedIn;

$scope.markers2 = [];
$scope.map = { center: { latitude: 	46.78439, longitude: 23.556620 }, zoom: 17};
$scope.map.infoWindow ={show:false, coords:null};

if(User.isLoggedIn){
    getItems();
    geocodeAddress();
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

function getItems(){

    GeoItem.getShopLocations().then((itemsServer) => {
        $scope.items = [{id:123, title: 'test', lat: itemsServer.latitude, lon: itemsServer.longitude, description: '123'}];
        getMarkers($scope.items);
    })
}

function geocodeAddress(){
    var geocodingPromise = Geocoder.geocodeAddress("Cluj Napoca, Romania");
        geocodingPromise.then(
          function (result) {
            $scope.geocodingResult =
              '(lat, lng) ' + result.lat + ', ' + result.lng +
              ' (address: \'' + result.formattedAddress + '\')';
              console.log("Result geocoded: ", result);
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
          }).then(function successCallback(data){
             $scope.allShops = data.data;
             console.log("All shops",$scope.allShops);
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
    var index = Math.floor((Math.random() * 9) + 1);
    var iconPath = '../images/chest'+index+'.png';
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
}


}]);

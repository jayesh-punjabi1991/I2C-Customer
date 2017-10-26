define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DisputeDetailsCtrl', ['$rootScope', '$scope','DisputeService','QuotesService', '$log', '$timeout', '$http', '$state', '$stateParams','$window','$filter', function($rootScope, $scope,DisputeService,QuotesService, $log, $timeout, $http, $state, $stateParams, $window, $filter) {
      $scope.disputeNumber = $stateParams.id;
      $scope.Loading=true;
      $scope.custId= $stateParams.custId;
        DisputeService.getDisputeDetails($stateParams.id).then(function success(response) {
          $scope.Loading=false;
          console.log(response);
          $scope.dispute_id=response.data.dispute_id;
          $scope.invoice_number=response.data.invoice_number;
          $scope.ge_order_number=response.data.ge_order_number;
          $scope.invoice_date=new Date(response.data.invoice.invoice_date*1000);
          $scope.invoice_status=response.data.invoice.status;
          $scope.dispute_status=response.data.status;
          $scope.invoiceData = response.data.invoice;
          $scope.To=response.data.to;
          $scope.From=response.data.from;
          $scope.description=response.data.description;
          $scope.comments = response.data.comments;
          $scope.OrderLink="/orderDetails/"+$scope.ge_order_number;
          if(response.data.supporting_documents != null && response.data.supporting_documents.length != 0){
              $scope.docFlag1 = true;
              $scope.supporting_documents1 = response.data.supporting_documents;
          }else{
              $scope.docFlag1 = false;
          }
          if($scope.invoiceData.supporting_documents != null && $scope.invoiceData.supporting_documents.length != 0){
              $scope.docFlag = true;
              $scope.supporting_documents = $scope.invoiceData.supporting_documents.reverse();
              angular.forEach($scope.supporting_documents, function (value, key) {
                $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.split("_");
              })
          }else{
              $scope.docFlag = false;
          }

        })
        $scope.displayFile = function (type, fileName) {
          if(type == "EXTERNAL"){
            DisputeService.viewDocument(fileName).success(function(response){
              convertToBlob(response);
            });
          }else{
            QuotesService.viewDocument(fileName).success(function(response) {
              convertToBlob(response);
            })
          }
        }
        function convertToBlob(response) {
          var sliceSize = sliceSize || 512;

          var byteCharacters = atob(response);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
           var slice = byteCharacters.slice(offset, offset + sliceSize);

           var byteNumbers = new Array(slice.length);
           for (var i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
           }

           var byteArray = new Uint8Array(byteNumbers);

           byteArrays.push(byteArray);
          }
          var blob = new Blob(byteArrays, { type: 'application/pdf' });
          var objectUrl = URL.createObjectURL(blob);
          //console.log(objectUrl);
          //var fURL = $sce.trustAsResourceUrl(objectUrl);
          window.open(objectUrl);
        }
    }]);
});

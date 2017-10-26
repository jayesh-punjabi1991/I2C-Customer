define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('InvoiceCtrl', ['$scope', 'OrdersService', '$http', '$timeout', '$window', '$filter','$state','$stateParams','InvoiceService','QuotesService', function($scope, OrdersService, $http, $timeout, $window, $filter, $state, $stateParams, InvoiceService, QuotesService) {
      $scope.invoiceNo = $stateParams.invNo;
      $scope.customerId = $window.sessionStorage.getItem('customerId');
      $scope.validateBtn = true;
      $scope.validateForm = false;
      $scope.validateButton = false;

      //Loader Variables
      $scope.Loading = false; // Validate Loader
      $scope.ULoading = false; // Upload Loader
      $scope.PLoading = false; //  Payment Loader
      $scope.DLoading = false; //  Dispute Loader
      $scope.ILoading = true; // Page Loader

      $scope.roleName = $window.sessionStorage.getItem('roleName');
      InvoiceService.getInvoiceDetails($stateParams.invNo).success(function(response){
        console.log(response);
        $scope.invoiceData = response[0];
        $scope.payAmount = $scope.invoiceData.total_amt;
        $scope.subject = "Raise a dispute for Invoice #" + $scope.invoiceNo;
        //$scope.balAmount = $scope.invoiceData.balance_amt.replace(/\,/g,'');
        if(response[0].supporting_documents != null && response[0].supporting_documents.length != 0){
            $scope.docFlag = true;
            $scope.supporting_documents = response[0].supporting_documents.reverse();
            angular.forEach($scope.supporting_documents, function (value, key) {
              $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.split("_");
            })
        }else{
            $scope.docFlag = false;
        }
        // angular.forEach(response.invoice_lines, function (val, ind) {
        //   val.extended_price = val.extended_price.replace(/\,/g,'');
        //   val.price = val.price.replace(/\,/g,'');
        // });
        $scope.ILoading = false;
      });
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

      // Download supporting documents
      $scope.displayFile = function (type, fileName) {
        if(type == "EXTERNAL"){
          InvoiceService.viewDocument(fileName).success(function(response){
            convertToBlob(response);
          });
        }else{
          QuotesService.viewDocument(fileName).success(function(response) {
            convertToBlob(response);
          })
        }
      }
      InvoiceService.getDLforCR().then(function success(response) {
        $scope.to=response.data.to;
      });
      // Raise a dispute
      $scope.sendDisputeMail = function() {
        $scope.ULoading = true;
        var mail = {
          'from' : $window.sessionStorage.getItem('userEmail')
          ,'to' : 'ge-drc'
          ,'cc' : 'test@ge.com'
          ,'subject' : $scope.subject
          ,'description' : $scope.description
          ,'ge_order_number' :   $scope.invoiceData.ge_order_number
          ,'invoice_number' : $scope.invoiceNo
          ,'sub_order_id' : $scope.invoiceData.sub_order_id
        }
        console.log(mail);
        var dd = new FormData();
        dd.append('disputeBody', angular.toJson(mail));
        $scope.mailtest = angular.toJson(mail);
        angular.forEach($scope.files, function(file){
           dd.append('file', file);
        });
        // for (var pair for dd.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]);
        // };
        InvoiceService.initiateDispute($scope.invoiceNo, dd).success(function (response) {
          alert('Dispute has been created');
          $scope.ULoading = false;
          $state.reload();
        }).error(function (response) {
          $scope.ULoading = false;
        });
      }
    }]);
});

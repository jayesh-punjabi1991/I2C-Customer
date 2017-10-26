define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('PaymentDetailsCtrl', ['$scope', '$http', '$timeout', '$window', '$filter','PaymentService','$state','$stateParams','InvoiceService','QuotesService', function($scope, $http, $timeout, $window, $filter, PaymentService, $state, $stateParams, InvoiceService, QuotesService) {
      $scope.invoiceNumber = $stateParams.no;

      $scope.PLoading = false; //  Dispute Loader
      $scope.ILoading = true; // Page Loader

      InvoiceService.getInvoiceDetails($scope.invoiceNumber).success(function(response){
        console.log(response);
        $scope.invoiceData = response[0];
        $scope.paymentData = response[1].paymentAdmin;
        $scope.description = $scope.invoiceNumber + '--' + $scope.invoiceData.customer_number;
        $scope.payAmount = 0;
        if(response[0].supporting_documents != null && response[0].supporting_documents.length != 0){
            $scope.docFlag = true;
            $scope.supporting_documents = response[0].supporting_documents.reverse();
            angular.forEach($scope.supporting_documents, function (value, key) {
              $scope.supporting_documents[key].description = $scope.supporting_documents[key].description.split("_");
            })
        }else{
            $scope.docFlag = false;
        }
        $scope.ILoading = false;
      });

      //Initiate Payments
      $scope.PaymentInitiate = function () {
        console.log('in pay');
        $scope.PLoading = true;
        var payData = {
          'invoice_number': $scope.invoiceData.invoice_number,
          'payment_amount': $scope.payAmount,
          'payment_description': $scope.description
        }
        console.log(payData);
        InvoiceService.initiatePayment(payData).success(function (response) {
          $scope.PLoading = false;
          alert('Payment Initiated')
          $state.reload();
        })
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


    }]);
});

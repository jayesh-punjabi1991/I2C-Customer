define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('QuoteDetailsCtrl', ['$scope', '$log','$timeout','QuotesService','$http','$state','$stateParams','PredixUserService','$window','$sce','$filter', function ($scope, $log,$timeout,QuotesService,$http,$state,$stateParams,PredixUserService,$window,$sce, $filter) {
      $scope.Loading=true;
      $scope.Validation=false;
      $scope.Validation1=false;
      $scope.Validation2=false;
      $scope.Validation3=false;
      $scope.acceptbutton1=false;
      $(document).ready(function(){
        $("input[class^='MandatoryFields'],textarea[class^='MandatoryFields']").on('change keyup paste mouseup',function(e){
              var alltxt=$("input[class^='MandatoryFields'],textarea[class^='MandatoryFields']").length;
              $scope.Validation=true;
              $("input[class^='MandatoryFields'],textarea[class^='MandatoryFields']").each(function(i){
                  if($(this).val().trim() =='')
                  {
                      $scope.Validation=true;
                      $scope.Validation1=false;
                      $scope.DisableAccept();
                      return false;
                  }
                  else
                  {
                      $scope.Validation=false;
                      $scope.Validation1=false;
                      $scope.DisableAccept();
                  }
                });
                if(!$scope.Validation){
                  $scope.enableAccept();
                  $scope.Validation=true;
                  $scope.Validation1=true;
                  $scope.acceptbutton1=true;
                  }
            });
        })

      QuotesService.getQuoteDetails($stateParams.id).then(function success(response){
        $scope.Loading=false;
        console.log(response);
        $scope.quoteData = response.data;
        $scope.customerId = response.data.customerId;
        $scope.QuoteNumber=response.data.quote_number;
        $scope.QuoteDate=parseInt(response.data.quote_date)*1000;
        $scope.customerName = response.data.customer_name;
        $scope.customerNumber = response.data.customer_number;
        $scope.QuoteVersion=response.data.quote_version;
        $scope.QuoteStatus=response.data.status;
        $scope.BillingTerms=response.data.billing_terms;
        $scope.DeliveryTerms=response.data.delivery_terms;
        $scope.ShipToAddress1=response.data.ship_to.address1;
        $scope.ShipToAddress2=response.data.ship_to.address2;
        $scope.ShipToAddress3=response.data.ship_to.address3;
        $scope.ShipToCity=response.data.ship_to.city;
        $scope.ShipToCountry=response.data.ship_to.country;
        $scope.ShipToPostalCode=response.data.ship_to.postalcode;
        $scope.ShipToProvince=response.data.ship_to.province;
        $scope.ShipToState=response.data.ship_to.state;
        $scope.BillToAddress1=response.data.bill_to.address1;
        $scope.BillToAddress2=response.data.bill_to.address2;
        $scope.BillToAddress3=response.data.bill_to.address3;
        $scope.BillToCity=response.data.bill_to.city;
        $scope.BillToCountry=response.data.bill_to.country;
        $scope.BillToPostalCode=response.data.bill_to.postalcode;
        $scope.BillToProvince=response.data.bill_to.province;
        $scope.BillToState=response.data.bill_to.state;
        $scope.poNumber = response.data.po_number;
        $scope.CustomerAccountNumber = response.data.customer_acc_number;
        $scope.POAmount = response.data.purchase_order_amount;
        $scope.paymentTerms = response.data.payment_terms;
        $scope.quote_terms = response.data.quote_terms;
        $scope.currency1 = response.data.currency;
        $scope.partNumber = response.data.quoteLines[0].partNumber;
        $scope.partDesc = response.data.quoteLines[0].lineItemDescription;
        $scope.sellingPrice = response.data.quoteLines[0].sellingPrice;
        $scope.listPrice = response.data.quoteLines[0].listPrice;
        $scope.quantity = response.data.quoteLines[0].quantity;
        $scope.discountPerc = response.data.quoteLines[0].discountPerc;
        $scope.IsOrderExist = response.data.is_order_exist;
        $scope.partsList = [];
        $scope.itemDetails = [];
        $scope.totalLP = 0;
        $scope.totalSP = 0;
        $scope.totalDisc = 0;
        console.log(response.data.supporting_documents.length);
        if(response.data.supporting_documents != null && response.data.supporting_documents.length != 0){
            console.log('in if');
            $scope.docFlag = true;
            $scope.supporting_documents = response.data.supporting_documents;
        }else{
            $scope.docFlag = false;
        }
        angular.forEach(response.data.quoteLines,function(value,key){
          $scope.totalLP = $scope.totalLP + parseInt(value.quantity)*parseFloat(value.list_price);
          $scope.discA = value.list_price * (value.discount_perc/100);
          value.selling_price = value.list_price - (value.list_price * (value.discount_perc/100));
          $scope.totalSP = $scope.totalSP + parseInt(value.quantity)*parseFloat(value.selling_price);
          $scope.totalDisc = $scope.totalDisc + parseInt(value.quantity) * parseFloat(value.list_price * (value.discount_perc/100));
          $scope.partsList.push({
            'srno': key + 1,
            'qty': value.quantity,
            'desc': value.line_item_description,
            'cPrice': $filter('currency')(value.list_price, $scope.currency1 + ' ', 2),
            'disc': $filter('number')(value.discount_perc, 2),
            'sPrice': $filter('currency')(value.selling_price, $scope.currency1 + ' ', 2)
          });
          $scope.itemDetails.push({
            'srno': key + 1,
            'qty': value.quantity,
            'desc': value.line_item_description,
            'cPrice': $filter('currency')(value.list_price, $scope.currency1  + ' ', 2),
            'disc': $filter('number')(value.discount_perc, 0),
            'sPrice': $filter('currency')(value.selling_price, $scope.currency1  + ' ', 2),
            'itemNo': value.part_number
          });
        });
      });
      $scope.acceptDetails1=true;
      $scope.completeDetails = function () {
        $scope.completedetails = true;
        $scope.acceptbutton = false;
      }
      $scope.cancelClicked = function () {
        $scope.completedetails = false;
        $scope.acceptbutton = false;
        $scope.acceptbutton1 = false;
      }
      $scope.DisableAccept=function(){
        var d = document.getElementById("AcceptButton");
        d.className += " disabled";
        d.classList.remove("btn-primary");
      }
      $scope.DisableReject=function(){
        var d = document.getElementById("RejectQuoteButton");
        d.className += " disabled";
        d.classList.remove("btn-reject");
      }
      $scope.enableAccept=function(){
        var d = document.getElementById("AcceptButton");
        d.className += " btn btn-primary";
        d.classList.remove("disabled");
      }
      $scope.enableReject=function(){
        var d = document.getElementById("RejectQuoteButton");
        d.className += " btn-reject";
        d.classList.remove("disabled");
      }

      $scope.acceptClicked = function () {
        if($scope.Validation1==true){
        $scope.Loading=true;
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";

        var acceptData = $scope.quoteData;
        var fd = new FormData();
        angular.forEach($scope.files, function(file){
           fd.append('file', file);
        });
        //console.log($scope.BillTo);
        acceptData.bill_to = {
          'address1':  $scope.address1,
          'address2': $scope.address2,
          'address3': $scope.address3,
          'province':$scope.province,
          'city':$scope.city,
          'country':$scope.country,
          'state':$scope.state,
          'postalcode':$scope.postalCode
        };
        console.log(acceptData);
        //acceptData.bill_to = $scope.BillTo;
        acceptData.po_number = $scope.PONumber;
        console.log(acceptData);
        fd.append('quoteInputVO', JSON.stringify(acceptData));
        // for (var pair of fd.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]);
        // };
        //console.log(fd);
        QuotesService.acceptQuote(fd).success(function (response) {
          alert("Quote #" + $scope.QuoteNumber + " is accepted successfully.");
          $state.go('quoteDetailsAR',{id: $scope.QuoteNumber});
          $scope.Loading=false;
        });
      }
      else{
        alert("Please fill all the Mandatory fields");
      }
      };
      $scope.displayFile = function (fileName) {
        QuotesService.viewDocument(fileName).success(function(response){
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
        });
      }
      $(document).ready(function() {
          $("#AcceptButton").click(function() {
              $("#AcceptDiv").slideToggle("slow");
          });
      });
      $scope.rejectBtnClicked = function () {
          $("input[class^='ForRejection'],textarea[class^='ForRejection']").on('change keyup paste mouseup',function(e){
                var alltxt=$("input[class^='ForRejection'],textarea[class^='ForRejection']").length;
                $scope.Validation2=true;
                $("input[class^='ForRejection'],textarea[class^='ForRejection']").each(function(i){
                    if($(this).val().trim()=='')
                    {
                        $scope.Validation2=true;
                        $scope.Validation3=false;
                        $scope.DisableReject();
                        return false;
                    }
                    else
                    {
                        $scope.Validation2=false;
                        $scope.Validation3=false;
                        $scope.DisableReject();
                    }
                  });
                  if(!$scope.Validation2){
                    $scope.enableReject();
                    $scope.Validation2=true;
                    $scope.Validation3=true;
                    }
              });
        $scope.successMessage=false;
        $scope.rejectDetails = true;
        $("#RejectDiv").slideToggle("slow");
      }
      $scope.rejectClicked = function () {
        if($scope.Validation3==true){
        $scope.Loading=true;
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";

        var rejectData = $scope.quoteData;
        var rd = new FormData();
        rejectData.comments = $scope.comments;
        rd.append('quoteInputVO', angular.toJson(rejectData));

        angular.forEach($scope.files, function(file){
           rd.append('file', file);
        });
        // for (var pair of rd.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]);
        // };
        QuotesService.rejectQuote(rd).success(function (response) {
           $scope.rejectDetails=false;
           alert("You have rejected Quote #" + $scope.QuoteNumber);
           $state.go('quoteDetailsAR',{id: $scope.QuoteNumber});
           //alert('Quote rejected');
           $scope.Loading=false;
        });
      }
      else{
        alert("Please fill out the Mandatory Fields");
      }
      }
    }]);
});

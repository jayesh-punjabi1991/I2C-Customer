define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('QuotesCtrl', ['$scope', '$log','$timeout','QuotesService','$http','PredixUserService','$window','$filter', function ($scope, $log,$timeout,QuotesService,$http,PredixUserService,$window,$filter) {
      $scope.QuotesList=[];
      if($window.sessionStorage.getItem('auth_token')){
          QuotesService.getQuotesList().then(function success(response){
            console.log(response.data);
            if(response.data[0].quotes != null){
              angular.forEach(response.data[0].quotes,function(value,key){
                $scope.QuotesList.push({"quote#":value.status!= 'confirmed' ? "<a id='quote' href='/quoteDetails/AR/"+value.quote_number+ "'>"+value.quote_number+"</a>" : "<a href='/quoteDetails/"+value.quote_number+"'>"+value.quote_number+"</a>","quoteVer":value.quote_version,"createdDate":value.quote_date ? $filter('date')(new Date(parseInt(value.quote_date) * 1000), 'MMM dd, yyyy'):'',"status":value.status,"action":value.status=='confirmed' ? "<a title='Accept Quote' style='color:Green !important' href='/quoteDetails/"+value.quote_number+"'><i class='fa fa-thumbs-up' aria-hidden='true'></i></a>" : ""});
              });
              $scope.Length = $scope.QuotesList.length;
            }
          });
      }
    }]);
});

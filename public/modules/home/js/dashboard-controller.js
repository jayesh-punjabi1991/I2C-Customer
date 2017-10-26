define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http','$scope', '$log','DashboardService','$rootScope','PredixUserService','$state', function ($http, $scope, $log, DashboardService, $rootScope, predixUserService, $state) {

        DashboardService.getMyPendingActions().success(function (response) {
          console.log(response);
          $scope.pendingActions = response;
          debugger
          if(response.length == 0){
              $scope.notifCount = 0;
          }else{
              $scope.notifCount = response.length;
          }

        }).error(function (response) {
          console.log(response);
        });
        $("#navitemlist > li:nth-child(1) > a").addClass("selected");
        $scope.processNotification = function (notif) {
          console.log(notif.invoice_number);
          if(notif.eventType == 'CR.Accept' || notif.eventType == 'CR.Initiate' || notif.eventType == 'Order.Sigupdate' || notif.eventType == 'Order.Approve'){
            $state.go('ordersDetailsA',{id:notif.order_id})
          }else if(notif.eventType == 'Quote.Import'){
            $state.go('quoteDetails',{id:notif.quote_id})
          }else if(notif.eventType == 'Dispute.Accept' || notif.eventType == 'Dispute.Reject'){
            $state.go('disputeDetails',{id:notif.dispute_id})
          }else if(notif.eventType == 'Invoice.DocUpdate' || notif.eventType == 'Invoice.Verify' || notif.eventType == 'Payment.Init' || notif.eventType == 'Invoice.Init'){
            $state.go('invoiceDetails',{invNo:notif.invoice_number})
          }
          // DashboardService.processNotification(notif.id).success(function (response) {
          //
          // })
        }

        $scope.markAsRead = function (notif) {
          DashboardService.processNotification(notif.id).success(function (response) {
            $state.reload();
          })
        }

    }]);
});

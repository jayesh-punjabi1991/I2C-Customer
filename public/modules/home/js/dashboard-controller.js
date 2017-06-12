define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$http','$scope', '$log','DashboardService','$rootScope','PredixUserService','$state', function ($http, $scope, $log, DashboardService, $rootScope, predixUserService, $state) {

        DashboardService.getMyPendingActions().success(function (response) {
          console.log(response);
          $scope.pendingActions = response;
          if(response.length == 0){
              $scope.notifCount = 0;
          }else{
              $scope.notifCount = response.length;
          }

        }).error(function (response) {
          console.log(response);
        });

        $scope.processNotification = function (notif) {
          console.log('in process');
          DashboardService.processNotification(notif.id).success(function (response) {
            if(notif.eventType == 'CR.Accept' || notif.eventType == 'CR.Initiate' || notif.eventType == 'Order.Sigupdate' || notif.eventType == 'Order.Approve'){
              $state.go('ordersDetailsA',{id:notif.order_id})
            }else if(notif.eventType == 'Quote.Import'){
              $state.go('quoteDetailsAR',{id:notif.quote_id})
            }
          })
        }

        $scope.markAsRead = function (notif) {
          DashboardService.processNotification(notif.id).success(function (response) {
            $state.reload();
          })
        }

    }]);
});

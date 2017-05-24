define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('OrderCtrl', ['$scope', '$log', '$timeout', 'OrdersService', '$http', 'PredixUserService', '$window', '$filter', function($scope, $log, $timeout, OrdersService, $http, PredixUserService, $window, $filter) {
        $scope.OrderList = [];
        OrdersService.getOrdersList().then(function success(response) {
            console.log(response);
            angular.forEach(response.data[0].orders, function(value, key) {
                //var date = new Date(parseInt(value.order_date));
                $scope.OrderList.push({
                    "order#": value.order_process_status == 'accepted' ? "<a href='/orderDetails/Accepted/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : value.order_process_status == 'generated' ? "<a href='/orderDetails/Accepted/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : value.order_process_status == 'change requested' ? "<a href='/orderDetails/CR/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>" : "<a href='/orderDetails/Rejected/" + value.ge_order_number + "'>" + value.ge_order_number + "</a>",
                    "PO#": value.cust_po_number,
                    "createdDate": value.order_date ? $filter('date')(new Date(parseInt(value.order_date) * 1000), 'MMM dd, yyyy') : '',
                    "value": value.contract_amount,
                    "status": value.order_process_status === "accepted" ? "<div id='circle'></div>" + value.order_process_status : value.order_process_status === "rejected" ? "<div id='circle2'></div>" + value.order_process_status : "<div id='circle2'></div>" + value.order_process_status,
                    "action": value.order_process_status == 'accepted' ? "<a title='Raise a change Request' style='color:#b93131 !important' href='/orderDetails/CR/" + value.ge_order_number + "'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a>" : ""
                });
            })
            $scope.Length = $scope.OrderList.length;
        })
        /*if($window.sessionStorage.getItem('auth_token')){
          OrdersService.getQuotesList().then(function success(response){
            angular.forEach(response.data[0].orders,function(value,key){
            $scope.OrderList.push({"order#":value.order_process_status== 'accepted' ? "<a href='/orderDetails/Accepted/"+value.ge_order_number+ "'>"+value.ge_order_number+"</a>" :value.order_process_status== 'generated' ? "<a href='/orderDetails/Generated/"+value.ge_order_number+ "'>"+value.ge_order_number+"</a>" :value.order_process_status== 'change requested' ? "<a href='/orderDetails/CR/"+value.ge_order_number+"'>"+value.ge_order_number+"</a>": "<a href='/orderDetails/Rejected/"+value.ge_order_number+"'>"+value.ge_order_number+"</a>","PO#":value.cust_po_number,"createdDate":value.order_date,"value":value.contract_amount,"status":value.order_process_status,"action":value.order_process_status=='accepted' ? "<a title='Raise a change Request' style='color:#b93131 !important' href='/orderDetails/CR/"+value.ge_order_number+"'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></a>" : ""});
          })
          });
        }*/
    }]);
});

define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRCtrl', ['$scope', '$log', '$timeout', 'CrService', '$http', 'PredixUserService', '$window', '$filter', function($scope, $log, $timeout, CrService, $http, PredixUserService, $window, $filter) {
        $scope.ChangeRequestList = [];
        /*CrService.getCrList().then(function success(response){
          angular.forEach(response.data,function(value,key){
            $scope.ChangeRequestList.push({"order#":value.ge_order_number,"cr#":value.status== 'Accepted' ? "<a href='/changeRequest/Accepted/"+value.change_req_id+ "'>"+value.change_req_id+"</a>" :value.status== 'Rejected' ? "<a href='/changeRequest/Rejected/"+value.change_req_id+ "'>"+value.change_req_id+"</a>" : "<a href='/changeRequest/Pending/"+value.change_req_id+"'>"+value.change_req_id+"</a>","PO#":value.cust_po_number,"createdDate":value.order_date,"value":value.contract_amount,"status":value.status,"action":value.order_process_status=='Pending' ? "<a title='Withdraw a change Request' style='color:#9c9c20 !important' href='javascript:void(0)'><i class='fa fa-undo' aria-hidden='true'></i></a>" : ""});
          })
        })*/

        if ($window.sessionStorage.getItem('auth_token')) {
            CrService.getCrList().then(function success(response) {
                console.log(response);
                angular.forEach(response.data[0].crs, function(value, key) {
                    $scope.ChangeRequestList.push({
                        "order#": value.ge_order_number,
                        "cr#": value.status == 'accepted' ? "<a href='/changeRequest/Accepted/" + value.change_req_id + "'>" + value.change_req_id + "</a>" : value.status == 'rejected' ? "<a href='/changeRequest/Rejected/" + value.change_req_id + "'>" + value.change_req_id + "</a>" : "<a href='/changeRequest/Pending/" + value.change_req_id + "'>" + value.change_req_id + "</a>",
                        "PO#": value.cust_po_number,
                        "createdDate": value.cr_date ? $filter('date')(value.cr_date * 1000, "MMM dd, yyyy") : '',
                        "status": value.status === "accepted" ? "<div class='status_accept'></div>" + value.status  : value.status === "rejected" ? "<div class='status_reject'></div>" + value.status: "<div class='status_pending'></div>" + value.status,
                        "action": value.order_process_status == 'pending' ? "<a title='Withdraw a change Request' style='color:#9c9c20 !important' href='javascript:void(0)'><i class='fa fa-undo' aria-hidden='true'></i></a>" : "",
                        "crDesc": value.description.substring(0, 40) + '...'
                    });
                })
                $scope.Length = $scope.ChangeRequestList.length;
            })
        }

        // document.getElementById('rangePicker').addEventListener('px-datetime-range-submitted', function(e) {
        //     var fromDate1 = e.detail.range.from.split('T')[0];
        //     var toDate1 = e.detail.range.to.split('T')[0];
        //     var fromDate = new Date(fromDate1).getTime();
        //     var toDate = new Date(toDate1).getTime();
        //
        //     function myFunction() {
        //         var d = new Date("2014-10-08");
        //         var n = d.getFullYear();
        //         var n1 = d.getMonth();
        //         var n2 = d.getDate();
        //         document.getElementById("demo").innerHTML = n;
        //         document.getElementById("demo1").innerHTML = n1 + 1;
        //         document.getElementById("demo2").innerHTML = n2;
        //     }
        // });
    }]);
});

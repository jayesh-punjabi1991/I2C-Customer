define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRDetailsCtrl', ['$scope', '$log','$timeout','CrService','$http','PredixUserService','$window','$state','$stateParams', function ($scope, $log,$timeout,CrService,$http,PredixUserService,$window, $state, $stateParams) {
      $scope.ChangeRequestList=[];
      $scope.OrderList=[];
      $scope.SubOrderList=[];
      var count=0;
      var count1=0;
      CrService.getCrDetails($stateParams.id).then(function success(response){
        $scope.response=response;
        $scope.orderNumber=response.data.ge_order_number;
        $scope.orderdate=response.data.order.order_date;
        $scope.POnumber=response.data.order.cust_po_number;
        $scope.CRStatus=response.data.status;
        $scope.taxableStatus=response.data.order.taxable_status;
        $scope.liquidatedDamageTerms=response.data.order.liquidated_damage_terms;
        //For Sub-Order Table
        angular.forEach(response.data.order.sub_orders,function(value,key){
          $scope.OrderList[count]=value;
          $scope.OrderList[count].SrNo=count+1;
          //$scope.OrderList[count].billToaddress=value.bill_to.address1+" "+value.bill_to.address2+" " +value.bill_to.city+" "+value.bill_to.country+" "+value.bill_to.state+" "+value.bill_to.province+" "+value.bill_to.postalcode;
          $scope.OrderList[count].link="<a id='Detail"+value.sub_order_id+"' class="+value.sub_order_id+" href='javascript:void(0)'>Details</a>";
          count++;
        })

        //For Shipment Table
        $timeout(function () {
          debugger
          for(var i=0;i<$scope.response.data.order.sub_orders.length;i++){
          document.getElementById('Detail'+$scope.response.data.order.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
            var count1=0;
            $scope.SubOrderList=[];
            $scope.selectedSubOrder=event.target.className;
            for(var i=0;i<$scope.response.data.order.sub_orders.length;i++){
            angular.forEach($scope.response.data.order.sub_orders[i].shipments,function(value,key){
              if(value.sub_order_id==$scope.selectedSubOrder){
                $scope.SubOrderList[count1]=value;
                $scope.SubOrderList[count1].SrNo=count1+1;
                $scope.SubOrderList[count1].link="<a href='javascript:void(0)'>Details</a>";
                ++count1;
              }
            })
          }
              if($scope.SubOrderList.length>0){
              $scope.Suborder=true;
              $scope.$apply();
            }
            else{
              $scope.Suborder=false;
            }
        }, false);
      }
    }, 5000);
      })
      $scope.AcceptClicked=function(){
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";
      }

      $scope.RejectClicked=function(){
        var d = document.getElementById("AcceptButton");
        var d1 = document.getElementById("RejectButton");
        d.className += " disabled";
        d1.className += " disabled";
      }

    }]);
});

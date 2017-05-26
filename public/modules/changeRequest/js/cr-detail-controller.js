define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('CRDetailsCtrl', ['$scope', '$log','$timeout','CrService','$http','PredixUserService','$window','$state','$stateParams','$filter', function ($scope, $log,$timeout,CrService,$http,PredixUserService,$window, $state, $stateParams, $filter) {
      $scope.ChangeRequestList=[];
      $scope.OrderList=[];
      $scope.SubOrderList=[];
      $scope.ShipmentList = [];
      $scope.dummy = [];
      $scope.dummy1 = [];
      $scope.crId = $stateParams.id;
      var count=0;
      var count1=0;
      CrService.getCrDetails($stateParams.id).then(function success(response){
        //console.log(response);
        $scope.orderNumber=response.data.ge_order_number;
        diffCode($scope.orderNumber);
        // CrService.getCrDiffDetails($scope.orderNumber).then(function success(response1) {
        //   console.log(response1);
        //   debugger;
        // });
        $scope.response=response;
        $scope.crData = response.data;

        $scope.crdate=response.data.cr_date*1000;
        $scope.POnumber=response.data.order.cust_po_number;
        $scope.CRStatus=response.data.status;
        $scope.orderStatus = response.data.order.order_process_status;
        $scope.taxableStatus=response.data.order.taxable_status;
        $scope.deliveryTerms = response.data.order.delivery_terms;
        $scope.description = response.data.description;
        $scope.billingTimeline = response.data.order.sub_orders[0].billing_terms;
        $scope.billingTerms = response.data.order.sub_orders[0].payment_terms;
        $scope.liquidatedDamageTerms=response.data.order.liquidated_damage_terms;
        $scope.shipTo_1 = ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.address1 ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.address1 : '');
        $scope.shipTo_2 = ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.address2 ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.address2 : '');
        $scope.shipTo_3 = ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.city ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.city : '')  + " " + ($scope.response.data.order.sub_orders[0].shipments[0].ship_to.country ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.country : '');
        $scope.shipTo_4 = $scope.response.data.order.sub_orders[0].shipments[0].ship_to.state ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.state : '' + " " + $scope.response.data.order.sub_orders[0].shipments[0].ship_to.province ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.province : '' + " " + $scope.response.data.order.sub_orders[0].shipments[0].ship_to.postalcode ? $scope.response.data.order.sub_orders[0].shipments[0].ship_to.postalcode : '';
        $scope.billTo_1 = $scope.response.data.order.sub_orders[0].bill_to.address1 ? $scope.response.data.order.sub_orders[0].bill_to.address1 : '';
        $scope.billTo_2 = $scope.response.data.order.sub_orders[0].bill_to.address2 ? $scope.response.data.order.sub_orders[0].bill_to.address2 : '';
        $scope.billTo_3 = ($scope.response.data.order.sub_orders[0].bill_to.city)?$scope.response.data.order.sub_orders[0].bill_to.city:'' + " " + ($scope.response.data.order.sub_orders[0].bill_to.country)?$scope.response.data.order.sub_orders[0].bill_to.country:'';
        $scope.billTo_4 = ($scope.response.data.order.sub_orders[0].bill_to.state)?$scope.response.data.order.sub_orders[0].bill_to.state:'' + " " + ($scope.response.data.order.sub_orders[0].bill_to.province)?$scope.response.data.order.sub_orders[0].bill_to.province:'' + " " + ($scope.response.data.order.sub_orders[0].postalcode)?$scope.response.data.order.sub_orders[0].postalcode:'';
      //   //For Sub-Order Table
      //   angular.forEach(response.data.order.sub_orders,function(value,key){
      //     $scope.OrderList[count]=value;
      //     $scope.OrderList[count].SrNo=count+1;
      //     $scope.OrderList[count].billToaddress=value.bill_to.address1 ? value.bill_to.address1 : ''+" "+value.bill_to.address2 ? value.bill_to.address2 : ''+" " +value.bill_to.city ? value.bill_to.city :''+" "+value.bill_to.country ? value.bill_to.country : ''+" "+value.bill_to.state ? value.bill_to.state : ''+" "+value.bill_to.province ? value.bill_to.province : ''+" "+value.bill_to.postalcode ? value.bill_to.postalcode : '';
      //     count++;
      //   })
      //   $scope.lengthofSubOrders = $scope.OrderList.length;
      //   //For Shipment Table
      //   $timeout(function () {
      //     for(var i=0;i<$scope.response.data.order.sub_orders.length;i++){
      //     document.getElementById('Detail'+$scope.response.data.order.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
      //       var count1=0;
      //       $scope.dummy = [];
      //       $scope.SubOrderList=[];
      //       $scope.ShipmentList = [];
      //       $scope.Shipment=false;
      //       $scope.$apply();
      //       for(var i=0;i<$scope.response.data.order.sub_orders.length;i++){
      //       angular.forEach($scope.response.data.order.sub_orders[i].shipments,function(value,key){
      //         if(value.sub_order_id==$scope.selectedSubOrder){
      //           $scope.dummy.push({
      //               'ge_order_number': value.ge_order_number,
      //               'ship_to': value.ship_to,
      //               'shipment_id': value.shipment_id,
      //               'sub_order_id': value.sub_order_id
      //           });
      //           $scope.SubOrderList[count1] = $scope.dummy[count1];
      //           $scope.SubOrderList[count1].SrNo = count1 + 1;
      //           $scope.SubOrderList[count1].ship_to = $scope.dummy[count1].ship_to.address1 ? $scope.dummy[count1].ship_to.address1 : '' + " " + $scope.dummy[count1].ship_to.address2 ? $scope.dummy[count1].ship_to.address2 : '' + " " + $scope.dummy[count1].ship_to.city ? $scope.dummy[count1].ship_to.city : '' + " " + $scope.dummy[count1].ship_to.country ? $scope.dummy[count1].ship_to.country : '' + " " + $scope.dummy[count1].ship_to.state ? $scope.dummy[count1].ship_to.state : '' + " " + $scope.dummy[count1].ship_to.province ? $scope.dummy[count1].ship_to.province : '' + " " + $scope.dummy[count1].ship_to.postalcode ? $scope.dummy[count1].ship_to.postalcode : '';
      //           ++count1;
      //         }
      //       })
      //     }
      //         $scope.lengthofShipments = $scope.SubOrderList.length;
      //         $scope.CreateShipmentJson();
      //         if($scope.SubOrderList.length>0){
      //         $scope.Suborder=true;
      //         $scope.$apply();
      //       }
      //       else{
      //         $scope.Suborder=false;
      //       }
      //   }, false);
      // }
      // }, 1000);
      })
      // $scope.saveSubOrder = function(val) {
      //     $scope.selectedSubOrder = val;
      // };
      // $scope.saveShipment = function(val) {
      //     $scope.selectedShipment = val;
      // };
      // $scope.CreateShipmentJson = function() {
      //     $timeout(function() {
      //         for (var i = 0; i < $scope.SubOrderList.length; i++) {
      //             document.getElementById('Details' + $scope.SubOrderList[i].shipment_id).addEventListener('click', function(event) {
      //                 $scope.dummy1 = [];
      //                 //$scope.selectedShipment = event.target.className;
      //                 var count2 = 0;
      //                 $scope.ShipmentList = [];
      //                 debugger
      //                 angular.forEach($scope.response.data.order.order_lines, function(value, key) {
      //                     if (value.shipment_id == $scope.selectedShipment) {
      //                         $scope.dummy1.push({
      //                             'line_number': value.line_number,
      //                             'item_number': value.item_number,
      //                             'line_item_description': value.line_item_description,
      //                             'quantity': value.quantity,
      //                             'sub_order_id': value.sub_order_id,
      //                             'shipment_id': value.shipment_id,
      //                             'list_price': value.list_price,
      //                             'discount_perc': value.discount_perc
      //                         });
      //                         $scope.ShipmentList[count2] = $scope.dummy1[count2];
      //                         $scope.ShipmentList[count2].SrNo = count2 + 1;
      //                         $scope.ShipmentList[count2].sellingPrice = $filter('currency')($scope.ShipmentList[count2].list_price - ($scope.ShipmentList[count2].list_price * ($scope.ShipmentList[count2].discount_perc / 100)), $scope.currency, 2);
      //                         $scope.ShipmentList[count2].list_price = $filter('currency')($scope.ShipmentList[count2].list_price, $scope.currency, 2);
      //                         $scope.ShipmentList[count2].discount_perc = $filter('number')($scope.ShipmentList[count2].discount_perc, 0);
      //                         count2++;
      //                     }
      //                 })
      //
      //                 $scope.LengthOfShipment = $scope.ShipmentList.length;
      //                 if ($scope.ShipmentList.length > 0) {
      //                     $scope.Shipment = true;
      //                     $scope.$apply();
      //                 } else {
      //                     $scope.Shipment = false;
      //                     $scope.$apply();
      //                 }
      //
      //             }, false);
      //
      //         }
      //     }, 1000);
      // }

      //Show Differences code
      function diffCode(oNo) {
        CrService.getCrDiffDetails(oNo).then(function success(response) {
            console.log(response);
            $scope.response = response.data[0];

            //For highlighting changed values of Order Headers
            for (var i = 0; i < response.data[1].order_header.length; i++) {
                //console.log("Changed Order_Headers_Properties:"+response.data[0].changedValues[0].order_header[i]);
                $('#' + response.data[1].order_header[i]).css("color", "#4CAF50");
                $('#' + response.data[1].order_header[i]).css("font-weight", "bold");
            }

            //$scope.orderNumber = $scope.response.ge_order_number;
            $scope.orderdate = new Date($scope.response.order_date*1000);
            //$scope.POnumber = $scope.response.cust_po_number;
            $scope.taxable_status=$scope.response.taxable_status;
            //$scope.liquidated_damage_terms=$scope.response.liquidated_damage_terms;
            $scope.delivery_terms=$scope.response.delivery_terms;
            //$scope.customer_number=$scope.response.customer_number;

            //For Sub-Order Table
            angular.forEach($scope.response.sub_orders, function(value, key) {
                $scope.OrderList[count] = value;
                $scope.OrderList[count].SrNo = count + 1;
                //$scope.OrderList[count].link = "<a id='Detail" + value.sub_order_id + "' class=" + value.sub_order_id + " href='javascript:void(0)'>Details</a>";
                count++;
            })
            $scope.lengthofSubOrders = $scope.OrderList.length;

            //For Highlighting changed Row of Sub_Order
            $timeout(function() {
                $scope.colorSubOrder();
            }, 100);
            $scope.colorSubOrder = function() {
                for (var i = 0; i < response.data[1].sub_orders.length; i++) {
                    //console.log("Changed Sub_orders:"+response.data[0].changedValues[0].sub_orders[i].sub_order_id);
                    $('#Sub_Order' + response.data[1].sub_orders[i].sub_order_id).css("background-color", "#85e085");
                    //$('#Sub_Order' + response.data[0].changedValues[0].sub_orders[i].sub_order_id).css("font-weight", "bold");
                }

                //Fields of SubOrder
                for (var i = 0; i < response.data[1].sub_orders.length; i++) {
                    for (var j = 0; j < response.data[1].sub_orders[i].ischanged.length; j++) {
                        //console.log("Changed Sub_orders:" + response.data[0].changedValues[0].sub_orders[i].sub_order_id + " and Column Name:" + response.data[0].changedValues[0].sub_orders[i].ischanged[j]);
                        $('#' + response.data[1].sub_orders[i].ischanged[j] + response.data[1].sub_orders[i].sub_order_id).css("color", "#1a651a");
                        $('#' + response.data[1].sub_orders[i].ischanged[j] + response.data[1].sub_orders[i].sub_order_id).css("font-weight", "bold");
                        $('#' + response.data[1].sub_orders[i].ischanged[j] + response.data[1].sub_orders[i].sub_order_id).css("text-decoration", "underline");
                    }
                }
            }

            //For Shipment Table

            $scope.saveSubOrder = function(val) {
                $scope.selectedSubOrder = val;
            };

            $timeout(function() {
                for (var i = 0; i < $scope.response.sub_orders.length; i++) {
                    document.getElementById('Detail' + $scope.response.sub_orders[i].sub_order_id).addEventListener('click', function(event) {
                        var count1 = 0;
                        $scope.dummy = [];
                        $scope.SubOrderList = [];
                        $scope.ShipmentList = [];
                        for (var i = 0; i < $scope.response.sub_orders.length; i++) {
                            angular.forEach($scope.response.sub_orders[i].shipments, function(value, key) {
                                if (value.sub_order_id == $scope.selectedSubOrder) {
                                    $scope.dummy.push({
                                        'ge_order_number': value.ge_order_number,
                                        'ship_to': value.ship_to,
                                        'shipment_id': value.shipment_id,
                                        'sub_order_id': value.sub_order_id
                                    });
                                    $scope.SubOrderList[count1] = $scope.dummy[count1];
                                    $scope.SubOrderList[count1].SrNo = count1 + 1;
                                    $scope.SubOrderList[count1].ship_to = $scope.dummy[count1].ship_to.address1 ? $scope.dummy[count1].ship_to.address1 : '' + " " + $scope.dummy[count1].ship_to.address2 ? $scope.dummy[count1].ship_to.address2 : '' + " " + $scope.dummy[count1].ship_to.city ? $scope.dummy[count1].ship_to.city : '' + " " + $scope.dummy[count1].ship_to.country ? $scope.dummy[count1].ship_to.country : '' + " " + $scope.dummy[count1].ship_to.state ? $scope.dummy[count1].ship_to.state : '' + " " + $scope.dummy[count1].ship_to.province ? $scope.dummy[count1].ship_to.province : '' + " " + $scope.dummy[count1].ship_to.postalcode ? $scope.dummy[count1].ship_to.postalcode : '';
                                    ++count1;
                                }
                            })
                        }
                        //For Highlighting changed Row of Shipment
                        $timeout(function() {
                            $scope.colorShipment();
                        }, 100);
                        $scope.colorShipment = function() {
                            debugger
                            angular.forEach(response.data[1].sub_orders, function(value, key) {
                              if(value.shipments){
                                for (var i = 0; i < value.shipments.length; i++) {
                                    $('#Shipment' + value.shipments[i].shipment_id).css("background-color", "#85e085");
                                    //$('#Shipment' + value.shipments[i].shipment_id).css("font-weight", "bold");
                                }
                              }
                            })

                            //Fields of Shipments
                            angular.forEach(response.data[1].sub_orders, function(value, key) {
                              if(value.shipments){
                                for (var i = 0; i < value.shipments.length; i++) {
                                    for (var j = 0; j < value.shipments[i].ischanged.length; j++) {
                                        //console.log("Changed Shipment_Id:"+value.shipments[i].shipment_id+" and Column Name:"+value.shipments[i].ischanged[j]);
                                        $('#' + value.shipments[i].ischanged[j] + value.shipments[i].shipment_id).css("color", "#1a651a");
                                        $('#' + value.shipments[i].ischanged[j] + value.shipments[i].shipment_id).css("font-weight", "bold");
                                        $('#' + value.shipments[i].ischanged[j] + value.shipments[i].shipment_id).css("text-decoration", "underline");
                                    }
                                }
                              }
                            })

                        }
                        $scope.lengthofShipments = $scope.SubOrderList.length;
                        $scope.CreateShipmentJson();
                        if ($scope.SubOrderList.length > 0) {
                            $scope.Suborder = true;
                            $scope.$apply();
                        } else {
                            $scope.Suborder = false;
                        }
                    }, false);
                }
            }, 1000);

            //For Order Lines
            $scope.saveShipment = function(val) {
                $scope.selectedShipment = val;
            };
            //For OrderLines Table
            $scope.CreateShipmentJson = function() {
                $timeout(function() {
                    for (var i = 0; i < $scope.SubOrderList.length; i++) {
                        document.getElementById('Details' + $scope.SubOrderList[i].shipment_id).addEventListener('click', function(event) {
                            $scope.dummy1 = [];
                            //$scope.selectedShipment = event.target.className;
                            var count2 = 0;
                            $scope.ShipmentList = [];
                            angular.forEach($scope.response.order_lines, function(value, key) {
                                if (value.shipment_id == $scope.selectedShipment) {
                                    $scope.dummy1.push({
                                        'line_number': value.line_number,
                                        'item_number': value.item_number,
                                        'line_item_description': value.line_item_description,
                                        'quantity': value.quantity,
                                        'sub_order_id': value.sub_order_id,
                                        'shipment_id': value.shipment_id,
                                        'list_price': value.list_price,
                                        'discount_perc': value.discount_perc
                                    });
                                    $scope.ShipmentList[count2] = $scope.dummy1[count2];
                                    $scope.ShipmentList[count2].SrNo = count2 + 1;
                                    $scope.ShipmentList[count2].sellingPrice = $filter('currency')($scope.ShipmentList[count2].list_price - ($scope.ShipmentList[count2].list_price * ($scope.ShipmentList[count2].discount_perc / 100)), $scope.currency, 2);
                                    $scope.ShipmentList[count2].list_price = $filter('currency')($scope.ShipmentList[count2].list_price, $scope.currency, 2);
                                    $scope.ShipmentList[count2].discount_perc = $filter('number')($scope.ShipmentList[count2].discount_perc, 0);
                                    count2++;
                                }
                            })
                            //For Highlighting changed Row of Line Item
                            $timeout(function() {
                                $scope.colorLineItem();
                            }, 100);
                            $scope.colorLineItem = function() {
                                for (var i = 0; i < response.data[1].order_lines.length; i++) {
                                    //console.log("Changed Order_Lines:"+response.data[0].changedValues[0].order_lines[i]);
                                    $('#LineItem' + response.data[1].order_lines[i]).css("background-color", "#85e085");
                                    //$('#LineItem' + response.data[0].changedValues[0].order_lines[i]).css("font-weight", "bold");
                                }
                            }
                            $scope.LengthOfShipment = $scope.ShipmentList.length;
                            if ($scope.ShipmentList.length > 0) {
                                $scope.Shipment = true;
                                $scope.$apply();
                            } else {
                                $scope.Shipment = false;
                                $scope.$apply();
                            }

                        }, false);

                    }
                }, 1000);
            }

        })
      }

      $scope.acceptClicked=function(){
        // var d = document.getElementById("AcceptButton");
        // var d1 = document.getElementById("RejectButton");
        // d.className += " disabled";
        // d1.className += " disabled";

        var crdata = {
          'from' : $scope.crData.from
          ,'to' : $scope.crData.to
          ,'cc' : $scope.crData.cc
          ,'subject' : $scope.crData.subject
          ,'description' : $scope.crData.description
          ,'ge_order_number' :   $scope.crData.ge_order_number
          ,'cust_po_number' : $scope.crData.cust_po_number
          ,'sub_order_id' : $scope.crData.sub_order_id
          ,'contract_amount': $scope.crData.contract_amount
          ,'change_req_id': $scope.crData.change_req_id
          ,'cr_date': $scope.crData.cr_date
          ,'dispute_ref': $scope.crData.dispute_ref
          ,'order_date': $scope.crData.order_date
          ,'parentCustId': $scope.crData.parentCustId
          ,'status': $scope.crData.status
          ,'supporting_documents': $scope.crData.supporting_documents
        };

        CrService.acceptCR($scope.crData.change_req_id, crdata).success(function (response) {
          alert('success!');
        })

        //console.log($scope.data);
      }

      $scope.rejectClicked=function(){
        // var d = document.getElementById("AcceptButton");
        // var d1 = document.getElementById("RejectButton");
        // d.className += " disabled";
        // d1.className += " disabled";

        var crdata = {
          'from' : $scope.crData.from
          ,'to' : $scope.crData.to
          ,'cc' : $scope.crData.cc
          ,'subject' : $scope.crData.subject
          ,'description' : $scope.crData.description
          ,'ge_order_number' :   $scope.crData.ge_order_number
          ,'cust_po_number' : $scope.crData.cust_po_number
          ,'sub_order_id' : $scope.crData.sub_order_id
          ,'contract_amount': $scope.crData.contract_amount
          ,'change_req_id': $scope.crData.change_req_id
          ,'cr_date': $scope.crData.cr_date
          ,'dispute_ref': $scope.crData.dispute_ref
          ,'order_date': $scope.crData.order_date
          ,'parentCustId': $scope.crData.parentCustId
          ,'status': $scope.crData.status
          ,'supporting_documents': $scope.crData.supporting_documents
        };

        // var crd = new FormData();
        // crd.append('file', '');
        // crd.append('crbody', JSON.stringify(crdata));
        CrService.rejectCR($scope.crData.change_req_id, crdata).success(function (response) {
          alert('success!');
        });
      }
      $scope.approveClicked=function(){
        var orderData = $scope.crData.order;

        // var crd = new FormData();
        // crd.append('file', '');
        // crd.append('crbody', JSON.stringify(crdata));
        console.log(orderData);
        CrService.approveOrder($scope.orderNumber, orderData).success(function (response) {
          alert('success!');
        });
      }

    }]);
});

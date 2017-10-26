define(['angular', './module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('PaymentCtrl', ['$scope', '$http', '$timeout', '$window', '$filter','InvoiceService','PaymentService', function($scope, $http, $timeout, $window, $filter, InvoiceService, PaymentService) {
      // tabs logic
      $('#tab-ul #selected').addClass('div-visible');
        $('#tab-ul li').on('click',function(){
            var i =$(this).parent().children().index(this);
            var liItem=$(this)[0];
            $(".selected-tab").removeClass("selected-tab");
            $(liItem).addClass('selected-tab');
            var divItem=$('#content').children()[i];
            $('.div-visible').addClass('div-invisible');
            $(divItem).removeClass('div-invisible');
            $(divItem).addClass('div-visible');

        });
        $scope.invoiceClicked = true;
        $scope.invoiceFlag = true;
        $scope.paymentFlag = false;
        $scope.InvoiceList = [];
        $scope.DueList = [];
        $scope.PaymentList = [];

        $scope.ILoading = true;
        $scope.PLoading = true;

        var date = new Date();
        var today = date.getTime();
        var custId = $window.sessionStorage.getItem('customerId');

        InvoiceService.getInvoiceList().success(function (response) {
          console.log(response);
          getInvoices(response[0].invoices)
          $scope.ILoading = false;
        }).then(function() {
          payments();
        })

        function payments() {
          PaymentService.getPaymentList().success(function (response) {
            console.log(response);
            getPayments(response[0].payments);
            $scope.PLoading = false;
          });
        }

        function getInvoices(invoiceData) {
          angular.forEach(invoiceData, function (value, key) {
            var datediff = Math.round((new Date(parseInt(value.invoice_due_date)*1000) - today)/(1000*60*60*24));
            console.log(value.invoice_due_date);
            console.log(datediff);
            if(datediff > 5){
              $scope.InvoiceList.push({
                'invoiceNo':'<a href="/payment/invoiceDetails/'+ value.invoice_number+'">'+value.invoice_number+'</a>',
                'orderNo': value.ge_order_number,
                'custId': custId,
                'custName': value.customer_name.substring(0,15) + '...',
                'status': value.status,
                'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                'dueDate' : '<div class="green-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                'action' : (value.balance_amt > 0 && value.status == 'published') ? ((value.paymentButtonEnabled) ? '<a href="/paymentDetails/'+ value.invoice_number +'" class="btn btn-primary Custom">Authorise Payment</a>' : '<a class="btn btn-primary Custom disabled">Authorise Payment</a>') : '',
                "invoice_due_date":value.invoice_due_date
              });
            }else if(datediff <= 5 && datediff >= 0){
              if(value.status != 'paid' && value.balance_amt > 0){
                $scope.DueList.push({
                  'invoiceNo':'<a href="/payment/invoiceDetails/'+ value.invoice_number+'">'+value.invoice_number+'</a>',
                  'orderNo': value.ge_order_number,
                  'custId': custId,
                  'custName': value.customer_name.substring(0,15) + '...',
                  'status': value.status,
                  'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                  'dueDate' : '<div class="yellow-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                  'action' : (value.balance_amt > 0 && value.status == 'published') ? ((value.paymentButtonEnabled) ? '<a href="/paymentDetails/'+ value.invoice_number +'" class="btn btn-primary Custom">Authorise Payment</a>' : '<a class="btn btn-primary Custom disabled">Authorise Payment</a>') : '',
                  "invoice_due_date":value.invoice_due_date
                });
              }
              $scope.InvoiceList.push({
                'invoiceNo':'<a href="/payment/invoiceDetails/'+ value.invoice_number+'">'+value.invoice_number+'</a>',
                'orderNo': value.ge_order_number,
                'custId': custId,
                'custName': value.customer_name.substring(0,15) + '...',
                'status': value.status,
                'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                'dueDate' : '<div class="yellow-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                'action' : (value.balance_amt > 0 && value.status == 'published') ? ((value.paymentButtonEnabled) ? '<a href="/paymentDetails/'+ value.invoice_number +'" class="btn btn-primary Custom">Authorise Payment</a>' : '<a class="btn btn-primary Custom disabled">Authorise Payment</a>') : '',
                "invoice_due_date":value.invoice_due_date
              });
            }else if(datediff < 0){
              if(value.status != 'paid' && value.balance_amt > 0){
                $scope.DueList.push({
                  'invoiceNo':'<a href="/payment/invoiceDetails/'+ value.invoice_number+'">'+value.invoice_number+'</a>',
                  'orderNo': value.ge_order_number,
                  'custId': custId,
                  'custName': value.customer_name.substring(0,15) + '...',
                  'status': value.status,
                  'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                  'dueDate' : value.status == 'paid' ? $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') : '<div class="red-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                  'action' : (value.balance_amt > 0 && value.status == 'published') ? ((value.paymentButtonEnabled) ? '<a href="/paymentDetails/'+ value.invoice_number +'" class="btn btn-primary Custom">Authorise Payment</a>' : '<a class="btn btn-primary Custom disabled">Authorise Payment</a>') : '',
                  "invoice_due_date":value.invoice_due_date
                });
              }
              $scope.InvoiceList.push({
                'invoiceNo':'<a href="/payment/invoiceDetails/'+ value.invoice_number+'">'+value.invoice_number+'</a>',
                'orderNo': value.ge_order_number,
                'custId': custId,
                'custName': value.customer_name.substring(0,15) + '...',
                'status': value.status,
                'dueAmt': $filter('currency')(value.balance_amt,'', 2) + '/' + $filter('currency')(value.total_invoice_amt_with_tax,'', 2),
                'dueDate' : value.status == 'paid' ? $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') : '<div class="red-bg">'+ $filter('date')(new Date(parseInt(value.invoice_due_date) * 1000), 'MMM dd, yyyy') +'</div>',
                'action' : (value.balance_amt > 0 && value.status == 'published') ? ((value.paymentButtonEnabled) ? '<a href="/paymentDetails/'+ value.invoice_number +'" class="btn btn-primary Custom">Authorise Payment</a>' : '<a class="btn btn-primary Custom disabled">Authorise Payment</a>') : '',
                "invoice_due_date":value.invoice_due_date
              });
            }
          });
          $scope.InvoiceList=$filter("orderBy")($scope.InvoiceList,"invoice_due_date");
          $scope.DueList=$filter("orderBy")($scope.DueList,"invoice_due_date");
        }

        function getPayments(paymentData) {
          angular.forEach(paymentData, function (value, key) {
            $scope.PaymentList.push({
              "payment_id" : value.payment_id,
              "payee_bank_name":value.payee_bank_name,
              'payee_acc_number': value.payee_acc_number,
              'payer_int_ref': value.payer_int_ref,
              'payment_description': value.payment_description.length > 40 ? value.payment_description.substring(0, 40) + '...' : value.payment_description,
              'payment_date': $filter('date')(new Date(parseInt(value.payment_date*1000)), 'MMM dd, yyyy'),
              'payment_amount' : $filter('currency')(value.payment_amount, value.currency + ' ', 2),
              'status' : value.status,
              "paydate":value.payment_date
            });
          });
          $scope.PaymentList=$filter("orderBy")($scope.PaymentList,"paydate");
        }
    }]);
});

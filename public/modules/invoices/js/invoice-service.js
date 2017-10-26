define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('InvoiceService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            getInvoiceList: function(){
              return $http.get(urls.base_url + urls.get_invoice_list + '?custId=' + $window.sessionStorage.getItem('customerId'), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
            getInvoiceDetails: function(invNo){
              return $http.get(urls.base_url + urls.get_invoice_details + '/' + invNo + '?custId=' + $window.sessionStorage.getItem('customerId'), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
             getInvoiceListBySubOrder: function(oId, soId) {
               return $http.get(urls.base_url + urls.get_invoice_list_by_suborder + '?custId=' + $window.sessionStorage.getItem('customerId') + '&filterBy=order_no&value=' + oId + '&subOrderId=' + soId, {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
             },
             validateInvoice: function(invNo, data) {
               return $http.post(urls.base_url + urls.validate_invoice + '/'+ invNo + '?custId=' + $window.sessionStorage.getItem('customerId') , angular.toJson(data) , {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
             },
             getDLforCR : function(){
               return $http.get(urls.base_url + urls.get_DL_for_CR + "/" + $window.sessionStorage.getItem('customerId') + "?eventName=Dispute.Init",{
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               })
              },
             initiateDispute: function(invNo, data) {
               return $http.post(urls.base_url + urls.initiate_dispute+ '/' + $window.sessionStorage.getItem('customerId') + '/'+ invNo, data , {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken'),
                    'transformRequest': angular.identity,
                    'Content-Type': undefined
                  }
                });
             },
            viewDocument: function (invNo) {
              return $http.get(urls.base_url + urls.download_invoice + '?invoiceNo=' + invNo, {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token')
                 }
               },{responseType : 'arraybuffer'});
            },
            initiatePayment: function(data) {
              return $http.put(urls.base_url + urls.initiate_payment+ '?custId=' + $window.sessionStorage.getItem('customerId'), angular.toJson(data) , {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken'),
                 }
               });
            }
        };
    }]);
});

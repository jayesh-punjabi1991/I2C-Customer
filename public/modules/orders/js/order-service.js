define(['angular', './module', 'constants'], function(angular, module) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    module.factory('OrdersService', ['$q','$http','urls','$window','$rootScope', function($q,$http,urls,$window,$rootScope) {
        return {
            getOrdersList: function(){
              return $http.get(urls.base_url + urls.get_orders_list +'?customerId=' + $window.sessionStorage.getItem('customerId'), {
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               });
             },
             getOrdersListByDate: function(){
               return $http.get(urls.base_url + urls.get_orders_list_date +'/'+$window.sessionStorage.getItem('fromDate')+'/'+$window.sessionStorage.getItem('toDate')+'/ORDER'+'?custId=' + $window.sessionStorage.getItem('customerId'), {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken')
                  }
                });
              },
            getOrderDetails: function(val){
                return $http.get(urls.base_url + urls.get_order_details+'/'+val+'?customerId=' + $window.sessionStorage.getItem('customerId'), {
                   headers: {
                     'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                     'x-access-token': $window.sessionStorage.getItem('userToken')
                   }
                 });
             },
             getDLforCR : function(){
               return $http.get(urls.base_url + urls.get_DL_for_CR +"/"+ $window.sessionStorage.getItem('customerId') + "?eventName=CR.Initiate",{
                 headers: {
                   'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                   'x-access-token': $window.sessionStorage.getItem('userToken')
                 }
               })
             },
              initiateCR : function (oNum, data) {
                return $http.post(urls.base_url + urls.initiate_cr + '/' + $window.sessionStorage.getItem('customerId') + '/' + oNum, data, {
                  headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                    'x-access-token': $window.sessionStorage.getItem('userToken'),
                    'transformRequest': angular.identity,
                    'Content-Type': undefined
                  }
                })
              },
              uploadDocument: function (data) {
                return $http.post(urls.base_url + urls.file_upload, data , {
                   headers: {
                     'Authorization': 'Bearer ' + $window.sessionStorage.getItem('auth_token'),
                     'x-access-token': $window.sessionStorage.getItem('userToken'),
                     'transformRequest': angular.identity,
                     'Content-Type': undefined
                   }
                 });
              }
        };
    }]);
});

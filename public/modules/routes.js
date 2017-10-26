/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {


        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
         .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService', function ($q, predixUserService) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo){
                            deferred.resolve(userInfo);
                        }, function(){
                            deferred.reject({code: 'UNAUTHORIZED'});
                        });
                        return deferred.promise;
                    }]
                }
            })
            .state('home', {
                parent: 'secure',
                url: '/home',
                templateUrl: 'modules/home/views/home.html',
                controller: 'UserCtrl'
            })
            .state('dashboards', {
                parent: 'secure',
                url: '/dashboards',
                templateUrl: 'modules/home/views/dashboards.html',
                controller: 'DashboardsCtrl'
            })
            .state('quotes', {
                parent: 'secure',
                url: '/quotes',
                templateUrl: 'modules/quotes/views/quotes.html',
                controller: 'QuotesCtrl'
            })
            .state('quoteDetails', {
                parent: 'secure',
                url: '/quoteDetails/:id',
                templateUrl: 'modules/quotes/views/quote-details.html',
                controller: 'QuoteDetailsCtrl'
            })
            .state('quoteDetailsAR', {
                parent: 'secure',
                url: '/quoteDetails/AR/:id',
                templateUrl: 'modules/quotes/views/quote-details-ar.html',
                controller: 'QuoteDetailsCtrl'
            })
            .state('orders', {
                parent: 'secure',
                url: '/orders',
                templateUrl: 'modules/orders/views/orders.html',
                controller: 'OrderCtrl'
            })
            .state('disputes', {
                parent: 'secure',
                url: '/disputes',
                templateUrl: 'modules/disputes/views/disputes.html',
                controller: 'DisputeCtrl'
            })
            .state('disputeDetails', {
                parent: 'secure',
                url: '/disputeDetails/:id',
                templateUrl: 'modules/disputes/views/disputeDetails.html',
                controller: 'DisputeDetailsCtrl'
            })
            .state('ordersDetailsA', {
                url: '/orderDetails/:id',
                templateUrl: 'modules/orders/views/order-details.html',
                controller: 'OrderDetailsCtrl'
            })
            .state('ordersDetailsV', {
                parent: 'secure',
                url: '/version/orderDetails',
                templateUrl: 'modules/orders/views/order-details-version.html',
                controller: 'OrderDetailsVersionCtrl'
            })
            .state('ordersDetailsG', {
                parent: 'secure',
                url: '/orderDetails/:id',
                templateUrl: 'modules/orders/views/order-details.html',
                controller: 'OrderDetailsCtrl'
            })
            .state('ordersDetailsCR', {
                parent: 'secure',
                url: '/orderDetails/:id',
                templateUrl: 'modules/orders/views/order-details.html',
                controller: 'OrderDetailsCtrl'
            })
            .state('changeRequest', {
                parent: 'secure',
                url: '/changeRequest',
                templateUrl: 'modules/changeRequest/views/changeRequest.html',
                controller: 'CRCtrl'
            })
            .state('changeRequestDetailsA', {
                parent: 'secure',
                url: '/changeRequest/Accepted/:id',
                templateUrl: 'modules/changeRequest/views/change-request-details.html',
                controller: 'CRDetailsCtrl'
            })
            .state('changeRequestDetailsR', {
                parent: 'secure',
                url: '/changeRequest/Rejected/:id',
                templateUrl: 'modules/changeRequest/views/change-request-details.html',
                controller: 'CRDetailsCtrl'
            })
            .state('changeRequestDetailsP', {
                parent: 'secure',
                url: '/changeRequest/Pending/:id',
                templateUrl: 'modules/changeRequest/views/change-request-details.html',
                controller: 'CRDetailsCtrl'
            }).state('fulfillment', {
                parent: 'secure',
                url: '/fulfillment',
                templateUrl: 'modules/fulfillment/views/fulfillment.html',
                controller: 'FFCtrl'
            }).state('invoiceDetails', {
                parent: 'secure',
                url: '/invoiceDetails/:invNo',
                templateUrl: 'modules/invoices/views/invoice.html',
                controller: 'InvoiceCtrl'
            })
            .state('invoiceDetailsP', {
                parent: 'secure',
                url: '/payment/invoiceDetails/:invNo',
                templateUrl: 'modules/invoices/views/invoiceP.html',
                controller: 'InvoiceCtrl'
            })
            .state('payments', {
                parent: 'secure',
                url: '/payments',
                templateUrl: 'modules/payments/views/payments.html',
                controller: 'PaymentCtrl'
            })
            .state('paymentDetails', {
                parent: 'secure',
                url: '/paymentDetails/:no',
                templateUrl: 'modules/payments/views/payment-details.html',
                controller: 'PaymentDetailsCtrl'
            })
            .state('audit', {
                parent: 'secure',
                url: '/order/auditTrail/:id',
                templateUrl: 'modules/orders/views/audit-trail.html',
                controller: 'AuditCtrl'
            });


        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            //document.querySelector('px-app-nav').markSelected('/dashboards');
            $state.go('home');
        });

    }]);
});

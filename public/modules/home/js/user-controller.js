define(['angular', './module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('UserCtrl', ['$http','$scope','$rootScope','PredixUserService','$state','$window', function ($http, $scope, $rootScope, predixUserService, $state, $window) {
      predixUserService.isAuthenticated().then(function (userInfo) {
        console.log(userInfo);
        $window.sessionStorage.setItem('userName',userInfo.user_name);
        $window.sessionStorage.setItem('userEmail',userInfo.email);
        $window.sessionStorage.setItem('userToken',userInfo.user_token);

        $rootScope.userName = userInfo.user_name;

        predixUserService.fetchToken().success(function (response) {
            if(response){
                $window.sessionStorage.setItem('auth_token',response.usrToken);
                var data = {
                  'email': $window.sessionStorage.getItem('userEmail')
                };
                predixUserService.getUserDetails(data).success(function (response){
                  console.log(response);
                  $window.sessionStorage.setItem('customerId',response.customerID);
                  $window.sessionStorage.setItem('roleName', response.userRole.userRoleName);
                  $window.sessionStorage.setItem('roleID', response.userRole.userRoleID);
                  $window.sessionStorage.setItem('userPermission', response.userPermission);
                  $rootScope.userRole = response.userRole.userRoleName;
                  $rootScope.custName = response.customerID;
                  if($rootScope.userRole=="cust-ap"){
                  $rootScope.App.tabs =  [
                      {icon: 'fa-home fa-2x', state: 'dashboards', label: 'Home'},
                      {icon: 'fa-truck fa-2x', state: 'orders', label: 'Orders'},
                      {icon: 'fa-gavel fa-2x', state: 'disputes', label: 'Disputes'},
                      {icon: 'fa-money fa-2x', state: 'payments', label: 'Payments'}
                  ]
                  }
                  else{
                    $rootScope.App.tabs =  [
                        {icon: 'fa-home fa-2x', state: 'dashboards', label: 'Home'},
                        {icon: 'fa-file-text-o fa-2x', state: 'quotes', label: 'Quotes'},
                        {icon: 'fa-truck fa-2x', state: 'orders', label: 'Orders'},
                        {icon: 'fa-pencil-square-o fa-2x', state: 'changeRequest', label: 'Change Request'}
                    ]
                  }
                  $state.go('dashboards');
                });
            }else{
                alert('Unable to fetch token.Please try again later.');
            }
        });
      });
    }]);
});

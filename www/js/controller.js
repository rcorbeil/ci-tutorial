angular.module('starter.controllers', [ ])
    .controller('RegisterCtrl',['$scope', '$state', 'UserService', 
        '$ionicHistory', function($scope, $state, UserService, $ionicHistory) {
            $scope.reg = {};
            $scope.repeat= {};
            
            $scope.regSubmitForm = function(form){
                if($scope.repeat.repeatPassword === $scope.reg.password){
                    if(form.$valid){
                       // if($scope.repeat.repeatPassword === $scope.reg.password){
                          UserService.create($scope.reg)
                        .then(function(response) {
                            if (response.status === 200) {
                                //Should return a token
                                console.log(response);
                                $ionicHistory.nextViewOptions({
                                  historyRoot: true,
                                  disableBack: true
                                });
                                $state.go('lobby');
                            } else {
                                // invalid response
                                alert("Something went wrong, try again.");
                            }
                        }, function(response) {
                            // Code 401 corresponds to Unauthorized access, in this case, the email/password combination was incorrect.
                            if(response.status === 422)
                            {
                                alert("Email and Password are already registered");
                            }else if(response.data === null) {
                        //If the data is null, it means there is no internet connection. 
                                alert("The connection with the server was unsuccessful, check your internet connection and try again later.");
                            }else {
                                alert("Something went wrong, repsone fail try again.");
                            }
                         });
                        }
               }else{alert("Opps the Passwords dont match :( try again!");}    
            };
    }])
    
    .controller('LoginCtrl',['$scope', '$state', 'UserService', 
        '$ionicHistory', function($scope, $state, UserService, $ionicHistory) {
            $scope.user = {};
        
            $scope.loginSubmitForm = function(form){
            if(form.$valid){
            UserService.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    //Should return a token
                    console.log(response);
                    $ionicHistory.nextViewOptions({
                      historyRoot: true,
                      disableBack: true
                    });
                    $state.go('lobby');
                } else {
                    // invalid response
                    alert("Something went wrong, try again.");
                }
            }, function(response) {
                // Code 401 corresponds to Unauthorized access, in this case, the email/password combination was incorrect.
                if(response.status === 401)
                {
                    alert("Incorrect username or password");
                }else if(response.data === null) {
//If the data is null, it means there is no internet connection. 
                    alert("The connection with the server was unsuccessful, check your internet connection and try again later.");
                }else {
                    alert("Something went wrong, try again.");
                }

             });
            }else{alert("Invaild, complete run");}
        };    
    }]);
    
    
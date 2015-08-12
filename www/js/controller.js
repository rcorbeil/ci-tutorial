angular.module('starter.controllers', [ ])
    .controller('RegisterCtrl',['$scope', '$state', 'UserService', '$ionicHistory', '$window', 
    function($scope, $state, UserService, $ionicHistory, $window) {
            $scope.reg = {};
            $scope.repeat= {};
            
            //Required to get the access token
            function loginAfterRegister()
            {
                UserService.login($scope.user)
                .then(function(response) {
                    if (response.status === 200) {
                        //Should return a token
                        $window.localStorage["userID"] = response.data.userId;
                        $window.localStorage['token'] = response.data.id;
                        $ionicHistory.nextViewOptions({
                           historyRoot: true,
                           disableBack: true
                        });
                        $state.go('lobby');
                    } else {
                        // invalid response
                        $state.go('landing');
                    }
                }, function(response) {
                    // something went wrong
                    console.log(response);
                    $state.go('landing');
                });
            }

            $scope.regSubmitForm = function(form){
                    if(form.$valid){
                       if($scope.repeat.repeatPassword !== $scope.reg.password){
                           alert("Opps the Passwords dont match :( try again!");
                         }else{
                             UserService.create($scope.reg)
                        .then(function(response) {
                            if (response.status === 200) {
                                //Should return a token 
                                console.log(response);
                                loginAfterRegister();
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
                    }
            };
    }])
    
    .controller('LoginCtrl',['$scope', '$state', 'UserService', '$ionicHistory',
         '$window', function($scope, $state, UserService, $ionicHistory, $window) {
            $scope.user = {};
        
            $scope.loginSubmitForm = function(form){
            if(form.$valid){
            UserService.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    //Should return a token
                      $window.localStorage["userID"] = response.data.userId;
                      $window.localStorage['token'] = response.data.id;
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
            }
        };    
    }])
    
    // The controller is also missing two ejection depedencies 'UserService' and '$window'
    
    /*Also Constructor injections (used by angularJs) needs to be explained. 
    The basic idea with constructor-injection is that the object has no defaults and
    instead you have a single constructor where all of the collaborators and values 
    need to be supplied before you can instantiate the object. ---- Long story short ---
    you need to call the dependencies in controllers in order.
    
    here's the specific Url: http://misko.hevery.com/2009/02/19/constructor-injection-vs-setter-injection/
    */
    
    .controller('LobbyCtrl',['$scope', '$state', '$ionicHistory', 'UserService', '$window', 
        'TKQuestionsService', 'ServerQuestionService', function($scope, $state, $ionicHistory, UserService, $window, TKQuestionsService, ServerQuestionService) {
            
            /*needs the logout function to be added to documentation
            inorder to control the flow of the controller. Otherwise, 
            when you transfer to lobby it'll automatically logout instead 
            of waiting for a ng-click event to occur.*/
            
            $scope.logout = function(){ 
            UserService.logout($window.localStorage.token)
                .then(function(response) {
                    //The successful code for logout is 204
                    if(response.status === 204)
                    {
                        $ionicHistory.nextViewOptions({
                          historyRoot: true,
                          disableBack: true
                        });
                        $state.go('landing');
                    }else {
                         alert("Could not logout at this moment, try again.");
                    }
                }, function(response) {
                    alert("Could not logout at this moment, try again.");
                });
            };
            
            //This is where all of the functions to handle getting the questions for the test set up
            
            function getQuestions(){ //this is a different function from TKService.js file thats getQuestion
                ServerQuestionService.all($window.localStorage['token'])
                .then(function(response) {
                    if (response.status === 200) {
                        var questions = response.data;
                        TKQuestionsService.setQuestions(questions);
                        $window.localStorage.questions = JSON.stringify(questions);
                    } else {
                        // invalid response
                        confirmPrompt();
                    }
                }, function(response) {
                    // something went wrong
                    confirmPrompt();
                });
            }
            function confirmPrompt(){
                var response = confirm("The questions could not be retrieved at this time, do you want to try again?");
                if (response == true) {
                    getQuestions();
                }
            }
            
            $scope.takeTestButtonTapped = function()
            {
                if($window.localStorage.questions === undefined)
                    getQuestions();
                else {
                    $state.go('test.detail',{testID:1});
                }
            };
            
            //This is where the controller gets the questions 
            //Get Questions Initially if they are not already stored
             if($window.localStorage.questions === undefined){
                getQuestions();
            }else{
                TKQuestionsService.setQuestions(JSON.parse($window.localStorage.questions));
            }
        }])
    
    /*Also how the .state method is made in app.js is made should be discussed 
    here is mine:
    
    .state('lobby', {
        url: '/lobby',
        templateUrl: 'templates/lobby.html',
        controller: 'LobbyCtrl'
      });
    */
    .controller('TestCtrl', ['$scope', 'testInfo', '$stateParams', '$state',
        function($scope, testInfo, $stateParams, $state) {
            //testInfo is passed in the router to obtain the questions
            var qNumber = $stateParams.testID;
            $scope.title = "Question #"+qNumber;
            
            testInfo.forEach(function(infoDict){
                if(infoDict.Answer_ID === "A")
                    $scope.questionA = infoDict;
                if(infoDict.Answer_ID === "B")
                    $scope.questionB = infoDict;
            });
            
            $scope.buttonClicked = function (option) {
                if(option === "A") {
                    console.log("Chose A");
                }
                else if(option === "B") {
                    console.log("Chose B");
                }
                var nextqNumber = Number(qNumber) +1;
                if(nextqNumber > 30) {
                    $state.go('results');
                }else {
                    $state.go('test.detail',{testID:nextqNumber});
                }
            };
        }]);
    
    
app.controller('LoginDialogController', ['$uibModalInstance', '$scope', '$http', function ($modalInstance, $scope, $http) {
    $scope.close = function () {
        $modalInstance.dismiss();
    };
    
    $scope.login = function () {
        $scope.processing = true;
        $http.post('/rpc', {name: 'login', params: {authMethod: 0, username: $scope.username, authData: {password: $scope.password}}}).then(
            function(response){
                "use strict";
                $scope.processing = false;
                if (response.data.success){
                    $modalInstance.close(response.data.result);
                }
                else{
                    alert(response.data.error.errorMessage);
                }
            },
            function(err){
                "use strict";
                $scope.processing = false;
                console.log(err);
                alert('Network error.');
            }
        );
    }
}]);
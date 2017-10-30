app.controller('AdminSupplierAddDialogController', ['$uibModalInstance', '$scope', '$http', function ($modalInstance, $scope, $http) {
    $scope.close = function () {
        $modalInstance.dismiss();
    };
    
    $scope.addSupplier = function () {
        $scope.processing = true;
        $http.post('/rpc', {
            token: $scope.global.user.token, name: 'add_supplier', params: {
                name: $scope.name,
                address: $scope.address,
                phoneNumber: $scope.phoneNumber,
                website: $scope.website,
                iban: $scope.iban,
                bank: $scope.bank,
                bankAddress: $scope.bankAddress,
                swift: $scope.swift,
            }
        }).then(
            function (response) {
                "use strict";
                $scope.processing = false;
                if (response.data.success) {
                    $modalInstance.close(response.data.result);
                }
                else {
                    alert(response.data.error.errorMessage);
                }
            },
            function (err) {
                "use strict";
                $scope.processing = false;
                console.log(err);
                alert('Network error.');
            }
        );
    }
}]);

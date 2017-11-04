const MultiSuppliersSelectorPartialController = function ($scope, $http) {
    "use strict";
    
    const ctrl = this;
    
    const multiSuppliersSelectorAjax = {
        transport: function (params, success, failure) {
            $http.post('/rpc', {
                token: ctrl.global.user.token,
                name: 'get_all_product_suppliers',
                params: {query: params.data.term}
            }).then(
                function (response) {
                    if (response.data.success) {
                        success(response.data.result);
                    }
                    else {
                        failure();
                    }
                },
                function (err) {
                    failure();
                }
            );
        },
        processResults: function (data) {
            data.forEach(function (supplier) {
                supplier.id = supplier._id;
                supplier.text = supplier.name;
            });
            
            return {
                results: data
            };
        }
    };
    
    const initSelector = function (data, value) {
        ctrl.multiSuppliersSelector.select2({
            multiple: true,
            data: data,
            ajax: multiSuppliersSelectorAjax
        });
        ctrl.multiSuppliersSelector.one('select2:select', function (e) {
            $scope.$apply(function () {
                //-- keep a local change
                ctrl.supplier = e.params.data;
                ctrl.onSuppliersChanged({selectedSuppliers: e.params.data});
            });
        });
        ctrl.multiSuppliersSelector.val(value).trigger('change');
    };
    
    const initSelectorWithData = function(selectedSuppliers){
        let data = [];
        let ids = [];
        if (selectedSuppliers && selectedSuppliers.length){
            selectedSuppliers.forEach(function(supplier){
                data.push({id: supplier._id, text: supplier.name});
                ids.push(supplier._id);
            });
        }
        initSelector(data, ids);
    };
    
    ctrl.$onInit = function () {
        ctrl.multiSuppliersSelector = $('.partials_supplier-selector_selector');
        initSelectorWithData(ctrl.selectedSupplier);
    };
    
    ctrl.$onChanges = function (objs) {
        if (ctrl.multiSuppliersSelector){
            //-- reflect change in UI level, not to trigger value change
            if(objs['selectedSuppliers']) {
                initSelectorWithData(objs['selectedSuppliers'].currentValue);
            }
        }
    };
};

app.component('multiSuppliersSelector', {
    templateUrl: 'partials/multi-suppliers-selector',
    controller: MultiSuppliersSelectorPartialController,
    bindings: {
        global: '<',
        selectedSuppliers: '<',
        onSuppliersChanged: '&'
    }
});

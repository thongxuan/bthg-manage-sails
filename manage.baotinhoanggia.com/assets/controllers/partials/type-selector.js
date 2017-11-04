const TypeSelectorPartialController = function ($scope, $http) {
    "use strict";
    
    const ctrl = this;
    
    const typeSelectorAjax = {
        transport: function (params, success, failure) {
            $http.post('/rpc', {
                token: ctrl.global.user.token,
                name: 'get_all_product_types',
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
            data.forEach(function (type) {
                type.id = type._id;
                type.text = type.name;
            });
        
            //-- filter if ctrl.selectedGroup is present
            if (ctrl.selectedGroup){
                data = data.filter(function(type){
                    return String(type.groupID) === ctrl.selectedGroup._id;
                });
            }
        
            return {
                results: data
            };
        }
    };
    
    const initSelector = function (data, value) {
        ctrl.typeSelector.select2({
            data: data,
            ajax: typeSelectorAjax
        });
        ctrl.typeSelector.one('select2:select', function (e) {
            $scope.$apply(function () {
                //-- keep a local change
                ctrl.type = e.params.data;
                ctrl.onTypeChanged({selectedType: e.params.data});
            });
        });
        ctrl.typeSelector.val(value).trigger('change');
    };
    
    const initSelectorWithData = function(selectedType){
        let data = [];
        let ids = [];
        if (selectedType){
            data.push({id: selectedType._id, text: selectedType.name});
            ids.push(selectedType._id);
        }
        initSelector(data, ids);
    };
    
    ctrl.$onInit = function () {
        ctrl.typeSelector = $('.partials_type-selector_selector');
        initSelectorWithData(ctrl.selectedType);
    };
    
    ctrl.$onChanges = function (objs) {
        if (ctrl.typeSelector){
            if (objs['selectedType']){
                initSelectorWithData(objs['selectedType'].currentValue);
            }
        }
    };
};

app.component('typeSelector', {
    templateUrl: 'partials/type-selector',
    controller: TypeSelectorPartialController,
    bindings: {
        global: '<',
        selectedGroup: '<',
        selectedType: '<',
        onTypeChanged: '&'
    }
});

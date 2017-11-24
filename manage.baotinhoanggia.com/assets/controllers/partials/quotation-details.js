const QuotationDetailsPartialController = function($scope, $timeout, $http){
    "use strict";
    
    const ctrl = this;
    
    ctrl.calculateTotalOrderValue = function () {
        let sum = new BigNumber(0);
        ctrl.quotation.selections.forEach(function (selection) {
            sum = sum.add(new BigNumber(selection.price).mul(selection.amount));
        });
        return sum.toString();
    };
    
    ctrl.exportPDF = function (dict) {
        ctrl.exportingPDF = true;
        //-- get company info
        
        $http.post('/rpc', {
            token: ctrl.global.user.token,
            name: 'get_system_variable',
            params: {
                name: 'COMPANY_INFO'
            }
        }).then(
            function (response) {
                if (response.data.success) {
                    let companyInfo = JSON.parse(response.data.result.value);
                    let q = ctrl.quotation;
                    // console.log(q);
                    //-- build pdf file
                    let dd = {
                        content: [
                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{
                                            border: [true, true, true, false],
                                            fontSize: 12,
                                            text: companyInfo.business || '',
                                            alignment: 'center',
                                            color: '#2d72bc',
                                        }],
                                        [{
                                            border: [true, false, true, false],
                                            fontSize: 14,
                                            bold: true,
                                            color: '#a01959',
                                            text: companyInfo.name || '',
                                            alignment: 'center'
                                        }],
                                        [{
                                            border: [true, false, true, false],
                                            fontSize: 10,
                                            text: companyInfo.contact || '',
                                            alignment: 'center',
                                            color: '#0e1a4f',
                                            italics: true,
                                        }],
                                        [{
                                            border: [true, false, true, true],
                                            fontSize: 10,
                                            text: companyInfo.address || '',
                                            alignment: 'center'
                                        }],
                                    ],
                                },
                            },
                            {
                                text: dict.quo001,
                                alignment: 'center',
                                margin: [0, 10, 0, 10],
                                bold: true,
                                fontSize: 16,
                                color: '#0e1a4f',
                            },
                            {
                                color: '#0e1a4f',
                                style: 'infoTable',
                                table: {
                                    widths: ['auto', '*', 'auto', 'auto'],
                                    body: [
                                        [
                                            {border: [false, true, false, false], text: dict.quo002},
                                            {
                                                border: [false, true, false, false],
                                                text: q.customerContactID.customerID.name || ''
                                            },
                                            {border: [false, true, false, false], text: dict.quo003, alignment: 'right'},
                                            {
                                                border: [false, true, false, false],
                                                text: q.outStockOrderID.code || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {
                                                border: [false, false, false, false],
                                                text: dict.quo004
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.customerID.address || ''
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: dict.quo005,
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: moment(q.createdAt).format('DD-MM-YYYY') || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {
                                                border: [false, false, false, false],
                                                text: dict.quo006
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.title && q.customerContactID.name ? `${q.customerContactID.title} ${q.customerContactID.name}` : q.customerContactID.name || '',
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: dict.quo007,
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.userID.name ? q.userID.lastName ? `${q.userID.name} ${q.userID.lastName}` : q.userID.name : '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {border: [false, false, false, false], text: dict.quo008},
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.position || '',
                                                alignment: 'left'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: dict.quo009,
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.userID.position || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {border: [false, false, false, false], text: dict.quo010},
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.email || ''
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: dict.quo011,
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.userID.email || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {border: [false, false, false, true], text: dict.quo012},
                                            {
                                                border: [false, false, false, true],
                                                text: q.customerContactID.phoneNumber || ''
                                            },
                                            {
                                                border: [false, false, false, true],
                                                text: dict.quo013,
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, true],
                                                text: q.userID.phoneNumber || '',
                                                alignment: 'right'
                                            },
                                        ],
                                    ],
                                },
                            },
                            {
                                color: '#0e1a4f',
                                stack: [`${dict.quo014} ${q.customerContactID.title} ${q.customerContactID.name}`, dict.quo015, dict.quo016],
                                margin: [0, 10, 0, 10],
                                fontSize: 9
                            },
                            {
                                color: '#0e1a4f',
                                fontSize: 9,
                                table: {
                                    widths: ['auto', 50, '*', 100, 'auto', 'auto', 'auto', 50],
                                    headerRows: 0,
                                    dontBreakRows: true,
                                    body: [
                                        [
                                            {text: dict.quo031, rowSpan: 2, bold: true,},
                                            {
                                                text: dict.quo017,
                                                colSpan: 3,
                                                alignment: 'center',
                                                bold: true,
                                            },
                                            {}, {},
                                            {text: dict.quo018, alignment: 'center', rowSpan: 2, bold: true,},
                                            {
                                                text: dict.quo019,
                                                alignment: 'center',
                                                rowSpan: 2,
                                                bold: true,
                                            },
                                            {text: dict.quo020, alignment: 'center', rowSpan: 2, bold: true,},
                                            {
                                                text: dict.quo021,
                                                alignment: 'center',
                                                rowSpan: 2,
                                                bold: true,
                                            }
                                        ],
                                        [
                                            {},
                                            {text: dict.quo022, alignment: 'center', bold: true,},
                                            {
                                                text: dict.quo023,
                                                alignment: 'center',
                                                bold: true,
                                            },
                                            {text: dict.quo024, alignment: 'center', bold: true,}, {}, {}, {}, {}
                                        ],
                                    ]
                                },
                                
                            },
                            {
                                fontSize: 10,
                                text: dict.quo025,
                                margin: [0, 10, 0, 5],
                                bold: true,
                            },
                            {
                                color: '#0e1a4f',
                                text: q.terms || '',
                                margin: [0, 0, 0, 20],
                                style: 'terms',
                            },
                            {
                                color: '#0e1a4f',
                                fontSize: 9,
                                table: {
                                    widths: ['*', '*'],
                                    body: [
                                        [{text: dict.quo026, alignment: 'center'}, {
                                            stack: [{
                                                text: dict.quo027,
                                                alignment: 'center'
                                            }, {text: `${q.userID.position || ''}\n\n\n\n\n\n`, alignment: 'center'}]
                                        }],
                                        [{}, {
                                            text: q.userID.name ? q.userID.lastName ? `${q.userID.name} ${q.userID.lastName}` : q.userID.name || '' : '',
                                            alignment: 'center'
                                        }]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ],
                        styles: {
                            infoTable: {
                                fontSize: 9,
                            },
                            terms: {
                                fontSize: 9,
                            },
                        }
                    };
                    
                    //-- insert products here
                    //-- get all images from s3
                    let images = [];
                    let imageCount = 0;
                    
                    let checkFinishLoadingImages = function(){
                        if (imageCount === q.selections.length){
                            let total = new BigNumber(0);
                            q.selections.forEach(function(selection, index){
                                let subtotal = new BigNumber(selection.amount).mul(new BigNumber(selection.price));
                                total = total.add(subtotal);
                                if (images[index]) {
                                    dd.content[4].table.body.push([
                                        {text: index + 1, alignment: 'center'},
                                        {text: selection.productID.typeID.name || '', alignment: 'center'},
                                        {
                                            stack: [
                                                {text: selection.productID.brandID? `${dict.quo028}: ${selection.productID.brandID.name} (${ctrl.global.utils.originNameFromCode(selection.productID.brandID.origin)})` : '',},
                                                {text: selection.productID.model? `${dict.quo029}: ${selection.productID.model}` : '',},
                                                {text: selection.productID.description? '\n' + selection.productID.description : '',}
                                            ],
                                            alignment: 'left'
                                        },
                                        {
                                            image: 'data:image/jpeg;base64,' + images[index],
                                            width: 100
                                        },
                                        {text: accounting.formatNumber(selection.amount), alignment: 'right'},
                                        {text: accounting.formatNumber(selection.price), alignment: 'right'},
                                        {text: accounting.formatNumber(subtotal.toString()), alignment: 'right'},
                                        {
                                            text: selection.note || '',
                                            alignment: 'left'
                                        }
                                    ]);
                                }
                                else{
                                    dd.content[4].table.body.push([
                                        {text: index + 1, alignment: 'center'},
                                        {text: selection.productID.typeID.name || '', alignment: 'center'},
                                        {
                                            stack: [
                                                {text: selection.productID.brandID? `${dict.quo028}: ${selection.productID.brandID.name} (${ctrl.global.utils.originNameFromCode(selection.productID.brandID.origin)})` : '',},
                                                {text: selection.productID.model? `${dict.quo029}: ${selection.productID.model}` : '',},
                                                {text: selection.productID.description? '\n' + selection.productID.description : '',}
                                            ],
                                            alignment: 'left'
                                        },
                                        {
                                            text: ''
                                        },
                                        {text: accounting.formatNumber(selection.amount), alignment: 'right'},
                                        {text: accounting.formatNumber(selection.price), alignment: 'right'},
                                        {text: accounting.formatNumber(subtotal.toString()), alignment: 'right'},
                                        {
                                            text: selection.note || '',
                                            alignment: 'left'
                                        }
                                    ]);
                                }
                            });
                            
                            //-- footer
                            dd.content[4].table.body.push([
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                },
                                {text: dict.quo030, alignment: 'center', bold: true},
                                {text: accounting.formatNumber(total.toString()), alignment: 'right', bold: true},
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                }
                            ]);
                            
                            pdfMake.createPdf(dd).download(`${dict.quo032} ${ctrl.quotation.outStockOrderID.name}.pdf`);
                            ctrl.exportingPDF = false;
                        }
                    };
                    
                    for (let i=0; i<q.selections.length; i++){
                        if (q.selections[i].productID.photos && q.selections[i].productID.photos.length) {
                            $http({
                                url: q.selections[i].productID.photos[0].url,
                                method: 'GET',
                                responseType: 'arraybuffer',
                            }).then(
                                function (response) {
                                    images[i] = ctrl.global.utils.arrayBufferToBase64(response.data);
                                    imageCount++;
                                    checkFinishLoadingImages();
                                },
                                function (err) {
                                    images[i] = null;
                                    imageCount++;
                                    checkFinishLoadingImages();
                                }
                            );
                        }
                        else{
                            images[i] = null;
                            imageCount++;
                            checkFinishLoadingImages();
                        }
                    }
                }
                else {
                    alert(ctrl.global.utils.errors[response.data.error.errorName]);
                }
            },
            function () {
                alert(ctrl.global.utils.errors['NETWORK_ERROR']);
            }
        );
    };
    
    ctrl.confirmOrder = function(i18n_confirm_order_prompt){
        //-- show confirm orderDialog
    };
    
    ctrl.$onInit = function () {
        ctrl.loadingQuotation = true;
        
        $http.post('/rpc', {
            token: ctrl.global.user.token,
            name: 'get_quotation_details',
            params: {
                _id: ctrl.quotationId,
            }
        }).then(
            function (response) {
                ctrl.loadingQuotation = false;
                if (response.data.success) {
                    ctrl.quotation = response.data.result;
                    ctrl.quotation.selections.sort(function(a, b){
                        return a.sortOrder - b.sortOrder;
                    });
                }
                else {
                    alert(ctrl.global.utils.errors[response.data.error.errorName]);
                }
            },
            function () {
                ctrl.loadingQuotation = false;
                alert(ctrl.global.utils.errors['NETWORK_ERROR']);
            }
        );
    }
    
};

app.component('quotationDetails', {
    templateUrl: 'partials/quotation-details',
    controller: QuotationDetailsPartialController,
    bindings: {
        global: '<',
        quotationId: '<'
    }
});

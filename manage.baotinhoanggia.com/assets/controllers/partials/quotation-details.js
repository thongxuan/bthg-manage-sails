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
    
    ctrl.exportPDF = function () {
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
                                text: 'QUOTATION',
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
                                            {border: [false, true, false, false], text: 'To'},
                                            {
                                                border: [false, true, false, false],
                                                text: q.customerContactID.customerID.name || ''
                                            },
                                            {border: [false, true, false, false], text: 'No.', alignment: 'right'},
                                            {
                                                border: [false, true, false, false],
                                                text: q.outStockOrderID.code || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {
                                                border: [false, false, false, false],
                                                text: 'Address'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.customerID.address || ''
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: 'Date',
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: moment(q.createdAt).format('YYYY-MM-DD') || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {
                                                border: [false, false, false, false],
                                                text: 'Att'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.title && q.customerContactID.name ? `${q.customerContactID.title} ${q.customerContactID.name}` : q.customerContactID.name || '',
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: 'Sales person',
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.userID.name ? q.userID.lastName ? `${q.userID.name} ${q.userID.lastName}` : q.userID.name : '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {border: [false, false, false, false], text: 'Position'},
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.position || '',
                                                alignment: 'left'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: 'Position',
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.userID.position || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {border: [false, false, false, false], text: 'Email'},
                                            {
                                                border: [false, false, false, false],
                                                text: q.customerContactID.email || ''
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: 'Email',
                                                alignment: 'right'
                                            },
                                            {
                                                border: [false, false, false, false],
                                                text: q.userID.email || '',
                                                alignment: 'right'
                                            },
                                        ],
                                        [
                                            {border: [false, false, false, true], text: 'Phone'},
                                            {
                                                border: [false, false, false, true],
                                                text: q.customerContactID.phoneNumber || ''
                                            },
                                            {
                                                border: [false, false, false, true],
                                                text: 'Phone',
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
                                stack: [`Dear ${q.customerContactID.title} ${q.customerContactID.name}`, 'Thank you for your enquiry', 'We are glad to provide you with our quote as below:'],
                                margin: [0, 10, 0, 10],
                                fontSize: 9
                            },
                            {
                                color: '#0e1a4f',
                                fontSize: 9,
                                table: {
                                    widths: ['auto', 50, '*', 100, 'auto', 'auto', 'auto', 50],
                                    headerRows: 1,
                                    dontBreakRows: true,
                                    body: [
                                        [
                                            {text: 'No.', rowSpan: 2, bold: true,},
                                            {
                                                text: 'Details',
                                                colSpan: 3,
                                                alignment: 'center',
                                                bold: true,
                                            },
                                            {}, {},
                                            {text: 'Qt.', alignment: 'center', rowSpan: 2, bold: true,},
                                            {
                                                text: 'Unit price\n(VND)',
                                                alignment: 'center',
                                                rowSpan: 2,
                                                bold: true,
                                            },
                                            {text: 'Subtotal\n(VND)', alignment: 'center', rowSpan: 2, bold: true,},
                                            {
                                                text: 'Note',
                                                alignment: 'center',
                                                rowSpan: 2,
                                                bold: true,
                                            }
                                        ],
                                        [
                                            {},
                                            {text: 'Item', alignment: 'center', bold: true,},
                                            {
                                                text: 'Description',
                                                alignment: 'center',
                                                bold: true,
                                            },
                                            {text: 'Photos', alignment: 'center', bold: true,}, {}, {}, {}, {}
                                        ],
                                    ]
                                },
                                
                            },
                            {
                                fontSize: 10,
                                text: 'Terms & Conditions',
                                margin: [0, 10, 0, 5],
                                bold: true,
                            },
                            {
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
                                        [{text: 'Customer\'s comfirmation', alignment: 'center'}, {
                                            stack: [{
                                                text: 'Made by',
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
                                                {text: selection.productID.brandID? `Brand: ${selection.productID.brandID.name} (${ctrl.global.utils.originNameFromCode(selection.productID.brandID.origin)})` : '',},
                                                {text: selection.productID.model? 'Model: ' + selection.productID.model : '',},
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
                                            text: '',
                                            alignment: 'justify'
                                        }
                                    ]);
                                }
                                else{
                                    dd.content[4].table.body.push([
                                        {text: index + 1, alignment: 'center'},
                                        {text: selection.productID.typeID.name || '', alignment: 'center'},
                                        {
                                            stack: [
                                                {text: selection.productID.brandID? `Brand: ${selection.productID.brandID.name} (${ctrl.global.utils.originNameFromCode(selection.productID.brandID.origin)})` : '',},
                                                {text: selection.productID.model? 'Model: ' + selection.productID.model : '',},
                                                {text: selection.productID.description? 'Description: ' + selection.productID.description : '',}
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
                                            text: '',
                                            alignment: 'justify'
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
                                {text: 'Total', alignment: 'center', bold: true},
                                {text: accounting.formatNumber(total.toString()), alignment: 'right', bold: true},
                                {
                                    border: [false, false, false, false],
                                    text: ''
                                }
                            ]);
                            
                            pdfMake.createPdf(dd).download(`Bao gia ${ctrl.quotation.outStockOrderID.name}.pdf`);
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
                    alert(ctrl.global.utils.errors[response.data.error.errorCode]);
                }
            },
            function () {
                alert(ctrl.global.utils.errors[-1]);
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
                    // console.log(ctrl.quotation);
                }
                else {
                    alert(ctrl.global.utils.errors[response.data.error.errorCode]);
                }
            },
            function () {
                ctrl.loadingQuotation = false;
                alert(ctrl.global.utils.errors[-1]);
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
const mongoose = require('mongoose');
const sysUtils = require('../../utils/system');

module.exports = {
    
    //----------- product category -------------
    
    addProductCategory: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] name: product category name
            }
         */
        try {
            //-- check if the name existed
            
            let category = await _app.model.ProductGroup.findOne({name: params.name});
            if (category)
                return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            category = new _app.model.ProductGroup({
                name: params.name
            });
            
            category = await category.save();
            
            return sysUtils.returnSuccess(category);
        }
        catch (err) {
            console.log('addProductCategory:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    updateProductCategory: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] _id: the id of product category
                [required] name: new product category name
            }
         */
        try {
            //-- check if the name existed
            
            let category = await _app.model.ProductGroup.findById(params._id);
            if (!category)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let namedCategory = await _app.model.ProductGroup.findOne({name: params.name});
            if (namedCategory && namedCategory.name === params.name && String(namedCategory._id) !== String(category._id))
                if (category)
                    return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            category.name = params.name;
            category = await category.save();
            
            return sysUtils.returnSuccess(category);
        }
        catch (err) {
            console.log('updateProductCategory:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    removeProductCategory: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] _id: the id of product category
            }
         */
        try {
            //-- check if dirty
            
            let category = await _app.model.ProductGroup.findById(params._id);
            if (!category)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let types = await _app.model.ProductType.find({groupID: category._id});
            if (!types && !types.length)
                return sysUtils.returnError(_app.errors.RESOURCE_DIRTY_ERROR);
            
            category = await _app.model.ProductGroup.findByIdAndRemove(category._id);
            
            return sysUtils.returnSuccess(category);
        }
        catch (err) {
            console.log('removeProductCategory:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    getAllProductCategories: async function (principal, params) {
        "use strict";
        /*
            params: {
                query: query by name
                with_count: count the product type of each product
            }
         */
        try {
            let categories;
            if (params.with_count) {
                categories = await _app.model.ProductGroup.aggregate([
                    {
                        $lookup: {
                            from: "productType",
                            localField: "_id",
                            foreignField: "groupID",
                            as: "productTypes"
                        }
                    }
                ]);
                categories.forEach(cat => {
                    cat.size = cat.productTypes.length;
                    delete cat.productTypes;
                });
            }
            else {
                categories = await _app.model.ProductGroup.find({});
            }
            if (params.query) {
                let regex = new RegExp(`.*${sysUtils.regexEscape(params.query)}.*`,'gi');
                categories = categories.filter(cat => {
                    return !!regex.exec(cat.name);
                });
            }
            return sysUtils.returnSuccess(categories);
        }
        catch (err) {
            console.log('getAllProductCategories:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    //----------- product brand -------------
    
    addProductBrand: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] name: brand name
                origin: brand origin
            }
         */
        try {
            //-- check if the name existed
            
            let brand = await _app.model.ProductBrand.findOne({name: params.name});
            if (brand)
                return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            brand = new _app.model.ProductBrand({
                name: params.name,
                origin: params.origin
            });
            
            brand = await brand.save();
            
            return sysUtils.returnSuccess(brand);
        }
        catch (err) {
            console.log('addProductBrand:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    updateProductBrand: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] _id: the id of product category
                [required] name: new product category name
                origin,
            }
         */
        try {
            //-- check if the name existed
            
            let brand = await _app.model.ProductBrand.findById(params._id);
            if (!brand)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let namedBrand = await _app.model.ProductBrand.findOne({name: params.name});
            if (namedBrand && namedBrand.name === params.name && String(namedBrand._id) !== String(brand._id))
                if (brand)
                    return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            brand.name = params.name;
            brand.origin = params.origin;
            
            brand = await brand.save();
            
            return sysUtils.returnSuccess(brand);
        }
        catch (err) {
            console.log('updateProductBrand:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    removeProductBrand: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] _id: the id of product brand
            }
         */
        try {
            
            let brand = await _app.model.ProductBrand.findById(params._id);
            if (!brand)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            brand = await _app.model.ProductBrand.findByIdAndRemove(brand._id);
            
            return sysUtils.returnSuccess(brand);
        }
        catch (err) {
            console.log('removeProductBrand:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    getAllProductBrands: async function (principal, params) {
        "use strict";
        /*
            params: {
                query: query by name
                with_count: count the product type of each product
            }
         */
        try {
            let brands;
            if (params.with_count) {
                brands = await _app.model.ProductBrand.aggregate([
                    {
                        $lookup: {
                            from: "product",
                            localField: "_id",
                            foreignField: "brandID",
                            as: "products"
                        }
                    }
                ]);
                brands.forEach(brand => {
                    brand.size = brand.products.length;
                    delete brand.products;
                });
            }
            else {
                brands = await _app.model.ProductBrand.find({});
            }
            if (params.query){
                let regex = new RegExp(`.*${params.query}.*`, 'ig');
                brands = brands.filter(b=>{
                    return !!regex.exec(b.name);
                });
            }
            return sysUtils.returnSuccess(brands);
        }
        catch (err) {
            console.log('getAllProductBrands:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    //----------- product type -------------
    
    addProductType: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] groupID: id of category
                [required] name: product category name
            }
         */
        try {
            //-- check if the name existed
            let type = await _app.model.ProductType.findOne({name: params.name});
            if (type)
                return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            let category = await _app.model.ProductGroup.findById(params.groupID);
            if (!category)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            type = new _app.model.ProductType({
                groupID: category._id,
                name: params.name
            });
            
            type = await type.save();
            
            return sysUtils.returnSuccess(type);
        }
        catch (err) {
            console.log('addProductType:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    updateProductType: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] _id: the id of product category
                [required] name: new product category name
            }
         */
        try {
            //-- check if the name existed
            
            let type = await _app.model.ProductType.findById(params._id);
            if (!type)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let namedType = await _app.model.ProductType.findOne({name: params.name});
            if (namedType && namedType.name === params.name && String(namedType._id) !== String(type._id))
                if (type)
                    return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            type.name = params.name;
            type = await type.save();
            
            return sysUtils.returnSuccess(type);
        }
        catch (err) {
            console.log('updateProductType:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    removeProductType: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] _id: the id of product category
            }
         */
        try {
            //-- check if dirty
            
            let type = await _app.model.ProductType.findById(params._id);
            if (!type)
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let products = await _app.model.Product.find({typeID: type._id});
            if (!products && !products.length)
                return sysUtils.returnError(_app.errors.RESOURCE_DIRTY_ERROR);
            
            type = await _app.model.ProductType.findByIdAndRemove(type._id);
            
            return sysUtils.returnSuccess(type);
        }
        catch (err) {
            console.log('removeProductType:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    getAllTypesFromCategory: async function (principal, params) {
        "use strict";
        /*
            params: {
                [required] groupID,
                query: filter by name
                with_count: count the product of each type
            }
         */
        try {
            let types;
            if (params.with_count) {
                types = await _app.model.ProductType.aggregate([
                    {
                        $match: {groupID: mongoose.Types.ObjectId(params.groupID)}
                    },
                    {
                        $lookup: {
                            from: "product",
                            localField: "_id",
                            foreignField: "typeID",
                            as: "products"
                        }
                    }
                ]);
                types.forEach(type => {
                    type.size = type.products.length;
                    delete type.products;
                });
            }
            else {
                types = await _app.model.ProductType.find({groupID: params.groupID});
            }
            
            if (params.query){
                let regex = new RegExp(`.*${sysUtils.regexEscape(params.query)}.*`, 'ig');
                types = types.filter(t=>{
                    return !!regex.exec(t.name);
                })
            }
            return sysUtils.returnSuccess(types);
        }
        catch (err) {
            console.log('getAllTypesFromCategory:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
};

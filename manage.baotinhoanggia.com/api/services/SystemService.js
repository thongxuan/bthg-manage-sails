const sysUtils = require('../../utils/system');

const aws = require('aws-sdk');
const mongoDbRestore = require('mongodb-restore');
const mongoDbBackup = require('mongodb-backup');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Cron = require('cron').CronJob;

const backupDir = path.join(__dirname, '../backup-db');

const runBackup = async function () {
    
    let date = moment().format(sails.config.TIME_FORMAT);
    let backupFileName = sails.config.BACKUP_FILE_PREFIX + date + '.tar';
    
    return await new Promise((resolve) => {
        mongoDbBackup({
            uri: `mongodb://${sails.config.MONGO_USERNAME && sails.config.MONGO_USERPASSWORD ? sails.config.MONGO_USERNAME + ':' + sails.config.MONGO_USERPASSWORD + '@' : ''}${sails.config.MONGO_SERVER}:${sails.config.MONGO_PORT}/${sails.config.MONGO_DBNAME}`,
            root: backupDir,
            tar: backupFileName,
            callback: function (err) {
                if (!err) {
                    //-- Upload file to S3
                    let pathToBackupFile = path.join(backupDir, backupFileName);
                    fs.readFile(pathToBackupFile, (err, backupData) => {
                        if (err) {
                            resolve(sysUtils.returnError(_app.errors.SYSTEM_ERROR));
                        }
                        else {
                            let binaryData = new Buffer(backupData, 'binary');
                            let param = {
                                Body: binaryData,
                                Key: backupFileName,
                                Bucket: sails.config.S3_DB_BACKUP_BUCKET
                            };
                            _app.S3.putObject(param, (err) => {
                                if (err) {
                                    resolve(sysUtils.returnError(_app.errors.SYSTEM_ERROR));
                                }
                                else {
                                    fs.unlinkSync(pathToBackupFile);
                                    resolve(sysUtils.returnSuccess({Key: param.Key, Size: binaryData.length}));
                                }
                            });
                        }
                    });
                }
                else {
                    resolve(sysUtils.returnError(_app.errors.SYSTEM_ERROR));
                }
            }
        });
    });
};

const runBackupWithCronJob = async function () {
    try {
        console.log('- set db backup life cycle');
        let setLifecycleParams = {
            Bucket: sails.config.S3_DB_BACKUP_BUCKET,
            LifecycleConfiguration: {
                Rules: [
                    {
                        Expiration: {
                            Days: sails.config.BACKUP_EXPIRATION_DAY
                        },
                        ID: sails.config.BACKUP_LIFECYCLE_ID,
                        Status: "Enabled"
                    }
                ]
            }
        };
        await _app.S3.putBucketLifecycleConfiguration(setLifecycleParams).promise();
        
        return await new Promise((resolve) => {
            new Cron(`00 */${sails.config.BACKUP_INTERVAL_MINUTE} * * * *`, async function () {
                try {
                    await runBackup();
                    console.log('[SYSTEM] db backup success at ', moment().format(sails.config.TIME_FORMAT));
                }
                catch (err) {
                    console.log('[SYSTEM] db backup FAILURE at ', moment().format(sails.config.TIME_FORMAT));
                }
            }, null, true, sails.config.TIME_ZONE);
            resolve(sysUtils.returnSuccess());
        });
    }
    catch (err) {
        return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
    }
};

module.exports = {
    
    init: async function (params) {
        "use strict";
        
        moment.tz.setDefault(sails.config.TIME_ZONE);
        
        aws.config.update({
            accessKeyId: sails.config.AWS_API_ID,
            secretAccessKey: sails.config.AWS_API_KEY
        });
        
        aws.config.setPromisesDependency(global.Promise);
        _app.S3 = new aws.S3();
        
        await runBackupWithCronJob();
        
        return sysUtils.returnSuccess();
    },
    
    checkAttribute: async function (principal, params) {
        "use strict";
        /*
            params:{
                [required] collection: collection to be checked
                [required] pairs: array of {attr, value} to be checked
            }
         */
        try {
            if (!_app.model[params.collection])
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let promise = _app.model[params.collection].findOne();
            params.pairs.forEach(pair => {
                promise = promise.where(pair.attr, pair.value);
            });
            
            let existed = await promise.exec();
            
            if (existed)
                return sysUtils.returnError(_app.errors.DUPLICATED_ERROR);
            
            return sysUtils.returnSuccess();
        }
        catch (err) {
            console.log('checkAttribute:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
    
    filterCollection: async function (principal, params) {
        "use strict";
        /*
            params:{
                [required] collection: collection to be checked
                [required] filter: array of {attr, value}
            }
         */
        try {
            if (!_app.model[params.collection])
                return sysUtils.returnError(_app.errors.NOT_FOUND_ERROR);
            
            let promise = _app.model[params.collection].find();
            params.filter.forEach(pair => {
                promise = promise.where(pair.attr, pair.value);
            });
            
            let result = await promise.exec();
            
            return sysUtils.returnSuccess(result);
        }
        catch (err) {
            console.log('filterCollection:', err);
            return sysUtils.returnError(_app.errors.SYSTEM_ERROR);
        }
    },
};
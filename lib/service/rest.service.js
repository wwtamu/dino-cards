"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restService = void 0;
var request = require('request');
var RestService = /** @class */ (function () {
    function RestService() {
    }
    RestService.prototype.request = function (req, cb) {
        return request(req, cb);
    };
    RestService.prototype.get = function (url, headers) {
        if (headers === void 0) { headers = { 'Content-Type': 'application/json' }; }
        return new Promise(function (resolve, reject) {
            request.get({
                url: url, headers: headers
            }, function (error, response, body) {
                if (error) {
                    console.log('failed get', url, error);
                    reject(error);
                }
                else if (response && response.statusCode >= 200 && response.statusCode <= 299) {
                    resolve(response);
                }
                else {
                    console.log('failed get', url, response.statusCode);
                    reject(response);
                }
            });
        });
    };
    RestService.prototype.post = function (url, json, headers) {
        if (headers === void 0) { headers = { 'Content-Type': 'application/json' }; }
        return new Promise(function (resolve, reject) {
            request.post({ url: url, json: json, headers: headers }, function (error, response, body) {
                if (error) {
                    console.log('failed post', url, error);
                    reject(error);
                }
                else if (response && response.statusCode >= 200 && response.statusCode <= 299) {
                    resolve(response);
                }
                else {
                    console.log('failed post', url, json, response.statusCode);
                    reject(response);
                }
            });
        });
    };
    RestService.prototype.put = function (url, json, headers) {
        if (headers === void 0) { headers = { 'Content-Type': 'application/json' }; }
        return new Promise(function (resolve, reject) {
            request.put({ url: url, json: json, headers: headers }, function (error, response, body) {
                if (error) {
                    console.log('failed put', url, error);
                    reject(error);
                }
                else if (response && response.statusCode >= 200 && response.statusCode <= 299) {
                    resolve(response);
                }
                else {
                    console.log('failed put', url, json, response.statusCode);
                    reject(response);
                }
            });
        });
    };
    RestService.prototype.delete = function (url, headers) {
        if (headers === void 0) { headers = { 'Content-Type': 'application/json', 'Accept': 'plain/text' }; }
        return new Promise(function (resolve, reject) {
            request.delete({ url: url, headers: headers }, function (error, response, body) {
                if (error) {
                    console.error('failed delete', url, error);
                    reject(error);
                }
                else if (response && response.statusCode >= 200 && response.statusCode <= 299) {
                    resolve(response);
                }
                else {
                    console.warn('failed delete', url, response.statusCode);
                    reject(response);
                }
            });
        });
    };
    return RestService;
}());
exports.restService = new RestService();

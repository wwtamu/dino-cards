"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = void 0;
var fs = require('fs');
var FileService = /** @class */ (function () {
    function FileService() {
    }
    FileService.prototype.read = function (path) {
        if (this.exists(path)) {
            return fs.readFileSync(path, 'utf8');
        }
        throw new Error("not found: " + path);
    };
    FileService.prototype.readAll = function (path, endsWith) {
        var _this = this;
        if (endsWith === void 0) { endsWith = ''; }
        if (this.exists(path)) {
            return fs.readdirSync(path).filter(function (file) {
                return !file.startsWith('.') && file.endsWith(endsWith) && fs.lstatSync(path + "/" + file).isFile();
            }).map(function (file) {
                return _this.read(path + "/" + file);
            });
        }
        throw new Error("not found: " + path);
    };
    FileService.prototype.listDirectories = function (path) {
        if (this.exists(path)) {
            return fs.readdirSync(path).filter(function (file) {
                return fs.lstatSync(path + "/" + file).isDirectory();
            });
        }
        throw new Error("not found: " + path);
    };
    FileService.prototype.exists = function (path) {
        return fs.existsSync(path);
    };
    FileService.prototype.createDirectory = function (path) {
        return fs.mkdirSync(path);
    };
    FileService.prototype.createFile = function (path, data) {
        if (data === void 0) { data = ''; }
        return fs.writeFileSync(path, JSON.stringify(data, null, 2));
    };
    FileService.prototype.save = function (path, data) {
        return fs.writeFileSync(path, JSON.stringify(data, null, 2));
    };
    return FileService;
}());
exports.fileService = new FileService();

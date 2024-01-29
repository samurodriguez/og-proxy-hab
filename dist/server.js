"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var lib_1 = require("./lib");
var app = express_1.default();
var port = Number(process.env.PORT || 8080);
var SERVER_URL = process.env.SERVER_URL;
var sendResponse = function (res, output) {
    if (!output) {
        return res
            .set('Access-Control-Allow-Origin', '*')
            .status(404)
            .json({ metadata: null });
    }
    return res
        .set('Access-Control-Allow-Origin', '*')
        .status(200)
        .json({ metadata: output });
};
app.listen(port, function () {
    console.log("Server started on port " + port);
});
app.use(express_1.default.static('public'));
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = req.query.url;
                return [4 /*yield*/, lib_1.getMetadata(url)];
            case 1:
                metadata = _a.sent();
                return [2 /*return*/, res
                        .set('Access-Control-Allow-Origin', '*')
                        .status(200)
                        .json({ metadata: metadata })];
        }
    });
}); });
app.get('/v2', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, isUrlValid, hostname, output, metadata, _a, images, og, meta, image, description, title, siteName, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                url = req.query.url;
                url = url.toLowerCase();
                url = url.indexOf('://') === -1 ? 'http://' + url : url;
                isUrlValid = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(url);
                if (!url || !isUrlValid) {
                    return [2 /*return*/, res
                            .set('Access-Control-Allow-Origin', '*')
                            .status(400)
                            .json({ error: 'Invalid URL' })];
                }
                if (!(url && isUrlValid)) return [3 /*break*/, 2];
                hostname = new URL(url).hostname;
                output = void 0;
                return [4 /*yield*/, lib_1.getMetadata(url)];
            case 1:
                metadata = _b.sent();
                if (!metadata) {
                    return [2 /*return*/, sendResponse(res, null)];
                }
                _a = metadata, images = _a.images, og = _a.og, meta = _a.meta;
                image = og.image
                    ? og.image
                    : images.length > 0
                        ? images[0].url
                        : SERVER_URL + "/img-placeholder.jpg";
                description = og.description
                    ? og.description
                    : meta.description
                        ? meta.description
                        : null;
                title = (og.title ? og.title : meta.title) || '';
                siteName = og.site_name || '';
                output = {
                    title: title,
                    description: description,
                    image: image,
                    siteName: siteName,
                    hostname: hostname,
                };
                sendResponse(res, output);
                _b.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.log(error_1);
                return [2 /*return*/, res.set('Access-Control-Allow-Origin', '*').status(500).json({
                        error: 'Internal server error. Please open a Github issue or contact me on Twitter @dhaiwat10 if the issue persists.',
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });

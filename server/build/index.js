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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const arnd_samples_1 = __importDefault(require("./routes/arnd_samples"));
const pscs_samples_1 = __importDefault(require("./routes/pscs_samples"));
const qr_1 = __importDefault(require("./routes/qr"));
const deleted_1 = __importDefault(require("./routes/deleted"));
const labels_1 = __importDefault(require("./routes/labels"));
(function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = (_a = process.env.LOCAL_DEV_PORT) !== null && _a !== void 0 ? _a : 5000;
        app.use(body_parser_1.default.json({ limit: '50mb' }));
        app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
        app.use((0, cors_1.default)());
        app.get("/", (req, res) => {
            res.send("Hello World!");
        });
        app.use('/arnd_samples', arnd_samples_1.default);
        app.use('/pscs_samples', pscs_samples_1.default);
        app.use('/qr', qr_1.default);
        app.use('/deleted', deleted_1.default);
        app.use('/labels', labels_1.default);
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        db_1.default.$disconnect();
    });
})();

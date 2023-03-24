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
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middlewares/error");
const db_1 = __importDefault(require("./db/db"));
const user_1 = __importDefault(require("./routes/user"));
const product_1 = __importDefault(require("./routes/product"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5050;
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '100kb' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: false }));
app.get('/', (req, res) => {
    res.send('Welcome');
});
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/product', product_1.default);
app.use(error_1.notFound);
app.use(error_1.errorHandler);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.sync();
        console.log('Connected to DB');
        server.listen(PORT, () => {
            console.log('Server listening on localhost:', PORT);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
void start();

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
const firebase_1 = __importDefault(require("./firebase"));
const app = express_1.default();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(port, () => {
    console.log('Angiovio listening at port 3000');
});
// sign up
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = req.body;
        yield firebase_1.default.auth().createUser(form);
        res.status(200).send('Account created successfully.');
    }
    catch (error) {
        res.status(500).send(`An unexpected error occured, ${error}`);
    }
}));
// update password
app.post('/changepassword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = req.body;
        let uid = '';
        yield firebase_1.default.auth().getUserByEmail(form.email)
            .then((userRecord) => uid = userRecord.uid);
        yield firebase_1.default.auth().updateUser(uid, {
            password: form.password
        });
        res.status(200).send('Account updated successfully.');
    }
    catch (error) {
        res.status(500).send(`An unexpected error occured, ${error}`);
    }
}));
//# sourceMappingURL=App.js.map
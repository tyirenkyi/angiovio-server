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
const uuid_1 = require("uuid");
const firebase_1 = __importDefault(require("./firebase"));
const db_1 = __importDefault(require("./db"));
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
// db.task(async t => {
//   return await t.any("CREATE TABLE drugs(id UUID PRIMARY KEY, userId text NOT NULL, name text NOT NULL, dosage integer NOT NULL, interval integer NOT NULL, missed integer NOT NULL, taken integer NOT NULL, repeats integer NOT NULL, createdOn text NOT NULL, updatedOn text NOT NULL)")
//     .then(data => {
//       console.log("success");
//     })
// })
// sign up
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = req.body;
        yield firebase_1.default.auth().createUser(form);
        res.status(200).send('Account created successfully.');
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, ${error}`);
    }
}));
// update password
app.post('/api/changepassword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).send(`An unexpected error occurred, ${error}`);
    }
}));
// add drug
app.post('/api/adddrug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = req.body;
        db_1.default.task((t) => __awaiter(void 0, void 0, void 0, function* () {
            return yield t.any("INSERT INTO drugs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [uuid_1.v4(), form.user, form.name, form.dosage, form.interval, form.missed, form.taken, form.repeats, new Date().toString(), ''])
                .then(data => {
                console.log('Insert successful');
                res.status(200).send('Insert successful');
            })
                .catch(error => {
                console.log('failed to insert data', error);
                res.status(500).send('An error occurred, failed to insert data');
            });
        }));
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, ${error}`);
    }
}));
// get drugs
app.get('/api/drugs/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        db_1.default.task((t) => __awaiter(void 0, void 0, void 0, function* () {
            return yield t.any("SELECT * FROM drugs WHERE userId = $1", userId)
                .then(data => {
                console.log('READ successful');
                res.status(200).send(JSON.stringify(data));
            })
                .catch(error => {
                console.log('READ failed');
                res.status(500).send(`An error occurred, failed to get data, ${error}`);
            });
        }));
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, ${error}`);
    }
}));
// get drug
app.get('/api/drug/:userId/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name } = req.params;
        db_1.default.task((t) => __awaiter(void 0, void 0, void 0, function* () {
            return yield t.any("SELECT * FROM drugs WHERE userId = $1 AND name = $2", [userId, name])
                .then(data => {
                console.log('READ successful');
                res.status(200).send(JSON.stringify(data));
            })
                .catch(error => {
                console.log('READ failed', error);
                res.status(500).send(`An error occurred, failed to get data, ${error}`);
            });
        }));
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, ${error}`);
    }
}));
// take drug
app.put('/api/takedrug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name } = req.body;
        db_1.default.task((t) => __awaiter(void 0, void 0, void 0, function* () {
            return t.one('SELECT * FROM drugs WHERE userId = $1 AND name = $2', [userId, name])
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                return t.none("UPDATE drugs SET taken = $1 WHERE userId = $2 AND name = $3", [data.taken + 1, userId, name])
                    .then(result => {
                    console.log('UPDATE successful');
                    res.status(200).send('Update successful');
                })
                    .catch(error => {
                    console.log('UPDATE failed', error);
                    res.status(500).send(`An error occurred, failed to get data, ${error}`);
                });
            }));
        }))
            .catch(error => {
            console.log('failed to update drug', error);
        });
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, failed to get data, ${error}`);
    }
}));
// miss drug
app.put('/api/missdrug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name } = req.body;
        db_1.default.task((t) => __awaiter(void 0, void 0, void 0, function* () {
            return t.one('SELECT * FROM drugs WHERE userId = $1 AND name = $2', [userId, name])
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                return t.none("UPDATE drugs SET missed = $1, updatedOn = $2 WHERE userId = $3 AND name = $4", [data.missed + 1, new Date().toString(), userId, name])
                    .then(result => {
                    console.log('UPDATE successful');
                    res.status(200).send('Update successful');
                })
                    .catch(error => {
                    console.log('UPDATE failed', error);
                    res.status(500).send(`An error occurred, failed to update data, ${error}`);
                });
            }));
        }))
            .catch(error => {
            console.log('failed to update drug', error);
        });
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, failed to get data, ${error}`);
    }
}));
// delete drug
app.delete('/api/drug/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name } = req.body;
        db_1.default.task((t) => __awaiter(void 0, void 0, void 0, function* () {
            return t.none('DELETE FROM drugs WHERE userId = $1 AND name = $2', [userId, name])
                .then(data => {
                console.log('DELETE successful');
                res.status(200).send('DELETE successful');
            })
                .catch(error => {
                console.log('DELETE failed', error);
                res.status(500).send(`An error occurred, failed to delete data, ${error}`);
            });
        }));
    }
    catch (error) {
        res.status(500).send(`An unexpected error occurred, failed to delete data, ${error}`);
    }
}));
//# sourceMappingURL=App.js.map
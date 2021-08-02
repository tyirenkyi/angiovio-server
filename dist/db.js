"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = pg_promise_1.default();
const cn = {
    user: 'db',
    password: 'uyic0zaoa34tnce7',
    database: 'db',
    host: 'app-eb1fc847-ebd6-493d-8007-1cc02fc437c9-do-user-9387719-0.b.db.ondigitalocean.com',
    port: 25060,
    ssl: {
        rejectUnauthorized: false
    }
};
const db = pgp(cn);
db.connect()
    .then(obj => {
    console.log("Connection to database is established");
})
    .catch(err => {
    console.log("Database connection attempt failed: ", err);
});
exports.default = db;
//# sourceMappingURL=db.js.map
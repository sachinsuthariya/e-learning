"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEmailemailExistConstraint = exports.IsEmailAlreadyExistConstraint = exports.IsPasswordMatchesRequirementsConstraint = void 0;
const class_validator_1 = require("class-validator");
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
let IsPasswordMatchesRequirementsConstraint = class IsPasswordMatchesRequirementsConstraint {
    validate(password, args) {
        /* ==*password validator regex*==
         should have one uppercase,
         one lowercase,
         min length should be 6,
         max length should be 30
         no white space allowed*/
        const regex = new RegExp("^(?!.* )(?=.*?[A-Z])(?=.*?[a-z]).{6,30}$");
        return regex.test(password);
    }
};
IsPasswordMatchesRequirementsConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: false })
], IsPasswordMatchesRequirementsConstraint);
exports.IsPasswordMatchesRequirementsConstraint = IsPasswordMatchesRequirementsConstraint;
let IsEmailAlreadyExistConstraint = class IsEmailAlreadyExistConstraint {
    validate(email, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield My.first(tables_1.Tables.USER, ["id"], "email = ?", [email]);
            return user ? false : true;
        });
    }
};
IsEmailAlreadyExistConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsEmailAlreadyExistConstraint);
exports.IsEmailAlreadyExistConstraint = IsEmailAlreadyExistConstraint;
let IsEmailemailExistConstraint = class IsEmailemailExistConstraint {
    validate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield My.first(tables_1.Tables.USER, ["id"], "email = ?", [email]);
            return user ? true : false;
        });
    }
};
IsEmailemailExistConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsEmailemailExistConstraint);
exports.IsEmailemailExistConstraint = IsEmailemailExistConstraint;
//# sourceMappingURL=authValidators.js.map
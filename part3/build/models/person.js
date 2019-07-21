"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
exports.findPerson = (id) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const person = (yield Person.findById(id));
    return person ? person.toJSON() : null;
});
exports.getAllPeople = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return (yield Person.find({})).map(p => p.toJSON());
});
const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
    },
});
PersonSchema.plugin(uniqueValidator);
const Person = mongoose.model('Person', PersonSchema);
exports.default = Person;

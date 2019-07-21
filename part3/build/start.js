"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const person_1 = require("./models/person");
const PORT = process.env.PORT || 3001;
const app = express();
const URL = process.env.MONGO_URL;
const initMongo = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        yield mongoose.connect(URL, { useNewUrlParser: true, useFindAndModify: false });
        console.log('Connected to mongo');
    }
    catch (e) {
        console.log(e);
        console.log('Failed to connect to mongo');
    }
});
const errorHandler = (error, request, response, next) => {
    console.log(error, Object.keys(error.name), error.kind, error.value);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'Invalid id' });
    }
    if (error.error === 'user-not-found') {
        return response.status(400).send({ error: 'User not found with id' });
    }
    if (error.name === 'required-fields') {
        return response.status(400).send({ error: 'Missing required fields' });
    }
    if (error.name === 'ValidationError' && error.errors && error.errors.kind === 'unique') {
        return response.status(400).send({ error: error.errors.message });
    }
    if (error.name === 'ValidationError' && error.errors && error.errors.kind === 'minlength') {
        return response.status(400).send({ error: error.errors.message });
    }
    next(error);
};
initMongo();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
    ].join(' ');
}));
app.get('/api/persons', (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const all = yield person_1.getAllPeople();
    res.json(all);
}));
app.get('/info', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    res.send(`<div>
                <p>Phonebook has info for ${(yield person_1.getAllPeople()).length} people
                <p>${(new Date()).toUTCString()}</p>
            </div>`);
}));
app.get('/api/persons/:byId', ({ params: { byId } }, res, next) => {
    person_1.findPerson(byId).then(p => res.json(p)).catch((e) => next(e));
});
app.delete('/api/persons/:byId', ({ params: { byId } }, res, next) => {
    person_1.default.findByIdAndRemove(byId).then((resp) => res.json(resp)).catch(e => next(e));
});
app.post('/api/persons', ({ body: { name, number } }, res, next) => {
    if (!name || !number) {
        return next({ name: 'required-fields' });
    }
    else {
        const person = new person_1.default({
            name,
            number,
        });
        person.save().then(resp => res.status(201).json(resp.toJSON()))
            .catch(e => next(e));
    }
});
app.put('/api/persons/:id', ({ params: { id }, body: { name, number } }, res, next) => {
    if (!name || !number) {
        return next({ name: 'required-fields' });
    }
    person_1.default.findByIdAndUpdate(id, { name, number }).then((update) => {
        if (!update) {
            return next({ error: 'user-not-found' });
        }
        res.json(update);
    }).catch((e) => next(e));
});
app.listen(PORT);
app.use(errorHandler);

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const application = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Todo = require('./models/todos');
application.use('/static', express.static('static'));
application.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/TodosApplication')

application.get('/', function (request, response) {
    response.sendFile(__dirname + "/static/index.html");
})

application.get('/api/todos/', async function(request, response){
    var todos = await Todo.find().sort('order');
    response.json(todos);
})
application.post('/api/todos/', async function(request, response) {
    var new_todo = new Todo({
        title: request.body.title,
        order: request.body.order,
        completed: request.body.completed
    })
    await new_todo.save();
})
application.get('/api/todos/:id', async function(request, response){
    var id = request.params.id;
    var todo = await Todo.find({_id: id})

    if (!todo) {
        response.status(404);
        return response.end()
    }
    response.json(todo);
})
application.put('/api/todos/:id', async function(request, response){
    var id = request.params.id;
    await Todo.findOneAndUpdate(
        { _id: id},
        {$set: {
            title: request.body.title,
            order: request.body.order,
            completed: request.body.completed
        }});
        var todos = await Todo.find();
        response.json(todos);
})
application.delete('/api/todos/:id', async function(request, response){
    var id = request.params.id;
    await Todo.findOneAndRemove({_id: id});
    var todos = await Todo.find();
    response.json(todos);
})
application.listen(3000);

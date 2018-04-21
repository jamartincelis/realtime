var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql      = require('mysql');

app.get('/hello', function(req, res) {
    res.send('Hello World!');
});


http.listen(8000, function() {
    console.log('Listening on *:8000');
});




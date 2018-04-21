var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var os = require('os');
//var Influx = require('influx');
var mysql      = require('mysql');


/*const influx = new Influx.InfluxDB({
  database: 'tick_data',
  host: '159.65.38.181',
  port: 8086,
  username: 'root',
  password: 'rsihunter999!'
});*/

/*var connection = mysql.createConnection({
  host     : '138.197.103.171',
  user     : 'root',
  password : 'rjvelam25@',
  database : 'cryptocoinconnection'
});*/

/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cryptocoinconnection'
})¨*/

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cryptocoinconnection'
});

app.use(express.static(__dirname + '/Live Coin Watch_ Cryptocurrency Prices & Market Cap List_files'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/cryptocoinconnection', function(req, res) {
    res.sendFile(__dirname + '/Live Coin Watch_ Cryptocurrency Prices & Market Cap List.html');
});

app.get('/hello', function(req, res) {
    res.send('Hello World!');
});

/*app.get('/times', function (req, res) {
  influx.query(`
 	select last("price") from "binance" group by "symbol", time(5m) limit 1
  `).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err.stack)
  })
});*/

app.get('/prices', function (req, res) {

  pool.getConnection(function (err, connection) {
      if (err) {
          console(err);
          connection.release();
          return;
      }
      connection.query("SELECT AVG(price) AS price, symbol FROM `coins_prices` GROUP BY symbol", function (err, rows) {
          connection.release();

          if (!err) {
              res.send(rows);

          } else {
              console.log(err);
          }
      });
      connection.on('error', function (err) {
          
          connection.release();

          console.log(err);
          return;
      });
  });




});

function getPrices() {
  pool.getConnection(function (err, connection) {
      if (err) {
          console(err);
          connection.release();
          return;
      }
      connection.query("SELECT AVG(price) AS price, symbol FROM `coins_prices` GROUP BY symbol", function (err, rows) {
          connection.release();

          if (!err) {
              var items = [], coins_prices = {};

              /*for (var i = 0; i < rows.length; i++) {
                  items.push(rows[i]);
              }*/

              for (var k in rows) {
                coins_prices[rows[k].symbol] = rows[k].price;
              }  

              io.emit('coins prices update', coins_prices);
          } else {
              console.log(err);
          }
      });
      connection.on('error', function (err) {
          
          connection.release();

          console.log(err);
          return;
      });
  });
}



io.on('connection', function(socket) {
    console.log('A new WebSocket connection has been established');
});

/*setInterval(function() {
  var btc = Math.floor(Math.random() * 1000);
  var eth = Math.floor(Math.random() * 1000);
  var xrp = Math.floor(Math.random() * 1000);
  var btccash = Math.floor(Math.random() * 1000);
  var eos = Math.floor(Math.random() * 1000);

  io.emit('stock price update', btc,eth,xrp,btccash,eos);
}, 2000);*/

setInterval(getPrices, 3000);

http.listen(8000, function() {
    console.log('Listening on *:8000');
});




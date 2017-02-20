var mbaasApi = require('fh-mbaas-api');
var events = require("events");
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var Logger = require('fh-logger-helper');
var xmppremote = require('./lib/xmpp.js');

// client.on('stanza', function (stanza) {
//   if (stanza.is('message') &&
//     // Important: never reply to errors!
//     (stanza.attrs.type !== 'error')) {
//     // Swap addresses...
//     stanza.attrs.to = stanza.attrs.from
//     console.log("HTIS", stanza.attrs.to);
//     delete stanza.attrs.from
//     // and send back
//     console.log('Sending response: ' + stanza.root().toString())
//     client.send(stanza)
//   }
// });

// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/hello'];

var app = express();
var server = require('http').createServer(app); 
var io = require('socket.io')(server);


io.on('connection', function(socket) {
  console.log("We have a socket connection from somewhere");

});

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/hello', require('./lib/hello.js')());
// app.use('/xmpp', require('./lib/xmpp.js')());


// Logger.log('info', 'hullo',xmppremote)
app.use('/talk', function(req, res) {
    xmppremote.sendmessage("hello there");

    res.send('this is a test you know');

});

xmppremote.on('connect', function(){
  Logger.log('error', "We Have Connected");
})

xmppremote.on('message', function(data){
  Logger.log('warn', "We Have Data!",data);
  io.emit('xmppmessage', data);
})





console.log("We have a socket connection from somewhere");
// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
server.listen(port, host, function() {
    //remove for prod, and use Environment Variable DEBUG_LEVEL to set.
    Logger.setLoggerLevel('silly');
    Logger.log("info", "App started at:", new Date(), "on port:", port);
});

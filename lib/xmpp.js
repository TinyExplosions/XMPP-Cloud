var Client = require('node-xmpp-client');
var events = require("events");
var util = require("util");
var XML = require('pixl-xml');
var Logger = require('fh-logger-helper');


function XMPPLayer() {
    events.EventEmitter.call(this);
    Logger.info("set up XMPP Connection");
    this.XMPPClient = new Client({
        jid: process.env.JABBER_ID,
        password: process.env.JABBER_PASSWORD,
        host: process.env.JABBER_HOST,
        reconnect: true
    });

    this.XMPPClient.on('connect', function() {
        Logger.log('silly', 'Client is connected');
        this.emit('connect', 'XMPP Connection Successful');
    }.bind(this));

    this.XMPPClient.on('error', function(e) {
        Logger.log('error', e);
    }.bind(this));

    this.XMPPClient.on('online', function() {
        Logger.log('silly', 'online')
        this.XMPPClient.send(new Client.Stanza('presence', {})
            .c('show').t('chat').up()
            .c('status').t('Nodebot running on RHMAP')
        );
    }.bind(this));

    this.XMPPClient.on('stanza', function(stanza) {
        if (stanza.is('message') &&
            // Important: never reply to errors!
            (stanza.attrs.type !== 'error')) {
            // // Swap addresses...
            // stanza.attrs.to = stanza.attrs.from

            // delete stanza.attrs.from
            // and send back

            var data = XML.parse(stanza.root().toString());
            var message = JSON.stringify(data.body);
            // console.log(JSON.stringify(data));
            if (message) {
                Logger.log("info", "Sending Message")
                this.emit('message', {
                    from: stanza.attrs.from,
                    message: message
                });
            }
             else {
                Logger.log('silly', 'No body to send ;(', data);
            }
        }
    }.bind(this));
}

util.inherits(XMPPLayer, events.EventEmitter);

XMPPLayer.prototype.sendmessage = function sendmessage(message) {
    var stanza = new Client.Stanza('message', { to: 'tinyexplosions@jabber.at', type: 'chat' })
        .c('body')
        .t(message);
    Logger.log('silly', 'Sending Message');
    this.XMPPClient.send(stanza);
}

module.exports = new XMPPLayer();

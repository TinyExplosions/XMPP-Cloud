# FeedHenry Hello World MBaaS Server

This is a simple FeedHenry MBaaS. Use it as a starting point for building your APIs. 

You need to create and set the following Environment Variable within RHMAP:

* process.env.JABBER_ID
* process.env.JABBER_PASSWORD
* process.env.JABBER_HOST

To a known Jabber/XMPP account details, and from there, the app will broadcast on a socket
any messages it receives to that user.

# Group Hello World API

# hello [/hello]

'Hello world' endpoint.

## hello [POST] 

'Hello world' endpoint.

+ Request (application/json)
    + Body
            {
              "hello": "world"
            }

+ Response 200 (application/json)
    + Body
            {
              "msg": "Hello world"
            }

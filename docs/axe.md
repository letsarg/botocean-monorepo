# Axe

# Axe Bundle
Each Axe bundle is assigned with an address when deployed.
When a user runs the bundle:
- user creates key for that bundle
- a AXE node is chosen for running that bundle
- user send encrypted key to AXE node using it's public key
- AXE node runs bundle with this key

Cross-messaging between bundles (target bundle must be `AxeBundleInteractive`):
- Bundle A sends calls to Bundle B via Botocean Network
- Bundle B (possibly performs validations ie. whitelisted address and its signature to call) executes incoming messages.

Async message bundle:
- User sends a call `{calldata, src: pubkey, fee }` to MessageBusBundle
- Bundle processes call then send the response `{ dest: pubkey, respdata_encrypted }` to MessageBusBundle
- MessageBusBundle sent messages back to the user

Bundle has ability to be exposed to the internet, the host machine must open its ports.
Via the spec of bundle.json, it provides interface for communicating with the ports.
```javascript
// bundle.json
host: {
  nodeId: "node#1",
  publicHost: "1.2.3.4",
},
expose: [
  {
    port: '9669',
    protocols: ["udp"],
    description: "bundle allows botocean messaging protocol, by exposing this port, it allows others to send messages to this bundle",
  },
  {
    port: "5432",
    protocols: ["tcp", "udp"],
    description: "postgres port"
  }
]
```
This bundle available publicly and register its `bundle.json` under Hub's registry.

# Messaging in Botocean Network
Message flow:
- End users > MessageBusBundle (endpoint) > Hub > SomeBundle
- SomeBundle > Hub > MessageBusBundle > End users

Hub is single point of failure. Elimates it we have:
- SomeBundle > MessageBusBundle (using endpoint)
- End users > MessageBusBundle (using endpoint)
- Hub <> MessageBusBundle

## Builtin-bundles
### MessageBusBundle
This is a bundle supports sending and receiving messages.
- `msgbus.botocean.network`:
  - users subscribes to this endpoint and authenticate themselve to receive incoming messages.
  - a user must whitelist which bundle can send message to them

## Bundles discovery

# domain-check-tool

## Sumary
For monitor a list of hosts using HTTP, ICMP and PORT check.

## Credits
Without those libs this project won't work!

[PING](https://www.npmjs.com/package/ping) | [CLI-TABLE](https://www.npmjs.com/package/cli-table) | [IS-PORT-REACHABLE](https://www.npmjs.com/package/is-port-reachable) | [AXIOS](https://www.npmjs.com/package/axios) | [LODASH](https://www.npmjs.com/package/lodash)

## Examples

```javascript
import { checkHosts, IHost, RequestType } from './index';

const hosts: IHost[] = [
    {
        host: 'https://google.com',
        identifier: 'HTTPS',
    },
    {
        host: 'http://google.com',
        identifier: 'HTTP',
    },
    {
        host: 'www.google.com',
        identifier: 'WWW',
    },
    {
        host: 'https://www.google.com',
        identifier: 'HTTPS + WWW',
    },
    {
        host: 'http://www.google.com',
        identifier: 'HTTP + WWW',
    },
    {
        host: 'https://google.com',
        identifier: 'HEADER',
        httpRequestType: RequestType.GET,
        header: { user: 'user' },
    },
    {
        host: 'https://google.com',
        identifier: 'BODY. ALSO THIS ONE WILL RETURN BAD REQUEST',
        httpRequestType: RequestType.GET,
        body: { test: 'test' },
    },
    {
        host: 'google.com',
        identifier: 'HOST',
        bypassHttp: true,
    },
    {
        host: 'https://google.com',
        identifier: 'PORT',
        port: 80,
        bypassHttp: true,
    },
    {
        host: 'google.com',
        identifier: 'INVALID URL',
        httpRequestType: RequestType.GET,
        port: 80,
        header: null,
        body: null,
        bypassHttp: false,
        bypassPing: false,
        bypassPort: false
    },
    {
        host: 'https://unknowmhostfortest.com',
        identifier: 'UNKNOW HOST',
        httpRequestType: RequestType.GET,
        port: 80,
        header: null,
        body: null,
        bypassHttp: false,
        bypassPing: false,
        bypassPort: false
    },
    {
        host: 'https://google.com',
        identifier: 'COMPLETE',
        httpRequestType: RequestType.GET,
        port: 80,
        header: null,
        body: null,
        bypassHttp: false,
        bypassPing: false,
        bypassPort: false
    },
]

checkHosts(hosts, true).then(response => console.log(response));
```
### Table printed

```bash
┌────────┬─────────────────────────────────────────────┬────────────────────────────────┬─────────────┬─────────┬────────┬───────┐
│ STATUS │ NAME                                        │ HOST                           │    HTTP     │  PORT   │  PING  │ LOSS% │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✖    │ UNKNOW HOST                                 │ https://unknowmhostfortest.com │  ENOTFOUND  │  ERROR  │ ERROR  │ ERROR │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✖    │ WWW                                         │ www.google.com                 │   INVALID   │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ HOST                                        │ google.com                     │   SKIPPED   │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ PORT                                        │ https://google.com             │   SKIPPED   │ PASSED  │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✖    │ INVALID URL                                 │ google.com                     │   INVALID   │ PASSED  │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ HTTP + WWW                                  │ http://www.google.com          │     OK      │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✖    │ BODY. ALSO THIS ONE WILL RETURN BAD REQUEST │ https://google.com             │ BAD REQUEST │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ HTTPS + WWW                                 │ https://www.google.com         │     OK      │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ HTTP                                        │ http://google.com              │     OK      │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ HTTPS                                       │ https://google.com             │     OK      │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ HEADER                                      │ https://google.com             │     OK      │ SKIPPED │ PASSED │ 0.000 │
├────────┼─────────────────────────────────────────────┼────────────────────────────────┼─────────────┼─────────┼────────┼───────┤
│   ✔    │ COMPLETE                                    │ https://google.com             │     OK      │ PASSED  │ PASSED │ 0.000 │
└────────┴─────────────────────────────────────────────┴────────────────────────────────┴─────────────┴─────────┴────────┴───────┘

```

### Object returned

```javascript
[
  {
    isAlive: false,
    hostIdentifier: 'UNKNOW HOST',
    host: 'https://unknowmhostfortest.com',
    http: 'ENOTFOUND',
    ping: 'ERROR',
    port: 'ERROR',
    packetLoss: 'ERROR'
  },
  {
    isAlive: false,
    hostIdentifier: 'WWW',
    host: 'www.google.com',
    http: 'INVALID',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'HOST',
    host: 'google.com',
    http: 'SKIPPED',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'PORT',
    host: 'https://google.com',
    http: 'SKIPPED',
    ping: 'PASSED',
    port: 'PASSED',
    packetLoss: '0.000'
  },
  {
    isAlive: false,
    hostIdentifier: 'INVALID URL',
    host: 'google.com',
    http: 'INVALID',
    ping: 'PASSED',
    port: 'PASSED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'HTTP + WWW',
    host: 'http://www.google.com',
    http: 'OK',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: false,
    hostIdentifier: 'BODY. ALSO THIS ONE WILL RETURN BAD REQUEST',
    host: 'https://google.com',
    http: 'BAD REQUEST',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'HTTPS + WWW',
    host: 'https://www.google.com',
    http: 'OK',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'HTTP',
    host: 'http://google.com',
    http: 'OK',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'HTTPS',
    host: 'https://google.com',
    http: 'OK',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'HEADER',
    host: 'https://google.com',
    http: 'OK',
    ping: 'PASSED',
    port: 'SKIPPED',
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostIdentifier: 'COMPLETE',
    host: 'https://google.com',
    http: 'OK',
    ping: 'PASSED',
    port: 'PASSED',
    packetLoss: '0.000'
  }
]
```

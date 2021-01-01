# domain-check-tool

## Sumary
For monitor a list of hosts using HTTP requests and ICMP.

## Credits
Without those libs this project won't work!

[PING](https://www.npmjs.com/package/ping) | [CLI-TABLE](https://www.npmjs.com/package/cli-table) | [IS-PORT-REACHABLE](https://www.npmjs.com/package/is-port-reachable) | [AXIOS](https://www.npmjs.com/package/axios)
## Examples

### Simple return

```javascript
import { checkHosts, IHost, RequestType } from 'domain-check-tool';

const host: IHost[] = [
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 21,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    }
]

checkHosts(host, false).then(response => console.log(response));
```

```javascript
[
  {
    isAlive: false,
    hostName: 'Google',
    host: 'https://google.com',
    http: 400,
    ping: true,
    port: true,
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    hostName: 'Google',
    host: 'https://google.com',
    http: 200,
    ping: true,
    port: true,
    packetLoss: '0.000'
  },
  {
    isAlive: false,
    hostName: 'Google',
    host: 'https://google.com',
    http: 400,
    ping: true,
    port: false,
    packetLoss: '0.000'
  }
]
```

### Show table

```javascript
import { checkHosts, IHost, RequestType } from 'domain-check-tool';

const host: IHost[] = [
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 21,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    }
]

checkHosts(host, true).then(response => console.log(response));
```

```bash
┌────────┬────────┬────────────────────┬──────┬──────┬──────┬───────┐
│ STATUS │ NAME   │ HOST               │ HTTP │ PORT │ PING │ LOSS% │
├────────┼────────┼────────────────────┼──────┼──────┼──────┼───────┤
│   ✔    │ Google │ https://google.com │ 200  │  ✔   │  ✔   │ 0.000 │
├────────┼────────┼────────────────────┼──────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │ 400  │  ✔   │  ✔   │ 0.000 │
├────────┼────────┼────────────────────┼──────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │ 400  │  ✖   │  ✔   │ 0.000 │
└────────┴────────┴────────────────────┴──────┴──────┴──────┴───────┘
```

### Show only errors in table

```javascript
import { checkHosts, IHost, RequestType } from 'domain-check-tool';

const host: IHost[] = [
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 21,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    }
]

checkHosts(host, true, true).then(response => console.log(response));
```

```bash
┌────────┬────────┬────────────────────┬──────┬──────┬──────┬───────┐
│ STATUS │ NAME   │ HOST               │ HTTP │ PORT │ PING │ LOSS% │
├────────┼────────┼────────────────────┼──────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │ 400  │  ✔   │  ✔   │ 0.000 │
├────────┼────────┼────────────────────┼──────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │ 400  │  ✖   │  ✔   │ 0.000 │
└────────┴────────┴────────────────────┴──────┴──────┴──────┴───────┘
```

### Skip process

```javascript
const host: IHost[] = [
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 21,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 21,
        httpRequestType: RequestType.GET,
        bypassHttp: true,
        bypassPing: false,
        bypassPort: false,
    }
]

checkHosts(host, true);
```

```bash
┌────────┬────────┬────────────────────┬────────┬──────┬──────┬───────┐
│ STATUS │ NAME   │ HOST               │  HTTP  │ PORT │ PING │ LOSS% │
├────────┼────────┼────────────────────┼────────┼──────┼──────┼───────┤
│   ✔    │ Google │ https://google.com │  200   │  ✔   │  ✔   │ 0.000 │
├────────┼────────┼────────────────────┼────────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │  400   │  ✔   │  ✔   │ 0.000 │
├────────┼────────┼────────────────────┼────────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │ SKIPED │  ✖   │  ✔   │ 0.000 │
├────────┼────────┼────────────────────┼────────┼──────┼──────┼───────┤
│   ✖    │ Google │ https://google.com │  400   │  ✖   │  ✔   │ 0.000 │
└────────┴────────┴────────────────────┴────────┴──────┴──────┴───────┘
```
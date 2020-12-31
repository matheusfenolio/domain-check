# domain-check-tool

## Sumary
For monitor a list of hosts using HTTP requests and ICMP.

## Credits
Without those libs this project won't work!

[PING](https://www.npmjs.com/package/ping)
[AXIOS](https://www.npmjs.com/package/axios)
## Examples

### Simple return

```javascript
import { checkHosts } from 'domain-check-tool';

checkHosts(['https://google.com', 'google.com']).then(response => { console.log(response) });
```

```javascript
[
  {
    isAlive: true,
    host: 'google.com',
    http: 'NOT VALID',
    ping: true,
    packetLoss: '0.000'
  },
  {
    isAlive: true,
    host: 'https://google.com',
    http: '200',
    ping: true,
    packetLoss: '0.000'
  }
]
```

### Show table

```javascript
import { checkHosts } from 'domain-check-tool';

checkHosts(['https://google.com', 'google.com', 'forExeple.com'], true);
```

```bash
┌────────┬────────────────────┬───────────┬───────┬─────────┐
│ STATUS │ HOST               │   HTTP    │ PING  │  LOSS%  │
├────────┼────────────────────┼───────────┼───────┼─────────┤
│   ✔    │ google.com         │ NOT VALID │ true  │  0.000  │
├────────┼────────────────────┼───────────┼───────┼─────────┤
│   ✔    │ https://google.com │    200    │ true  │  0.000  │
├────────┼────────────────────┼───────────┼───────┼─────────┤
│   ✖    │ forExemple.com      │ NOT VALID │ false │ unknown │
└────────┴────────────────────┴───────────┴───────┴─────────┘
```

### Show only errors in table

```javascript
import { checkHosts } from 'domain-check-tool';

checkHosts(['htt://forExemple.com', 'google.com'], true, true);
```

```bash
┌────────┬──────────────────────┬───────────┬───────┬─────────┐
│ STATUS │ HOST                 │   HTTP    │ PING  │  LOSS%  │
├────────┼──────────────────────┼───────────┼───────┼─────────┤
│   ✖    │ htt://forExemple.com │ NOT VALID │ false │ unknown │
└────────┴──────────────────────┴───────────┴───────┴─────────┘
```
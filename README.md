# domain-check-tool

## Sumary
For monitor a list of hosts using HTTP requests and ICMP.

## Credits
Withou those libs this project won't work!

[PING](https://www.npmjs.com/package/ping)
[AXIOS](https://www.npmjs.com/package/axios)
## Examples

### Simple return

```
import { checkHosts } from 'domain-check-tool';

checkHosts(['https://google.com', 'google.com']).then(response => { console.log(response) });
```

```
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

```
import { checkHosts } from 'domain-check-tool';

checkHosts(['https://google.com', 'google.com', 'forExeple.com'], true);
```

```
┌────────┬────────────────────┬───────────┬───────┬─────────┐
│ STATUS │ HOST               │   HTTP    │ PING  │  LOSS%  │
├────────┼────────────────────┼───────────┼───────┼─────────┤
│   ✔    │ google.com         │ NOT VALID │ true  │  0.000  │
├────────┼────────────────────┼───────────┼───────┼─────────┤
│   ✔    │ https://google.com │    200    │ true  │  0.000  │
├────────┼────────────────────┼───────────┼───────┼─────────┤
│   ✖    │ forExeple.com      │ NOT VALID │ false │ unknown │
└────────┴────────────────────┴───────────┴───────┴─────────┘
```

### Show only errors in table

```
import { checkHosts } from 'domain-check-tool';

checkHosts(['htt://forExemple.com', 'google.com'], true, true);
```

```
┌────────┬──────────────────────┬───────────┬───────┬─────────┐
│ STATUS │ HOST                 │   HTTP    │ PING  │  LOSS%  │
├────────┼──────────────────────┼───────────┼───────┼─────────┤
│   ✖    │ htt://forExemple.com │ NOT VALID │ false │ unknown │
└────────┴──────────────────────┴───────────┴───────┴─────────┘
```
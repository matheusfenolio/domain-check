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
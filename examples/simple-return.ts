import { checkHosts } from 'domain-check-tool';

checkHosts(['https://google.com', 'google.com']).then(response => { console.log(response) });
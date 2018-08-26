// Dependências
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Handlers
let handlers = {};

// Default handle, used if the requested handle does not exists.
handlers.notFound = (data, callback) => {
    callback(404, {'message' : 'Sorry, your endpoint could not be found'});
};

// Welcome handler, sends back a welcoming message.
handlers.welcome = (data, callback) => {
    messages = [
        'Hello and welcome to Hello API.',
        'Olá e seja bem vindo a API Hello.',
        'Hola y bienvenido a la API Hello.',
        'Hallo und willkommen bei Hallo API.',
        'Ciao e benvenuto in Hello API.',
        'Bonjour et bienvenue sur Hello API.',
        'Приветствуем и приветствуем Hello API.',
        '您好，歡迎來到Hello API。',
        'こんにちは、Hello APIへようこそ。',
        '안녕하세요, 안녕하세요. 안녕하세요.',
        'Dia duit agus fáilte a chur roimh Hello API.'
    ];
    let sortNumber = Math.round(Math.random() * (messages.length - 1));
    message = messages[sortNumber];
    callback(200, {'message' : message});
};

// A object with the handles for the post routes.
const postRouter = {
    'hello' : handlers.welcome
};

// A object with the handles for the get routes.
const getRouter = {

};

// A object with the routes.
const router = {
    'POST' : postRouter,
    'GET' : getRouter
};

// The server.
let server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname.replace(/^\/|\/$/g,'');
    let method = req.method.toUpperCase();
    let decoder = new StringDecoder('utf-8');

    let payload = '';
    req.on('data', (data) => {
        payload += decoder.write(data);
    });

    req.on('end', (data) => {
        let handler = typeof(router[method][path]) === 'function' ? router[method][path] : handlers.notFound;

        handler(data, (statusCode, responsePayload) => {
            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(responsePayload));
        });

        console.log('[LOG] '+method+' Request on https://localhost:3000/' + path);
        console.log('[LOG] Payload: ', (payload));
    });
});

// Start the server on 3000 port.
server.listen(3000, () => {
    console.log('[LOG] Server listening on 3000 port.');
});
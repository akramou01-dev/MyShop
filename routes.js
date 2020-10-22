const fileSys = require('fs');

const requestHandler = (req, res) => {
        const url = req.url;
        const method = req.method;
        let message1 = '';

        if (url === '/') {
            res.write('<html>');
            res.write('<head> <title> first Page </title> </head> ');
            res.write('<body><form  action = "/test" method="POST" ><input type ="text" name="test"><button type="submit"> Send </button></input></form>  </body>');
            res.write('</html>');
            return res.end();
        }
        if (url === '/test' && method === 'POST') {
            const body = [];
            req.on('data', (chunk) => {
                console.log(chunk);
                body.push(chunk);
            });
            return req.on('end', () => { // on fait un return pour que la fonction "req.on(...)"  soit executer avant le block d'instruction qui nous réoriente a une autre page 
                const parsedBody = Buffer.concat(body).toString(); // on a fait "toString()" psk on c qu'on va recevoir du texte 
                const message = parsedBody.split('=')[1];
                console.log(message);
                message1 = message.toString();
                console.log(message1);
                fileSys.writeFile('files.txt', message, err => {
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    return res.end();
                });

            });

        }
        console.log(message1); // ce block d'instruction peut s'executer avant ke req.on(..) car c asynchronne 
        res.setHeader('Content-Type', 'text.html');
        res.write('<html>');
        res.write('<head> <title> first Page </title> </head> ');
        res.write(`<body> <h1> Hey </h1> </body>`);
        res.write('</html>');
        res.end();


    }
    // 1ere methode 
module.exports = requestHandler;
//2eme methode  
// exports.hand = requestHandler; // c un shortcut pour module.export 
// module.exports.handler = requestHandler;


//3eme methode      
//on peut aussi exporter toute un objet et travailler avec les Props: 
// module.exports = {
//     prop1: 'test1',
//     prop2: 'test2'
// }

// exports.text = 'some texte writen ';
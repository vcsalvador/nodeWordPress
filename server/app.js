var express = require('express'),
	cors = require('cors'),
	http = require('http'),
    fs = require('fs'),
    _ = require('underscore'),
    //documentação para usarmos o mysql está neste link https://github.com/felixge/node-mysql
    mysql = require('mysql'),
    jwt = require('jsonwebtoken'),
    app = express();

var port = process.env.PORT || 8080;

var corsOptions = {
	origin: 'http://localhost:8080'
}

// configurando a conexao com o banco MYSQL
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'teste-123',
	database : 'nodewp-alpha'
});

// as rotas serão definidas como serviços para atender solicitações de banco do client
app.get('/login', function (req, res) {
	//connection.connect();


	console.log(req.params);

//	var query = connection.query('INSERT INTO teste SET ?', teste, function(err, rows){
//		if(err) {
//			//logging erro :'(
//			console.error('error connecting:' + err.stack);
//			return
//		}
//	});
//	console.log(query.sql);

	//após toda solicitação de banco deve ser fechada a conexao por medida de segurança
//	connection.end();
});

//definindo rota
app.get('/jogador/:numero_identificador',cors(corsOptions), function (req,res) {
	res.render('jogador', { 
		jogador : _.find(db.jogador.players, function (el) {
			return el.steamid === req.params.numero_identificador;
		}),
		jogosDesteJogador : _.find(db.jogosPorJogador, function (el) {
			return el.stemaid === req.params.numero_identificador;
		})
	}, function (err, hbs) {
		res.send(hbs);
	});
});

app.use(express.static('./client'));

//abrindo server
http.createServer(app).listen(port);
//logging tudo pra ver se ta funfando... :)
console.log("App is running in port " + port);
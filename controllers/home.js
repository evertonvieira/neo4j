const neo4j = require('neo4j-driver').v1;
let uri = "bolt://localhost:7687"
let user  = "admin"
let password = "admin"
module.exports = function(app){

	const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
	const session = driver.session();

	var HomeController = {
		index: function(req, res){
			filmes = []

			var titulo = 'Página Principal'
			
			session
			.run('MATCH (n) RETURN n')
			.then(function(result){
				result.records.forEach(function(record){
					console.log(record)
					filmes.push({
						id: record._fields[0].identity.low,
						nome: record._fields[0].properties.nome,
						ano: record._fields[0].properties.ano,
						duracao: record._fields[0].properties.duracao,
						classificacao: record._fields[0].properties.classificacao,
						genero: record._fields[0].properties.genero
					})
				});

				res.render('home/index',{
					titulo: titulo,
					filmes: filmes
				});
			})
			
			.catch(function(err){
				console.log(err);
			});


			
			
			
		}

	}

	return HomeController;
}
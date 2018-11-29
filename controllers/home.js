const neo4j = require('neo4j-driver').v1;

module.exports = function(app){
	
	const driver = neo4j.driver(
        process.env.NEO4J_HOST, 
        neo4j.auth.basic(
            process.env.NEO4J_USERNAME, 
            process.env.NEO4J_PASSWORD
        )
    );
	const session = driver.session();

	var HomeController = {
		index: function(req, res){

			let filmes = []
			let diretores = []
			let titulo = 'Página Principal'
			
			session
				.run('MATCH (n:Filmes) RETURN n')
				.then(function(result){
					result.records.forEach(function(record){
						filmes.push({
							id: record._fields[0].identity.low,
							nome: record._fields[0].properties.nome,
							ano: record._fields[0].properties.ano,
							duracao: record._fields[0].properties.duracao,
							classificacao: record._fields[0].properties.classificacao,
							genero: record._fields[0].properties.genero
						})
					});

				session
					.run('MATCH (d:Diretores) RETURN d')
					.then(function(array){
						array.records.forEach(function(record){

							diretores.push({
								id: record._fields[0].identity.low,
								nome: record._fields[0].properties.nome,
							})
						});
						res.render('home/index',{
							titulo: titulo,
							filmes: filmes,
							diretores: diretores
						});
						
					})
					.catch(function(err){
						console.log(err);
					});

				
			})
			.catch(function(err){
				console.log(err);
			});
			
			


			
			
			
		}

	}

	return HomeController;
}
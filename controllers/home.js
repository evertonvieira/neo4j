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

			let filmes = [];
			let atores = [];
			let atoresRelated = []
			let titulo = 'Página Principal';
			
			session
				.run('MATCH (a)-[r]->(b) RETURN a,b,r')
				.then(function(result){
					result.records.forEach(function(record){
						record.forEach(function(v,k,r) {
							
							if(v.constructor.name == "Node"){
								if(v.labels[0] == "Filmes"){
									var flag = false
									let objectFilme = {
										id: v.identity.low,
									   	nome: v.properties.nome,
										ano: v.properties.ano,
										duracao: v.properties.duracao,
										classificacao: v.properties.classificacao,
										genero: v.properties.genero,
										atores:[]
									};
									for (var i = 0; i < filmes.length; i++){
										if(filmes[i].id == objectFilme.id ){
											var flag = true;
										}
									}
									if (!flag){
										filmes.push(objectFilme);
									} 

								}else if(v.labels[0] == "Atores"){
									let objectAtor = {
										id: v.identity.low,
										nome: v.properties.nome
									};
									var flag = false
									for (var i = 0; i < atoresRelated.length; i++){
										if(atoresRelated[i].id == objectAtor.id ){
											var flag = true;
										}
									}
									if (!flag) atoresRelated.push(objectAtor);
								}
							}else if(v.constructor.name == "Relationship"){
								
								idStart = v.start.low;
								idEnd = v.end.low;

								for (let i = 0; i < atoresRelated.length; i++) {
									if(idStart == atoresRelated[i].id){
										actorTemp = atoresRelated[i];
									} 
									for (let j = 0; j < filmes.length; j++) {
										if(idEnd == filmes[j].id){
											filmeTemp = filmes[j];
										} 	
									}
									
								}

								var flag = false
								for (var i = 0; i < filmeTemp.atores.length; i++){
									if(filmeTemp.atores[i].id == actorTemp.id ){
										var flag = true;
									}
								}
								if (!flag) filmeTemp.atores.push(actorTemp);
							}
						})
						
					});

				session
					.run('MATCH (d:Atores) RETURN d')
					.then(function(array){
						array.records.forEach(function(record){
							atores.push({
								id: record._fields[0].identity.low,
								nome: record._fields[0].properties.nome,
							})
						});						
						res.render('home/index',{
							titulo: titulo,
							filmes: filmes,
							atores: atores,
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
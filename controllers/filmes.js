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

	var FilmesController = {
		index: function(req, res){
        },

        edit: function(req, res){
			let paramId = req.params.id;           
            
            const cypher =  `
            MATCH (p:Filmes) WHERE id(p) = ${paramId} 
            WITH p
            MATCH (b:Atores)
            MATCH (b)-[r:ATUOU]->(p)
            RETURN b,p
            `
            let filme = {}
            let atores = []
            var titulo = 'Filmes'
            			
			session
			.run(cypher)
			.then(function(result){
                console.log(result)
				result.records.forEach(function(record){
                    
                   
                    record._fields.forEach(function(element) {
                        if(element.labels[0] == "Filmes"){
                            filme.id = element.identity.low;
                            filme.nome = element.properties.nome;
                            filme.ano = element.properties.ano;                                                        
                            filme.duracao = element.properties.duracao;
                            filme.classificacao = element.properties.classificacao;
                            filme.genero = element.properties.genero;
                        }else if(element.labels[0] == "Atores"){
                            filme.idAtor = element.identity.low;
                            filme.nomeAtor = element.properties.nome;
                        }
                    });
                   
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
						res.render('filmes/editar',{
							titulo: titulo,
							filme: filme,
							atores: atores
						});
						
					})
					.catch(function(err){
						console.log(err);
					});
			})
			
			.catch(function(err){
				console.log(err);
			});
        },

        add: function(req, res){           

            let filme = req.body.filme;
            
            if(filme.ator != undefined){
                var cypher =  `                                             
                    CREATE (v:Filmes {
                        nome: "${filme.nome}",
                        ano: "${filme.ano}",
                        duracao: "${filme.duracao}",
                        classificacao: "${filme.classificacao}",
                        genero: "${filme.genero}"
                    } )
                    WITH v
                    MATCH(a:Atores)
                    WHERE id(a) in [${filme.ator}]
                    CREATE (a)-[r:ATUOU]->(v) return r
                `
            }else{
                var cypher =  `        
                    CREATE (v:Filmes {
                        nome: "${filme.nome}",
                        ano: "${filme.ano}",
                        duracao: "${filme.duracao}",
                        classificacao: "${filme.classificacao}",
                        genero: "${filme.genero}"
                    } )  
                    return v                               
                ` 
            }
            session
            .run(cypher)
            .then(function(result){
                req.flash('success', "Filme cadastrado com sucesso!");
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                req.flash('error', "Erro ao cadastrado o filme!");
                res.redirect("/")
                console.log(err)
                session.close()
            })
			
        },

        save: function(req, res){

            let filme = req.body.filme;
            const cypher =  `
                MATCH (v:Filmes) WHERE id(v) = ${filme.id}
                SET v.nome = "${filme.nome}", v.ano = "${filme.ano}", v.duracao = "${filme.duracao}",
                v.classificacao = "${filme.classificacao}", v.genero = "${filme.genero}"

                WITH v
                MATCH (o:Atores)
                WHERE id(o) = ${filme.oldIdAtor}

                WITH o
                MATCH (o)-[r:ATUOU]->(v) 
                DELETE r

                WITH v
                MATCH (b:Atores)
                WHERE id(b) = ${filme.idAtor}
                CREATE (b)-[r:ATUOU]->(v)             
                
                `
            session.run(cypher)
            .then(function(result){
                req.flash('success', "Filme editado com sucesso!");
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                req.flash('error', "Erro ao editar o filme!");
                res.redirect("/")
                console.log(err)
                session.close()
            })
			
        },

        delete: function(req, res){
            let paramId = req.params.id;
            const cypher =  `MATCH (p:Filmes) WHERE id(p) = ${paramId}  DETACH DELETE p`
            session.run(cypher)
            .then(function(result){
                req.flash('success', "Filme deletado com sucesso!");
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                console.log(err)
                req.flash('error', "Erro ao deletar o filme!");
                res.redirect("/")
                session.close()
            })
			
        }
        
        
	}

	return FilmesController;
}
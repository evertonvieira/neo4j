const neo4j = require('neo4j-driver').v1;
let uri = "bolt://localhost:7687"
let user  = "admin"
let password = "admin"

module.exports = function(app){

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
	const session = driver.session();

	var FilmesController = {
		index: function(req, res){
	
			
        },

        edit: function(req, res){
			let paramId = req.params.id;           

            const cypher =  `
            MATCH (p:Filmes) WHERE id(p) = ${paramId} 
            MATCH (b:Diretores)
            MATCH (b)-[r:DIRIGIU]->(p)
            RETURN b,p
            `
            let filme = {}
            let diretores = []
            var titulo = 'Filmes'
            			
			session
			.run(cypher)
			.then(function(result){
				result.records.forEach(function(record){
                   
                    record._fields.forEach(function(element) {
                        if(element.labels[0] == "Filmes"){
                            filme.id = element.identity.low;
                            filme.nome = element.properties.nome;
                            filme.ano = element.properties.ano;                                                        
                            filme.duracao = element.properties.duracao;
                            filme.classificacao = element.properties.classificacao;
                            filme.genero = element.properties.genero;
                        }else if(element.labels[0] == "Diretores"){
                            filme.idDiretor = element.identity.low;
                            filme.nomeDiretor = element.properties.nome;
                        }
                    });
                   
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
						res.render('filmes/editar',{
							titulo: titulo,
							filme: filme,
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
        },

        add: function(req, res){           
            //MATCH (a:Artist),(b:Album)
            // WHERE a.Name = "Strapping Young Lad" AND b.Name = "Heavy as a Really Heavy Thing"
            // CREATE (a)-[r:RELEASED]->(b)
            // RETURN r
            let paramIdDiretor = req.body.diretor;
            let paramNome = req.body.nome;
            let paramAno = req.body.ano;
            let paramDuracao = req.body.duracao;
            let paramClassificacao = req.body.classificacao;
            let paramGenero = req.body.genero;

            const cypher =  `
            
                CREATE (v:Filmes {
                    nome: "${paramNome}",
                    ano: "${paramAno}",
                    duracao: "${paramDuracao}",
                    classificacao: "${paramClassificacao}",
                    genero: "${paramGenero}"
                } ) 

                WITH v               
                MATCH (b:Diretores)
                WHERE id(b) = ${paramIdDiretor}
                CREATE (b)-[r:DIRIGIU]->(v)
                RETURN r
                `
            console.log(cypher)  
            session
            .run(cypher)
            .then(function(result){
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                console.log(err)
            })
			
        },

        save: function(req, res){
            let paramId = req.body.id;
            let paramNome = req.body.nome;            
            let paramAno = req.body.ano;
            let paramDuracao = req.body.duracao;
            let paramClassificacao = req.body.classificacao;
            let paramGenero = req.body.genero;
            let paramidDiretor = req.body.idDiretor;
            let paramOldIdDiretor = req.body.oldIdDiretor;

            const cypher =  `
                MATCH (v:Filmes) WHERE id(v) = ${paramId}
                SET v.nome = "${paramNome}", v.ano = "${paramAno}", v.duracao = "${paramDuracao}",
                v.classificacao = "${paramClassificacao}", v.genero = "${paramGenero}"

                WITH v
                MATCH (o:Diretores)
                WHERE id(o) = ${paramOldIdDiretor}

                WITH o
                MATCH (o)-[r:DIRIGIU]->(v) 
                DELETE r

                WITH v
                MATCH (b:Diretores)
                WHERE id(b) = ${paramidDiretor}
                CREATE (b)-[r:DIRIGIU]->(v)             
                
                `
            console.log(cypher)
                session.run(cypher)
            .then(function(result){
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                console.log(err)
            })
			
        },

        delete: function(req, res){
            let paramId = req.params.id;
            const cypher =  `MATCH (p:Filmes) WHERE id(p) = ${paramId}  DETACH DELETE p`
            session.run(cypher)
            .then(function(result){
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                console.log(err)
            })
			
        }
        
        
	}

	return FilmesController;
}
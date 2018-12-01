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

	var AtoresController = {
		index: function(req, res){	
			
        },

        add: function(req, res){   
            
            let ator = req.body.ator;
            var arrayFilmes = [];
            debugger;
            var arrayFilmes = ator.filmes;
            if(arrayFilmes != undefined){
                var cypher =  `                                             
                    CREATE (v:Atores {nome: "${ator.nome}", idade: "${ator.idade}" } )
                    WITH v
                    MATCH(f:Filmes)
                    WHERE id(f) in [${arrayFilmes}]
                    CREATE (v)-[r:ATUOU]->(f) return r
                `
            }else{
                var cypher =  `                                             
                    CREATE (v:Atores {nome: "${ator.nome}", idade: "${ator.idade}" } ) RETURN v
                ` 
            }
            session
            .run(cypher)
            .then(function(result){
                req.flash('success', "Ator Cadastrado com sucesso!");
                res.redirect("/")
                session.close()
            })
            .catch(function(err){
                console.log(err)
                req.flash('error', "Houve um erro ao cadastrar o Ator!");
                res.redirect("/")
                session.close()
            })
			
        },
        
	}

	return AtoresController;
}
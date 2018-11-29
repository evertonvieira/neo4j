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

	var DiretoresController = {
		index: function(req, res){	
			
        },

        add: function(req, res){           
            let paramNome = req.body.nome;
            let paramIdade = req.body.idade;
            const cypher =  `CREATE (v:Diretores {nome: "${paramNome}", idade: "${paramIdade}" } ) RETURN v`
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
        
	}

	return DiretoresController;
}
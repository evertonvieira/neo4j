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

        add: function(req, res){
            
            let paramNome = req.body.nome;
            let paramAno = req.body.ano;
            let paramGenero = req.body.genero;
            let paramDuracao = req.body.duracao;
            let paramClassificacao = req.body.classificacao;

            session
            .run('CREATE (n:Filmes  {nome: $paramNome, ano: $paramAno, genero: $paramGenero, duracao: $paramDuracao, classificacao: $paramClassificacao} ) RETURN n',
            {paramNome, paramAno, paramGenero, paramDuracao, paramClassificacao})
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
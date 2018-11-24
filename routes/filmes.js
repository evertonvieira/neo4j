module.exports = function(app){

    var filmes = app.controllers.filmes;
  
    app.route('/filmes').get(filmes.index)
    
    app.route('/filmes/add').post(filmes.add);
  }
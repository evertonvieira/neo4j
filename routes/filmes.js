module.exports = function(app){

    var filmes = app.controllers.filmes; 
    app.route('/filmes').get(filmes.index)
    app.route('/filmes/add').post(filmes.add);
    app.route('/filmes/save').post(filmes.save);
    app.route('/filmes/editar/:id').get(filmes.edit);
    app.route('/filmes/delete/:id').get(filmes.delete);
    
}
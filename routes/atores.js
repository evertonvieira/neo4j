module.exports = function(app){

    var atores = app.controllers.atores; 
    app.route('/atores').get(atores.index)
    app.route('/atores/add').post(atores.add);
    app.route('/atores/editar/:id').get(atores.edit);
    app.route('/atores/save').post(atores.save);

}
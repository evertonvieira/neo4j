module.exports = function(app){

    var diretores = app.controllers.diretores; 
    app.route('/diretores').get(diretores.index)
    app.route('/diretores/add').post(diretores.add);

}
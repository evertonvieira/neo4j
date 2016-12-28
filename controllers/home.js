module.exports = function(app){

	var HomeController = {
		index: function(req, res){
			var titulo = "Home Page";
			res.render('home/index',{titulo: titulo});
		}

	}

	return HomeController;
}
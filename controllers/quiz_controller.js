
var models = require('../models');

// Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId)
  		.then(function(quiz) {
      		if (quiz) {
        		req.quiz = quiz;
        		next();
      		} else {
      			next(new Error('No existe quizId=' + quizId));
      		}
        })
        .catch(function(error) { next(error); });
};


// GET /quizzes
exports.index = function(req, res, next) {
	var srch = req.query.search;

	if (srch == undefined) {
		// no se ha definido ninguna búsqueda
		srch = '%';
	}
	else {
		// búsqueda de quizes
		srch = '%'+srch+'%';
		srch = srch.replace(/ /g, '%');
	}

	console.log(srch);
	models.Quiz.findAll({
		where: {
			question: {
				$like: srch
			}
		}
	})
		.then(function(quizzes) {
			res.render('quizzes/index.ejs', { quizzes: quizzes});
		})
		.catch(function(error) {
			next(error);
		});
};


// GET /quizzes/:id
exports.show = function(req, res, next) {

	var answer = req.query.answer || '';

	res.render('quizzes/show', {quiz: req.quiz,
								answer: answer});
};


// GET /quizzes/:id/check
exports.check = function(req, res, next) {

	var answer = req.query.answer || "";

	var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';

	res.render('quizzes/result', { quiz: req.quiz,
								   result: result,
								   answer: answer });
};

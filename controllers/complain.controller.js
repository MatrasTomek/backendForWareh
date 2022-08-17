const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");
const mailer = require("../helpers/sendMail");
const adminMailer = require("../helpers/adminMail");

exports.getComplainByMieId = (req, res, next) => {
	const { mie_id } = req.params;

	const sqlGetCopmlainByMieId = `SELECT * FROM Miejsca WHERE mie_id="${mie_id}"`;

	db.query(sqlGetCopmlainByMieId, function (err, data, fields) {
		if (!err) {
			console.log(data);
		} else {
			console.log(err);
		}
	});
};

exports.postComplainByUser = (req, res, next) => {
	const { mie_id, Mie_ReklamacjaStatus, Mie_ReklamacjaData, Mie_ReklamacjaTresc } = req.body;

	const sqlSetCopmplainByUser = `UPDATE Miejsca SET Mie_ReklamacjaStatus=1, Mie_ReklamacjaData ='${Mie_ReklamacjaData}', Mie_ReklamacjaTresc ='${Mie_ReklamacjaTresc}' WHERE mie_id="${mie_id}"`;

	db.query(sqlSetCopmplainByUser, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 200,
				message: "Reklamacja złożona, instrukcja wysłana ma Twojego maila.",
			});
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");
const mailer = require("../helpers/sendMail");
const adminMailer = require("../helpers/adminMail");

//GET ALL COMPANIES FOR USER

exports.getAllCompaniesForUser = (req, res, next) => {
	const { userId } = req.params;

	const uzyt_id = Number(userId);

	const sqlAllCompanyForUser = `SELECT Podmiot.pod_id,	Podmiot.pod_nazwa,  Podmiot.pod_nip, Podmiot.pod_adres, Podmiot.pod_saldo, Podmiot.pod_aktywny, Podmiot.pod_abonament, Uzyt_Podmiot.up_pod_id, Uzyt_Podmiot.up_uzyt_id
  FROM Podmiot, Uzyt_Podmiot WHERE Podmiot.pod_id = Uzyt_Podmiot.up_pod_id AND Podmiot.pod_aktywny = 1 AND Uzyt_Podmiot.up_uzyt_id = ${uzyt_id} `;

	db.query(sqlAllCompanyForUser, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 200,
				data: data,
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

// ADD COMPANY
exports.postCompany = (req, res, next) => {
	// >>> data from Front <<<
	const { uzyt_id, login, pod_nazwa, pod_nip, pod_adres, pod_saldo } = req.body;

	// >>> checking is pod_nip exist

	const promiseNipExist = new Promise((resolve, reject) => {
		const sqlNipCompany = `SELECT * FROM Podmiot WHERE pod_nip = ${pod_nip}`;
		db.query(sqlNipCompany, function (err, data) {
			if (!err) {
				if (data.length) {
					const nipExist = {
						status: 404,
						message: `Nip ${pod_nip} istnieje już w bazie danych.`,
					};
					res.json(nipExist);
				} else {
					resolve();
				}
			} else {
				const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
				addError.dataSetError(error);
				const errData = helpers.handleErrors();
				res.json(errData);
				return;
			}
		});
	});
	promiseNipExist.then(() => {
		let pod_id = null;
		const promiseTopId = new Promise((resolve, reject) => {
			const sqlTopId = "SELECT pod_id FROM Podmiot ORDER BY pod_id DESC LIMIT 1";
			db.query(sqlTopId, function (err, data, fields) {
				if (!err) {
					pod_id = data[0].pod_id + 1;
					resolve(pod_id);
				} else {
					const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
					addError.dataSetError(error);
					const errData = helpers.handleErrors();
					res.json(errData);
					return;
				}
			});
		});
		promiseTopId.then((pod_id) => {
			const pod_aktywny = true;
			const company = [pod_id, pod_nazwa, pod_nip, pod_adres, pod_saldo, pod_aktywny];
			const sqlAddCopmany =
				"INSERT INTO Podmiot (pod_id, pod_nazwa, pod_nip, pod_adres, pod_saldo, pod_aktywny) VALUES (?,?,?,?,?, ?)";
			db.query(sqlAddCopmany, company, (err, data) => {
				if (!err) {
					data = [
						{
							pod_id: pod_id,
							pod_nazwa: pod_nazwa,
							pod_nip: pod_nip,
							pod_adres: pod_adres,
							pod_saldo: pod_saldo,
						},
					];
					res.json({
						status: 200,
						data: data,
					});
					// HANDLE SEND EMAIL TO USER
					const props = {
						title: "Rejestracja Firmy - Dane Twojej firmy",
						infoBeforeLink: `Właśnie zarejestrowałeś firmę: ${pod_nazwa}, adres: ${pod_adres}, nip: ${pod_nip}`,
						link: "",
						additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
						subject: "Rejestracja Firmy",
						mailTo: `${login}`,
					};
					mailer.mailSend(props);

					//SEND MAIL TO ADMIN
					const adminData = {
						mailFrom: `${login}`,
						content: `dodał firmę: ${pod_nazwa}, adres: ${pod_adres}, nip: ${pod_nip}`,
					};
					adminMailer.adminInfo(adminData);
				} else {
					const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
					addError.dataSetError(error);
					const errData = helpers.handleErrors();
					res.json(errData);
					return;
				}
			});
			const promiseTopId2 = new Promise((resolve, reject) => {
				let up_id = null;
				const sqlTopId = "SELECT up_id FROM Uzyt_Podmiot ORDER BY up_id DESC LIMIT 1";
				db.query(sqlTopId, function (err, data, fields) {
					if (!err) {
						up_id = data[0].up_id + 1;
						resolve(up_id);
					} else {
						const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
						addError.dataSetError(error);
						const errData = helpers.handleErrors();
						res.json(errData);
						return;
					}
				});
			});
			promiseTopId2.then((up_id) => {
				const newUp = [up_id, uzyt_id, pod_id];
				const sqlAddUp = "INSERT INTO Uzyt_Podmiot (up_id, up_uzyt_id, up_pod_id) VALUES (?,?,?)";
				db.query(sqlAddUp, newUp, (err, res) => {
					if (!err) {
						return;
					} else {
						const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
						addError.dataSetError(error);
						const errData = helpers.handleErrors();
						res.json(errData);
						return;
					}
				});
			});
		});
	});
};
// EDIT COMAPANY

exports.putCompany = (req, res, next) => {
	const { pod_id, pod_nazwa, pod_nip, pod_adres } = req.body;

	const sql = `UPDATE Podmiot SET pod_nazwa='${pod_nazwa}', pod_nip='${pod_nip}', pod_adres='${pod_adres}'  WHERE pod_id='${pod_id}'`;

	db.query(sql, function (err, data) {
		if (!err) {
			res.json({
				status: 200,
				message: `Dane firmy zmodyfikowane`,
			});
		} else {
			console.log(err);
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

exports.deleteCompany = (req, res, next) => {
	const { id } = req.params;

	const sqlPodmiotToDel = `UPDATE Podmiot SET pod_aktywny = 0 WHERE pod_id = ${id}`;
	db.query(sqlPodmiotToDel, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 200,
				message: `firma usunięta`,
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

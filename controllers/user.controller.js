const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");
const crypto = require("crypto");
const mailer = require("../helpers/sendMail");
const adminMailer = require("../helpers/adminMail");
const uuid = require("uuid");

// ADD USER
exports.postUser = (req, res, next) => {
	const { login, password, kind } = req.body;

	const secret = "";
	const md5Hasher = crypto.createHmac("md5", secret);
	const hash = md5Hasher.update(password).digest("hex");

	const sqlDoubleUserMail = `SELECT * FROM Uzytkownik WHERE uzyt_email='${login}'`;

	db.query(sqlDoubleUserMail, function (err, data) {
		if (!err) {
			if (data.length && data[0].uzyt_email === `${login}`) {
				res.json({
					status: 404,
					message: `Użytkownik: ${login}, już istnieje!!!.`,
				});
			} else if (data.length && data[0].uzyt_aktywny === 1) {
				res.json({
					status: 404,
					message: `Użytkownik: ${login}, zablokowany.`,
				});
			} else if (data.length === 0) {
				const promiseTopId = new Promise((resolve, reject) => {
					let id = null;
					const sqlTopId = "SELECT uzyt_id FROM Uzytkownik ORDER BY uzyt_id DESC LIMIT 1";
					db.query(sqlTopId, function (err, data, fields) {
						if (!err) {
							id = data[0].uzyt_id + 1;
							resolve(id);
						} else {
							const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
							addError.dataSetError(error);
							const errData = helpers.handleErrors();
							res.json(errData);
							return;
						}
					});
				});

				promiseTopId.then((id) => {
					const uzyt_aktywny = false;
					const user = [id, login, hash, uzyt_aktywny];
					const sql =
						"INSERT INTO Uzytkownik (uzyt_id, uzyt_email, uzyt_haslo, uzyt_aktywny) VALUES (?,?,?, ?)";
					db.query(sql, user, (err, data) => {
						if (!err) {
							res.json({
								status: 200,
								message: `${login}`,
							});
							// HANDLE SEND EMAIL TO NEW USER
							const props = {
								title: "Witamy w gronie Klientów twojemagazyny.pl",
								infoBeforeLink:
									"Proces rejestracji został rozpoczęty. Aby kontynuować proces rejestracji proszę potwierdzić klikając w poniższy link: ",
								link: `${
									kind === "wareh-finder"
										? "http://twojemagazyny.pl/#/activate"
										: "http://mag.twojemagazyny.pl/#/activate"
								}`,
								additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
								subject: "Potwierdzenie rejestracji konta",
								mailTo: `${login}`,
							};
							mailer.mailSend(props);

							//SEND MAIL To ADMIN
							const adminData = {
								mailFrom: `${login}`,
								content: `dodał konto jako ${
									kind === "wareh-owner" ? "właściciel magazynu" : "szukający magazynu"
								}`,
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
				});
			}
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

// EDIT USER ACTIVE
exports.postUserActive = (req, res, next) => {
	const { userLogin } = req.body;

	const sqlCheckIfUserExist = `SELECT * FROM Uzytkownik WHERE uzyt_email='${userLogin}'`;
	db.query(sqlCheckIfUserExist, function (err, data, fields) {
		if (!err) {
			if (!data.length) {
				res.json({
					status: 404,
					message: `Użytkownik ${userLogin} nie istnieje.`,
				});
				return;
			} else {
				const sqlSetActiv = `UPDATE Uzytkownik SET uzyt_aktywny = 1 WHERE uzyt_email = "${userLogin}"`;
				db.query(sqlSetActiv, function (err, data, fields) {
					if (!err) {
						res.json({
							status: 200,
						});
					} else {
						const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
						addError.dataSetError(error);
						const errData = helpers.handleErrors();
						res.json(errData);
						return;
					}
				});
			}
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

// LOGIN USER
exports.loginUser = (req, res, next) => {
	const { login, password } = req.body;

	const secret = "";
	const md5Hasher = crypto.createHmac("md5", secret);
	const hash = md5Hasher.update(password).digest("hex");

	const promiseUserActive = new Promise((resolve, reject) => {
		const sqlUserActive = `SELECT * FROM Uzytkownik`;

		db.query(sqlUserActive, function (err, data) {
			const searchedData = [];
			if (!err) {
				data.forEach((item) => {
					if (item.uzyt_email === login && item.uzyt_aktywny === 1) {
						searchedData.push(item);
						resolve(searchedData);
					} else {
						resolve(searchedData);
					}
				});
			} else {
				console.log("ERR");
				const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
				addError.dataSetError(error);
				const errData = helpers.handleErrors();
				res.json(errData);
				return;
			}
		});
	});

	promiseUserActive.then((searchedData) => {
		if (!searchedData.length) {
			dataErr = { status: 404, message: `użytkownik ${login} nie istnieje lub jest zablokowany` };
			res.json(dataErr);
			return;
		} else if (searchedData[0].uzyt_haslo !== hash.toString()) {
			dataErr = { status: 301, message: `hasło lub login się nie zgadza` };
			res.json(dataErr);
			return;
		} else if (searchedData[0].uzyt_haslo === hash.toString()) {
			res.json({
				status: 200,
				data: searchedData[0],
			});

			let uuidRandom = uuid.v4();
			let tokenId = uuidRandom.slice(0, 7);

			const sqlSetTokenId = `UPDATE Uzytkownik SET uzyt_token_id = '${tokenId}' WHERE uzyt_id = ${searchedData[0].uzyt_id}`;
			db.query(sqlSetTokenId, function (err, data) {
				if (!err) {
					// HANDLE SEND EMAIL TO  USER
					const props = {
						title: "Kod autoryzacyjny",
						infoBeforeLink: `${tokenId}`,
						link: "",
						additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
						subject: "Kod autoryzacyjny - twojemagazyny.pl",
						mailTo: `${login}`,
					};
					mailer.mailSend(props);
				} else {
					console.log("ERR");
					const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
					addError.dataSetError(error);
					const errData = helpers.handleErrors();
					res.json(errData);
					return;
				}
			});
		}
	});
};

// AUTH USER
exports.authUser = (req, res, next) => {
	const { uzyt_id, auth } = req.body;

	const sqlAuthUser = `SELECT * FROM Uzytkownik WHERE uzyt_id="${uzyt_id}"`;

	db.query(sqlAuthUser, function (err, data) {
		if (!err) {
			if (data[0].uzyt_token_id !== auth) {
				res.json({ status: 404, message: "Autoryzacja nieudana! Błędny Kod!" });
			} else {
				const user = {
					uzyt_id: data[0].uzyt_id,
					uzyt_email: data[0].uzyt_email,
					uzyt_aktywny: data[0].uzyt_aktywny,
				};
				res.json({ status: 200, data: user });
			}
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

// GET USER
exports.getUser = (req, res, next) => {
	const { id } = req.params;

	const sqlGetUserById = `SELECT * FROM Uzytkownik WHERE uzyt_id="${id}"`;

	db.query(sqlGetUserById, function (err, data) {
		if (!err) {
			const user = {
				uzyt_id: data[0].uzyt_id,
				uzyt_email: data[0].uzyt_email,
				uzyt_aktywny: data[0].uzyt_aktywny,
			};
			res.json({ status: 200, data: user });
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

// EDIT USER CHANGE PASS BY ID
exports.userChangePassById = (req, res, next) => {
	const { id, login, newPassword } = req.body;

	const secret = "";
	const md5Hasher = crypto.createHmac("md5", secret);
	const hash = md5Hasher.update(newPassword).digest("hex");

	const sqlChangePass = `UPDATE Uzytkownik SET uzyt_haslo = '${hash}' WHERE uzyt_id = ${id}`;
	db.query(sqlChangePass, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 200,
				message: "Hasło zostało zmienione",
			});
			// HANDLE SEND EMAIL TO  USER
			const props = {
				title: "Zmiana hasła",
				infoBeforeLink: `Potwierdzamy zmianę hasła z poziomu zalogowanego użytkownika`,
				link: "",
				additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
				subject: "Zmiana hasła",
				mailTo: `${login}`,
			};
			mailer.mailSend(props);
			//SEND MAIL To ADMIN
			const adminData = {
				mailFrom: `${login}`,
				content: "zmienił hasło z poziomu zalogowanego użytkownika",
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
};

// EDIT USER CHANGE PASS BY EMAIL
exports.userChangePassByEmail = (req, res, next) => {
	const { login, password, tokenId } = req.body;

	const secret = "";
	const md5Hasher = crypto.createHmac("md5", secret);
	const hash = md5Hasher.update(password).digest("hex");

	const promiseIsTokenIdCorrect = new Promise((resolve, reject) => {
		const sqlAuthUser = `SELECT * FROM Uzytkownik WHERE uzyt_email="${login}"`;
		db.query(sqlAuthUser, function (err, data) {
			if (!err) {
				if (!data.length) {
					res.json({
						status: 404,
						message: `Użytkownik ${login} nie istnieje`,
					});
				} else if (data[0].uzyt_token_id !== tokenId) {
					res.json({ status: 404, message: "Autoryzacja nieudana! Błędny Kod!" });
					return;
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

	promiseIsTokenIdCorrect.then(() => {
		const sqlChangePass = `UPDATE Uzytkownik SET uzyt_haslo = '${hash}' WHERE uzyt_email ="${login}"`;
		db.query(sqlChangePass, function (err, data, fields) {
			if (!err) {
				res.json({
					status: 200,
					message: `Hasło zostało zmienione`,
					data: [],
				});
				// HANDLE SEND EMAIL TO  USER
				const props = {
					title: "Zmiana utraconego hasła",
					infoBeforeLink: `Potwierdzamy zmianę utraconego hasła.`,
					link: "",
					additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
					subject: "Zmiana utraconego hasła",
					mailTo: `${login}`,
				};
				mailer.mailSend(props);
				//SEND MAIL To ADMIN
				const adminData = {
					mailFrom: `${login}`,
					content: "zmienił hasło z pozoimu utraconego hasła.",
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
	});
};

// LOST PASS
exports.userLostPassword = (req, res) => {
	const { login, kind } = req.body;

	const promiseUserActive = new Promise((resolve, reject) => {
		const sqlFindUserByEmail = `SELECT * FROM Uzytkownik WHERE uzyt_email='${login}'`;
		db.query(sqlFindUserByEmail, function (err, data) {
			if (!err) {
				if (!data.length) {
					dataErr = { status: 404, message: `użytkownik ${login} nie istnieje` };
					res.json(dataErr);
					return;
				} else if (data[0].uzyt_aktywny === 0 || data[0].uzyt_zablokow === 1) {
					dataErr = { status: 404, message: `użytkownik ${login} nie aktywny lub zablokowany` };
					res.json(dataErr);
					return;
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

	promiseUserActive.then(() => {
		let uuidRandom = uuid.v4();
		let tokenId = uuidRandom.slice(0, 7);

		const sqlSetTokenId = `UPDATE Uzytkownik SET uzyt_token_id = '${tokenId}' WHERE uzyt_email = '${login}'`;
		db.query(sqlSetTokenId, function (err, data) {
			if (!err) {
				// HANDLE SEND EMAIL TO USER
				const props = {
					title: `Zmiana hasła do konta ${login}`,
					infoBeforeLink: `Aby zmienić hasło kliknij w poniższy link, wpisz wymagane dane i token: ${tokenId}`,

					link: `${
						kind === "wareh-finder"
							? `http://mag.twojemagazyny.pl/#/change-pass`
							: `http://twojemagazyny.pl/#/change-pass`
					}`,

					// link: "http://localhost:3000/#/change-pass",

					additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
					subject: "Zmiana hasła",
					mailTo: `${login}`,
				};
				mailer.mailSend(props);
				data = { status: 200, message: true, data: [] };
				res.json(data);
			} else {
				const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
				addError.dataSetError(error);
				const errData = helpers.handleErrors();
				res.json(errData);
				return;
			}
		});
	});
};

// DEL USER
exports.deleteUser = (req, res, next) => {
	const { id } = req.params;

	// const sqlUzytPodmiotToDEL = `DELETE FROM Uzytkownik WHERE uzyt_id = ${id}`;
	const sqlUzytPodmiotToDEL = `UPDATE Uzytkownik SET uzyt_aktywny = false WHERE uzyt_id = ${id} `;
	db.query(sqlUzytPodmiotToDEL, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 200,
				message: `użytkownik o id: ${id} - usunięty!`,
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

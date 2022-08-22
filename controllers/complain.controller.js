const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");
const mailer = require("../helpers/sendMail");
const adminMailer = require("../helpers/adminMail");
const warehMailer = require("../helpers/warehMail");

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
	const {
		mie_id,
		tran_id,
		tran_data,
		tran_nazwa,
		mag_nazwa,
		mag_miejscowosc,
		mag_kodpocztowy,
		mag_adres,
		mag_kontakt_email,
		Mie_ReklamacjaStatus,
		Mie_ReklamacjaData,
		Mie_ReklamacjaTresc,
		userMail,
	} = req.body;

	const sqlSetCopmplainByUser = `UPDATE Miejsca SET Mie_ReklamacjaStatus=1, Mie_ReklamacjaData ='${Mie_ReklamacjaData}', Mie_ReklamacjaTresc ='${Mie_ReklamacjaTresc}' WHERE mie_id="${mie_id}"`;

	db.query(sqlSetCopmplainByUser, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 200,
				message: "Reklamacja złożona, instrukcja wysłana ma Twojego maila.",
			});
			// HANDLE SEND EMAIL TO USER
			const props = {
				title: `Reklamacja usługi ${mie_id}`,
				infoBeforeLink: `Złożyłeś reklamację usługi:${mie_id} do transakcji:${tran_id}, do magazynu: ${mag_nazwa}, ${mag_adres}, ${mag_kodpocztowy}, ${mag_miejscowosc}. Data reklamacji: ${Mie_ReklamacjaData}. Treść reklamacji: ${Mie_ReklamacjaTresc}. Magazyn skontaktuje się z Tobą w ciągu 24h`,
				link: "",
				additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
				subject: `Reklamacja usługi ${mie_id}`,
				mailTo: `${userMail}`,
			};
			mailer.mailSend(props);

			//SEND MAIL TO ADMIN
			const adminData = {
				mailFrom: `${userMail}`,
				content: `Zgłosił reklamację usługi:${mie_id} do transakcji:${tran_id}, do magazynu: ${mag_nazwa}, ${mag_adres}, ${mag_kodpocztowy}, ${mag_miejscowosc}. Data reklamacji: ${Mie_ReklamacjaData}. Treść reklamacji: ${Mie_ReklamacjaTresc}.`,
			};
			adminMailer.adminInfo(adminData);

			//SEND MAIL TO WAREH
			let warehMail = mag_kontakt_email;

			if (!warehMail || warehMail === null) {
				warehMail = "tomasz.matras@gmail.com";
				const propsWareh = {
					mailTo: `${warehMail}`,
					subject: `Reklamacja usługi ${mie_id}`,
					title: `Klient: ${userMail} zgłosił reklamację usługi:${mie_id}`,
					info1: `Dane Transakcji: ${tran_nazwa} z dnia: ${tran_data} `,
					info2: `Dane Magazynu: ${mag_nazwa}, ${mag_kodpocztowy}, ${mag_miejscowosc}, ${mag_adres} `,
					info3: `Reklamacja z dnia: ${Mie_ReklamacjaData}`,
					info4: `Treść reklamacji: ${Mie_ReklamacjaTresc}`,
				};
				warehMailer.warehInfo(propsWareh);
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

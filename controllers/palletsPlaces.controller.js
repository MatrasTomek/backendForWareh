const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");
const mailer = require("../helpers/sendMail");
const adminMailer = require("../helpers/adminMail");
const warehMailer = require("../helpers/warehMail");

exports.getPalletsPlacesById = (req, res, next) => {
	const { id } = req.params;

	const sqlSubscriptionTab = `SELECT * FROM Miejsca WHERE mie_id = ${id}`;

	db.query(sqlSubscriptionTab, function (err, data, fields) {
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

exports.postPalletsPlaces = (req, res, next) => {
	const { mie_uzyt_id, mie_mag_id, mie_rez_od, mie_rez_do, mie_ilosc, mie_tran_id } = req.body;

	let mie_id = null;
	const promiseAddPalletsPlaces = new Promise((resolve, reject) => {
		const sqlTopId = "SELECT mie_id FROM Miejsca ORDER BY mie_id DESC LIMIT 1";
		db.query(sqlTopId, function (err, data, fields) {
			if (!err) {
				if (!data[0]) {
					mie_id = 1;
				} else {
					mie_id = data[0].mie_id + 1;
				}

				resolve(mie_id);
			} else {
				const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
				console.log(error);
				addError.dataSetError(error);
				const errData = helpers.handleErrors();
				res.json(errData);
				return;
			}
		});
	});

	promiseAddPalletsPlaces.then((mie_id) => {
		const palletsPalces = [mie_id, mie_uzyt_id, mie_mag_id, mie_rez_od, mie_rez_do, mie_ilosc, mie_tran_id];

		const sqlAddPalletsPlaces =
			"INSERT INTO Miejsca (mie_id, mie_uzyt_id, mie_mag_id, mie_rez_od, mie_rez_do, mie_ilosc, mie_tran_id) VALUES (?,?,?,?,?,?,?)";
		db.query(sqlAddPalletsPlaces, palletsPalces, (err) => {
			if (!err) {
				data = [
					{
						mie_id: mie_id,
						mie_uzyt_id: mie_uzyt_id,
						mie_mag_id: mie_mag_id,
						mie_rez_od: mie_rez_od,
						mie_rez_do: mie_rez_do,
						mie_ilosc: mie_ilosc,
						mie_tran_id: mie_tran_id,
					},
				];
				res.json({
					status: 200,
					data: data,
				});
			} else {
				const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
				console.log(err);
				addError.dataSetError(error);
				const errData = helpers.handleErrors();
				res.json(errData);
				return;
			}
		});
	});
};

exports.putPalletsPlaces = (req, res, next) => {
	const { mie_id, mie_rez_od, mie_rez_do, mie_ilosc } = req.body;

	const sqlUpdatePlaces = `UPDATE Miejsca SET mie_rez_od='${mie_rez_od}', mie_rez_do ='${mie_rez_do}', mie_ilosc ='${mie_ilosc}' WHERE mie_id=${mie_id}`;
	db.query(sqlUpdatePlaces, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 201,
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

exports.putGoodsWasTaken = (req, res, next) => {
	const {
		userMail,
		warehMail,
		mag_nazwa,
		mag_adres,
		mag_kodpocztowy,
		mag_miejscowosc,
		mie_id,
		tran_id,
		uslugi_ilosc_palet,
	} = req.body;

	const sqlSetPalletsOut = `UPDATE Miejsca SET mie_wyszlo=1 WHERE mie_id=${mie_id}`;
	db.query(sqlSetPalletsOut, function (err, data, fields) {
		if (!err) {
			res.json({
				status: 201,
				data: mie_id,
			});

			// HANDLE SEND EMAIL TO USER
			const props = {
				title: "Potwierdzenie odbioru towaru",
				infoBeforeLink: `Właśnie potwierdziłeś odbiór ${uslugi_ilosc_palet} palet, z magazynu: ${mag_nazwa}, ${mag_adres}, ${mag_kodpocztowy}, ${mag_miejscowosc}`,
				link: "",
				additionalInfo: "Pozdrawiamy, twojemagazyny.pl",
				subject: "Potwierdzenie odbioru towaru",
				mailTo: `${userMail}`,
			};
			mailer.mailSend(props);

			//SEND MAIL TO ADMIN
			const adminData = {
				mailFrom: `${userMail}`,
				content: `potwierdził odbiór ${uslugi_ilosc_palet} palet, z magazynu: ${mag_nazwa}, ${mag_adres}, ${mag_kodpocztowy}, ${mag_miejscowosc}`,
			};
			adminMailer.adminInfo(adminData);

			//SEND MAIL TO WAREH
			const propsWareh = {
				mailTo: `${userMail}`,
				subject: `Potwierdzenie odbioru towaru`,
				title: `Potwierdzenie odbioru towaru od Klienta: ${userMail}`,
				info1: `Klient: ${userMail} właśnie potwierdził odbiór ${uslugi_ilosc_palet} palet`,
				info2: `Dane Magazynu odbioru: ${mag_nazwa}, ${mag_adres}, ${mag_kodpocztowy}, ${mag_miejscowosc}`,
				info3: "",
				info4: "",
			};

			warehMailer.warehInfo(propsWareh);
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			return;
		}
	});
};

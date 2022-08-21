const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

exports.getServiceByMieId = (req, res, next) => {
	const { id } = req.params;

	const mie_id = Number(id);

	const sqlGetService = `SELECT * FROM Uslugi WHERE uslugi_mie_id=${mie_id}`;
	db.query(sqlGetService, function (err, data, fields) {
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

exports.postService = (req, res, next) => {
	const { mie_id, services, uslugi_ilosc_palet, uslugi_wymiar } = req.body;

	const promiseSetPrices = new Promise((resolve, reject) => {
		const sqlGetPrice = `SELECT * FROM CennikiDetails WHERE cendet_RodzajeUslug_id=${services}`;
		db.query(sqlGetPrice, function (err, data, fields) {
			if (!err) {
				// const servicePrice = data.find((item) => item.cendet_id === services);
				// pricesData.push(servicePrice);

				// const handlingPrice = data.find((item) => item.cendet_id === services[1]);
				// pricesData.push(handlingPrice);

				resolve(data);
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
	promiseSetPrices.then((pricesData) => {
		const errorsArr = [];

		const servicePrice = (Number(pricesData[0].cendet_CenaNetto) * uslugi_wymiar[0] * uslugi_wymiar[1]) / 960000;

		const sqlAddService = `INSERT INTO Uslugi (uslugi_RodzajeUslug_id, uslugi_pakowanie_id, uslugi_mie_id, uslugi_cennik_id, uslugi_wartosc, uslugi_ilosc_palet, uslugi_wymiar) VALUES (${pricesData[0].cendet_RodzajeUslug_id}, ${pricesData[0].cendet_pakowanie_id}, ${mie_id}, ${pricesData[0].cendet_id}, ${servicePrice}, ${uslugi_ilosc_palet}, POINT(${uslugi_wymiar[0]}, ${uslugi_wymiar[1]}))`;
		db.query(sqlAddService, (err, data) => {
			if (!err) {
				return;
			} else {
				errorsArr.push(err);
				return;
			}
		});

		// const handlingPrice = (pricesData[1].cendet_CenaNetto * uslugi_wymiar[0] * uslugi_wymiar[1]) / 960000;

		// const sqlAddHandling = `INSERT INTO Uslugi (uslugi_RodzajeUslug_id, uslugi_pakowanie_id, uslugi_mie_id, uslugi_cennik_id, uslugi_wartosc, uslugi_ilosc_palet, uslugi_wymiar) VALUES (${pricesData[1].cendet_RodzajeUslug_id}, ${pricesData[1].cendet_pakowanie_id}, ${mie_id}, ${pricesData[1].cendet_id}, ${handlingPrice}, ${uslugi_ilosc_palet}, POINT(${uslugi_wymiar[0]}, ${uslugi_wymiar[1]}))`;
		// db.query(sqlAddHandling, (err, data) => {
		// 	if (!err) {
		// 		return;
		// 	} else {
		// 		errorsArr.push(err);
		// 		return;
		// 	}
		// });

		// pricesData.forEach((item) => {
		//   const uslugi_wartosc =
		//     (item.cendet_CenaNetto * uslugi_wymiar[0] * uslugi_wymiar[1]) / 960000;
		//   const serviceData = [
		//     item.cendet_RodzajeUslug_id,
		//     item.cendet_pakowanie_id,
		//     mie_id,
		//     item.cendet_id,
		//     uslugi_wartosc,
		//     uslugi_wymiar,
		//   ];

		//   const sqlAddService =
		//     "INSERT INTO Uslugi (uslugi_RodzajeUslug_id, uslugi_pakowanie_id, uslugi_mie_id, uslugi_cennik_id, uslugi_wartosc, uslugi_wymiar) VALUES (?,?,?,?,?,?)";
		//   db.query(sqlAddService, serviceData, (err, data) => {
		//     if (!err) {
		//       return;
		//     } else {
		//       errorsArr.push(err);
		//       return;
		//     }
		//   });
		// });

		if (!errorsArr.length) {
			const data = {
				status: 200,
			};
			res.json(data);
		} else {
			console.log(errorsArr);
			addError.dataSetError(errorsArr[0]);
			const errData = helpers.handleErrors();
			res.json(errData);
		}
	});
};

exports.getAllJoinedInfoTransakcjeId = (req, res, next) => {
	const { id } = req.params;

	const sqlGetAllJoinedInfo = `SELECT mie_id, mie_rez_od, mie_rez_do, mie_ilosc, mie_wyszlo, mie_ReklamacjaStatus, mie_ReklamacjaData, mie_ReklamacjaTresc, uslugi_RodzajeUslug_id, uslugi_ilosc_palet, uslugi_wymiar, RodzajeUslug_opis, mag_nazwa, mag_kodpocztowy, mag_adres, mag_miejscowosc, mag_kontakt_email, mie_mag_id FROM Miejsca, Uslugi, RodzajeUslug, Mag WHERE mie_tran_id=${id} and uslugi_mie_id=mie_id and RodzajeUslug_id=uslugi_RodzajeUslug_id and mag_id=mie_mag_id `;
	db.query(sqlGetAllJoinedInfo, function (err, data, fields) {
		if (!err) {
			data[0].tran_id = Number(id);
			res.json({
				status: 200,
				data: data[0],
			});
		} else {
			const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
			addError.dataSetError(error);
			const errData = helpers.handleErrors();
			res.json(errData);
			console.log(error);
			return;
		}
	});
};

exports.getAllJoinedInfoByWarehId = (req, res, next) => {
	const { id } = req.params;

	const sqlGetAllJoinedInfoWareh = `SELECT mie_id, mie_rez_od, mie_rez_do, mie_ilosc, mie_wyszlo, uslugi_RodzajeUslug_id, uslugi_wymiar, uslugi_ilosc_palet, RodzajeUslug_opis FROM Miejsca, Uslugi, RodzajeUslug WHERE mie_mag_id=${id} and uslugi_mie_id=mie_id and uslugi_RodzajeUslug_id <= 7 and RodzajeUslug_id=uslugi_RodzajeUslug_id`;
	db.query(sqlGetAllJoinedInfoWareh, function (err, data, fields) {
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
			console.log(error);
			return;
		}
	});
};

exports.getAllJoinedInfoByCompanyId = (req, res, next) => {
	const { id } = req.params;

	const sqlGetAllJoinedInfoWareh = `SELECT tran_id, tran_nazwa, mie_id, mie_mag_id, mie_rez_od, mie_rez_do, mie_ilosc, mie_wyszlo, mag_miejscowosc, mag_adres FROM Transakcje, Miejsca, Mag WHERE tran_id_podmiot=${id} and mie_tran_id=tran_id and mag_id=mie_mag_id`;
	db.query(sqlGetAllJoinedInfoWareh, function (err, data, fields) {
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
			console.log(error);
			return;
		}
	});
};

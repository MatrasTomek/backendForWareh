const CronJob = require("node-cron");
const db = require("../database");
const addError = require("./setDataError");
const helpers = require("./handleErrors");
const { forEach } = require("lodash");
exports.initScheduledJobs = () => {
	const scheduledJobFunction = CronJob.schedule("1 0 * * *", () => {
		const sqlGetAllMiejsca = "SELECT * FROM Miejsca WHERE mie_wyszlo IS NULL AND mie_ReklamacjaStatus IS NULL";

		const promiseGetAllNull = new Promise((resolve, reject) => {
			db.query(sqlGetAllMiejsca, function (err, data, fields) {
				if (!err) {
					if (data.length === 0) {
						reject();
						return;
					} else {
						resolve(data);
					}
				} else {
					// const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
					// addError.dataSetError(error);
					// const errData = helpers.handleErrors();
					// res.json(errData);
					console.log("CRON ERR", err);
					reject();
					return;
				}
			});
		});
		promiseGetAllNull.then((data) => {
			const today = Math.round(new Date().getTime() / 1000);
			const hrs24 = 24 * 3600;

			data.forEach((item) => {
				const unload = new Date(item.mie_rez_do).getTime() / 1000;
				const plus24h = unload + hrs24;

				if (plus24h <= today) {
					const sqlUpdateMiejscaUnload = `UPDATE Miejsca SET mie_wyszlo=1 WHERE mie_id=${item.mie_id}`;
					db.query(sqlUpdateMiejscaUnload, function (err, data, fields) {
						if (!err) {
							return;
						} else {
							console.log("CRON ERR", err);
							return;
						}
					});
				}
			});
		});
	});

	scheduledJobFunction.start();
};

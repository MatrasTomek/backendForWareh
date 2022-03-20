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
  const { pakowanie_id, mie_id, services } = req.body;

  const promiseSetPrices = new Promise((resolve, reject) => {
    const pricesData = [];
    const sqlGetPrice = `SELECT * FROM CennikiDetails`;
    db.query(sqlGetPrice, function (err, data, fields) {
      if (!err) {
        services.forEach((item) => {
          const price = data.find(
            (element) =>
              element.cendet_RodzajeUslug_id === item &&
              element.cendet_pakowanie_id === pakowanie_id
          );
          pricesData.push(price);
        });
        resolve(pricesData);
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

    pricesData.forEach((item) => {
      const serviceData = [
        item.cendet_RodzajeUslug_id,
        item.cendet_pakowanie_id,
        mie_id,
        item.cendet_id,
        item.cendet_CenaNetto,
      ];

      const sqlAddService =
        "INSERT INTO Uslugi (uslugi_RodzajeUslug_id, uslugi_pakowanie_id, uslugi_mie_id, uslugi_cennik_id, uslugi_wartosc) VALUES (?,?,?,?,?)";
      db.query(sqlAddService, serviceData, (err, data) => {
        if (!err) {
          return;
        } else {
          errorsArr.push(err);
          return;
        }
      });
    });

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

  const sqlGetAllJoinedInfo = `SELECT mie_id, mie_rez_od, mie_rez_do, mie_ilosc, uslugi_RodzajeUslug_id, uslugi_pakowanie_id, RodzajeUslug_opis, pakowanie_opis, mag_nazwa, mag_kodpocztowy, mag_adres, mag_miejscowosc, mie_mag_id FROM Miejsca, Uslugi, RodzajeUslug, Pakowanie, Mag WHERE mie_tran_id=${id} and uslugi_mie_id=mie_id and RodzajeUslug_id=uslugi_RodzajeUslug_id and pakowanie_id=uslugi_pakowanie_id and mag_id=mie_mag_id `;
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

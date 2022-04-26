const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

// GET ALL MAGS FROM DB Mag
exports.getAllMags = (req, res, next) => {
  const sqlMag = "SELECT * FROM Mag";
  db.query(sqlMag, function (err, data, fields) {
    if (!err) {
      res.json(data);
    } else {
      const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
      addError.dataSetError(error);
      const errData = helpers.handleErrors();
      res.json(errData);
      return;
    }
  });
};

// GET ONE MAG BY ID
exports.getMag = (req, res, next) => {
  const { id } = req.params;
  const sql = `SELECT * FROM Mag WHERE mag_id = ${id}`;

  db.query(sql, function (err, data, fields) {
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

// GET MAG BY COMPANY ID
exports.getMagByCompId = (req, res, next) => {
  const { id } = req.params;

  const sql = `SELECT * FROM Mag WHERE mag_pod_id = ${id} AND mag_aktywny = 1`;

  db.query(sql, function (err, data, fields) {
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

// GET MAG BY GEO LOCALIZATION
exports.getMagsByGeoCodes = (req, res) => {
  const { coordinates, range } = req.body;

  const itemsInRange = [];

  const sqlMag = "SELECT * FROM Mag WHERE mag_aktywny = 1";
  db.query(sqlMag, function (err, data, fields) {
    if (!err) {
      data.forEach((item) => {
        const calculatedRange =
          Math.sqrt(
            Math.pow(
              Number(coordinates.lng) - Number(item.mag_wspolrzedne_gps_dl),
              2
            ) +
              Math.pow(
                Number(coordinates.lat) - Number(item.mag_wspolrzedne_gps_szer),
                2
              )
          ) * 73;
        if (calculatedRange <= Number(range)) {
          item.range = calculatedRange;
          itemsInRange.push(item);
        }
      });
      res.json(itemsInRange);
    } else {
      const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
      addError.dataSetError(error);
      const errData = helpers.handleErrors();
      res.json(errData);
      return;
    }
  });
};

// ADD MAG BY COMPANY ID
exports.addMag = (req, res, next) => {
  const {
    mag_pod_id,
    mag_nazwa,
    mag_opis,
    mag_kodpocztowy,
    mag_miejscowosc,
    mag_adres,
    mag_wspolrzedne_gps,
    mag_kontakt_email,
  } = req.body;
  const promiseTopId = new Promise((resolve, reject) => {
    let mag_id = null;
    const sqlTopId = "SELECT mag_id FROM Mag ORDER BY mag_id DESC LIMIT 1";
    db.query(sqlTopId, function (err, data, fields) {
      if (!err) {
        mag_id = data[0].mag_id + 1;

        resolve(mag_id);
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        addError.dataSetError(error);
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });

  promiseTopId.then((mag_id) => {
    const mag_aktywny = true;
    const mag_wspolrzedne_gps_dl = mag_wspolrzedne_gps.lng;
    const mag_wspolrzedne_gps_szer = mag_wspolrzedne_gps.lat;
    const mag_Miejsca_deklarowane = 0;
    const mag_Miejsca_wolne = 0;
    const mag_Minimum_ostrzegaj = 33;
    const newWareh = [
      mag_id,
      mag_pod_id,
      mag_nazwa,
      mag_opis,
      mag_kodpocztowy,
      mag_adres,
      mag_miejscowosc,
      mag_Miejsca_deklarowane,
      mag_Miejsca_wolne,
      mag_Minimum_ostrzegaj,
      mag_aktywny,
      mag_wspolrzedne_gps_dl,
      mag_wspolrzedne_gps_szer,
      mag_kontakt_email,
    ];
    const sqlAddWareh =
      "INSERT INTO Mag ( mag_id, mag_pod_id, mag_nazwa, mag_opis, mag_kodpocztowy, mag_adres, mag_miejscowosc, mag_Miejsca_deklarowane, mag_Miejsca_wolne, mag_Minimum_ostrzegaj, mag_aktywny, mag_wspolrzedne_gps_dl, mag_wspolrzedne_gps_szer, mag_kontakt_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, ?)";

    db.query(sqlAddWareh, newWareh, (err, data) => {
      if (!err) {
        const wareh = {
          mag_id: mag_id,
          mag_pod_id: mag_pod_id,
          mag_nazwa: mag_nazwa,
          mag_opis: mag_opis,
          mag_kodpocztowy: mag_kodpocztowy,
          mag_miejscowosc: mag_miejscowosc,
          mag_adres: mag_adres,
          mag_Miejsca_wolne: mag_Miejsca_wolne,
          mag_Miejsca_deklarowane: mag_Miejsca_deklarowane,
          mag_aktywny: mag_aktywny,
          mag_kontakt_email: mag_kontakt_email,
        };

        res.json({
          status: 200,
          data: wareh,
        });
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

exports.editMag = (req, res, next) => {
  const {
    mag_id,
    mag_pod_id,
    mag_nazwa,
    mag_opis,
    mag_kontakt_email,
    mag_kodpocztowy,
    mag_miejscowosc,
    mag_adres,
    mag_Miejsca_deklarowane,
    mag_Miejsca_wolne,
    mag_wspolrzedne_gps,
  } = req.body;

  const mag_wspolrzedne_gps_dl = mag_wspolrzedne_gps.lng;
  const mag_wspolrzedne_gps_szer = mag_wspolrzedne_gps.lat;

  const sqlMagData = `UPDATE Mag SET mag_nazwa ='${mag_nazwa}',
  mag_opis = '${mag_opis}',
  mag_kodpocztowy = '${mag_kodpocztowy}',
  mag_miejscowosc='${mag_miejscowosc}',
  mag_adres='${mag_adres}',
  mag_Miejsca_deklarowane='${mag_Miejsca_deklarowane}', mag_Miejsca_wolne='${mag_Miejsca_wolne}', mag_wspolrzedne_gps_dl='${mag_wspolrzedne_gps_dl}', mag_wspolrzedne_gps_szer='${mag_wspolrzedne_gps_szer}', mag_kontakt_email='${mag_kontakt_email}' WHERE mag_id = ${mag_id}`;
  db.query(sqlMagData, (err, data) => {
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

exports.editMagSubscribe = (req, res, next) => {
  const { mag_id, podabon_id } = req.body;

  const sqlSubscribToMag = `UPDATE Mag SET mag_abonament = ${podabon_id} WHERE mag_id = ${mag_id}`;

  db.query(sqlSubscribToMag, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        data: {
          mag_id: mag_id,
          podabon_id: podabon_id,
        },
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

exports.setMagFreePalletsFromSubscribe = (req, res, next) => {
  const { mag_id, palletsToUpdate } = req.body;

  const sqlFreePalletsInMagFromSubscribe = `UPDATE Mag SET mag_Miejsca_wolne = ${palletsToUpdate} WHERE mag_id = ${mag_id}`;

  db.query(sqlFreePalletsInMagFromSubscribe, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        data: {
          mag_id: mag_id,
          mag_Miejsca_wolne: palletsToUpdate,
        },
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

exports.editMagFreePallets = (req, res, next) => {
  const { mag_id, palletsToUpdate } = req.body;

  const checkFreePallets = new Promise((resolve, reject) => {
    let freePallets = null;
    const sqlCheckFreePalletsinMAg = `SELECT mag_Miejsca_wolne FROM Mag WHERE mag_id=${mag_id}`;
    db.query(sqlCheckFreePalletsinMAg, function (err, data, fields) {
      if (!err) {
        freePallets = Number(palletsToUpdate) + data[0].mag_Miejsca_wolne;

        resolve(freePallets);
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        addError.dataSetError(error);
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });
  checkFreePallets.then((freePallets) => {
    const sqlUpdateFreePalletsInMag = `UPDATE Mag SET mag_Miejsca_wolne = ${freePallets} WHERE mag_id = ${mag_id}`;

    db.query(sqlUpdateFreePalletsInMag, function (err, data, fields) {
      if (!err) {
        res.json({
          status: 200,
          data: {
            mag_id: mag_id,
            mag_Miejsca_wolne: freePallets,
          },
        });
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

exports.deleteMag = (req, res, next) => {
  const { id } = req.params;

  const sqlMagToDEL = `UPDATE Mag SET mag_aktywny = 0 WHERE mag_id = ${id}`;

  db.query(sqlMagToDEL, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        message: `Magazyn o id: ${id} usunięty!`,
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

const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

// GEAT ALL DETAILS
exports.getAllDetails = (req, res, next) => {
  const sql = `SELECT * FROM MagDetails`;
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
// GET DETAILS OF MAG BY mdet_mag_id
exports.getDetailsById = (req, res, next) => {
  const { id } = req.params;
  const sql = `SELECT * FROM MagDetails WHERE mdet_mag_id = ${id}`;

  db.query(sql, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        data: data[0],
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

//ADD DETAILS OF MAG

exports.addDetailsToWareh = (req, res, next) => {
  const {
    mdet_mag_id,
    mdet_ADR,
    mdet_CHCCP,
    mdet_Dockirozladunkowe,
    mdet_ISO,
    mdet_InstTryskaczowa,
    mdet_KontrolaTemPIWilgo,
    mdet_MozliwoscRozladunkuBokiem,
    mdet_Neutralny,
    mdet_OdpornoscOgniowa,
    mdet_Ogrzewanie,
    mdet_OsuszaniePow,
    mdet_Spozywcze,
    mdet_Wysokosc,
    mdet_chlodnicze,
    mdet_godzinypracy,
    mdet_klasa,
    mdet_latwopalne,
    mdet_meble,
    mdet_militaria,
    mdet_mroznia,
    mdet_wielkosc,
    mdet_MaxWagaPalety,
  } = req.body;

  const promiseTopId = new Promise((resolve, reject) => {
    let mdet_id = null;
    const sqlTopId =
      "SELECT mdet_id FROM MagDetails ORDER BY mdet_id DESC LIMIT 1";
    db.query(sqlTopId, function (err, data, fields) {
      if (!err) {
        mdet_id = data[0].mdet_id + 1;
        resolve(mdet_id);
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        addError.dataSetError(error);
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });

  promiseTopId.then((mdet_id) => {
    const warehDetails = [
      mdet_id,
      mdet_mag_id,
      mdet_ADR,
      mdet_CHCCP,
      mdet_Dockirozladunkowe,
      mdet_ISO,
      mdet_InstTryskaczowa,
      mdet_KontrolaTemPIWilgo,
      mdet_MozliwoscRozladunkuBokiem,
      mdet_Neutralny,
      mdet_OdpornoscOgniowa,
      mdet_Ogrzewanie,
      mdet_OsuszaniePow,
      mdet_Spozywcze,
      mdet_Wysokosc,
      mdet_chlodnicze,
      mdet_godzinypracy,
      mdet_klasa,
      mdet_latwopalne,
      mdet_meble,
      mdet_militaria,
      mdet_mroznia,
      mdet_wielkosc,
      mdet_MaxWagaPalety,
    ];
    const sqlAddDetails =
      "INSERT INTO MagDetails (mdet_id, mdet_mag_id, mdet_ADR, mdet_CHCCP, mdet_Dockirozladunkowe, mdet_ISO,mdet_InstTryskaczowa, mdet_KontrolaTemPIWilgo, mdet_MozliwoscRozladunkuBokiem, mdet_Neutralny, mdet_OdpornoscOgniowa, mdet_Ogrzewanie, mdet_OsuszaniePow, mdet_Spozywcze, mdet_Wysokosc, mdet_chlodnicze, mdet_godzinypracy, mdet_klasa, mdet_latwopalne, mdet_meble, mdet_militaria, mdet_mroznia, mdet_wielkosc, mdet_MaxWagaPalety) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    db.query(sqlAddDetails, warehDetails, (err, data) => {
      if (!err) {
        const details = {
          mdet_id: mdet_id,
          mdet_mag_id: mdet_mag_id,
          mdet_ADR: mdet_ADR,
          mdet_CHCCP: mdet_CHCCP,
          mdet_Dockirozladunkowe: mdet_Dockirozladunkowe,
          mdet_ISO: mdet_ISO,
          mdet_InstTryskaczowa: mdet_InstTryskaczowa,
          mdet_KontrolaTemPIWilgo: mdet_KontrolaTemPIWilgo,
          mdet_MozliwoscRozladunkuBokiem: mdet_MozliwoscRozladunkuBokiem,
          mdet_Neutralny: mdet_Neutralny,
          mdet_OdpornoscOgniowa: mdet_OdpornoscOgniowa,
          mdet_Ogrzewanie: mdet_Ogrzewanie,
          mdet_OsuszaniePow: mdet_OsuszaniePow,
          mdet_Spozywcze: mdet_Spozywcze,
          mdet_Wysokosc: mdet_Wysokosc,
          mdet_chlodnicze: mdet_chlodnicze,
          mdet_godzinypracy: mdet_godzinypracy,
          mdet_klasa: mdet_klasa,
          mdet_latwopalne: mdet_latwopalne,
          mdet_meble: mdet_meble,
          mdet_militaria: mdet_militaria,
          mdet_mroznia: mdet_mroznia,
          mdet_wielkosc: mdet_wielkosc,
          mdet_MaxWagaPalety: mdet_MaxWagaPalety,
        };
        res.json({
          status: 200,
          data: details,
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

exports.editWarehDetails = (req, res, next) => {
  const {
    mdet_id,
    mdet_ADR,
    mdet_CHCCP,
    mdet_Dockirozladunkowe,
    mdet_ISO,
    mdet_InstTryskaczowa,
    mdet_KontrolaTemPIWilgo,
    mdet_MozliwoscRozladunkuBokiem,
    mdet_Neutralny,
    mdet_OdpornoscOgniowa,
    mdet_Ogrzewanie,
    mdet_OsuszaniePow,
    mdet_Spozywcze,
    mdet_Wysokosc,
    mdet_chlodnicze,
    mdet_godzinypracy,
    mdet_klasa,
    mdet_latwopalne,
    mdet_meble,
    mdet_militaria,
    mdet_mroznia,
    mdet_wielkosc,
    mdet_MaxWagaPalety,
  } = req.body;

  const sqlMagDetails = `UPDATE MagDetails SET mdet_ADR='${mdet_ADR}',
  mdet_CHCCP='${mdet_CHCCP}',
  mdet_Dockirozladunkowe='${mdet_Dockirozladunkowe}',
  mdet_ISO='${mdet_ISO}',
  mdet_InstTryskaczowa='${mdet_InstTryskaczowa}',
  mdet_KontrolaTemPIWilgo='${mdet_KontrolaTemPIWilgo}',
  mdet_MozliwoscRozladunkuBokiem='${mdet_MozliwoscRozladunkuBokiem}',
  mdet_Neutralny='${mdet_Neutralny}',
  mdet_OdpornoscOgniowa='${mdet_OdpornoscOgniowa}',
  mdet_Ogrzewanie='${mdet_Ogrzewanie}',
  mdet_OsuszaniePow='${mdet_OsuszaniePow}',
  mdet_Spozywcze='${mdet_Spozywcze}',
  mdet_Wysokosc='${mdet_Wysokosc}',
  mdet_chlodnicze='${mdet_chlodnicze}',
  mdet_godzinypracy='${mdet_godzinypracy}',
  mdet_klasa='${mdet_klasa}',
  mdet_latwopalne='${mdet_latwopalne}',
  mdet_meble='${mdet_meble}',
  mdet_militaria='${mdet_militaria}',
  mdet_mroznia='${mdet_mroznia}',
  mdet_wielkosc='${mdet_wielkosc}',
  mdet_MaxWagaPalety = '${mdet_MaxWagaPalety}'
  WHERE mdet_id = ${mdet_id}`;

  db.query(sqlMagDetails, (err, data) => {
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

exports.deleteWarehDetails = (req, res, next) => {
  const { id } = req.params;

  const sqlWarehDetailsToDel = `DELETE FROM MagDetails WHERE mdet_id = ${id}`;
  db.query(sqlWarehDetailsToDel, function (err, data, fields) {
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
};

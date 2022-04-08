const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

// exports.getPalletsPlacesForWarehsByCompanyId = (req, res, next) => {
//   const { id } = req.params;

//   let magIds = null;
//   const promiseAddPalletsPlaces = new Promise((resolve, reject) => {
//     const sqlSubscriptionTab = `SELECT mag_id FROM Mag WHERE mag_pod_id=${id} `;
//     db.query(sqlSubscriptionTab, function (err, data, fields) {
//       if (!err) {
//         magIds = data;
//         resolve(magIds);
//       } else {
//         const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
//         addError.dataSetError(error);
//         const errData = helpers.handleErrors();
//         res.json(errData);
//         return;
//       }
//     });
//   });
//   promiseAddPalletsPlaces.then((magIds) => {
//     magIds.forEach((item) => {
//       const sqlGetPlacesForMags = `SELECT * FROM Miejsca WHERE mie_mag_id=${item} `;
//       db.query(sqlGetPlacesForMags, function (err, data, fields) {
//         if (!err) {
//           res.json({
//             status: 200,
//             data: data,
//           });
//         } else {
//           const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
//           addError.dataSetError(error);
//           const errData = helpers.handleErrors();
//           res.json(errData);
//           return;
//         }
//       });
//     });
//   });
// };

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
  const {
    mie_uzyt_id,
    mie_mag_id,
    mie_rez_od,
    mie_rez_do,
    mie_ilosc,
    mie_tran_id,
  } = req.body;

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
    const palletsPalces = [
      mie_id,
      mie_uzyt_id,
      mie_mag_id,
      mie_rez_od,
      mie_rez_do,
      mie_ilosc,
      mie_tran_id,
    ];

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

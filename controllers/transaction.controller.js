const e = require("express");
const { identity } = require("lodash");
const db = require("../database");
const helpers = require("../helpers/handleErrors");

//GET ALL TRANSACTIONS FOR pod_id

exports.getAllTransactionsForOneCompany = (req, res, next) => {
  const { podId } = req.params;

  const sqlTransactionsForCompany = `SELECT * FROM Transakcje WHERE tran_id_podmiot='${podId}'`;

  db.query(sqlTransactionsForCompany, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        data: data,
      });
    } else {
      console.log(err);
      const errData = helpers.handleErrors();
      res.json(errData);
      return;
    }
  });
};

exports.getAllTransactionsForOneUers = (req, res, next) => {
  const { id } = req.params;

  const sqlTransactionsForUser = `SELECT * FROM Transakcje WHERE tran_id_uzyt='${id}' AND tran_status=1`;

  db.query(sqlTransactionsForUser, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        data: data,
      });
    } else {
      console.log(err);
      const errData = helpers.handleErrors();
      res.json(errData);
      return;
    }
  });
};

//RECHARGE ACCOUNT FOR pod_id
exports.rechargeCompanyAccount = (req, res, next) => {
  const { podId, uzytId, tranWartosc, tranData, tranNazwa, tranStatus } =
    req.body;

  const promiseTopId = new Promise((resolve, reject) => {
    let tran_id = null;
    const sqlTopId =
      "SELECT tran_id FROM Transakcje ORDER BY tran_id DESC LIMIT 1";
    db.query(sqlTopId, function (err, data, fields) {
      if (!err) {
        tran_id = data[0].tran_id + 1;
        resolve(tran_id);
      } else {
        reject(console.log(err));
      }
    });
  });

  promiseTopId.then((tran_id) => {
    const transaction = [
      tran_id,
      tranData,
      tranWartosc,
      uzytId,
      podId,
      tranNazwa,
      tranStatus,
    ];
    const sqlAddTransaction =
      "INSERT INTO Transakcje (tran_id, tran_data,  tran_wartosc, tran_id_uzyt, tran_id_podmiot, tran_nazwa, tran_status) VALUES (?,?,?,?,?,?,?)";
    db.query(sqlAddTransaction, transaction, (err, data) => {
      if (!err) {
        res.json({
          status: 200,
          data: tran_id,
        });
      } else {
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });
  // .then(() => {
  //   const promiseActullSaldo = new Promise((resolve, reject) => {
  //     let pod_saldo = null;
  //     const sqlCheckAccountValue = `SELECT pod_saldo FROM Podmiot WHERE pod_id=${podId}`;
  //     db.query(sqlCheckAccountValue, function (err, data, fields) {
  //       const saldoArray = Object.values(JSON.parse(JSON.stringify(data[0])));
  //       pod_saldo = saldoArray[0] + Number(tranWartosc);
  //       resolve(pod_saldo);
  //     });
  //   });
  //   promiseActullSaldo.then((pod_saldo) => {
  //     const sqlUpdateAccountValue = `UPDATE Podmiot SET pod_saldo=${pod_saldo} WHERE pod_id=${podId}`;
  //     db.query(sqlUpdateAccountValue, (err, data) => {
  //       if (!err) {
  //         res.json({
  //           status: 200,
  //           data: data,
  //         });
  //       } else {
  //         const errData = helpers.handleErrors();
  //         res.json(errData);
  //         return;
  //       }
  //     });
  //   });
  // });
};
exports.updateTransactionWhenUserPaid = (req, res, next) => {
  const { tran_id, tran_wartosc } = req.body;

  const sqlUpdateTransaction = `UPDATE Transakcje SET tran_wartosc='${tran_wartosc}', tran_status = 1 WHERE tran_id=${tran_id}`;
  db.query(sqlUpdateTransaction, function (err, data, fields) {
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

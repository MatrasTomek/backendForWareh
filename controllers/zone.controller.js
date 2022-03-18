const db = require("../database");
const _ = require("lodash");
// GET BY CITY FROM Strefy

exports.getZoneByCityFromStrefy = (req, res, next) => {
  const { itemData } = req.params;
  const sql = "SELECT * FROM Strefy";
  const searchedData = [];

  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    if (!itemData) {
      return searchedData;
    }
    data.forEach((item) => {
      if (item.str_miejscowosc.toUpperCase().includes(itemData.toUpperCase())) {
        searchedData.push(item);
      }
    });

    // const sortedData = searchedData.reduce((total, item) => {
    //   const uniqZip = item.str_kod.slice(0, 4);
    //   if (total.indexOf(uniqZip) === -1) {
    //     total.push(item);
    //   }
    //   //wrziuca do tabeli to co filtruje
    //   return total;
    // }, []);

    const uniqZip = _.uniqBy(searchedData, "str_lok_id");

    res.json(uniqZip);
  });
};

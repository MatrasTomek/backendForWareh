const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const scheduledFunctions = require("./helpers/cronSchedule");

const app = express();

app.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const criteriaRoutes = require("./routes/zone.routes");
const companyRoutes = require("./routes/company.routes");
const complainRoutes = require("./routes//complain.routes");
const detailsRoutes = require("./routes/details.routes");
const historyRoutes = require("./routes/history.routes");
const kindOfServicesRoutes = require("./routes/kindOfServices.routes");
const magsRoutes = require("./routes/mag.routes");
const packingRoutes = require("./routes/packing.routes");
const palletsRoutes = require("./routes/paletsPlaces.routes");
const servicesRoutes = require("./routes/services.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const transactionRoutes = require("./routes/transaction.routes");
const usersRoutes = require("./routes/users.routes");

app.use("/company", companyRoutes);
app.use("/complain", complainRoutes);
app.use("/details", detailsRoutes);
app.use("/history", historyRoutes);
app.use("/kindof", kindOfServicesRoutes);
app.use("/mags", magsRoutes);
app.use("/packing", packingRoutes);
app.use("/places", palletsRoutes);
app.use("/services", servicesRoutes);
app.use("/subscribe", subscriptionRoutes);
app.use("/transactions", transactionRoutes);
app.use("/user", usersRoutes);
app.use("/zones", criteriaRoutes);

scheduledFunctions.initScheduledJobs();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;

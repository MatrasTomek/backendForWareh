const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_HOST = process.env.MAIL_HOST;

exports.warehInfo = (propsWareh) => {
	const { title, info1, info2, info3, info4, subject, mailTo } = propsWareh;

	const mailFrom = "automat@twojemagazyny.pl";

	const selfSignedConfig = {
		host: MAIL_HOST,
		port: 465,
		secure: true, // użwa TLS
		auth: {
			user: "automat@twojemagazyny.pl",
			pass: MAIL_PASS,
		},
		tls: {
			// nie przerywa przy błędnym certyfikacie
			rejectUnauthorized: false,
		},
	};
	const transport = nodemailer.createTransport(selfSignedConfig);

	transport
		.sendMail({
			to: `${mailTo}`,
			from: `${mailFrom}`,
			subject: `${subject}`,
			html: `<html>\n  <head><h3>${title}</h3>\n</head>\n  <body>\n    <p>${info1}  <br/>\n </p>\n <p>${info2}  <br/>\n </p>\n<p>${info3}  <br/>\n </p>\n<p>${info4}  <br/>\n </p>\n <h4>Pozdrawiamy, twojemagazyny.pl  <br/>\n </h4>\n</body>\n</html>`,
		})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.log(err);
			return err;
		});
};

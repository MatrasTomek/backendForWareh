const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_HOST = process.env.MAIL_HOST;

exports.mailSend = (props) => {
	const { title, link, infoBeforeLink, additionalInfo, subject, mailTo } = props;

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
			html: `<html>\n  <head><h2>${title}</h2>\n</head>\n  <body>\n    <p>${infoBeforeLink}  <br/>\n </p>\n <a href="${link}">${link}</a>\n <p>${additionalInfo}</p>\n</body>\n</html>`,
		})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.log(err);
			return err;
		});
};

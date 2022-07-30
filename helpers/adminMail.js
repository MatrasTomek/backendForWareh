const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_HOST = process.env.MAIL_HOST;

exports.adminInfo = (adminData) => {
	const { mailFrom, content } = adminData;

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
			to: "rejestracja@twojemagazyny.pl",
			from: "automat@twojemagazyny.pl",
			subject: `Użytkownik ${content}`,
			html: `<p>Użytkownik: ${mailFrom} - ${content} </p>`,
		})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.log(err);
			return err;
		});
};

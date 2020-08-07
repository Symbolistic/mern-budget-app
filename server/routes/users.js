const express = require("express");
const router = express.Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
const { User } = require("../models/User");
const passportConfig = require("../middleware/passport"); // This is needed for the middleware

//const config = require("../config/key");


const nodemailer = require("nodemailer");


//=================================
//             User
//=================================

const signToken = (userID) => {
	return JWT.sign(
		{
			iss: "Symbol",
			sub: userID,
		},
		"Symbol",
		{ expiresIn: "1h" }
	);
};

router.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	User.findOne({ email: email.toLowerCase() }, (err, document) => {
		if (err) {
			return res
				.status(500)
				.json({ message: { msgBody: "Error has occured", msgError: true } });
		}

		// Error code if email exists
		if (document)
			return res
				.status(400)
				.json({
					message: { msgBody: "Email is already in use", msgError: true },
				});

		// Error code if name field is empty/falsy
		if (!name)
			return res
				.status(400)
				.json({
					message: { msgBody: "Please enter your name", msgError: true },
				});

		// Error code is password is less than 6 characters
		if (password.length < 6)
			return res
				.status(400)
				.json({
					message: {
						msgBody: "Password must be at least 6 characters",
						msgError: true,
					},
				});
		else {
			const newUser = new User({
				name,
				email: email.toLowerCase(),
				password,
				role: "user",
			});
			newUser.save((err) => {
				if (err)
					return res
						.status(500)
						.json({
							message: { msgBody: "Error has occured", msgError: true },
						});
				else
					return res
						.status(201)
						.json({
							message: {
								msgBody: "Account successfully created",
								msgError: false,
							},
						});
			});
		}
	});
});

router.post(
	"/login",
	passport.authenticate("local", { session: false }),
	(req, res) => {
		if (req.isAuthenticated()) {
			const { _id, name, email, role } = req.user;
			const token = signToken(_id);
			res.cookie("access_token", token, { httpOnly: true, sameSite: true });
			res
				.status(200)
				.json({
					isAuthenticated: true,
					user: { userFrom: _id, name, email, role },
				});
		}
	}
);

// Forgot Password Route
router.put("/forgot-password", (req, res) => {
	const email = req.body.email;

	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (err) {
			return res
				.status(500)
				.json({ message: { msgBody: "Error has occured", msgError: true } });
		}

		if (!user) {
			return res
				.status(400)
				.json({ message: { msgBody: "Email not found", msgError: true } });
		}

		const token = JWT.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
			expiresIn: "20m",
		});

		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.NODEMAIL_USER,
				pass: process.env.NODEMAIL_PASS
			}
		})


		const data = {
			from: "noreply@budget.com",
			to: email,
			subject: "Password Reset Link",
			html: `
                <h2>Please click on the given link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/reset/${token}</p>
            `,
		};

		return user.updateOne({ resetLink: token }, (err, success) => {
			if (err) {
				return res
					.status(400)
					.json({
						message: { msgBody: "Reset Password Link Error", msgError: true },
					});
			} else {
				transporter.sendMail(data, function (error, body) {
					if (error) {
						console.log(error)
						return res.status(500).json({
							message: { msgBody: "Houston, we have a problem, ERROR", msgError: true}
						});
					}
					return res.json({
						message: { msgBody: "Password Reset has been emailed to you", msgError: false },
					});
				});
			}
		});
	});
});

// Reset Password Route
router.put("/reset-password", (req, res) => {
	const { resetLink, newPass } = req.body;

	if (resetLink) {
		JWT.verify(resetLink, config.RESET_PASSWORD_KEY, (err, decodedData) => {
			if (err) {
				return res.status(401).json({
					message: { msgBody: "Incorrect Token or it has expired" },
				});
			}

			// Find the user by using the resetLink
			User.findOne({ resetLink }, (err, user) => {
				if (err) {
					return res
						.status(500)
						.json({
							message: { msgBody: "Error has occured", msgError: true },
						});
				}

				if (!user) {
					return res
						.status(400)
						.json({
							message: {
								msgBody: "User with this token does not exist",
								msgError: true,
							},
						});
				}

				// Error code is password is less than 6 characters
				if (newPass.length < 6) {
					return res
						.status(400)
						.json({
							message: {
								msgBody: "Password must be at least 6 characters",
								msgError: true,
							},
						});
				}

				user.password = newPass;

				user.save((err, result) => {
					if (err) {
						return res
							.status(400)
							.json({
								message: { msgBody: "Reset Password Error", msgError: true },
							});
					} else {
						return res
							.status(200)
							.json({ message: { msgBody: "Your password has been changed", msgError: false }});
					}
				});
			});
		});
	} else {
		return res
			.status(401)
			.json({ message: "Authentication Error!", msgError: true });
	}
});

router.get(
	"/logout",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.clearCookie("access_token");
		res.json({ user: { name: "", email: "", role: "" }, success: true });
	}
);

router.get(
	"/admin",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		if (req.user.role === "admin")
			res
				.status(200)
				.json({ message: { msgBody: "You are an admin", msgError: false } });
		else {
			res
				.status(403)
				.json({
					message: { msgBody: "You are not an admin, go away", msgError: true },
				});
		}
	}
);

router.get(
	"/authenticated",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { _id, name, email, role } = req.user;
		res
			.status(200)
			.json({
				isAuthenticated: true,
				user: { userFrom: _id, name, email, role },
			});
	}
);

module.exports = router;

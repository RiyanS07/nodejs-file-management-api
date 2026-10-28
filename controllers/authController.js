const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendSuccess, sendFailure } = require("../responseHandler");

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return sendFailure(
                res,
                400,
                "Username and password are required."
            );
        }

        if (username !== process.env.AUTH_USERNAME) {
            return sendFailure(res, 401, "Invalid credentials.");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            process.env.AUTH_PASSWORD_HASH
        );

        if (!isPasswordValid) {
            return sendFailure(res, 401, "Invalid credentials.");
        }

        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return sendSuccess(res, 200, "Login successful.", { token });
    } catch (error) {
        console.error("Login error:", error);
        return sendFailure(res, 500, "Login failed.");
    }
}

module.exports = { login };

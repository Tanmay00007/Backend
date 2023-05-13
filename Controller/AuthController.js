const { success } = require("../Helper/Response");
const { ROLE } = require("../Helper/Role_Constant");
const Users = require("../Model/User");
const bcrypt = require("bcrypt");
const sendMail = require("../Services/EmailServices");
const getJwtToken = require("../Helper/GetJwtToken");



exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const isUserExist = await Users.findOne({
            email
        })
        if (isUserExist) {
            return res.status(400).json({ error: true, message: "User already exist" });
        }
        const user = await Users.create({
            email: email,
            password: password,
            userType: ROLE,
        });

        const isEmailSent = await sendMail({ email }, "Here is your OTP to verify your account: " + generatedOTP, "Successfully register on OIR")
        if (isEmailSent === null) {
            return res.status(200).json(success(`${email}  is register successfully but we are facing some email issue.`, { id: user._id }))
        }
        return res.status(200).json(success(`${email}  is register successfully`, { id: user._id }))
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: true, message: "Please provide all requied fields" });
        }
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: "Invalide Credentials" });
        }
        const token = getJwtToken(user._id);
        const response ={
            id:user._id,
            email:user.email,
            userType:user.ROLE,
            token
        }
        return res.status(200).json(success("Login Successful", response))

    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}
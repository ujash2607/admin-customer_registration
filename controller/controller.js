const sql = require("../database/db");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};


const sendVerificationEmail = (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.emailUser,
            pass: process.env.emailPass
        }
    });

    const mailOptions = {
        from: process.env.emailUser,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${process.env.verifyEmailUrl}=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending verification email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
};

const addCustomer = async (req, res) => {
    let text, values;

    try {

        const { first_name, last_name, email, password } = req.body;
        let role = 'customer';

        text = `SELECT * FROM users WHERE email = ?`;
        values = [email];
        console.log(text, values);

        const [checkUser] = await sql.query(text, values);

        if (checkUser.length > 0) {

            console.log(`This user ${email} is alredy registered`);
            res.status(400).send({ success: false, message: `This user ${email} is alredy registered` });
        }
        else {
            const token = generateVerificationToken();
            const hashedPassword = await bcrypt.hash(password, 10);

            text = 'INSERT INTO users (first_name, last_name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
            values = [first_name, last_name, email, hashedPassword, role, false];

            const [result] = await sql.query(text, values);
            const userId = result.insertId;

            text = 'INSERT INTO verification_tokens (user_id, token) VALUES (?, ?)';
            values = [userId, token];
            await sql.query(text, values);

            sendVerificationEmail(email, token);

            const adduser = await sql.query(text, values);
            res.status(200).send({ success: true, message: `User registered successfully, please check your email for email verification` });
        }
    } catch (error) {
        console.log(error, 'error while add user');
        res.status(400).send({ success: false, message: 'error while add user', error: error });
    }
}


const addAdmin = async (req, res) => {
    let text, values;
    try {
        const { first_name, last_name, email, password } = req.body;
        let role = 'admin';

        text = `SELECT * FROM users WHERE email = ?`;
        values = [email];
        console.log(text, values);

        const [checkUser] = await sql.query(text, values);

        if (checkUser.length > 0) {

            console.log(`This user ${email} is alredy registered`);
            res.status(400).send({ success: false, message: `This user ${email} is alredy registered` });
        }
        else {
            const token = generateVerificationToken();

            const hashedPassword = await bcrypt.hash(password, 10);

            text = 'INSERT INTO users (first_name, last_name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
            values = [first_name, last_name, email, hashedPassword, role, false];

            const [result] = await sql.query(text, values);
            const userId = result.insertId;

            text = 'INSERT INTO verification_tokens (user_id, token) VALUES (?, ?)';
            values = [userId, token];
           await sql.query(text, values);

            sendVerificationEmail(email, token);

            const adduser = await sql.query(text, values);
            res.status(200).send({ success: true, message: `User registered successfully, Please check your email for email verification` });
        }
    } catch (error) {
        console.log(error, 'error while add user');
        res.status(400).send({ success: false, message: 'error while add user', error: error });
    }
}


const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        let text = 'SELECT * FROM verification_tokens WHERE token = ?';
        let values = [token];
        const [result] = await sql.query(text, values);

        if (result.length === 0) {
            return res.status(400).send({ success: false, message: 'Invalid or expired token' });
        }

        const userId = result[0].user_id;
        text = 'UPDATE users SET is_verified = ? WHERE id = ?';
        values = [true, userId];
        await sql.query(text, values);

        text = 'DELETE FROM verification_tokens WHERE token = ?';
        values = [token];
        await sql.query(text, values);

        res.status(200).send({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error verifying email' });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
        let text, values;

    try {
        text = 'SELECT * FROM users WHERE email = ?';
        values = [email]
        const [result] = await sql.query(text, values);

        if (result.length === 0 || result[0].role !== 'admin') {
            console.log('You are not allowed to login from here');
            return res.status(400).send({ success: false, message: 'You are not allowed to login from here' });
        }

        const user = result[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ success: false, message: 'Invalid email or password'});
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ success: true, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error logging in' });
    }
};



module.exports = {
    addCustomer,
    addAdmin,
    verifyEmail,
    adminLogin
}
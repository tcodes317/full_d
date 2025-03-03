const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt"); // Import bcrypt
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // import in forgot password
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

// Secret key for JWT
const JWT_SECRET = "your_jwt_secret";

// Secret for email verification link
const SECRET_KEY = "your_email_secret";

// Secret key for encryption/decryption (Loaded from .env file for security)
// const secretKey = "your-secret-key";

// Generate a secret key (must be stored securely) >> I just added this to see the result. The secretKey = "your-secret-key" is the main.
const secretKey = crypto.randomBytes(32); // 256-bit key

const app = express();
const port = 5000;

//middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test_db",
});


db.connect((err) => {
    if (err) {
      console.error("Database connection error:", err);
      return;
    }
    console.log("Connected to the MySQL database.");
});


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tcodes317@gmail.com",
    pass: "lfgk bkns dafz cmjs"
  }
});


// Function to generate hashed verification link >> this is for register
const generateVerificationHash = (email) => {
  return crypto.createHmac("sha256", SECRET_KEY).update(email).digest("hex");
};

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Store user in MySQL with hashed password
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }

      const verificationHash = generateVerificationHash(email);
      const verificationLink = `http://localhost:5000/verify?email=${encodeURIComponent(email)}&hash=${verificationHash}`;

      const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Verify Your Email",
        html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Email failed to send:", error);
          return res.status(500).json({ message: "Failed to send verification email" });
        }

        res.json({
          message: `A verification link has been sent to ${email}. Please check your inbox.`,
        });
      });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// There's need for verification

app.get("/verify", (req, res) => {
    const { email, hash } = req.query;
  
    if(!email || !hash){
      return res.status(400).send("Missing parameters");
    }
  
    const expectedHash = generateVerificationHash(email);
  
    if (hash === expectedHash) {
      res.redirect(`http://localhost:5173/verify-email?email=${email}&hash=${hash}`);
    } else {
      res.redirect("http://localhost:5173/verify-email?status=error");
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required." });
    }
  
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Error fetching user." });
      }
  
      

      if (results.length === 0) {
        return res.status(404).send({ message: "User not found." });
      }
  
      const user = results[0];

      //  // 🚨 Check if the user has verified their email
      // if (!user.isVerified) {
      //   return res.status(401).send({ message: "Please verify your email address." });
      // }

      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid email or password." });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h", // Token expires in 1 hour
      });
  
      res.status(200).send({ message: "Login successful!", token });
    });
});

app.post("/logout", (req, res)=>{
  // const token = req.body.token;
  const { token } = req.body;

  if(!token){
    return res.status(400).json({ message: "Token is required."})
  }

  try{
    jwt.verify(token, JWT_SECRET); //verify the token
    invalidatedTokens.add(token); // Add the token to the invalidate list
    res.status(200).json({ message: "Logout successful."});
  }
  catch(error){
    res.status(401).json({ message: "Invalid token."});
  }
})


// Object to store temporary reset tokens
const resetTokens = {}; // Temporary storage. Needed in forgot-password

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (results.length === 0) return res.status(404).json({ error: "User not found." });

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    resetTokens[email] = { resetToken, resetTokenExpiry };

    // Auto-delete token after expiration
    setTimeout(() => {
      if (resetTokens[email]?.resetTokenExpiry <= Date.now()) {
        delete resetTokens[email];
      }
    }, 3600000);

    // Reset link with the plain token
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log("Reset link:", resetLink);

    // Email configuration
    const mailOptions = {
      from: "tcodes317@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `<p>You requested a password reset. Click the link below:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>If you did not request this, please ignore this email.</p>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (err) => {
      if (err) return res.status(500).json({ error: "Error sending email." });
      res.status(200).json({ message: "Password reset link sent to your email." });
    });
  });
});

app.post("/reset-password/:resetToken", (req, res) => {
  const { resetToken } = req.params; // Token from URL
  const { newPassword } = req.body; // New password sent in the body

  if (!newPassword) return res.status(400).json({ error: "New password is required" });

  // Find the email associated with the reset token
  let emailFound = null;

  // Check if the token exists in the resetTokens object
  for (const [email, tokenData] of Object.entries(resetTokens)) {
    if (tokenData.resetToken === resetToken) {
      emailFound = email;
      break;
    }
  }

  // If no token match is found
  if (!emailFound) return res.status(400).json({ error: "Invalid or expired token" });

  // Check if the token is expired
  const tokenData = resetTokens[emailFound];
  if (Date.now() > tokenData.resetTokenExpiry) {
    delete resetTokens[emailFound]; // Remove expired token
    return res.status(400).json({ error: "Token has expired" });
  }

  // Proceed to update the user's password in the database
  const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the password

  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, emailFound],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error." });

      // Successfully updated password, remove the reset token
      delete resetTokens[emailFound];

      res.status(200).json({ message: "Password reset successfully." });
    }
  );
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
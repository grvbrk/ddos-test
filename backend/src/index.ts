import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Rate limiter configuration
const otpLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // Limit each IP to 3 OTP requests per windowMs
  message: "Too many requests, please try again after 5 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 password reset requests per windowMs
  message:
    "Too many password reset attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

const otpStore: Record<string, number> = {};

app.get("/", (req, res) => {
  return res.send("Working");
});

app.post("/generate-otp", otpLimiter, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  console.log(`OTP for ${email}: ${otp}`); // Log the OTP to the console
  res.status(200).json({ message: "OTP generated and logged" });
});

app.post("/reset-password", passwordResetLimiter, async (req, res) => {
  const { email, otp, newPassword, token } = req.body;

  //check captcha
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  let formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY as string);
  formData.append("response", token);

  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const challenge = await result.json();
  console.log(process.env.TURNSTILE_SECRET_KEY);
  console.log(challenge);
  const success = challenge.success;

  if (!success) {
    return res.status(403).json({ message: "Invalid reCAPTCHA token" });
  }

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }

  if (otpStore[email] === otp) {
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    delete otpStore[email]; // Clear the OTP after use
    res.status(200).json({ message: "Password has been reset successfully" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

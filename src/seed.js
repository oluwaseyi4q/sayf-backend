require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

async function main() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@sayftechnology.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });

  console.log(`Admin created: ${email}`);
  console.log("Change the password after first login.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

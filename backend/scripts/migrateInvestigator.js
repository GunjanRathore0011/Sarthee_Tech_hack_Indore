const mongoose = require("mongoose");
const Investigator = require("../models/InvestigatorSchema"); // path to your model
const User = require("../models/User"); // path to your model
require("dotenv").config();

async function migrateInvestigatorsToUsers() {
     await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  try {
    const investigators = await Investigator.find({});
    console.log(`Found ${investigators.length} investigators`);

    for (const inv of investigators) {
      // Check if a user already exists
      const existingUser = await User.findOne({ additionDetails: inv._id });
      if (existingUser) {
        console.log(`User already exists for investigator ${inv.name}`);
        continue; // skip
      }

      // Create a User for the investigator
      const user = new User({
        userName: inv.name,
        email: inv.email,
        number: inv.phone,
        accountType: "Officer", // or "Officier" if you want to match spelling
        additionDetails: inv._id
      });

      await user.save();
      console.log(`Created user for investigator ${inv.name}`);
    }

    console.log("Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateInvestigatorsToUsers();

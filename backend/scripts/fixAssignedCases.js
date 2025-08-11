const mongoose = require("mongoose");
const Investigator = require("../models/InvestigatorSchema");
const Complaint = require("../models/Complaint");
require("dotenv").config();

async function runMigration() {
  await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("🔍 Checking investigators with missing caseId...");

  const investigators = await Investigator.find({
    "assignedCases.caseId": { $exists: false }
  });

  console.log(`Found ${investigators.length} investigators with missing caseId`);

  for (const inv of investigators) {
    let updated = false;

    inv.assignedCases.forEach((ac) => {
      if (!ac.caseId) {
        // Check if the _id of subdoc is actually a complaintId
        // This assumes your old data stored the complaint ID in the subdoc's _id
        const possibleComplaintId = ac._id;

        // Only update if that complaint exists
        if (mongoose.Types.ObjectId.isValid(possibleComplaintId)) {
          ac.caseId = possibleComplaintId;
          updated = true;
          console.log(`✅ Added caseId for investigator ${inv._id}, subdoc ${ac._id}`);
        }
      }
    });

    if (updated) {
      await inv.save();
      console.log(`💾 Saved investigator ${inv._id}`);
    }
  }

  console.log("🎯 Migration completed!");
  mongoose.disconnect();
}

runMigration().catch(err => {
  console.error("❌ Migration error:", err);
  mongoose.disconnect();
});

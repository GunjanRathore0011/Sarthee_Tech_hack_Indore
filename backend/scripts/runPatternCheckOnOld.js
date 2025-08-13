require('dotenv').config();
const mongoose = require('mongoose');
const PatternAlert = require('../models/PatternAlert');

function normalizeIds(ids) {
  return Array.from(new Set(ids.map(id => id.toString())));
}

(async () => {
  await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Connected');

  const alerts = await PatternAlert.find({});
  for (const alert of alerts) {
    const uniqueComplaints = normalizeIds(alert.complaints || []);
    alert.complaints = uniqueComplaints;
    alert.count = uniqueComplaints.length;
    await alert.save();
    console.log(`Updated alert ${alert._id} with ${uniqueComplaints.length} unique complaints`);
  }

  console.log('Migration complete');
  process.exit(0);
})();

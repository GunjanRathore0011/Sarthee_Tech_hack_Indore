require('dotenv').config();
const mongoose = require('mongoose');
const Suspect = require('../models/SuspectSchema');
const { checkAndCreateAlerts } = require('../utils/pattern');

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    const suspects = await Suspect.find({});
    console.log(`Found ${suspects.length} suspects`);

    for (const suspect of suspects) {
      await checkAndCreateAlerts(suspect);
    }

    console.log('Pattern detection complete for old suspects');
    process.exit(0);
  } catch (err) {
    console.error('Error running pattern check:', err);
    process.exit(1);
  }
})();

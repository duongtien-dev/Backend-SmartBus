const app = require('./app');
const connectDB = require('./src/config/database');
const config = require('./src/config');
const { seedTicketProducts } = require('./src/seeds/seedTicketProducts');
const { migrateReviewRefs } = require('./src/seeds/migrateReviewRefs');

connectDB().then(async () => {
    await migrateReviewRefs();
    await seedTicketProducts();
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
});

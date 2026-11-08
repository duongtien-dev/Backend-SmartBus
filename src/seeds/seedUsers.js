const bcrypt = require('bcryptjs');

async function seedUsers(User, users, { repairPasswords = false, log = () => {} } = {}) {
    const userMap = {};
    for (const data of users) {
        const existing = await User.findOne({ email: data.email }).select('+password');
        if (existing) {
            if (repairPasswords && !(await bcrypt.compare(data.password, existing.password))) {
                // User's pre-save hook hashes the plain password exactly once.
                existing.password = data.password;
                await existing.save();
                log(`Repaired password: ${data.email}`);
            } else {
                log(`User already exists: ${data.email}`);
            }
            userMap[data.email] = existing;
        } else if (!repairPasswords) {
            userMap[data.email] = await User.create(data);
            log(`Created user: ${data.email} [${data.role}]`);
        } else {
            log(`User not found, skipped: ${data.email}`);
        }
    }
    return userMap;
}

module.exports = { seedUsers };

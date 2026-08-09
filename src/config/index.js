require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwfzptm5v',
        api_key: process.env.CLOUDINARY_API_KEY || '134838427692594',
        api_secret: process.env.CLOUDINARY_API_SECRET || 'ZLQkvDyyA_bI8kazbqUvQp_fcnU',
        folder: process.env.CLOUDINARY_FOLDER || 'backend-bus',
    },
    smtp: {
        host: process.env.SMTP_HOST || '',
        port: Number(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.FROM_EMAIL || 'noreply@example.com',
    },
    /** Secret cho cron gọi POST /api/notify/dispatch */
    workerSecret: process.env.WORKER_SECRET || 'dev-worker-secret',
    /** Key thiết bị GPS cố định trên xe (A1-Full) */
    vehicleGpsSecret: process.env.VEHICLE_GPS_SECRET || 'dev-vehicle-gps-secret',
};

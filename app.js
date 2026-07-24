const express = require('express');
const { autoValidate } = require('./src/middlewares/validate');

const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const stopRoutes = require('./src/routes/stopRoutes');
const routeReportRoutes = require('./src/routes/routeReportRoutes');
const favoriteRouteRoutes = require('./src/routes/favoriteRouteRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const adminUserRoutes = require('./src/routes/adminUserRoutes');
const suggestLocationRoutes = require('./src/routes/suggestLocationRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const paymentMethodRoutes = require('./src/routes/paymentMethodRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const shiftReportRoutes = require('./src/routes/shiftReportRoutes');
const adminShiftReportRoutes = require('./src/routes/adminShiftReportRoutes');
const leaveRequestRoutes = require('./src/routes/leaveRequestRoutes');
const activeShiftRoutes = require('./src/routes/activeShiftRoutes');
const scanLogRoutes = require('./src/routes/scanLogRoutes');
const staffScheduleRoutes = require('./src/routes/staffScheduleRoutes');
const adminStaffScheduleRoutes = require('./src/routes/adminStaffScheduleRoutes');
const adminDashboardRoutes = require('./src/routes/adminDashboardRoutes');
const ticketProductRoutes = require('./src/routes/ticketProductRoutes');
const adminTicketProductRoutes = require('./src/routes/adminTicketProductRoutes');
const app = express();

autoValidate();
app.use(express.json());
app.use(morgan('dev'));

// CORS middleware cho cả 3000 và 5173
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:8081',
            'http://localhost:9000',
            'http://192.168.1.43:8081',
        ],
        credentials: true,
    })
);

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/route-reports', routeReportRoutes);
app.use('/api/route-favorites', favoriteRouteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/suggest-locations', suggestLocationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ticket-products', ticketProductRoutes);
app.use('/api/admin/ticket-products', adminTicketProductRoutes);
app.use('/api/shift-reports', shiftReportRoutes);
app.use('/api/admin/shift-reports', adminShiftReportRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/staff-shifts', activeShiftRoutes);
app.use('/api/scan-logs', scanLogRoutes);
app.use('/api/staff-schedules', staffScheduleRoutes);
app.use('/api/admin/staff-schedules', adminStaffScheduleRoutes);

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'OK' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
});

module.exports = app;

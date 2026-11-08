#!/usr/bin/env node
/**
 * ================================================================
 *  SMARTBUS – FULL SEED SCRIPT
 * ================================================================
 *  Seed toàn bộ dữ liệu mẫu cho hệ thống Backend-SmartBus
 *
 *  Usage:
 *    node src/seeds/seed.js            # chạy bình thường (upsert)
 *    node src/seeds/seed.js --fresh    # xoá sạch toàn bộ collections trước khi seed
 *
 *  Thứ tự seed (theo dependency):
 *    1. Users (admin, staff × 5, user × 10)
 *    2. Routes (5 tuyến: 03, 05, 08, 11, 16)
 *    3. Stops  (từ json/stops.json – subset 5 trạm/tuyến)
 *    4. Vehicles (10 xe)
 *    5. TicketProducts (3 loại vé)
 *    6. PaymentMethods (momo, zalopay, visa, napas – gắn vào users)
 *    7. Tickets (vé của users)
 *    8. StaffSchedules (lịch ca 7 ngày tới cho mỗi staff)
 *    9. ActiveShifts (1 ca đang chạy)
 *   10. ShiftReports (báo cáo ca lịch sử)
 *   11. ScanLogs (log quét vé)
 *   12. Reviews (đánh giá tuyến)
 *   13. FavoriteRoutes (tuyến yêu thích)
 *   14. RouteReports (báo cáo sự cố)
 *   15. Posts (tin tức / thông báo)
 *   16. LeaveRequests (đơn nghỉ phép của staff)
 *   17. TripSubscriptions (theo dõi ETA)
 * ================================================================
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ──────────────────────────────────────────────────────
const User            = require('../models/User');
const Route           = require('../models/Route');
const Stop            = require('../models/Stop');
const Vehicle         = require('../models/Vehicle');
const TicketProduct   = require('../models/TicketProduct');
const PaymentMethod   = require('../models/paymentMethod');
const Ticket          = require('../models/Ticket');
const StaffSchedule   = require('../models/StaffSchedule');
const ActiveShift     = require('../models/ActiveShift');
const ShiftReport     = require('../models/ShiftReport');
const ScanLog         = require('../models/ScanLog');
const Review          = require('../models/Review');
const FavoriteRoute   = require('../models/FavoriteRoute');
const RouteReport     = require('../models/RouteReport');
const Post            = require('../models/Post');
const LeaveRequest    = require('../models/LeaveRequest');
const TripSubscription = require('../models/TripSubscription');

// ── Helpers ──────────────────────────────────────────────────────
const log = (msg) => console.log(`  ✔  ${msg}`);
const warn = (msg) => console.warn(`  ⚠  ${msg}`);

function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    d.setHours(0, 0, 0, 0);
    return d;
}

function daysAgo(n) { return daysFromNow(-n); }

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── 1. USERS ─────────────────────────────────────────────────────
const RAW_USERS = [
    // Admin
    {
        full_name: 'Admin SmartBus',
        email: 'admin@smartbus.vn',
        phone: '0900000001',
        password: 'Admin@123',
        gender: 'male',
        role: 'admin',
        active: true,
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Phước Ninh',
        address_detail: '01 Điện Biên Phủ',
        occupation: 'Quản trị viên',
    },
    {
        full_name: 'Phó Admin Hệ Thống',
        email: 'admin2@smartbus.vn',
        phone: '0900000002',
        password: 'Admin@123',
        gender: 'female',
        role: 'admin',
        active: true,
        province: 'Đà Nẵng',
        district: 'Thanh Khê',
        ward: 'Thanh Khê Đông',
        address_detail: '10 Trần Phú',
        occupation: 'Quản trị viên',
    },
    // Staff
    {
        full_name: 'Nguyễn Văn Bình',
        email: 'staff.binh@smartbus.vn',
        phone: '0911111001',
        password: 'Staff@123',
        gender: 'male',
        role: 'staff',
        active: true,
        province: 'Đà Nẵng',
        district: 'Liên Chiểu',
        ward: 'Hòa Khánh Bắc',
        address_detail: '45 Hoàng Văn Thái',
        occupation: 'Nhân viên xe buýt',
    },
    {
        full_name: 'Trần Thị Lan',
        email: 'staff.lan@smartbus.vn',
        phone: '0911111002',
        password: 'Staff@123',
        gender: 'female',
        role: 'staff',
        active: true,
        province: 'Đà Nẵng',
        district: 'Sơn Trà',
        ward: 'Mân Thái',
        address_detail: '32 Ngô Quyền',
        occupation: 'Nhân viên xe buýt',
    },
    {
        full_name: 'Lê Minh Tuấn',
        email: 'staff.tuan@smartbus.vn',
        phone: '0911111003',
        password: 'Staff@123',
        gender: 'male',
        role: 'staff',
        active: true,
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Hải Châu I',
        address_detail: '78 Lê Duẩn',
        occupation: 'Nhân viên xe buýt',
    },
    {
        full_name: 'Phạm Thị Hoa',
        email: 'staff.hoa@smartbus.vn',
        phone: '0911111004',
        password: 'Staff@123',
        gender: 'female',
        role: 'staff',
        active: true,
        province: 'Đà Nẵng',
        district: 'Ngũ Hành Sơn',
        ward: 'Mỹ An',
        address_detail: '15 Lê Văn Hiến',
        occupation: 'Nhân viên xe buýt',
    },
    {
        full_name: 'Võ Đức Hùng',
        email: 'staff.hung@smartbus.vn',
        phone: '0911111005',
        password: 'Staff@123',
        gender: 'male',
        role: 'staff',
        active: true,
        province: 'Đà Nẵng',
        district: 'Cẩm Lệ',
        ward: 'Hòa Thọ Tây',
        address_detail: '99 Ông Ích Đường',
        occupation: 'Nhân viên xe buýt',
    },
    // Inactive staff
    {
        full_name: 'Đặng Thị Minh (Nghỉ việc)',
        email: 'staff.minh.inactive@smartbus.vn',
        phone: '0911111099',
        password: 'Staff@123',
        gender: 'female',
        role: 'staff',
        active: false,
        province: 'Đà Nẵng',
        district: 'Thanh Khê',
        ward: 'Thanh Lộc Đán',
        address_detail: '7 Dũng Sĩ Thanh Khê',
        occupation: 'Nhân viên xe buýt',
    },
    // Users (hành khách)
    {
        full_name: 'Nguyễn Văn An',
        email: 'user.an@gmail.com',
        phone: '0933000001',
        password: 'User@123',
        gender: 'male',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Nam Dương',
        address_detail: '25 Trần Phú',
        occupation: 'Sinh viên',
        date_of_birth: new Date('2002-05-15'),
    },
    {
        full_name: 'Lê Thị Bảo',
        email: 'user.bao@gmail.com',
        phone: '0933000002',
        password: 'User@123',
        gender: 'female',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Thanh Khê',
        ward: 'Xuân Hà',
        address_detail: '11 Trần Cao Vân',
        occupation: 'Giáo viên',
        date_of_birth: new Date('1990-03-20'),
        is_priority_user: true,
        priority_user: 'teacher',
    },
    {
        full_name: 'Trần Minh Châu',
        email: 'user.chau@gmail.com',
        phone: '0933000003',
        password: 'User@123',
        gender: 'male',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Sơn Trà',
        ward: 'An Hải Bắc',
        address_detail: '50 Ngô Quyền',
        occupation: 'Nhân viên văn phòng',
        date_of_birth: new Date('1995-07-10'),
    },
    {
        full_name: 'Phạm Thị Dung',
        email: 'user.dung@gmail.com',
        phone: '0933000004',
        password: 'User@123',
        gender: 'female',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Liên Chiểu',
        ward: 'Hòa Hiệp Nam',
        address_detail: '3 Nguyễn Tất Thành',
        occupation: 'Công nhân',
        date_of_birth: new Date('1988-11-25'),
        is_priority_user: true,
        priority_user: 'worker',
    },
    {
        full_name: 'Hoàng Văn Hải',
        email: 'user.hai@gmail.com',
        phone: '0933000005',
        password: 'User@123',
        gender: 'male',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Ngũ Hành Sơn',
        ward: 'Hòa Hải',
        address_detail: '200 Ngũ Hành Sơn',
        occupation: 'Lập trình viên',
        date_of_birth: new Date('1998-02-14'),
    },
    {
        full_name: 'Võ Thị Kim',
        email: 'user.kim@gmail.com',
        phone: '0933000006',
        password: 'User@123',
        gender: 'female',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Cẩm Lệ',
        ward: 'Hòa Xuân',
        address_detail: '88 Nguyễn Hữu Thọ',
        occupation: 'Sinh viên',
        date_of_birth: new Date('2003-09-01'),
    },
    {
        full_name: 'Đỗ Minh Long',
        email: 'user.long@gmail.com',
        phone: '0933000007',
        password: 'User@123',
        gender: 'male',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Phước Ninh',
        address_detail: '14 Lê Lợi',
        occupation: 'Bác sĩ',
        date_of_birth: new Date('1985-06-30'),
        is_priority_user: true,
        priority_user: 'doctor',
    },
    {
        full_name: 'Nguyễn Thị Mai',
        email: 'user.mai@gmail.com',
        phone: '0933000008',
        password: 'User@123',
        gender: 'female',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Thanh Khê',
        ward: 'Hòa Khê',
        address_detail: '62 Điện Biên Phủ',
        occupation: 'Nội trợ',
        date_of_birth: new Date('1975-04-18'),
    },
    {
        full_name: 'Bùi Văn Nam',
        email: 'user.nam@gmail.com',
        phone: '0933000009',
        password: 'User@123',
        gender: 'male',
        role: 'user',
        active: true,
        province: 'Quảng Nam',
        district: 'Hội An',
        ward: 'Cẩm Phô',
        address_detail: '5 Phan Bội Châu',
        occupation: 'Tiểu thương',
        date_of_birth: new Date('1980-12-05'),
    },
    {
        full_name: 'Lý Thị Oanh',
        email: 'user.oanh@gmail.com',
        phone: '0933000010',
        password: 'User@123',
        gender: 'female',
        role: 'user',
        active: true,
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Bình Hiên',
        address_detail: '30 Hùng Vương',
        occupation: 'Kế toán',
        date_of_birth: new Date('1992-08-22'),
    },
];

// ── 2. ROUTES ────────────────────────────────────────────────────
const ROUTE_DATA = [
    {
        code: '03',
        name: 'Tuyến 3',
        description: 'Bến xe buýt Sân bay → Bãi đỗ xe KDL Bà Nà Hills',
        isHot: false,
        turnOnDay: 3,
        startName: 'Trạm xe buýt Sân bay',
        endName: 'Bãi đỗ xe KDL Bà Nà Hills',
    },
    {
        code: '05',
        name: 'Tuyến 5',
        description: 'Chung cư Hoà Hiệp Nam → Công viên Biển Đông',
        isHot: false,
        turnOnDay: 3,
        startName: 'Chung cư Hoà Hiệp Nam',
        endName: 'Công viên Biển Đông',
    },
    {
        code: '08',
        name: 'Tuyến 8',
        description: 'Vũng Thùng → Trạm xe buýt Phạm Hùng',
        isHot: false,
        turnOnDay: 3,
        startName: 'Vũng Thùng',
        endName: 'Trạm xe buýt Phạm Hùng',
    },
    {
        code: '11',
        name: 'Tuyến 11',
        description: 'Xuân Diệu → Bệnh viện Phụ sản nhi',
        isHot: true,
        turnOnDay: 3,
        startName: 'Xuân Diệu',
        endName: 'Bệnh viện Phụ sản nhi',
    },
    {
        code: '16',
        name: 'Tuyến 16',
        description: 'Kim Liên → Đại học Việt Hàn',
        isHot: false,
        turnOnDay: 3,
        startName: 'Kim Liên',
        endName: 'Đại học Việt Hàn',
    },
];

// ── 3. STOPS (5 trạm đại diện mỗi tuyến) ───────────────────────
// key = routeCode, mỗi phần tử là 1 trạm
const STOPS_BY_ROUTE = {
    '03': [
        { stopCode: '0301', order: 1,  name: 'Bến xe buýt sân bay',           coordinates: [108.20555725799204, 16.056808306012176], times: ['06:00','10:00','14:00'] },
        { stopCode: '0302', order: 2,  name: 'Ga quốc tế sân bay Đà Nẵng',    coordinates: [108.20285807309176, 16.056845181314976], times: ['06:13','10:13','14:13'] },
        { stopCode: '0306', order: 6,  name: '130 Điện Biên Phủ',              coordinates: [108.19929921921528, 16.065807054167994], times: ['07:07','11:07','15:07'] },
        { stopCode: '0310', order: 10, name: '128 Tôn Đức Thắng',              coordinates: [108.17441522541450, 16.059110790013193], times: ['08:00','12:00','16:00'] },
        { stopCode: '0315', order: 15, name: 'Kế đình làng Đại La',            coordinates: [108.11706222339444, 16.030991140618160], times: ['09:07','13:07','17:07'] },
        { stopCode: '0318', order: 18, name: 'Bãi đỗ xe KDL Bà Nà Hills',     coordinates: [108.03623111451351, 16.025830574184440], times: ['09:47','13:47','17:47'] },
    ],
    '05': [
        { stopCode: '0501', order: 1,  name: 'Chung cư Hoà Hiệp Nam',         coordinates: [108.13279265744556, 16.108599658941262], times: ['06:00','10:07','14:06'] },
        { stopCode: '0507', order: 7,  name: '755-757 Tôn Đức Thắng',          coordinates: [108.15044452549190, 16.071464037192293], times: ['06:50','10:56','14:56'] },
        { stopCode: '0513', order: 13, name: '35-37 Kinh Dương Vương',         coordinates: [108.17289733803820, 16.072421412929520], times: ['07:39','11:46','15:46'] },
        { stopCode: '0522', order: 22, name: 'BV Đa khoa Quang Trung',         coordinates: [108.21693695574113, 16.074106277968745], times: ['08:54','13:01','17:01'] },
        { stopCode: '0525', order: 25, name: '07 Lê Duẩn',                     coordinates: [108.22150262594573, 16.071393685940410], times: ['09:19','13:26','17:26'] },
        { stopCode: '0529', order: 29, name: 'Công viên Biển Đông Võ Nguyên Giáp', coordinates: [108.24541105682050, 16.073409326633870], times: ['09:52','13:59','17:59'] },
    ],
    '08': [
        { stopCode: '0801', order: 1,  name: 'Bến xe Bùi Dương Lịch',         coordinates: [108.23234812953970, 16.089525171308210], times: ['06:00','10:00','14:00'] },
        { stopCode: '0805', order: 5,  name: '862 Ngô Quyền',                  coordinates: [108.23148450966526, 16.077376953648482], times: ['06:34','10:34','14:34'] },
        { stopCode: '0810', order: 10, name: 'Số 34 Ngũ Hành Sơn',            coordinates: [108.23698004561321, 16.052591534835890], times: ['07:17','11:17','15:17'] },
        { stopCode: '0820', order: 20, name: 'Viettronimex Plaza Nguyễn Hữu Thọ', coordinates: [108.21693695574113, 16.034106277968745], times: ['08:20','12:20','16:20'] },
        { stopCode: '0825', order: 25, name: 'Dệt may Hoà Thọ Ông Ích Đường', coordinates: [108.19500000000000, 16.021000000000000], times: ['08:55','12:55','16:55'] },
        { stopCode: '0828', order: 28, name: 'Bến xe buýt Phạm Hùng',         coordinates: [108.18500000000000, 16.013000000000000], times: ['09:30','13:30','17:30'] },
    ],
    '11': [
        { stopCode: '1101', order: 1,  name: 'Bến xe buýt Xuân Diệu',         coordinates: [108.22870000000000, 16.086500000000000], times: ['06:00','10:00','14:00'] },
        { stopCode: '1105', order: 5,  name: 'Bờ hồ 1 Hàm Nghi',              coordinates: [108.22400000000000, 16.075800000000000], times: ['06:30','10:30','14:30'] },
        { stopCode: '1110', order: 10, name: 'Trường THPT Nguyễn Hiền',        coordinates: [108.21200000000000, 16.052300000000000], times: ['07:10','11:10','15:10'] },
        { stopCode: '1118', order: 18, name: 'Siêu thị Lotte',                 coordinates: [108.22100000000000, 16.040300000000000], times: ['07:50','11:50','15:50'] },
        { stopCode: '1122', order: 22, name: 'Số 256 Lê Văn Hiến',             coordinates: [108.22600000000000, 16.034100000000000], times: ['08:20','12:20','16:20'] },
        { stopCode: '1124', order: 24, name: 'BV Phụ sản nhi Đà Nẵng',        coordinates: [108.22870000000000, 16.030300000000000], times: ['08:40','12:40','16:40'] },
    ],
    '16': [
        { stopCode: '1601', order: 1,  name: 'Kim Liên',                       coordinates: [108.20300000000000, 16.102000000000000], times: ['06:00','10:00','14:00'] },
        { stopCode: '1605', order: 5,  name: '171 Nguyễn Văn Cừ',              coordinates: [108.20100000000000, 16.082000000000000], times: ['06:25','10:25','14:25'] },
        { stopCode: '1610', order: 10, name: 'Trung tâm Hành chính TP',        coordinates: [108.20800000000000, 16.068000000000000], times: ['06:55','10:55','14:55'] },
        { stopCode: '1615', order: 15, name: 'Cầu Rồng',                       coordinates: [108.22700000000000, 16.061000000000000], times: ['07:25','11:25','15:25'] },
        { stopCode: '1618', order: 18, name: 'ĐH Việt Hàn (Khu A)',            coordinates: [108.26300000000000, 16.054000000000000], times: ['07:50','11:50','15:50'] },
        { stopCode: '1620', order: 20, name: 'Đại học Việt Hàn',               coordinates: [108.26900000000000, 16.048000000000000], times: ['08:05','12:05','16:05'] },
    ],
};

// ── 4. VEHICLES ──────────────────────────────────────────────────
const VEHICLE_DATA = [
    { plateNumber: '43B-001.11', capacity: 60 },
    { plateNumber: '43B-002.22', capacity: 45 },
    { plateNumber: '43B-003.33', capacity: 60 },
    { plateNumber: '43B-004.44', capacity: 45 },
    { plateNumber: '43B-005.55', capacity: 30 },
    { plateNumber: '43B-006.66', capacity: 60 },
    { plateNumber: '43B-007.77', capacity: 45 },
    { plateNumber: '43B-008.88', capacity: 30 },
    { plateNumber: '43B-009.99', capacity: 60 },
    { plateNumber: '43B-010.00', capacity: 45, active: false },
];

// ── 5. TICKET PRODUCTS ───────────────────────────────────────────
const TICKET_PRODUCTS = [
    { code: 'single',            title: 'Vé lượt',           validity: 'Có giá trị sử dụng 1 lần',                       unitPrice: 8000,   active: true, sortOrder: 1 },
    { code: 'monthlySingleRoute', title: 'Vé tháng đơn tuyến', validity: 'Có giá trị trong 1 tháng (áp dụng 1 tuyến)',  unitPrice: 80000,  active: true, sortOrder: 2 },
    { code: 'monthlyInterRoute', title: 'Vé tháng liên tuyến', validity: 'Có giá trị trong 1 tháng (áp dụng mọi tuyến)', unitPrice: 120000, active: true, sortOrder: 3 },
];

// ── POST DATA ────────────────────────────────────────────────────
const POST_CONTENTS = [
    {
        title: 'Tuyến 11 tạm dừng do sửa chữa đường',
        summary: 'Tuyến xe buýt số 11 tạm thời điều chỉnh lịch trình do thi công đường Lê Văn Hiến.',
        content: `Kính gửi quý hành khách,\n\nDo công trình sửa chữa đường Lê Văn Hiến (đoạn từ số 200 đến 400), từ ngày 10/11/2026 đến 20/11/2026, tuyến xe buýt số 11 sẽ điều chỉnh lộ trình như sau:\n\n- Xe sẽ đi theo đường Hồ Xuân Hương thay đoạn Lê Văn Hiến bị chặn.\n- Thời gian đi lại dự kiến tăng thêm 10-15 phút.\n\nXin lỗi vì sự bất tiện này. Chúng tôi sẽ thông báo ngay khi tuyến hoạt động bình thường trở lại.\n\nTrân trọng,\nBan Quản lý SmartBus Đà Nẵng`,
        category: 'Thông báo',
    },
    {
        title: 'Thông báo lịch nghỉ Tết Dương lịch 2027',
        summary: 'Lịch hoạt động xe buýt trong dịp Tết Dương lịch 1/1/2027.',
        content: `Nhân dịp Tết Dương lịch 2027, xe buýt SmartBus sẽ hoạt động theo lịch đặc biệt:\n\n📅 Ngày 1/1/2027: Chạy theo lịch Chủ nhật (tần suất thưa hơn)\n📅 Ngày 2-3/1/2027: Trở lại lịch bình thường\n\nMột số tuyến giảm chuyến vào buổi sáng sớm. Hành khách vui lòng kiểm tra lịch trình chi tiết trong ứng dụng.\n\nChúc mừng năm mới 2027!`,
        category: 'Thông báo',
    },
    {
        title: 'SmartBus ra mắt tính năng theo dõi xe buýt thời gian thực',
        summary: 'Hành khách có thể xem vị trí xe buýt theo thời gian thực trên ứng dụng.',
        content: `SmartBus vui mừng thông báo tính năng mới: **Theo dõi xe buýt thời gian thực**!\n\n🚌 Xem chính xác vị trí xe buýt trên bản đồ\n⏰ Dự báo thời gian đến trạm (ETA)\n🔔 Nhận thông báo khi xe sắp đến trạm của bạn\n\nTính năng này hiện có trên tuyến 03, 05, 08, 11 và sẽ sớm mở rộng ra tất cả các tuyến.\n\nTải ngay ứng dụng SmartBus để trải nghiệm!`,
        category: 'Tin tức',
    },
    {
        title: 'Hướng dẫn mua vé tháng qua ứng dụng SmartBus',
        summary: 'Tiết kiệm hơn với vé tháng – mua nhanh, dùng ngay, không cần tiền mặt.',
        content: `**Mua vé tháng SmartBus – 3 bước đơn giản:**\n\n1. Mở ứng dụng SmartBus và đăng nhập\n2. Vào mục "Mua vé" → chọn "Vé tháng đơn tuyến" hoặc "Vé tháng liên tuyến"\n3. Chọn tuyến (nếu vé đơn tuyến), thanh toán và nhận QR code\n\n💡 Vé tháng đơn tuyến: 80.000đ/tháng\n💡 Vé tháng liên tuyến: 120.000đ/tháng (tất cả các tuyến)\n\nSử dụng QR code khi lên xe – nhân viên sẽ quét để xác nhận.`,
        category: 'Hướng dẫn',
    },
    {
        title: 'Khuyến mãi: Vé lượt chỉ 5.000đ cho học sinh sinh viên',
        summary: 'Chương trình ưu đãi đặc biệt dành cho học sinh, sinh viên Đà Nẵng.',
        content: `SmartBus triển khai chương trình ưu đãi đặc biệt:\n\n🎓 **Đối tượng:** Học sinh, sinh viên có thẻ HS/SV hợp lệ\n💰 **Giá vé:** 5.000đ/lượt (giảm 37.5% so với giá thường)\n📅 **Thời gian:** Từ 01/11/2026 đến 31/01/2027\n\n**Cách đăng ký:**\n- Upload ảnh thẻ HS/SV trong mục "Hồ sơ" → "Người dùng ưu tiên"\n- Chờ xét duyệt (trong vòng 24h)\n- Nhận giá ưu đãi ngay sau khi được duyệt\n\nHãy chia sẻ thông tin này đến bạn bè để cùng tiết kiệm!`,
        category: 'Khuyến mãi',
    },
];

// ── REVIEW CONTENTS ──────────────────────────────────────────────
const REVIEW_CONTENTS = [
    { rating: 5, content: 'Xe sạch sẽ, nhân viên nhiệt tình, đúng giờ. Rất hài lòng!' },
    { rating: 4, content: 'Dịch vụ tốt, xe đúng giờ. Chỉ hơi đông vào giờ cao điểm.' },
    { rating: 5, content: 'Tiện lợi, giá rẻ, nhân viên thân thiện. Sẽ tiếp tục sử dụng.' },
    { rating: 3, content: 'Xe hay trễ vào buổi sáng khoảng 10-15 phút. Cần cải thiện.' },
    { rating: 4, content: 'Lịch trình ổn định, ghế ngồi thoải mái.' },
    { rating: 2, content: 'Hôm nay xe trễ 30 phút, không có thông báo gì. Khá thất vọng.' },
    { rating: 5, content: 'Tuyến này rất thuận tiện đi làm. Giá vé phải chăng.' },
    { rating: 4, content: 'Nhân viên check vé nhanh, không làm mất thời gian.' },
    { rating: 3, content: 'Xe hơi cũ, điều hòa không mát lắm. Nhưng đúng giờ.' },
    { rating: 5, content: 'Ứng dụng mua vé rất tiện. Không cần tiền lẻ nữa!' },
];

// ── ROUTE REPORT CONTENTS ────────────────────────────────────────
const ROUTE_REPORT_CONTENTS = [
    { type: 'issue',      content: 'Xe số 43B-001.11 chạy tuyến 03 bị hỏng điều hòa. Rất nóng bức.' },
    { type: 'complaint',  content: 'Nhân viên xe tuyến 05 nói chuyện thô lỗ với hành khách cao tuổi.' },
    { type: 'suggestion', content: 'Nên thêm điểm dừng ở gần THPT Phan Châu Trinh cho tuyến 11.' },
    { type: 'issue',      content: 'Trạm Lê Duẩn (tuyến 05) không có mái che, trời mưa rất bất tiện.' },
    { type: 'other',      content: 'Thời gian chờ xe tuyến 16 quá lâu vào buổi chiều tối.' },
    { type: 'suggestion', content: 'Nên tăng tần suất tuyến 11 vào giờ cao điểm sáng và chiều.' },
];

// ════════════════════════════════════════════════════════════════
//  MAIN SEED FUNCTION
// ════════════════════════════════════════════════════════════════
async function seed() {
    const isFresh = process.argv.includes('--fresh');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-bus';

    console.log('\n🚌  SmartBus – Full Seed Script');
    console.log('═'.repeat(50));
    console.log(`  Mode  : ${isFresh ? '🔴 FRESH (drop all)' : '🟢 UPSERT'}`);
    console.log(`  DB    : ${uri.replace(/:\/\/.*@/, '://***@')}`);
    console.log('═'.repeat(50));

    await mongoose.connect(uri);
    console.log('  MongoDB connected\n');

    // ── FRESH MODE: xoá sạch ───────────────────────────────────
    if (isFresh) {
        console.log('  Dropping collections...');
        const toDrop = [
            TripSubscription, LeaveRequest, Post, RouteReport,
            FavoriteRoute, Review, ScanLog, ShiftReport,
            ActiveShift, StaffSchedule, Ticket, PaymentMethod,
            TicketProduct, Vehicle, Stop, Route, User,
        ];
        for (const M of toDrop) {
            await M.deleteMany({});
        }
        console.log('  All collections cleared.\n');
    }

    // ══════════════════════════════════════════════════════════
    //  1. USERS
    // ══════════════════════════════════════════════════════════
    console.log('1️⃣  Seeding Users...');
    const userMap = {}; // email → doc

    for (const u of RAW_USERS) {
        const existing = await User.findOne({ email: u.email });
        if (existing) {
            userMap[u.email] = existing;
            warn(`User already exists: ${u.email}`);
            continue;
        }
        const hashed = await bcrypt.hash(u.password, 10);
        const doc = await User.create({ ...u, password: hashed });
        userMap[u.email] = doc;
        log(`Created user: ${u.email} [${u.role}]`);
    }

    const admin1  = userMap['admin@smartbus.vn'];
    const admin2  = userMap['admin2@smartbus.vn'];
    const staffs  = [
        userMap['staff.binh@smartbus.vn'],
        userMap['staff.lan@smartbus.vn'],
        userMap['staff.tuan@smartbus.vn'],
        userMap['staff.hoa@smartbus.vn'],
        userMap['staff.hung@smartbus.vn'],
    ];
    const regularUsers = [
        userMap['user.an@gmail.com'],
        userMap['user.bao@gmail.com'],
        userMap['user.chau@gmail.com'],
        userMap['user.dung@gmail.com'],
        userMap['user.hai@gmail.com'],
        userMap['user.kim@gmail.com'],
        userMap['user.long@gmail.com'],
        userMap['user.mai@gmail.com'],
        userMap['user.nam@gmail.com'],
        userMap['user.oanh@gmail.com'],
    ];

    // ══════════════════════════════════════════════════════════
    //  2. ROUTES
    // ══════════════════════════════════════════════════════════
    console.log('\n2️⃣  Seeding Routes...');
    const routeMap = {}; // code → doc

    for (const r of ROUTE_DATA) {
        const doc = await Route.findOneAndUpdate(
            { code: r.code },
            { $set: { ...r, userId: admin1._id, staffId: staffs[0]._id } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        routeMap[r.code] = doc;
        log(`Route upserted: ${r.code} – ${r.name}`);
    }

    // ══════════════════════════════════════════════════════════
    //  3. STOPS
    // ══════════════════════════════════════════════════════════
    console.log('\n3️⃣  Seeding Stops...');
    const stopMap = {}; // stopCode → doc

    for (const [routeCode, stops] of Object.entries(STOPS_BY_ROUTE)) {
        const route = routeMap[routeCode];
        for (const s of stops) {
            const doc = await Stop.findOneAndUpdate(
                { stopCode: s.stopCode },
                {
                    $set: {
                        routeId: route._id,
                        stopCode: s.stopCode,
                        name: s.name,
                        location: { type: 'Point', coordinates: s.coordinates },
                        times: s.times,
                        order: s.order,
                    },
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            stopMap[s.stopCode] = doc;
        }
        log(`Stops upserted for Route ${routeCode}: ${stops.length} stops`);
    }

    // ══════════════════════════════════════════════════════════
    //  4. VEHICLES
    // ══════════════════════════════════════════════════════════
    console.log('\n4️⃣  Seeding Vehicles...');
    const vehicleDocs = [];
    const routeCodes  = Object.keys(routeMap);

    for (let i = 0; i < VEHICLE_DATA.length; i++) {
        const v = VEHICLE_DATA[i];
        const assignedRoute = i < routeCodes.length ? routeMap[routeCodes[i]]._id : null;
        const doc = await Vehicle.findOneAndUpdate(
            { plateNumber: v.plateNumber },
            { $set: { ...v, routeId: assignedRoute ?? null } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        vehicleDocs.push(doc);
        log(`Vehicle upserted: ${v.plateNumber}`);
    }

    // ══════════════════════════════════════════════════════════
    //  5. TICKET PRODUCTS
    // ══════════════════════════════════════════════════════════
    console.log('\n5️⃣  Seeding TicketProducts...');
    const ticketProductMap = {}; // code → doc

    for (const tp of TICKET_PRODUCTS) {
        const doc = await TicketProduct.findOneAndUpdate(
            { code: tp.code },
            { $set: tp },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        ticketProductMap[tp.code] = doc;
        log(`TicketProduct upserted: ${tp.code} – ${tp.unitPrice.toLocaleString()}đ`);
    }

    // ══════════════════════════════════════════════════════════
    //  6. PAYMENT METHODS
    // ══════════════════════════════════════════════════════════
    console.log('\n6️⃣  Seeding PaymentMethods...');
    const paymentMethodMap = {}; // userId.toString() → [docs]

    const pmDefs = [
        // user.an – MoMo
        { userEmail: 'user.an@gmail.com',   provider: 'momo',     phoneNumber: '0933000001', email: 'user.an@gmail.com' },
        // user.bao – ZaloPay
        { userEmail: 'user.bao@gmail.com',  provider: 'zalopay',  phoneNumber: '0933000002', email: 'user.bao@gmail.com' },
        // user.chau – Visa
        { userEmail: 'user.chau@gmail.com', provider: 'visa',     cardNumber: '4111111111111111', expiryDate: '12/28', csc: '123', cardHolderName: 'TRAN MINH CHAU' },
        // user.dung – Napas
        { userEmail: 'user.dung@gmail.com', provider: 'napas',    cardNumber: '9704000000000018', expiryDate: '01/27', csc: '456', cardHolderName: 'PHAM THI DUNG', bankName: 'Vietcombank' },
        // user.hai – MoMo
        { userEmail: 'user.hai@gmail.com',  provider: 'momo',     phoneNumber: '0933000005', email: 'user.hai@gmail.com' },
        // user.kim – ZaloPay
        { userEmail: 'user.kim@gmail.com',  provider: 'zalopay',  phoneNumber: '0933000006', email: 'user.kim@gmail.com' },
        // user.long – Visa + ShopeePay
        { userEmail: 'user.long@gmail.com', provider: 'visa',     cardNumber: '4111222233334444', expiryDate: '06/29', csc: '789', cardHolderName: 'DO MINH LONG' },
        { userEmail: 'user.long@gmail.com', provider: 'shopeepay', phoneNumber: '0933000007', email: 'user.long@gmail.com' },
        // user.mai – Napas
        { userEmail: 'user.mai@gmail.com',  provider: 'napas',    cardNumber: '9704000000000019', expiryDate: '03/28', csc: '321', cardHolderName: 'NGUYEN THI MAI', bankName: 'BIDV' },
        // user.nam – MoMo
        { userEmail: 'user.nam@gmail.com',  provider: 'momo',     phoneNumber: '0933000009', email: 'user.nam@gmail.com' },
        // user.oanh – ZaloPay
        { userEmail: 'user.oanh@gmail.com', provider: 'zalopay',  phoneNumber: '0933000010', email: 'user.oanh@gmail.com' },
    ];

    for (const pm of pmDefs) {
        const user = userMap[pm.userEmail];
        if (!user) continue;
        const { userEmail, ...pmData } = pm;
        const existing = await PaymentMethod.findOne({ user: user._id, provider: pmData.provider });
        let doc;
        if (existing) {
            doc = existing;
            warn(`PaymentMethod exists: ${pm.userEmail} – ${pm.provider}`);
        } else {
            doc = await PaymentMethod.create({ ...pmData, user: user._id });
            log(`PaymentMethod created: ${pm.userEmail} – ${pm.provider}`);
        }
        const uid = user._id.toString();
        if (!paymentMethodMap[uid]) paymentMethodMap[uid] = [];
        paymentMethodMap[uid].push(doc);
    }

    // ══════════════════════════════════════════════════════════
    //  7. TICKETS
    // ══════════════════════════════════════════════════════════
    console.log('\n7️⃣  Seeding Tickets...');

    const ticketDefs = [
        // Vé đã sử dụng (lịch sử)
        {
            userEmail: 'user.an@gmail.com', routeCode: '11',
            startStop: 'Bến xe buýt Xuân Diệu', endStop: 'Siêu thị Lotte',
            ticketType: 'single', departureDate: daysAgo(10), departureTime: '06:00',
            seatQuantity: 1, status: 'used', purchasedAgo: 11,
        },
        {
            userEmail: 'user.bao@gmail.com', routeCode: '05',
            startStop: 'Chung cư Hoà Hiệp Nam', endStop: '07 Lê Duẩn',
            ticketType: 'monthlySingleRoute', departureDate: daysAgo(30), departureTime: '06:00',
            seatQuantity: 1, status: 'expired', purchasedAgo: 32,
        },
        {
            userEmail: 'user.chau@gmail.com', routeCode: '03',
            startStop: 'Bến xe buýt sân bay', endStop: 'Bãi đỗ xe KDL Bà Nà Hills',
            ticketType: 'single', departureDate: daysAgo(5), departureTime: '10:00',
            seatQuantity: 2, status: 'used', purchasedAgo: 6,
        },
        // Vé đang hiệu lực (tháng)
        {
            userEmail: 'user.dung@gmail.com', routeCode: '05',
            startStop: 'Chung cư Hoà Hiệp Nam', endStop: 'Công viên Biển Đông Võ Nguyên Giáp',
            ticketType: 'monthlySingleRoute', departureDate: daysAgo(5), departureTime: '06:00',
            seatQuantity: 1, status: 'active', purchasedAgo: 6,
        },
        {
            userEmail: 'user.hai@gmail.com', routeCode: '08',
            startStop: 'Bến xe Bùi Dương Lịch', endStop: 'Bến xe buýt Phạm Hùng',
            ticketType: 'monthlyInterRoute', departureDate: daysAgo(3), departureTime: '06:00',
            seatQuantity: 1, status: 'active', purchasedAgo: 4,
        },
        // Vé đã thanh toán (sắp đi)
        {
            userEmail: 'user.kim@gmail.com', routeCode: '11',
            startStop: 'Bến xe buýt Xuân Diệu', endStop: 'BV Phụ sản nhi Đà Nẵng',
            ticketType: 'single', departureDate: daysFromNow(1), departureTime: '10:00',
            seatQuantity: 1, status: 'paid', purchasedAgo: 1,
        },
        {
            userEmail: 'user.long@gmail.com', routeCode: '16',
            startStop: 'Kim Liên', endStop: 'Đại học Việt Hàn',
            ticketType: 'single', departureDate: daysFromNow(2), departureTime: '14:00',
            seatQuantity: 1, status: 'paid', purchasedAgo: 1,
        },
        // Vé pending
        {
            userEmail: 'user.mai@gmail.com', routeCode: '03',
            startStop: 'Bến xe buýt sân bay', endStop: '128 Tôn Đức Thắng',
            ticketType: 'single', departureDate: daysFromNow(3), departureTime: '06:00',
            seatQuantity: 1, status: 'pending', purchasedAgo: 0,
        },
        // Vé bị hủy
        {
            userEmail: 'user.nam@gmail.com', routeCode: '05',
            startStop: 'Chung cư Hoà Hiệp Nam', endStop: 'BV Đa khoa Quang Trung',
            ticketType: 'single', departureDate: daysAgo(2), departureTime: '14:00',
            seatQuantity: 1, status: 'cancelled', purchasedAgo: 3,
        },
        // Thêm vài vé nữa cho user.oanh
        {
            userEmail: 'user.oanh@gmail.com', routeCode: '11',
            startStop: 'Bến xe buýt Xuân Diệu', endStop: 'Siêu thị Lotte',
            ticketType: 'monthlySingleRoute', departureDate: daysAgo(2), departureTime: '06:00',
            seatQuantity: 1, status: 'active', purchasedAgo: 3,
        },
        {
            userEmail: 'user.an@gmail.com', routeCode: '16',
            startStop: 'Kim Liên', endStop: 'Cầu Rồng',
            ticketType: 'single', departureDate: daysFromNow(5), departureTime: '10:00',
            seatQuantity: 1, status: 'paid', purchasedAgo: 1,
        },
    ];

    const ticketDocs = [];
    for (const td of ticketDefs) {
        const user   = userMap[td.userEmail];
        const route  = routeMap[td.routeCode];
        if (!user || !route) continue;

        const pmList = paymentMethodMap[user._id.toString()];
        const pm     = pmList ? pmList[0] : null;
        if (!pm) { warn(`No payment method for ${td.userEmail}, skipping ticket`); continue; }

        const tpCode = td.ticketType;
        const tp     = ticketProductMap[tpCode];
        const price  = tp ? tp.unitPrice * td.seatQuantity : 8000;

        const purchaseDate = daysAgo(td.purchasedAgo);
        const issueDate    = ['paid','active','used'].includes(td.status) ? purchaseDate : null;
        const expiryDate   = td.ticketType === 'single'
            ? td.departureDate
            : (issueDate ? new Date(issueDate.getTime() + 30 * 86400000) : null);
        const usedAt       = td.status === 'used' ? daysAgo(td.purchasedAgo - 1) : null;

        // Sinh QR code ngẫu nhiên
        const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const existing = await Ticket.findOne({ user: user._id, routeId: route._id, departureDate: td.departureDate, departureTime: td.departureTime });
        if (existing) {
            ticketDocs.push(existing);
            warn(`Ticket exists for ${td.userEmail} on route ${td.routeCode}`);
            continue;
        }

        const doc = await Ticket.create({
            user: user._id,
            routeId: route._id,
            routeName: route.name,
            startStopName: td.startStop,
            endStopName: td.endStop,
            ticketType: td.ticketType,
            departureDate: td.departureDate,
            departureTime: td.departureTime,
            seatQuantity: td.seatQuantity,
            customerName: user.full_name,
            customerPhone: user.phone,
            paymentMethodId: pm._id,
            price,
            qrCode,
            status: td.status,
            purchaseDate,
            issueDate,
            expiryDate,
            usedAt,
        });
        ticketDocs.push(doc);
        log(`Ticket created: ${td.userEmail} → Tuyến ${td.routeCode} [${td.status}]`);
    }

    // ══════════════════════════════════════════════════════════
    //  8. STAFF SCHEDULES
    // ══════════════════════════════════════════════════════════
    console.log('\n8️⃣  Seeding StaffSchedules...');

    const periods = ['morning', 'afternoon', 'evening'];
    const periodTimes = {
        morning:   { startTime: '05:30', endTime: '12:30' },
        afternoon: { startTime: '12:30', endTime: '19:30' },
        evening:   { startTime: '17:00', endTime: '22:00' },
    };
    const routeCodeList = Object.keys(routeMap);

    const scheduleDocs = [];
    // Tạo lịch 7 ngày tới cho mỗi staff (sáng+chiều)
    for (let dayOffset = -3; dayOffset <= 7; dayOffset++) {
        const workDate = daysFromNow(dayOffset);
        for (let si = 0; si < staffs.length; si++) {
            const staff = staffs[si];
            const period = periods[si % 2 === 0 ? 0 : 1]; // alternating morning/afternoon
            const { startTime, endTime } = periodTimes[period];
            const routeCode = routeCodeList[si % routeCodeList.length];
            const route = routeMap[routeCode];
            const vehicle = vehicleDocs[si % vehicleDocs.length];

            // Status dựa vào dayOffset
            let status = 'scheduled';
            if (dayOffset < -1) status = 'completed';
            else if (dayOffset === -1 || dayOffset === 0) status = 'completed'; // hôm qua, hôm nay sáng

            const existing = await StaffSchedule.findOne({ staffId: staff._id, workDate, period });
            if (existing) {
                scheduleDocs.push(existing);
                continue;
            }
            const doc = await StaffSchedule.create({
                staffId: staff._id,
                workDate,
                period,
                startTime,
                endTime,
                routeId: route._id,
                routeName: route.name,
                routeCode: route.code,
                plateNumber: vehicle.plateNumber,
                status,
            });
            scheduleDocs.push(doc);
        }
    }
    log(`StaffSchedules created: ${scheduleDocs.length} records`);

    // ══════════════════════════════════════════════════════════
    //  9. ACTIVE SHIFTS (1 ca đang chạy – staff đầu tiên)
    // ══════════════════════════════════════════════════════════
    console.log('\n9️⃣  Seeding ActiveShifts...');

    const activeShiftDocs = [];
    // Tạo 1 ca đang active cho staff[0]
    const existingActiveShift = await ActiveShift.findOne({ staffId: staffs[0]._id, status: 'active' });
    if (existingActiveShift) {
        activeShiftDocs.push(existingActiveShift);
        warn('ActiveShift already exists for staff.binh');
    } else {
        const route03 = routeMap['03'];
        const vehicle0 = vehicleDocs[0];
        const todaySchedule = scheduleDocs.find(s => s.staffId.toString() === staffs[0]._id.toString() && s.status !== 'completed');
        const shift = await ActiveShift.create({
            staffId: staffs[0]._id,
            scheduleId: todaySchedule ? todaySchedule._id : null,
            routeId: route03._id,
            routeName: route03.name,
            routeCode: route03.code,
            vehicleId: vehicle0._id,
            plateNumber: vehicle0.plateNumber,
            currentStopOrder: 2,
            lastLat: 16.0568,
            lastLng: 108.2029,
            lastLocationAt: new Date(),
            heading: 90,
            locationSource: 'staff',
            shiftStartAt: new Date(Date.now() - 2 * 3600000), // 2 giờ trước
            status: 'active',
        });
        activeShiftDocs.push(shift);
        log(`ActiveShift created for ${staffs[0].email}`);
    }

    // 2 ca đã kết thúc (staffs[1] và staffs[2])
    for (let si = 1; si <= 2; si++) {
        const staff = staffs[si];
        const route = routeMap[routeCodeList[si % routeCodeList.length]];
        const vehicle = vehicleDocs[si];
        const startAt = new Date(Date.now() - (12 + si) * 3600000);
        const endAt   = new Date(Date.now() - (5 + si) * 3600000);

        const existing = await ActiveShift.findOne({ staffId: staff._id, shiftStartAt: startAt });
        if (!existing) {
            const shift = await ActiveShift.create({
                staffId: staff._id,
                routeId: route._id,
                routeName: route.name,
                routeCode: route.code,
                vehicleId: vehicle._id,
                plateNumber: vehicle.plateNumber,
                currentStopOrder: 6,
                lastLat: 16.071 + si * 0.001,
                lastLng: 108.220 + si * 0.002,
                lastLocationAt: endAt,
                locationSource: 'staff',
                shiftStartAt: startAt,
                shiftEndAt: endAt,
                status: 'ended',
            });
            activeShiftDocs.push(shift);
            log(`ActiveShift (ended) created for ${staff.email}`);
        }
    }

    // ══════════════════════════════════════════════════════════
    //  10. SHIFT REPORTS
    // ══════════════════════════════════════════════════════════
    console.log('\n🔟  Seeding ShiftReports...');

    const shiftReportDefs = [
        { staffIdx: 1, daysBack: 1, totalScans: 45, successfulScans: 42, failedScans: 3, totalRevenue: 336000, status: 'approved', reviewedByAdmin: admin1 },
        { staffIdx: 2, daysBack: 1, totalScans: 38, successfulScans: 36, failedScans: 2, totalRevenue: 288000, status: 'approved', reviewedByAdmin: admin1 },
        { staffIdx: 0, daysBack: 2, totalScans: 52, successfulScans: 50, failedScans: 2, totalRevenue: 400000, status: 'submitted', reviewedByAdmin: null },
        { staffIdx: 3, daysBack: 2, totalScans: 29, successfulScans: 27, failedScans: 2, totalRevenue: 216000, status: 'rejected',  reviewedByAdmin: admin2, reviewNote: 'Số liệu không khớp với log quét vé.' },
        { staffIdx: 4, daysBack: 3, totalScans: 61, successfulScans: 58, failedScans: 3, totalRevenue: 464000, status: 'approved', reviewedByAdmin: admin2 },
    ];

    for (const sr of shiftReportDefs) {
        const staff     = staffs[sr.staffIdx];
        const startAt   = new Date(daysAgo(sr.daysBack).setHours(6, 0, 0, 0));
        const endAt     = new Date(daysAgo(sr.daysBack).setHours(13, 0, 0, 0));

        const existing  = await ShiftReport.findOne({ staffId: staff._id, shiftStartAt: startAt });
        if (existing) { warn(`ShiftReport exists for ${staff.email}`); continue; }

        await ShiftReport.create({
            staffId: staff._id,
            shiftStartAt: startAt,
            shiftEndAt: endAt,
            totalScans: sr.totalScans,
            successfulScans: sr.successfulScans,
            failedScans: sr.failedScans,
            totalRevenue: sr.totalRevenue,
            note: `Báo cáo ca ngày ${daysAgo(sr.daysBack).toLocaleDateString('vi-VN')}`,
            status: sr.status,
            reviewedBy: sr.reviewedByAdmin ? sr.reviewedByAdmin._id : null,
            reviewNote: sr.reviewNote || '',
            reviewedAt: sr.reviewedByAdmin ? new Date(endAt.getTime() + 3600000) : null,
        });
        log(`ShiftReport created: ${staff.email} – ${sr.status}`);
    }

    // ══════════════════════════════════════════════════════════
    //  11. SCAN LOGS
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣1️⃣  Seeding ScanLogs...');

    // Chỉ seed scan logs cho vé đã 'used' hoặc 'active'
    const usedTickets = ticketDocs.filter(t => ['used', 'active'].includes(t.status));
    const activeShiftForScan = activeShiftDocs[0]; // dùng ca của staff[0]
    const firstStop = Object.values(stopMap)[0];

    for (let i = 0; i < Math.min(usedTickets.length * 2, 15); i++) {
        const ticket = usedTickets[i % usedTickets.length];
        const isValid = i % 5 !== 4; // 1 trong 5 lần quét thất bại
        await ScanLog.create({
            ticket: ticket._id,
            qrCode: ticket.qrCode || `QR-MANUAL-${i}`,
            isValid,
            reason: isValid ? '' : 'Vé đã hết hạn hoặc không hợp lệ',
            scannedBy: staffs[i % staffs.length]._id,
            shiftId: activeShiftForScan._id,
            stopId: firstStop ? firstStop._id : null,
            lat: 16.056 + Math.random() * 0.05,
            lng: 108.200 + Math.random() * 0.05,
        });
    }
    log(`ScanLogs created: ${Math.min(usedTickets.length * 2, 15)} records`);

    // ══════════════════════════════════════════════════════════
    //  12. REVIEWS
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣2️⃣  Seeding Reviews...');

    const reviewDefs = [
        { userEmail: 'user.an@gmail.com',   routeCode: '11', idx: 0 },
        { userEmail: 'user.bao@gmail.com',  routeCode: '05', idx: 1 },
        { userEmail: 'user.chau@gmail.com', routeCode: '03', idx: 2 },
        { userEmail: 'user.dung@gmail.com', routeCode: '05', idx: 3 },
        { userEmail: 'user.hai@gmail.com',  routeCode: '08', idx: 4 },
        { userEmail: 'user.kim@gmail.com',  routeCode: '11', idx: 5 },
        { userEmail: 'user.long@gmail.com', routeCode: '16', idx: 6 },
        { userEmail: 'user.mai@gmail.com',  routeCode: '03', idx: 7 },
        { userEmail: 'user.nam@gmail.com',  routeCode: '08', idx: 8 },
        { userEmail: 'user.oanh@gmail.com', routeCode: '11', idx: 9 },
    ];

    for (const rv of reviewDefs) {
        const user  = userMap[rv.userEmail];
        const route = routeMap[rv.routeCode];
        const rc    = REVIEW_CONTENTS[rv.idx];
        const existing = await Review.findOne({ user: user._id, route: route._id });
        if (existing) { warn(`Review exists: ${rv.userEmail} → Tuyến ${rv.routeCode}`); continue; }
        await Review.create({ user: user._id, route: route._id, rating: rc.rating, content: rc.content });
        log(`Review created: ${rv.userEmail} → Tuyến ${rv.routeCode} ⭐${rc.rating}`);
    }

    // ══════════════════════════════════════════════════════════
    //  13. FAVORITE ROUTES
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣3️⃣  Seeding FavoriteRoutes...');

    const favDefs = [
        { userEmail: 'user.an@gmail.com',   routeCode: '11' },
        { userEmail: 'user.an@gmail.com',   routeCode: '05' },
        { userEmail: 'user.bao@gmail.com',  routeCode: '05' },
        { userEmail: 'user.chau@gmail.com', routeCode: '03' },
        { userEmail: 'user.chau@gmail.com', routeCode: '08' },
        { userEmail: 'user.dung@gmail.com', routeCode: '05' },
        { userEmail: 'user.hai@gmail.com',  routeCode: '08' },
        { userEmail: 'user.kim@gmail.com',  routeCode: '11' },
        { userEmail: 'user.long@gmail.com', routeCode: '16' },
        { userEmail: 'user.oanh@gmail.com', routeCode: '11' },
        { userEmail: 'user.oanh@gmail.com', routeCode: '05' },
    ];

    for (const fav of favDefs) {
        const user  = userMap[fav.userEmail];
        const route = routeMap[fav.routeCode];
        const existing = await FavoriteRoute.findOne({ userId: user._id, routeId: route._id });
        if (existing) continue;
        await FavoriteRoute.create({ userId: user._id, routeId: route._id });
        log(`FavoriteRoute: ${fav.userEmail} → Tuyến ${fav.routeCode}`);
    }

    // ══════════════════════════════════════════════════════════
    //  14. ROUTE REPORTS
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣4️⃣  Seeding RouteReports...');

    const rrDefs = [
        { userEmail: 'user.an@gmail.com',   routeCode: '03', idx: 0, status: 'in_progress' },
        { userEmail: 'user.bao@gmail.com',  routeCode: '05', idx: 1, status: 'new' },
        { userEmail: 'user.chau@gmail.com', routeCode: '11', idx: 2, status: 'resolved' },
        { userEmail: 'user.dung@gmail.com', routeCode: '05', idx: 3, status: 'new' },
        { userEmail: 'user.hai@gmail.com',  routeCode: '16', idx: 4, status: 'new' },
        { userEmail: 'user.kim@gmail.com',  routeCode: '11', idx: 5, status: 'rejected' },
    ];

    for (const rr of rrDefs) {
        const user  = userMap[rr.userEmail];
        const route = routeMap[rr.routeCode];
        const rc    = ROUTE_REPORT_CONTENTS[rr.idx];
        await RouteReport.create({
            userId: user._id,
            routeId: route._id,
            type: rc.type,
            content: rc.content,
            phone: user.phone,
            status: rr.status,
        });
        log(`RouteReport created: ${rr.userEmail} → Tuyến ${rr.routeCode} [${rr.status}]`);
    }

    // ══════════════════════════════════════════════════════════
    //  15. POSTS
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣5️⃣  Seeding Posts...');

    for (let i = 0; i < POST_CONTENTS.length; i++) {
        const pc = POST_CONTENTS[i];
        const existing = await Post.findOne({ title: pc.title });
        if (existing) { warn(`Post exists: ${pc.title}`); continue; }

        // Gắn related_routes theo nội dung
        const relatedRoutes = i < 3 ? [routeMap[routeCodeList[i % routeCodeList.length]]._id] : [];
        const authorUser    = i % 2 === 0 ? admin1 : admin2;

        await Post.create({
            title: pc.title,
            summary: pc.summary,
            content: pc.content,
            category: pc.category,
            related_routes: relatedRoutes,
            user: authorUser._id,
            images: [],
        });
        log(`Post created: ${pc.title}`);
    }

    // ══════════════════════════════════════════════════════════
    //  16. LEAVE REQUESTS
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣6️⃣  Seeding LeaveRequests...');

    const leaveDefs = [
        {
            staffEmail: 'staff.binh@smartbus.vn',
            startDate: daysFromNow(5), endDate: daysFromNow(7),
            reason: 'Có việc gia đình cần giải quyết gấp, xin phép nghỉ 3 ngày.',
            status: 'submitted',
        },
        {
            staffEmail: 'staff.lan@smartbus.vn',
            startDate: daysFromNow(10), endDate: daysFromNow(12),
            reason: 'Đi khám bệnh định kỳ và nghỉ dưỡng bệnh.',
            status: 'approved',
            reviewedBy: admin1,
            reviewNote: 'Đã duyệt. Nhớ bàn giao ca trước khi nghỉ.',
        },
        {
            staffEmail: 'staff.tuan@smartbus.vn',
            startDate: daysAgo(10), endDate: daysAgo(8),
            reason: 'Thăm người thân ở quê.',
            status: 'approved',
            reviewedBy: admin2,
            reviewNote: 'Đã duyệt.',
        },
        {
            staffEmail: 'staff.hoa@smartbus.vn',
            startDate: daysFromNow(3), endDate: daysFromNow(4),
            reason: 'Tham dự đám cưới người thân.',
            status: 'rejected',
            reviewedBy: admin1,
            reviewNote: 'Lịch trình tuần này đông khách, không thể duyệt.',
        },
        {
            staffEmail: 'staff.hung@smartbus.vn',
            startDate: daysFromNow(15), endDate: daysFromNow(20),
            reason: 'Nghỉ phép thường niên theo hợp đồng lao động.',
            status: 'submitted',
        },
    ];

    for (const lr of leaveDefs) {
        const staff = userMap[lr.staffEmail];
        const existing = await LeaveRequest.findOne({ staffId: staff._id, startDate: lr.startDate });
        if (existing) { warn(`LeaveRequest exists for ${lr.staffEmail}`); continue; }
        await LeaveRequest.create({
            staffId: staff._id,
            startDate: lr.startDate,
            endDate: lr.endDate,
            reason: lr.reason,
            status: lr.status,
            reviewedBy: lr.reviewedBy ? lr.reviewedBy._id : null,
            reviewNote: lr.reviewNote || '',
            reviewedAt: lr.reviewedBy ? new Date() : null,
        });
        log(`LeaveRequest created: ${lr.staffEmail} [${lr.status}]`);
    }

    // ══════════════════════════════════════════════════════════
    //  17. TRIP SUBSCRIPTIONS (theo dõi ETA)
    // ══════════════════════════════════════════════════════════
    console.log('\n1️⃣7️⃣  Seeding TripSubscriptions...');

    const subDefs = [
        { userEmail: 'user.an@gmail.com',   routeCode: '11', stopCode: '1101', notifyBefore: 5 },
        { userEmail: 'user.bao@gmail.com',  routeCode: '05', stopCode: '0501', notifyBefore: 10 },
        { userEmail: 'user.chau@gmail.com', routeCode: '03', stopCode: '0301', notifyBefore: 5 },
        { userEmail: 'user.dung@gmail.com', routeCode: '05', stopCode: '0507', notifyBefore: 7 },
        { userEmail: 'user.hai@gmail.com',  routeCode: '08', stopCode: '0801', notifyBefore: 5 },
        { userEmail: 'user.oanh@gmail.com', routeCode: '11', stopCode: '1105', notifyBefore: 10 },
    ];

    for (const sub of subDefs) {
        const user  = userMap[sub.userEmail];
        const route = routeMap[sub.routeCode];
        const stop  = stopMap[sub.stopCode];
        if (!stop) { warn(`Stop ${sub.stopCode} not found, skipping subscription`); continue; }

        const existing = await TripSubscription.findOne({ userId: user._id, routeId: route._id, stopId: stop._id });
        if (existing) { warn(`TripSubscription exists for ${sub.userEmail}`); continue; }

        await TripSubscription.create({
            userId: user._id,
            routeId: route._id,
            stopId: stop._id,
            notifyBeforeMinutes: sub.notifyBefore,
            active: true,
        });
        log(`TripSubscription created: ${sub.userEmail} → Tuyến ${sub.routeCode} @ ${sub.stopCode}`);
    }

    // ══════════════════════════════════════════════════════════
    //  SUMMARY
    // ══════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(50));
    console.log('✅  Seed hoàn tất!\n');

    const summary = {
        Users:              await User.countDocuments(),
        Routes:             await Route.countDocuments(),
        Stops:              await Stop.countDocuments(),
        Vehicles:           await Vehicle.countDocuments(),
        TicketProducts:     await TicketProduct.countDocuments(),
        PaymentMethods:     await PaymentMethod.countDocuments(),
        Tickets:            await Ticket.countDocuments(),
        StaffSchedules:     await StaffSchedule.countDocuments(),
        ActiveShifts:       await ActiveShift.countDocuments(),
        ShiftReports:       await ShiftReport.countDocuments(),
        ScanLogs:           await ScanLog.countDocuments(),
        Reviews:            await Review.countDocuments(),
        FavoriteRoutes:     await FavoriteRoute.countDocuments(),
        RouteReports:       await RouteReport.countDocuments(),
        Posts:              await Post.countDocuments(),
        LeaveRequests:      await LeaveRequest.countDocuments(),
        TripSubscriptions:  await TripSubscription.countDocuments(),
    };

    console.log('  📊 Database Summary:');
    for (const [col, count] of Object.entries(summary)) {
        console.log(`     ${col.padEnd(20)} : ${count}`);
    }

    console.log('\n  🔑 Test Accounts:');
    console.log('     admin@smartbus.vn          | Admin@123 | admin');
    console.log('     admin2@smartbus.vn         | Admin@123 | admin');
    console.log('     staff.binh@smartbus.vn     | Staff@123 | staff');
    console.log('     staff.lan@smartbus.vn      | Staff@123 | staff');
    console.log('     staff.tuan@smartbus.vn     | Staff@123 | staff');
    console.log('     staff.hoa@smartbus.vn      | Staff@123 | staff');
    console.log('     staff.hung@smartbus.vn     | Staff@123 | staff');
    console.log('     user.an@gmail.com          | User@123  | user');
    console.log('     user.bao@gmail.com         | User@123  | user (priority)');
    console.log('     user.long@gmail.com        | User@123  | user (priority)');
    console.log('═'.repeat(50));

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(async (err) => {
    console.error('\n❌ Seed failed:', err);
    try { await mongoose.disconnect(); } catch { /* ignore */ }
    process.exit(1);
});

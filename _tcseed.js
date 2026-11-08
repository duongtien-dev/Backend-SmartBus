require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('E:/cap2-2/Cap2/Backend-SmartBus/src/config/database');
const User = require('E:/cap2-2/Cap2/Backend-SmartBus/src/models/User');
const Post = require('E:/cap2-2/Cap2/Backend-SmartBus/src/models/Post');

(async () => {
  await connectDB();
  const accs = [
    { full_name: 'DaGo Admin', email: 'admin@smartbus.vn', phone: '0900000001', password: 'Admin@123', role: 'admin', active: true },
    { full_name: 'DaGo Staff', email: 'nhanvien01@smartbus.vn', phone: '0912345678', password: 'Staff@123', role: 'staff', active: true },
    { full_name: 'Nguyen Van A', email: 'nguyenvana@gmail.com', phone: '0912345678', password: 'User@123', role: 'user', active: true },
    { full_name: 'DaGo Staff Inactive', email: 'nhanvien.inactive@smartbus.vn', phone: '0912345679', password: 'Staff@123', role: 'staff', active: false },
    { full_name: 'DaGo Admin Two', email: 'admin2@smartbus.vn', phone: '0900000002', password: 'Admin@123', role: 'admin', active: true },
  ];
  for (const a of accs) {
    await User.deleteOne({ email: a.email });
    await User.create(a);
  }
  await Post.deleteMany({ title: /^Tuy\x00ean 01/ });
  await Post.create({ title: 'Tuyen 01 tam dung', summary: 'Thong bao tam dung', content: 'Noi dung chi tiet', category: 'Thong bao', user: (await User.findOne({ email: 'admin@smartbus.vn' }))._id });
  const users = await User.find({ email: { $in: accs.map(a => a.email) } }).select('email role active');
  console.log(JSON.stringify(users, null, 1));
  await mongoose.connection.close();
  process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });

const mongoose = require('mongoose');
require('dotenv').config(); // Wajib panggil dotenv untuk load .env

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Terhubung ke MongoDB Atlas');
})
.catch((err) => {
  console.error('❌ Gagal konek ke MongoDB Atlas:', err.message);
});

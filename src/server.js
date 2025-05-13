require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 라우터 연결
const foodRoutes = require('./routes/foodRoutes');
app.use('/api/foods', foodRoutes);

// 기본 경로
app.get('/', (req, res) => {
  res.send('Smart Kitchen Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

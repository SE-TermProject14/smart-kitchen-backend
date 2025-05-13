// 임시 데이터
const foods = [
  { id: 1, name: 'Apple', category: 'Fruit' },
  { id: 2, name: 'Bread', category: 'Grain' },
  { id: 3, name: 'Chicken', category: 'Meat' },
];

// GET /api/foods
exports.getFoods = (req, res) => {
  res.json(foods);
};

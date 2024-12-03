
import dotenv from 'dotenv';
dotenv.config();
const app = require('./app');

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
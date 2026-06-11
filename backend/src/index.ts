import 'dotenv/config';
import app from './app';


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n🚀 Rookie API running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}\n`);
});

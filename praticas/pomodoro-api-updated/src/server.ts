import 'dotenv/config';
import { app } from './app';

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
  console.log(`✅ API rodando em http://localhost:${port}`);
  console.log(`   Health: http://localhost:${port}/health`);
  console.log(`   Settings: http://localhost:${port}/settings`);
  console.log(`   Tasks: http://localhost:${port}/tasks`);
});

import { createServer as createViteServer } from 'vite';
import app from './server/index.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function start() {
  process.env.RUNNING_IN_VITE = 'true';

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Mount Vite's connect instance as middleware so static assets and HTML are served
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ ShopEasy Store Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

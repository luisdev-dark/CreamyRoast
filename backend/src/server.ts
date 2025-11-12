// src/server.ts
import app from './app';

const PORT = process.env.PORT || 3001;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🍵 Cream & Roast API v0.01 funcionando en puerto ${PORT}`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api`);
  console.log(`🔐 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
});

export default app;
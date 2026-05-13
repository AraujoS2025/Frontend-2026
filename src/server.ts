import { app } from './app'
import { prisma } from './lib/prisma'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333

async function main() {
  await prisma.$connect()
  console.log('✅ Banco de dados conectado.')

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error('❌ Erro ao iniciar o servidor:', err)
  process.exit(1)
})

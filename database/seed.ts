// ============================================================
// SpecKAI — Calculator App Database Seed
// Seeds sample calculation history entries for development.
// Run: npx ts-node database/seed.ts
// ============================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample calculation history entries representing typical usage
const sampleCalculations: Array<{
  expression: string
  result: string
  sessionId: string
}> = [
  { expression: '2 + 2',          result: '4',           sessionId: 'seed-session-001' },
  { expression: '10 - 3',         result: '7',           sessionId: 'seed-session-001' },
  { expression: '6 * 7',          result: '42',          sessionId: 'seed-session-001' },
  { expression: '100 / 4',        result: '25',          sessionId: 'seed-session-001' },
  { expression: '3.14 * 2',       result: '6.28',        sessionId: 'seed-session-002' },
  { expression: '1000 / 3',       result: '333.3333...',  sessionId: 'seed-session-002' },
  { expression: '99 + 1',         result: '100',         sessionId: 'seed-session-002' },
  { expression: '2 * 2 * 2 * 2',  result: '16',          sessionId: 'seed-session-003' },
  { expression: '(5 + 3) * 2',    result: '16',          sessionId: 'seed-session-003' },
  { expression: '0.1 + 0.2',      result: '0.3',         sessionId: 'seed-session-003' },
]

async function main(): Promise<void> {
  console.log('🌱 Starting calculator history seed...')

  // Clear existing seed data
  const deleted = await prisma.calculationHistory.deleteMany({
    where: {
      sessionId: {
        startsWith: 'seed-session-',
      },
    },
  })
  console.log(`🗑️  Cleared ${deleted.count} existing seed records`)

  // Insert sample calculations
  const created = await prisma.calculationHistory.createMany({
    data: sampleCalculations,
    skipDuplicates: true,
  })
  console.log(`✅ Seeded ${created.count} calculation history records`)

  // Display summary
  const total = await prisma.calculationHistory.count()
  console.log(`📊 Total records in calculation_history: ${total}`)

  const sessions = await prisma.calculationHistory.groupBy({
    by: ['sessionId'],
    _count: { id: true },
  })
  console.log('\n📋 Records per session:')
  sessions.forEach(s => {
    console.log(`   ${s.sessionId ?? 'no-session'}: ${s._count.id} calculation(s)`)
  })

  console.log('\n🎉 Seed complete!')
}

main()
  .catch(error => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
}
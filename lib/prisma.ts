import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? true : { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as { prisma_v2: PrismaClient }
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v2 = prisma

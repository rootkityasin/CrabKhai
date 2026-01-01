
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany()

    console.log(`Found ${products.length} products. Updating pieces...`)

    for (const product of products) {
        // Random pieces between 8 and 20
        const randomPieces = Math.floor(Math.random() * (20 - 8 + 1)) + 8

        await prisma.product.update({
            where: { id: product.id },
            data: { pieces: randomPieces },
        })
        console.log(`Updated ${product.name} with ${randomPieces} pcs`)
    }

    console.log('All products updated successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

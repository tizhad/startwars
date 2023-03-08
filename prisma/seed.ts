import {PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient()

const planetsData: Prisma.PlanetCreateInput[] = [
    {
        name: 'A',
        rotation_period: 1,
    },
    {
        name: 'B',
        rotation_period: 2,
    },
]

const residentsData: Prisma.ResidentCreateInput[] = [
    {
        name: 'Resident 1',
        planet: {
            connectOrCreate:
                {
                    where: {
                        id: 1
                    },
                    create: {
                        name: 'Planet 1',
                        rotation_period: 1
                    }
                }
        },
        species: {
            create: [
                {
                    Specie: {
                        connectOrCreate: {
                            where: {
                                id: 1
                            },
                            create: {
                                name: 'Specie 1'
                            }
                        }
                    }
                }
            ]
        }
    },
    {
        name: 'Resident 2',
        planet: {
            connectOrCreate:
                {
                    where: {
                        id: 1
                    },
                    create: {
                        name: 'Planet 1',
                        rotation_period: 1
                    }
                }
        },
        species: {
            create: [
                {
                    Specie: {
                        connectOrCreate: {
                            where: {
                                id: 1
                            },
                            create: {
                                name: 'Specie 1'
                            }
                        }
                    }
                }
            ]
        }
    },
]

async function main() {
    console.log(`Start seeding ...`)
    // for (const u of planetsData) {
    //     const user = await prisma.planet.create({
    //         data: u,
    //     })
    //     console.log(`Created planet with id: ${user.id}`)
    // }

    // for (const u of residentsData) {
    //     const user = await prisma.resident.create({
    //         data: u,
    //     })
    //     console.log(`Created resident with id: ${user.id}`)
    // }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

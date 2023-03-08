import {Prisma, PrismaClient} from '@prisma/client'
import express from 'express'
import axios from "axios";
import e from "express";

const prisma = new PrismaClient();

const getPlanet = async (planetId: Number) => {
    try {
        const res = await axios.get(`https://swapi.dev/api/planets/${planetId}`);
        return res.data
    } catch (err) {
        console.error(err);
    }
};

const getResidents = async (page: any) => {
    try {
        const res = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
        return res.data
    } catch (err) {
        console.error(err);
    }
};

const getSpecie = async (specieId: Number) => {
    try {
        const res = await axios.get(`https://swapi.dev/api/species/${specieId}`);
        return res.data
    } catch (err) {
        console.error(err);
    }
};

const importPlanets = async (planets: any) => {
    const planetsData: Prisma.PlanetCreateManyInput[] = planets.map((p: { name: string; rotation_period: string; }) => {
        return {
            name: p.name,
            rotation_period: +p.rotation_period,
        }
    })
    const user = await prisma.planet.createMany({
        data: planetsData,
        skipDuplicates: true,
    })
}

const getResources = async () => {
    let residents: any = [];
    for (let page = 1; page < 2; page++) {
        console.log(page)
        const pageResult = await getResidents(page)
        residents = residents.concat(pageResult.results);
    }
    console.log(residents)
    console.log(residents.length)

    const enrichedResidents = [];
    for (const resident of residents) {
        resident.id = resident.url.slice(0, -1).split('/').pop()
        resident.planetId = resident.homeworld.slice(0, -1).split('/').pop()
        resident.planet = await getPlanet(resident.planetId)

        const species = []
        for (const specie of resident.species) {
            const specieId = specie.slice(0, -1).split('/').pop()
            const specieData = await getSpecie(specieId)
            specieData.specieId = specieId
            species.push(specieData)
        }

        resident.species = species
        enrichedResidents.push(resident)
    }
    return enrichedResidents
};

const importResources = async (residents: any) => {
    const inputs: Prisma.ResidentCreateInput[] = residents.map((resident: any) => {
        return {
            id: parseInt(resident.id),
            name: resident.name,
            planet: {
                connectOrCreate:
                    {
                        where: {
                            id: parseInt(resident.planetId)
                        },
                        create: {
                            id: parseInt(resident.planetId),
                            name: resident.planet.name,
                            rotation_period: resident.planet.rotation_period,
                        }
                    }
            },
            species: resident.species.length == 0 ? undefined :
                {
                    create: resident.species.map((specie: { specieId: any; name: any; }) => {
                        return {
                            Specie: {
                                connectOrCreate: {
                                    where: {
                                        id: parseInt(specie.specieId)
                                    },
                                    create: {
                                        id: parseInt(specie.specieId),
                                        name: specie.name
                                    }
                                }
                            }
                        }
                    })
                }
        }
    })

    for (const input of inputs) {
        await prisma.resident.create({
            data: input,
        })
    }
};

export default function handler() {
    getResources().then(resources => {
            importResources(resources).then(res => console.log("done"))
        }
    )
};

/* istanbul ignore file */
import { db } from './db';
import { ShelteredAnimal, Animal } from '../models/ShelteredAnimal';

export function getAnimalByID(shelterIDNumber: number): Promise<ShelteredAnimal> { // Get an animal by its ID
    const sql = 'SELECT * FROM animals WHERE shelterIDNumber = $1';

    return db.query<Animal>(sql, [shelterIDNumber])
        .then(result => result.rows.map(row => ShelteredAnimal.from(row))[0]);
}

export function getAllAnimals(): Promise<ShelteredAnimal[]> { // Get all animals
    const sql = 'SELECT * FROM animals';

    return db.query<Animal>(sql, []).then(result => {
        const rows: Animal[] = result.rows;

        console.log(rows);

        const animals: ShelteredAnimal[] = rows.map(row => ShelteredAnimal.from(row));
        return animals;
    });
}


export async function animalExists(shelterIDNumber: number): Promise<boolean> { // Checks if animal exists in the table.
    const sql = `SELECT EXISTS(SELECT shelterIDNumber FROM animals WHERE shelterIDNumber = $1);`;
    const result = await db.query<Exists>(sql, [shelterIDNumber]);
    return result.rows[0].exists;
}

export function saveAnimal(animal: ShelteredAnimal): Promise<ShelteredAnimal> { // Saves animal
    const sql = `INSERT INTO animals (name, species, sex, fixed, declawed, birthdate) \
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    return db.query<Animal>(sql, [
        animal.name,
        animal.species,
        animal.sex,
        animal.fixed,
        animal.declawed,
        animal.birthdate.toISOString()
    ]).then(result => result.rows.map(row => ShelteredAnimal.from(row))[0]);
}

export function patchAnimal(animal: ShelteredAnimal): Promise<ShelteredAnimal> {

    const sql = `UPDATE animals SET name = COALESCE($1, name), \
species = COALESCE($2, species), sex = COALESCE($3, sex) \
fixed = COALESCE($4, fixed), declawed = COALESCE($5, declawed) \
birthdate = COALESCE($6, birthdate) WHERE shelterIDNumber = $7 RETURNING *`;

    const birthdate = animal.birthdate && animal.birthdate.toISOString();

    const params = [animal.name, animal.species, animal.sex, animal.fixed, animal.declawed,
                    birthdate, animal.shelterIDNumber];

    return db.query<Animal>(sql, params)
        .then(result => result.rows.map(row => ShelteredAnimal.from(row))[0]);
}

interface Exists {
    exists: boolean;
}
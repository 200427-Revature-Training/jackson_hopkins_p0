/* istanbul ignore file */
import { db } from './db';
import { Species, SpeciesRow } from '../models/Species';

export function getSpeciesByID(species_id: number): Promise<Species> {
    const sql = 'SELECT * FROM species WHERE species_id = $1';

    return db.query<SpeciesRow>(sql, [species_id])
        .then(result => result.rows.map(row => Species.from(row))[0]);
}

export function getAllSpecies(): Promise<Species[]> { // Get all species
    const sql = 'SELECT * FROM species';

    return db.query<SpeciesRow>(sql, []).then(result => {
        const rows: SpeciesRow[] = result.rows;

        console.log(rows);

        const species: Species[] = rows.map(row => Species.from(row));
        return species;
    });
}

export async function speciesExists(speciesID: number): Promise<boolean> { // Chekcs if species exists in the table.
    const sql = `SELECT EXISTS(SELECT species_id FROM species WHERE species_id = $1);`;
    const result = await db.query<Exists>(sql, [speciesID]);
    return result.rows[0].exists;
}

export function saveSpecies(species: Species): Promise<Species> {
    const sql = `INSERT INTO species (name) \
VALUES ($1) RETURNING *`;

    return db.query<SpeciesRow>(sql, [
        species.name
    ]).then(result => result.rows.map(row => Species.from(row))[0]);
}

export function patchSpecies(species: Species): Promise<Species> {

    const sql = `UPDATE species SET name = COALESCE($1, name) \ WHERE species_id = $2 RETURNING *`;

    const params = [species.name, species.speciesID];

    return db.query<SpeciesRow>(sql, params)
        .then(result => result.rows.map(row => Species.from(row))[0]);
}

interface Exists {
    exists: boolean;
}
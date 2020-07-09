import * as speciesService from '../../src/services/species-service';
import * as speciesDao from '../../src/daos/species-dao';
import { Species } from '../../src/models/Species';

jest.mock('../../src/daos/species-dao');

const mockSpeciesDao = speciesDao as any;

describe('saveSpecies', () => {
    test('422 returned if no name provided', async () => {
        expect.assertions(1);
        mockSpeciesDao.saveSpecies.mockImplementation(() => {
            console.log('This is what mock dao actually calls');
        });

        const payload = {
            speciesID: 1,
        };

        try {
            await speciesService.saveSpecies(payload);
            fail('speciesService.saveSpecies did not throw expected error');
        } catch(err) {
            expect(err).toBeDefined();
        }
    });

    test('Input object transformed to Species object', async () => {
        mockSpeciesDao.saveSpecies.mockImplementation(o => o);

        const payload = {
            speciesID: 2,
            name: 'cat'
        };

        const result = await speciesService.saveSpecies(payload);

        expect(payload).not.toBeInstanceOf(Species);
        expect(result).toBeInstanceOf(Species);
    });

    test('ID value of input is replaced in output', async () => {
        mockSpeciesDao.saveSpecies.mockImplementation(o => o);

        const payload = {
            speciesID: 2,
            name: 'cat'
        };;

        const result = await speciesService.saveSpecies(payload);

        expect(result.speciesID).not.toBe(payload.speciesID);
    });

    test('Extraneous fields in input are not in output', async () => {
        mockSpeciesDao.saveSpecies.mockImplementation(o => o);

        const payload = {
            speciesID: 2,
            name: 'cat'
        };

        const result = await speciesService.saveSpecies(payload) as any;

        expect(result.likesSkateboards).not.toBeDefined();
    });
});


describe('patchSpecies', () => {

    test('successful patch', async () => {
        expect.assertions(1);

        mockSpeciesDao.patchSpecies
            .mockImplementation(() => ({}));

        const payload = {
            speciesID: 2,
            name: 'cat'
        };

        const result = await speciesService.patchSpecies(payload);
        expect(result).toBeTruthy();
    });

    test('patch fails when no valid id is provided', async () => {
        expect.assertions(1);

        mockSpeciesDao.patchSpecies
            .mockImplementation(() => ({}));

        const payload = {
            name: 'cat'
        };

        try {
            await speciesService.patchSpecies(payload);
            fail();
        } catch(err) {
            expect(err).toBeTruthy();
        }
    });
});
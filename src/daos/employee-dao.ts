/* istanbul ignore file */
import { db } from './db';
import { EmployeeKeeper, Employee } from '../models/EmployeeKeeper';

export function getEmployeeByID(employeeID: number): Promise<EmployeeKeeper> {
    const sql = 'SELECT * FROM employees WHERE employee_ID = $1';

    return db.query<Employee>(sql, [employeeID])
        .then(result => result.rows.map(row => EmployeeKeeper.from(row))[0]);
}

export function getAllEmployees(): Promise<EmployeeKeeper[]> { // Get all employees
    const sql = 'SELECT * FROM employees';

    return db.query<Employee>(sql, []).then(result => {
        const rows: Employee[] = result.rows;

        console.log(rows);

        const employees: EmployeeKeeper[] = rows.map(row => EmployeeKeeper.from(row));
        return employees;
    });
}

export async function employeeExists(employeeID: number): Promise<boolean> { // Chekcs if employee exists in the table.
    const sql = `SELECT EXISTS(SELECT employeeID FROM employees WHERE employeeID = $1);`;
    const result = await db.query<Exists>(sql, [employeeID]);
    return result.rows[0].exists;
}

export function saveEmployee(employee: EmployeeKeeper): Promise<EmployeeKeeper> {
    const sql = `INSERT INTO employees (first_name, last_name, position) \
VALUES ($1, $2, $3) RETURNING *`;

    return db.query<Employee>(sql, [
        employee.firstName,
        employee.lastName,
        employee.position

    ]).then(result => result.rows.map(row => EmployeeKeeper.from(row))[0]);
}

export function patchEmployee(employee: EmployeeKeeper): Promise<EmployeeKeeper> {

    const sql = `UPDATE employees SET first_name = COALESCE($1, first_name), \
last_name = COALESCE($2, last_name), position = COALESCE($3, position) \
WHERE employeeID = $4 RETURNING *`;

    const params = [employee.firstName, employee.lastName,
                    employee.position, employee.employeeID];

    return db.query<Employee>(sql, params)
        .then(result => result.rows.map(row => EmployeeKeeper.from(row))[0]);
}

interface Exists {
    exists: boolean;
}
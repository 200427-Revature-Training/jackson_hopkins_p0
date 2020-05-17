import { db } from './db';
import { EmployeeKeeper, Employee } from '../models/EmployeeKeeper';

export function getEmployeeByID(employeeID: number): Promise<EmployeeKeeper> {
    const sql = 'SELECT * FROM employees WHERE employeeID = $1';

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
    const sql = `INSERT INTO employees (employeeID, firstName, lastName, position) \
VALUES ($1, $2, $3, $4) RETURNING *`;

    return db.query<Employee>(sql, [
        employee.employeeID,
        employee.firstName,
        employee.lastName,
        employee.position

    ]).then(result => result.rows.map(row => EmployeeKeeper.from(row))[0]);
}

interface Exists {
    exists: boolean;
}
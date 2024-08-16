const inquirer = require('inquirer')
const getDb = require('./lib/db')

function main() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "option",
            loop: false,
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        }
    ]).then((res) => {
        switch(res.option) {
            case "Add Employee":
                addEmployee();
                break;

            case "View All Employees":
                viewAllEmployees()
                break;

            case "Update Employee Role":
                updateEmployeeRole()
                break;

            case "View All Roles": 
                viewAllRoles()
                break;

            case "Add Role":
                addRole();
                break;

            case "View All Departments": 
                viewAllDepartments()
                break;

            case "Add Department":
                addDepartment()
                break

            case "Quit": 
                quit()
                break;
        }
    })
}

async function viewAllEmployees() {
    const db = await getDb()
    const roles = (await db.query("SELECT * FROM role")).rows
    const employees = (await db.query("SELECT * FROM employee")).rows
    const departments = (await db.query("SELECT * FROM department")).rows


    console.table(employees.map((employee) => {
        const employeeRole = roles.find(role => role.id === employee.role_id)
        const employeeDepartment = departments.find(department => department.id === employeeRole.department)
        const employeeManager = employees.find(e => e.id === employee.manager_id)

        return {
            id: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            title: employeeRole.title,
            department: employeeDepartment.name,
            salary: employeeRole.salary,
            manager: employeeManager? employeeManager.first_name + " " + employeeManager.last_name : null
        }
    }))

    main()
}

async function addEmployee() {
    const db = await getDb()
    const roles = (await db.query("SELECT * FROM role")).rows
    const employees = (await db.query("SELECT * FROM employee")).rows

    inquirer.prompt([
        {
            type: "input",
            message: "Enter First Name",
            name: "first_name",
        },
        {
            type: "input",
            message: "Enter Last Name",
            name: "last_name",
        },
        {
            type: "list",
            message: "Choose Role",
            name: "role",
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        },
        {
            type: "list",
            message: "Choose Manager",
            name: "manager",
            choices: [
                {
                    name: "No Manager",
                    value: null
                },
                ...employees.map((employee) => {
                    return {
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }
                })
            ]
        }
    ]).then((res) => {
        db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)`, Object.values(res))
        main()
    })
}

async function updateEmployeeRole() {
    const db = await getDb()
    const roles = (await db.query("SELECT * FROM role")).rows
    const employees = (await db.query("SELECT * FROM employee")).rows

    inquirer.prompt([
        {
            type: "list",
            message: "Choose Employee",
            name: "employee",
            choices: employees.map((employee) => {
                return {
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
            })
        },
        {
            type: "list",
            message: "Choose Role",
            name: "role",
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        },
    ]).then(async (res) => {
        await db.query("UPDATE public.employee SET role_id=$1 WHERE id=$2;", [res.role, res.employee])
        main()
    })
}

async function viewAllRoles() {
    const db = await getDb()
    const roles = (await db.query("SELECT * FROM role")).rows
    
    console.table(roles)
    main()
}

async function addRole() {
    const db = await getDb()
    const departments = (await db.query("SELECT * FROM department")).rows

    inquirer.prompt([
        {
            type: "input",
            message: "Enter Role Title",
            name: "title",
        },
        {
            type: "number",
            message: "Enter Role Salary",
            name: "salary",
        },
        {
            type: "list",
            message: "Choose Department",
            name: "department",
            choices: departments.map((department) => {
                return {
                    name: department.name,
                    value: department.id
                }
            })
        },
    ]).then(async (res) => {
        await db.query(`INSERT INTO role(title, salary, department) VALUES($1, $2, $3)`, Object.values(res))
        main()
    })
}

async function viewAllDepartments() {
    const db = await getDb()
    const departments = (await db.query("SELECT * FROM department")).rows
    
    console.table(departments)

    main()
}

async function addDepartment() {
    const db = await getDb()

    inquirer.prompt([
        {
            type: "input",
            message: "Enter Department Name",
            name: "name"
        }
    ]).then(async (res) => {
        await db.query('INSERT INTO department(name) VALUES($1)', [res.name])
        main()
    })
}

function quit() {
    console.log("Bye!")
    process.exit(0)
}


main()
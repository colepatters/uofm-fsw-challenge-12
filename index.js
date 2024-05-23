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
        if (res.option === "View All Employees") {
            viewAllEmployees()
        }

        if (res.option === "Quit") {
            quit()
        }
    })
}

function viewAllEmployees() {
    getDb().then(function (client) {
        client.query("SELECT * FROM employee")
        .then((res) => {
            console.table(res.rows)
        })
    })


    main()
}

function addEmployee() {
    console.log("view all employees")
    main()
}

function updateEmployeeRole() {
    console.log("view all employees")
    main()
}

function viewAllRoles() {
    console.log("view all employees")
    main()
}

function addRole() {
    console.log("view all employees")
    main()
}

function viewAllDepartments() {
    console.log("view all employees")
    main()
}

function addDepartment() {
    console.log("view all employees")
    main()
}

function quit() {
    console.log("Bye!")
}


main()
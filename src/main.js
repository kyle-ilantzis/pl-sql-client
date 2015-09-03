var mockDbs = [
	{ host: "localhost", port: "3306", username:"", password: "", dbType: DB_TYPE_MYSQL},
	{ host: "localhost", port: "4545", username:"", password: "", dbType: DB_TYPE_POSTGRES}
];

React.render(<DbList dbs={mockDbs}/>,document.body);
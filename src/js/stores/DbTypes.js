(function(pl) {
	
	var MYSQL_DRIVER = "mysql";
	var POSTGRES_DRIVER = "postgres";
	var SQLITE3_DRIVER = "sqlite3";
	
	var DB_TYPE_MYSQL = "MYSQL";
	var DB_TYPE_POSTGRES = "POSTGRES";
	var DB_TYPE_SQLITE3 = "SQLITE3";
	
	var DB_DEFAULTS = {};
	DB_DEFAULTS[DB_TYPE_MYSQL] = {
		host: "localhost",
		port: "3306",
		database: "",
		user: "root",
		password: "",
		dbType: DB_TYPE_MYSQL
	};
	DB_DEFAULTS[DB_TYPE_POSTGRES] = {
		host: "localhost",
		port: "5432",
		database: "",
		user: "root",
		password: "",
		dbType: DB_TYPE_POSTGRES
	};
	DB_DEFAULTS[DB_TYPE_SQLITE3] = {
		path: "",
		dbType: DB_TYPE_SQLITE3
	};
	
	var url = function(driver, host, port, database, user, password) {
		return driver + "://" + user + ":" + password + "@" + host + ":" + port + "/" + database;
	};
	
	pl.DbTypes = {
		
		MYSQL_DRIVER: "mysql",
		POSTGRES_DRIVER: "postgres",
		SQLITE3_DRIVER: "sqlite3",
		
		DB_TYPE_MYSQL: DB_TYPE_MYSQL,
		DB_TYPE_POSTGRES: DB_TYPE_POSTGRES,
		DB_TYPE_SQLITE3: DB_TYPE_SQLITE3,
		
		DB_TYPES: [DB_TYPE_MYSQL, DB_TYPE_POSTGRES, DB_TYPE_SQLITE3],
		
		DB_DEFAULTS: DB_DEFAULTS,
		
		toUrl: function(db) {
		
			switch(db.dbType) {
			
				case DB_TYPE_MYSQL:
					return url(MYSQL_DRIVER, db.host, db.port, db.scheme, db.user, db.password);
				
				case DB_TYPE_POSTGRES:
					return url(POSTGRES_DRIVER, db.host, db.port, db.scheme, db.user, db.password);
				
				case DB_TYPE_SQLITE3:
					return SQLITE3_DRIVER + "://" + db.path;
			}
		}
	};
})(pl||{});
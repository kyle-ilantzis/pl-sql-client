(function(pl) {
	
	var DB_TYPE_NIL = "";
	var DB_TYPE_MYSQL = "MYSQL";
	var DB_TYPE_POSTGRES = "POSTGRES";
	var DB_TYPE_SQLITE3 = "SQLITE3";
	
	pl.DbTypes = {
		
		DB_TYPE_NIL: DB_TYPE_NIL,
		DB_TYPE_MYSQL: DB_TYPE_MYSQL,
		DB_TYPE_POSTGRES: DB_TYPE_POSTGRES,
		DB_TYPE_SQLITE3: DB_TYPE_SQLITE3,
		
		DB_TYPES: [DB_TYPE_MYSQL, DB_TYPE_POSTGRES, DB_TYPE_SQLITE3],
		
		toUrl: function(db) {
		
			switch(db.dbType) {
			
				case DB_TYPE_MYSQL:
				case DB_TYPE_POSTGRES:
					return "";
				
				case DB_TYPE_SQLITE3:
					return "";
			}
		}
	};
})(pl||{});
'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('role', {
    columns: {
      id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true, unsigned: true, length: 11 },
      role_name: { type: 'string', length: 255, notNull: true },
      created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('role', callback);
};

exports._meta = {
  "version": 1
};

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
  db.createTable('users', {
    columns: {
      id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true, unsigned: true, length: 11 },
      role_id:
      {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true,
        foreignKey: {
          name: 'user_role_id_fk',
          table: 'role',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      username: { type: 'string', length: 255, notNull: true },
    email: { type: 'string', length: 255, notNull: true, unique: true },
    password: { type: 'string', length: 255, notNull: true },
    profilepicture: { type: 'string', length: 255, notNull: true },
    bio: { type: 'string', length: 255 },
      created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user', callback);
};

exports._meta = {
  "version": 1
};

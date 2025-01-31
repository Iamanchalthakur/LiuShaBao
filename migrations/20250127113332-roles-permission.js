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
  db.createTable('roles_permission', {
    columns: {
      id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true, unsigned: true, length: 11 },
   
      role_id:
      {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true,
        foreignKey: {
          name: 'roles_permission_role_id_fk',
          table: 'role',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      permission_id:
      {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true,
        foreignKey: {
          name: 'roles_permission_permission_id_fk',
          table: 'permission',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
   
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('roles_permission', callback);
};

exports._meta = {
  "version": 1
};

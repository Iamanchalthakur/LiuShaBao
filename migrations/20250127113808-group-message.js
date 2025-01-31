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

exports.up = function(db) {
  return db.createTable('group_message', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    group_name: { type: 'varchar', length: 255, notNull: true },
    user_id: { type: 'int', notNull: true },
    createdBy: { type: 'int', notNull: true },
    content: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('group_message', 'fk_group_message_user', {
      type: 'foreign key',
      fields: ['user_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete group messages if the user is deleted
    });
  })
  .then(function() {
    return db.addConstraint('group_message', 'fk_group_message_creator', {
      type: 'foreign key',
      fields: ['createdBy'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete group messages if the creator is deleted
    });
  })
  // Adding an index for group_name and user_id
  .then(function() {
    return db.addIndex('group_message', 'idx_group_name_user', ['group_name', 'user_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('group_message');
};

exports._meta = {
  "version": 1
};

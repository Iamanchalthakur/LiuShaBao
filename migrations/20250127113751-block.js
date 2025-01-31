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
  return db.createTable('block', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    blocker_id: { type: 'int', notNull: true },
    blocked_id: { type: 'int', notNull: true },
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('block', 'fk_block_blocker', {
      type: 'foreign key',
      fields: ['blocker_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Deletes the block record if the blocker is deleted
    });
  })
  .then(function() {
    return db.addConstraint('block', 'fk_block_blocked', {
      type: 'foreign key',
      fields: ['blocked_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Deletes the block record if the blocked user is deleted
    });
  })
  .then(function() {
    // Adding indexes to improve query performance on blocker_id and blocked_id
    return db.addIndex('block', 'idx_block_blocker', ['blocker_id']);
  })
  .then(function() {
    return db.addIndex('block', 'idx_block_blocked', ['blocked_id']);
  })
  .then(function() {
    // Optional: Adding unique constraint to prevent blocking the same user multiple times
    return db.addUniqueConstraint('block', 'unique_block', ['blocker_id', 'blocked_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('block');
};

exports._meta = {
  "version": 1
};

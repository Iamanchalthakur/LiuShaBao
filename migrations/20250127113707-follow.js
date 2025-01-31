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
  return db.createTable('follow', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    followed_by: { type: 'int', notNull: true },
    followed_to: { type: 'int', notNull: true },
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('follow', 'fk_followed_by_user', {
      type: 'foreign key',
      fields: ['followed_by'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Deletes the follow record if the following user is deleted
    });
  })
  .then(function() {
    return db.addConstraint('follow', 'fk_followed_to_user', {
      type: 'foreign key',
      fields: ['followed_to'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Deletes the follow record if the followed user is deleted
    });
  })
  .then(function() {
    // Add a unique constraint to prevent duplicate follows
    return db.addConstraint('follow', 'unique_follow', {
      type: 'unique',
      fields: ['followed_by', 'followed_to']
    });
  })
  .then(function() {
    // Adding indexes for better performance
    return db.addIndex('follow', 'idx_followed_by', ['followed_by']);
  })
  .then(function() {
    return db.addIndex('follow', 'idx_followed_to', ['followed_to']);
  });
};

exports.down = function(db) {
  return db.dropTable('follow');
};

exports._meta = {
  "version": 1
};

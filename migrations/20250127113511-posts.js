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
  return db.createTable('posts', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { type: 'int', notNull: true },
    title: { type: 'varchar', length: 255, notNull: true },
    content: { type: 'text', notNull: true },
    status: { type: 'varchar', length: 50, notNull: true },
    published_at: { type: 'timestamp' },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' } // Fixed here
  })
  .then(function() {
    return db.addConstraint('posts', 'fk_posts_user', {
      type: 'foreign key',
      fields: ['user_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // You can also use 'SET NULL' if you want posts to persist when a user is deleted
    });
  });
};

exports.down = function(db) {
  return db.dropTable('posts');
};

exports._meta = {
  "version": 1
};

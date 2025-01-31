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
  return db.createTable('comments', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    post_id: { type: 'int', notNull: true },
    user_id: { type: 'int', notNull: true },
    content: { type: 'text', notNull: true },
    image: { type: 'varchar', length: 255 }, // Can store image URL or file path
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() },
    updated_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('comments', 'fk_comments_post', {
      type: 'foreign key',
      fields: ['post_id'],
      references: 'posts(id)',
      onDelete: 'CASCADE' // Deletes comments if the post is deleted
    });
  })
  .then(function() {
    return db.addConstraint('comments', 'fk_comments_user', {
      type: 'foreign key',
      fields: ['user_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Deletes comments if the user is deleted
    });
  })
  .then(function() {
    // Adding indexes for faster querying
    return db.addIndex('comments', 'idx_comments_post', ['post_id']);
  })
  .then(function() {
    return db.addIndex('comments', 'idx_comments_user', ['user_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('comments');
};

exports._meta = {
  "version": 1
};

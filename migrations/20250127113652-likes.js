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
  return db.createTable('likes', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { type: 'int', notNull: true },
    post_id: { type: 'int', notNull: true },
    comment_id: { type: 'int' },
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('likes', 'fk_likes_user', {
      type: 'foreign key',
      fields: ['user_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete likes if user is deleted
    });
  })
  .then(function() {
    return db.addConstraint('likes', 'fk_likes_post', {
      type: 'foreign key',
      fields: ['post_id'],
      references: 'posts(id)',
      onDelete: 'CASCADE' // Delete likes if post is deleted
    });
  })
  .then(function() {
    return db.addConstraint('likes', 'fk_likes_comment', {
      type: 'foreign key',
      fields: ['comment_id'],
      references: 'comments(id)',
      onDelete: 'CASCADE' // Delete likes if comment is deleted
    });
  })
  .then(function() {
    // Adding indexes for better performance
    return db.addIndex('likes', 'idx_likes_user', ['user_id']);
  })
  .then(function() {
    return db.addIndex('likes', 'idx_likes_post', ['post_id']);
  })
  .then(function() {
    return db.addIndex('likes', 'idx_likes_comment', ['comment_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('likes');
};

exports._meta = {
  "version": 1
};

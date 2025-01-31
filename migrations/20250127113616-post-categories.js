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
  return db.createTable('post_categories', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    post_id: { type: 'int', notNull: true },
    category_id: { type: 'int', notNull: true },
    user_id: { type: 'int', notNull: true },
    created_at: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' } // Added created_at for tracking
  })
  .then(function() {
    // Adding Foreign Key Constraints
    return db.addConstraint('post_categories', 'fk_post_categories_post', {
      type: 'foreign key',
      fields: ['post_id'],
      references: 'posts(id)',
      onDelete: 'CASCADE' // Delete post-category entries when a post is deleted
    });
  })
  .then(function() {
    return db.addConstraint('post_categories', 'fk_post_categories_category', {
      type: 'foreign key',
      fields: ['category_id'],
      references: 'categories(id)',
      onDelete: 'CASCADE' // Delete post-category entries when a category is deleted
    });
  })
  .then(function() {
    return db.addConstraint('post_categories', 'fk_post_categories_user', {
      type: 'foreign key',
      fields: ['user_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete post-category entries when a user is deleted (optional)
    });
  })
  .then(function() {
    // Adding indexes for faster lookups
    return db.addIndex('post_categories', 'idx_post_categories_post', ['post_id']);
  })
  .then(function() {
    return db.addIndex('post_categories', 'idx_post_categories_category', ['category_id']);
  })
  .then(function() {
    return db.addIndex('post_categories', 'idx_post_categories_user', ['user_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('post_categories');
};

exports._meta = {
  "version": 1
};

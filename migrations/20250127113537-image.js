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
  return db.createTable('image', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    post_id: { type: 'int', notNull: true },
    image: { type: 'varchar', length: 255, notNull: true }
  })
  .then(function() {
    return db.addConstraint('image', 'fk_image_post', {
      type: 'foreign key',
      fields: ['post_id'],
      references: 'posts(id)',
      onDelete: 'CASCADE' // Deletes images when the associated post is deleted
    });
  });
};

exports.down = function(db) {
  return db.dropTable('image');
};

exports._meta = {
  "version": 1
};

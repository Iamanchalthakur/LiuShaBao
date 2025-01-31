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
  return db.createTable('message', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    receiver_id: { type: 'int', notNull: true },
    sender_id: { type: 'int', notNull: true },
    is_read: { type: 'boolean', defaultValue: false }, // Default to false (unread)
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('message', 'fk_message_receiver', {
      type: 'foreign key',
      fields: ['receiver_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete messages if the receiver is deleted
    });
  })
  .then(function() {
    return db.addConstraint('message', 'fk_message_sender', {
      type: 'foreign key',
      fields: ['sender_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete messages if the sender is deleted
    });
  })
  .then(function() {
    // Adding indexes for better performance on receiver_id and sender_id
    return db.addIndex('message', 'idx_message_receiver', ['receiver_id']);
  })
  .then(function() {
    return db.addIndex('message', 'idx_message_sender', ['sender_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('message');
};

exports._meta = {
  "version": 1
};

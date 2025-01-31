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
  return db.createTable('message_seen_time', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    sender_id: { type: 'int', notNull: true },
    receiver_id: { type: 'int', notNull: true },
    seen_at: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', defaultValue: dbm.dataType.now() }
  })
  .then(function() {
    return db.addConstraint('message_seen_time', 'fk_message_seen_sender', {
      type: 'foreign key',
      fields: ['sender_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete seen time record if sender is deleted
    });
  })
  .then(function() {
    return db.addConstraint('message_seen_time', 'fk_message_seen_receiver', {
      type: 'foreign key',
      fields: ['receiver_id'],
      references: 'users(id)',
      onDelete: 'CASCADE' // Delete seen time record if receiver is deleted
    });
  })
  .then(function() {
    // Add indexes for better query performance
    return db.addIndex('message_seen_time', 'idx_message_seen_sender_receiver', ['sender_id', 'receiver_id']);
  })
  .then(function() {
    // Add a unique constraint to avoid duplicate seen times for a sender-receiver pair
    return db.addUniqueConstraint('message_seen_time', 'unique_sender_receiver', ['sender_id', 'receiver_id']);
  });
};

exports.down = function(db) {
  return db.dropTable('message_seen_time');
};

exports._meta = {
  "version": 1
};

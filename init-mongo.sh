#!/bin/bash
set -e

# Start MongoDB in the background with the correct options
mongod --bind_ip_all --replSet rs0 &

# Get the process ID of the background mongod
pid=$!

# Wait for MongoDB to be ready
# We use a loop to check the connection status
until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1
do
  echo "Waiting for MongoDB to start..."
  sleep 1
done
echo "MongoDB started."

# Execute your existing init.js script to initiate the replica set and seed data
echo "Running init.js script..."
mongosh < /docker-entrypoint-initdb.d/init.js

# Bring the MongoDB process to the foreground
# This makes the script wait for mongod to exit, keeping the container alive
wait $pid
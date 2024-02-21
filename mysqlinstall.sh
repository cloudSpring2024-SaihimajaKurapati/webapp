#!/bin/bash

DB_USERNAME=root
DB_PASSWORD=root
NEW_PASSWORD=root
DB_NAME=health_check_db


sudo yum install -y mysql-server mysql


sudo systemctl start mysqld


sudo systemctl enable mysqld


sleep 5


echo "Securing MySQL Installation..."
mysql -u $DB_USERNAME -e "ALTER USER '$DB_USERNAME'@'localhost' IDENTIFIED BY '$NEW_PASSWORD';"

echo "MySQL Installation Completed."

# Create MySQL database if it doesn't exist
if ! mysql -u $DB_USERNAME -p"$NEW_PASSWORD" -e "USE $DB_NAME"; then
    echo "Creating database $DB_NAME..."
    mysql -u $DB_USERNAME -p"$NEW_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    echo "Database $DB_NAME created."
else
    echo "Database $DB_NAME already exists."
fi

# Create MySQL table if it doesn't exist
mysql -u $DB_USERNAME -p"$NEW_PASSWORD" -e "USE $DB_NAME; CREATE TABLE IF NOT EXISTS Users (id CHAR(36) BINARY PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, userName VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL);"

echo "MySQL installation and configuration completed."

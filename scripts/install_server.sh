#! /bin/bash

#installation per server
#version 6

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

#nodejs :
sudo apt-get install -y nodejs
sudo npm install

#mysql server :

sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password no_pass'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password no_pass'
sudo apt-get -y install mysql-server


#create db in server
mysql -u root --password=no_pass < ./db_carto.sql

#run the app
npm start

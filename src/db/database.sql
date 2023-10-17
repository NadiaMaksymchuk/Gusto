CREATE DATABASE IF NOT EXISTS  gustodb DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
USE gustodb
CREATE TABLE  IF NOT EXISTS  Restaurants (id BIGINT AUTO_INCREMENT PRIMARY KEY,name NVARCHAR(255),cuisineType BIGINT,address NVARCHAR(255),contacts NVARCHAR(255))ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE  IF NOT EXISTS Users (Id BIGINT PRIMARY KEY,city INT,language INT,firstName NVARCHAR(255),lastName NVARCHAR(255),dateOfBirth DATETIME,email NVARCHAR(255),numberPhone NVARCHAR(20),imagePath NVARCHAR(255),sex INT,isAdmin BOOLEAN);
CREATE DATABASE IF NOT EXISTS  gustodb DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
USE gustodb
CREATE TABLE IF NOT EXISTS Image (id NVARCHAR(255) PRIMARY KEY,url NVARCHAR(255),urlMin NVARCHAR(255)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS  Restaurants (id BIGINT AUTO_INCREMENT PRIMARY KEY ,name NVARCHAR(255),cuisineType BIGINT,address NVARCHAR(255),contacts NVARCHAR(255))ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS Users (id BIGINT AUTO_INCREMENT PRIMARY KEY,city INT,language INT,firstName NVARCHAR(255),lastName NVARCHAR(255),dateOfBirth DATETIME,email NVARCHAR(255) UNIQUE,numberPhone NVARCHAR(20),imageId NVARCHAR(255),FOREIGN KEY (imageId) REFERENCES Image(id),sex INT,isAdmin BOOLEAN, password NVARCHAR(255), salt NVARCHAR(255),INDEX(email))ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS MenuItems (id BIGINT PRIMARY KEY AUTO_INCREMENT,restaurantId BIGINT,name NVARCHAR(255),description NVARCHAR(255),price BIGINT,imageId NVARCHAR(255),type BIGINT,FOREIGN KEY (restaurantId) REFERENCES Restaurants(id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS Orders (id BIGINT PRIMARY KEY AUTO_INCREMENT,userId BIGINT,restaurantId BIGINT,orderStatus INT,orderDate DATETIME,DeliveryTime DATETIME,FOREIGN KEY (userId) REFERENCES Users(id),FOREIGN KEY (restaurantId) REFERENCES Restaurants(id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS OrderItems (id BIGINT PRIMARY KEY AUTO_INCREMENT,orderId BIGINT,menuItemId BIGINT,Quantity INT,totalPrice BIGINT,FOREIGN KEY (orderId) REFERENCES Orders(id),FOREIGN KEY (menuItemId) REFERENCES MenuItems(id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS Couriers (id BIGINT PRIMARY KEY AUTO_INCREMENT,firstName NVARCHAR(255),lastName NVARCHAR(255),numberPhone NVARCHAR(255),vehicleNumber NVARCHAR(255),availabilityStatus INT) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS DeliveryDetails (id BIGINT PRIMARY KEY AUTO_INCREMENT,orderId BIGINT,courierId BIGINT,quantity INT,totalPrice BIGINT,deliveryDate DATETIME,status INT,FOREIGN KEY (orderId) REFERENCES Orders(id),FOREIGN KEY (courierId) REFERENCES Couriers(id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
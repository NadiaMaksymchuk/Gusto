# Gusto | Documentation | API Documentation

## Description
Gusto is an online web platform for food delivery from your favorite restaurant or cafe in your city. The site effectively allows you to order from the restaurant, calculate the time and price of delivery, track the courier and contact if necessary.

Content:


## Technologies:

- Task should be implemented on Typescript

Backend:
- Platform: Node.js
- Network: REST, WebSockets
- Framework: express
- Database: MySql
- Cloud: Azure
- Other: JWT, Firebase, Docker

## Implementation details

Base URL

```
 http://localhost:4200/api/
```

## Extensions for frontend development
- ESLint (analysis tool that checks TypeScript\JavaScript code for readability, maintainability, and functionality errors)
- EditorConfig (helps maintain consistent coding styles for multiple developers working on the same project)

## Links
[Trello Board]()

## Install

Clone repo

```
git clone https://github.com/NadiaMaksymchuk/Gusto.git
```

Go to project folder

```
cd src/app
```

Install dependencies

```
npm i
```

## Environment variables


## DB Schema

```mermaid
erDiagram
  Users ||--|{ Notifications : userId
  Users }|--|{ Chats : id

  Users {
    bigint Id PK
    int city
    int language
    nvarchar firstName
    nvarchar lastName
    int age
    nvarchar email
    nvchar numberPhone
    nvarchar imagePath
    int sex
    boolean isAdmin
  }

  Notifications {
    bigint id PK
    bigint userId FK
    nvarchar text
    int type
    boolean isRead
  }

  Restaurants {
    bigint id PK
    nvchar name
    bigint cuisineType
    nvchar address
    nvchar contacts
  }

  Chats ||--|{ Messages : chatId
  Chats {
    bigint id PK
    nvarchar name
  }
  
  MenuItems {
    bigint id PK
    bigint restarantId FK
    nvarchar name
    nvarchar description
    bigint price
    nvarchar imagePath
  }

  Couriers {
    bigint id PK
	nvarchar firstName
    nvarchar lastName
    nvarchar vehicleNumber
    int availabilityStatus
  }

  Orders {
    bigint id PK
	bigint userId FK
    bigint restaurantId FK
    int orderStatus
    datatime orderDate
    datatime estimatedDeliveryTime
  }

  OrderItems  {
    bigint id PK
	bigint orderId FK
    bigint menuItemId FK
    int Quantity
    bigint totalPrice
  }

  DeliveryDetails  {
    bigint id PK
	bigint orderId FK
    bigint menuItemId FK
    int Quantity
    bigint totalPrice
    datatime deliveryDate
    int status
  }

  Messages {
    bigint id PK
	bigint createdBy
    bigint chatId FK
    nvarchar text
    datetime createdAt
    boolean isDeleted
  }

```
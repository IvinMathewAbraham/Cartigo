# Online Shopping Cart

## Abstract

The Online Shopping Cart is a web-based eCommerce application developed using React.js, Node.js, and Express.js with MySQL as the database management system. The platform enables customers to conveniently browse, select, and purchase products online through a modern and responsive user interface.

The system provides an interactive digital marketplace where customers can explore available products, submit product enquiries, place orders, and make secure online payments, while administrators can efficiently manage products, orders, inventory, customer information, and enquiries. By automating retail operations and online sales, the application enhances customer convenience, streamlines order processing, and improves overall business management.

The platform consists of two major modules:

1. Admin (Seller) Module
2. Customer (User) Module

---

# Module Description

## 1. Admin (Seller) Module

The Admin Module provides comprehensive backend functionalities for managing the online store. It enables administrators to control product listings, monitor orders, handle customer enquiries, and analyse business performance through a centralised dashboard.

### Admin Features

#### Dashboard
Displays key business metrics such as:
- Total Products
- Orders
- Customers
- Enquiries
- Sales
- Revenue

#### Product Management
- Add products
- Edit products
- Update products
- Delete products
- Manage:
  - Product Name
  - Category
  - Price
  - Description
  - Stock Quantity
  - Product Images

#### Category Management
- Organise products into relevant categories
- Improve navigation and product filtering

#### Order Management
- View customer orders
- Update order status:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- Generate digital invoices

#### Enquiry Management
- View customer product enquiries
- Respond to enquiries directly from the product page
- Track enquiry status:
  - New
  - Read
  - Replied

#### Inventory Management
- Monitor stock levels
- Manage product availability in real time

#### Reports and Analytics
- Generate sales reports
- Generate revenue summaries
- Identify best-selling products

#### Customer Management
- View registered customers
- Manage customer accounts
- Review interaction history

#### Authentication and Authorization
- Secure administrator login
- Role-based access control

### Benefits
This module helps store owners efficiently manage operations, improve inventory control, respond to customer enquiries, and monitor overall business performance.

---

## 2. Customer (User) Module

The Customer Module provides a user-friendly shopping experience that allows customers to browse products, make enquiries, place orders, and track deliveries online.

### Customer Features

#### Home Page
Displays:
- Featured products
- Latest offers
- Popular items
- Promotional banners

#### Product Browsing
View products with:
- Images
- Descriptions
- Prices
- Sizes
- Availability details

#### Search and Filtering
- Search by product name
- Search by category
- Filter by price range

#### Product Enquiry
Submit enquiries directly from the product detail page, including:
- Name
- Email
- Phone Number
- Custom Message

#### Shopping Cart
- Add products to cart
- Update quantities
- Remove items before checkout

#### Wishlist
- Save favourite products for future purchases

#### Checkout and Payment
- Secure online payment processing
- Delivery information management

#### Order Tracking
- View order history
- Track delivery status

#### User Registration and Login
- Secure account creation
- JWT-based authentication

#### Reviews and Ratings
- Submit product reviews
- Provide ratings
- Share feedback

#### Profile Management
- Update personal details
- Manage addresses
- Edit account information

### Benefits
This module ensures a seamless and engaging shopping experience, increasing customer satisfaction and encouraging repeat purchases.

---

# Technologies Used

## Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Bootstrap / React Bootstrap

## Backend
- Node.js
- Express.js

## Database
- MySQL
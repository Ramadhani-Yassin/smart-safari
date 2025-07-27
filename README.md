# Smart Safari System

## Overview
Smart Safari is a comprehensive taxi booking and management system for Zanzibar, providing a seamless platform for customers to book rides and drivers to manage their services. The system streamlines the process of booking taxi rides, managing routes, handling payments, and coordinating between customers and drivers. The system consists of three main components:

- **Back End**: Spring Boot REST API
- **Front End**: Angular web application (Customer, Driver & Admin portals)
- **Database**: MySQL database for data persistence

---

## Project Structure

```
smart_safari/
  ├── backEnd/          # Spring Boot API
  └── frontEnd/         # Angular Web App
```

### Back End (Spring Boot)
- **Controller**: Handles HTTP requests for bookings, users, routes, and payments.
- **DTO**: Data Transfer Objects for API communication (BookingRequestDto, etc.).
- **Model**: JPA entities for database tables (Booking, User, Route, Payment, etc.).
- **Repository**: Spring Data JPA repositories for CRUD operations with custom queries.
- **Service**: Business logic for booking management, driver assignment, payment processing, etc.
- **Resources**: `application.properties` for database and server configuration.

### Front End (Angular)
- **Components**: Modular components for different user roles and features.
  - **Customer Dashboard**: Book rides, view booking history, manage payments, profile settings.
  - **Driver Dashboard**: Accept/decline ride requests, manage active rides, view earnings, profile management.
  - **Admin Dashboard**: Manage customers, drivers, routes, view analytics, system administration.
- **Models**: TypeScript interfaces for data structures (Booking, User, Route, Payment, etc.).
- **Services**: API communication services for all features (BookingService, RouteService, etc.).
- **Shared Components**: Reusable UI components and utilities.

---

## Features

### Customer Features
- **Route Booking**: Browse available routes and book taxi rides
- **Real-time Status Tracking**: Monitor booking status (PENDING, ON_WAY, IN_PROGRESS, COMPLETED, PAID)
- **Payment Management**: Multiple payment methods (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, Bank Transfer)
- **Booking History**: View all past and current bookings with detailed information
- **Profile Management**: Update personal information and preferences
- **Responsive Design**: Modern UI with mobile-friendly interface

### Driver Features
- **Ride Requests**: View and accept/decline pending ride requests
- **Active Ride Management**: Start, complete, and manage ongoing rides
- **Earnings Tracking**: Monitor daily, weekly, and monthly earnings
- **Status Management**: Toggle online/offline status
- **Route Information**: Access detailed route and passenger information
- **Payment Processing**: Mark rides as paid and track payment status

### Admin Features
- **User Management**: Manage customers and drivers (view, delete users)
- **Route Management**: Add, edit, and delete taxi routes
- **Analytics Dashboard**: View system statistics and revenue data
- **Booking Monitoring**: Track all bookings across the platform
- **System Administration**: Overall platform management and oversight

---

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- Angular CLI 20+
- MySQL 8.0+

### Back End Setup
1. Navigate to the `backEnd` directory:
   ```bash
   cd backEnd
   ```

2. Configure the database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_safari
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

4. The API server runs on `http://localhost:8080`

### Front End Setup
1. Navigate to the `frontEnd` directory:
   ```bash
   cd frontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Access the application at `http://localhost:4200`

---

## API Endpoints

### Booking Management
- **GET /api/bookings**: Get all bookings
- **GET /api/bookings/{id}**: Get booking by ID
- **POST /api/bookings**: Create new booking
- **GET /api/bookings/customer/{customerId}**: Get customer bookings
- **GET /api/bookings/pending**: Get pending bookings
- **GET /api/bookings/status/{status}**: Get bookings by status
- **PUT /api/bookings/{bookingId}/accept**: Accept booking (driver)
- **PUT /api/bookings/{bookingId}/decline**: Decline booking (driver)
- **PUT /api/bookings/{id}/status**: Update booking status
- **DELETE /api/bookings/{id}**: Delete booking

### User Management
- **GET /api/users**: Get all users
- **GET /api/users/{id}**: Get user by ID
- **POST /api/users**: Create new user
- **PUT /api/users/{id}**: Update user
- **DELETE /api/users/{id}**: Delete user
- **GET /api/users/role/{role}**: Get users by role

### Route Management
- **GET /api/routes**: Get all routes
- **GET /api/routes/{id}**: Get route by ID
- **POST /api/routes**: Create new route
- **PUT /api/routes/{id}**: Update route
- **DELETE /api/routes/{id}**: Delete route

### Payment Management
- **GET /api/payments**: Get all payments
- **GET /api/payments/{id}**: Get payment by ID
- **POST /api/payments**: Create new payment
- **PUT /api/payments/{id}**: Update payment
- **DELETE /api/payments/{id}**: Delete payment

---

## Database Schema

### Core Tables
- **users**: Customer and driver information
- **routes**: Available taxi routes with pricing
- **bookings**: Ride booking records with status tracking
- **payments**: Payment transaction records

### Key Relationships
- Users can have multiple bookings (as customers or drivers)
- Routes are linked to bookings
- Payments are associated with bookings
- Status tracking for booking lifecycle management

---

## Usage

### For Customers
1. **Register/Login**: Create account or sign in to the platform
2. **Browse Routes**: View available taxi routes with pricing
3. **Book a Ride**: Select route, choose pickup time, and confirm booking
4. **Track Status**: Monitor booking status in real-time
5. **Make Payment**: Complete payment when ride is finished
6. **View History**: Access booking history and receipts

### For Drivers
1. **Driver Registration**: Register as a driver with vehicle information
2. **Accept Requests**: View and accept pending ride requests
3. **Manage Rides**: Start, complete, and manage active rides
4. **Track Earnings**: Monitor income and performance metrics
5. **Update Status**: Toggle online/offline availability

### For Administrators
1. **User Management**: Oversee customer and driver accounts
2. **Route Management**: Add and manage taxi routes
3. **System Monitoring**: View analytics and system performance
4. **Support**: Handle customer and driver support requests

---

## Technology Stack

### Back End
- **Framework**: Spring Boot 3.5.4
- **Database**: MySQL with JPA/Hibernate
- **Build Tool**: Maven
- **Language**: Java 17

### Front End
- **Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: CSS3 with custom design system
- **Icons**: Font Awesome
- **Build Tool**: Angular CLI

### Database
- **RDBMS**: MySQL 8.0+
- **ORM**: Spring Data JPA
- **Connection**: JDBC with connection pooling

---

## Security Features
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Robust error management and logging
- **Session Management**: Secure user session handling

---

## Performance Features
- **Database Optimization**: Indexed queries and efficient data retrieval
- **Caching**: Application-level caching for improved performance
- **Responsive Design**: Mobile-first approach for all devices
- **Real-time Updates**: Live status updates and notifications

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🏆 Developed by

**Ramadhani Yassin**  
[Personal Website](http://ramadhani-yassin.vercel.app/)  
[LinkedIn](https://www.linkedin.com/in/ramadhani-yassin-ramadhani/)

<div align="center">
  <a href="https://github.com/Ramadhani-Yassin" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/ramadhani-yassin-ramadhani/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="mailto:yasynramah@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
  <a href="http://ramadhani-yassin.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Website">
  </a>
</div>

--- 

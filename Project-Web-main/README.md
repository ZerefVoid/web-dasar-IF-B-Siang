# Orangutan Haven Donation System

A full-stack web application developed to support orangutan conservation efforts through information management, donation tracking, and sanctuary administration.

## Features

### Public Features

* View orangutan profiles and stories
* Read conservation news and articles
* Browse Frequently Asked Questions (FAQ)
* Contact Orangutan Haven
* User registration and login

### User Features

* Personal dashboard
* Donation history
* Profile management
* Online donation system

### Admin Features

* Dashboard analytics
* Manage orangutan data
* Manage news articles
* Manage donations
* Manage users
* Manage FAQs
* Manage contact messages

## Technologies Used

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* MySQL

## Project Structure

src/

* components/
* pages/
* context/
* utils/
* assets/

server/

* config/
* middleware/
* routes/

database/

* orangutan_haven.sql

## Installation

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev / npm start
```

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE orangutan_haven;
```

Import the SQL file:

```bash
mysql -u root -p orangutan_haven < database/orangutan_haven.sql
```

## Main Modules

* Authentication System
* Orangutan Management
* Donation Management
* News Management
* User Management
* FAQ Management
* Contact Management

## Screenshots

* Home Page
* Orangutans Page
* Orangutan Detail Page
* News Page
* Donation Dashboard
* Admin Dashboard

## Authors

* Fahzren
* Krismon
* Dina
* Lewis
* Leuser
* Dek Nong

## Purpose

This project was developed as an educational and management platform to support orangutan conservation awareness and simplify sanctuary data management.

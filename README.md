# Citizen Complaints and Engagement System (CCES)

A comprehensive backend system for managing citizen complaints and engagement, built with NestJS and MongoDB.

## Overview

The Citizen Complaints and Engagement System (CCES) is a robust platform designed to facilitate efficient communication between citizens and government institutions. It provides a structured way to submit, track, and manage complaints while ensuring transparency and accountability.

## Plan
https://hyper-impulse-d65.notion.site/Citizen-Complaints-and-Engagement-System-383a63ae4f4f4afc9cebb51868e95381

## Features

- **User Management**
  - User registration and authentication
  - Role-based access control (Admin, User)
  - Password reset functionality
  - User profile management

- **Institution Management**
  - Create and manage institutions
  - Assign administrators to institutions
  - Track institution performance

- **Complaint Management**
  - Submit and track complaints
  - Categorize complaints
  - Status updates and notifications
  - File attachments support

- **AI Integration**
  - Gemini AI integration for intelligent responses
  - Automated complaint categorization
  - Smart routing of complaints

## Tech Stack

- **Backend Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **AI Integration**: Google Gemini AI
- **Email Service**: Nodemailer
- **Validation**: Class Validator
- **Environment Variables**: ConfigModule

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Gemini API Key



## Installation

1. Clone the repository:
```bash
git clone [git@github.com:Reconfort/CCES-Backend.git]
cd CCES-Backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=4444
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run start:dev
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:4444/api/v1/docs
```

## Project Structure

```
src/
├── common/                 # Common utilities and decorators
├── modules/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── institution/       # Institution management
│   ├── tickets/          # Complaint management
│   ├── category/         # Complaint categories
│   └── gemini/           # AI integration
├── main.ts               # Application entry point
└── app.module.ts         # Root module
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/verify-code` - Verify reset code
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id/status` - Update user status
- `PATCH /api/v1/users/:id/permissions` - Update user permissions

### Institutions
- `POST /api/v1/institutions` - Create institution
- `GET /api/v1/institutions` - Get all institutions
- `GET /api/v1/institutions/:id` - Get institution by ID
- `PATCH /api/v1/institutions/:id` - Update institution
- `DELETE /api/v1/institutions/:id` - Delete institution

### Tickets (Complaints)
- `POST /api/v1/tickets` - Create complaint
- `GET /api/v1/tickets` - Get all complaints
- `GET /api/v1/tickets/:id` - Get complaint by ID
- `PATCH /api/v1/tickets/:id` - Update complaint status
- `DELETE /api/v1/tickets/:id` - Delete complaint

### Categories
- `POST /api/v1/category` - Create category
- `GET /api/v1/category` - Get all categories
- `GET /api/v1/category/:id` - Get category by ID
- `PUT /api/v1/category/:id` - Update category
- `DELETE /api/v1/category/:id` - Delete category

### AI Integration
- `POST /api/v1/gemini` - Chat with Gemini AI

## Security Features

- JWT-based authentication
- Role-based access control
- Password encryption
- Request validation
- CORS enabled
- Helmet security headers

## Error Handling

The system implements comprehensive error handling with:
- HTTP status codes
- Detailed error messages
- Validation errors
- Custom exception filters

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [support email/contact information]

## Acknowledgments

- NestJS team for the amazing framework
- Google for the Gemini AI API
- MongoDB team for the database
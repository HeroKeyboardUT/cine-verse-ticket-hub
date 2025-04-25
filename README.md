# Setup
## Install dependencies
### Root
```
npm i
```
### Backend
```
cd backend
npm i
```
### Frontend
```
cd frontend
npm i
```
## Setup database
1. Copy the content in `cinema.sql` and run in your MySQL instance
2. Create a file name `.env` in folder backend with the following contents
```env
# Main env
PORT = 5000

# Database configuration
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD= your-mysql-instance-password
DB_NAME="cinemasystem"
DB_PORT=3306

# JWT authentication
JWT_SECRET="1234"
```
# Run
npm start


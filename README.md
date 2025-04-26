# Setup
## Install dependencies
### Root
```sh
npm i
```
### Backend
```sh
cd backend
npm i
```
### Frontend
```sh
cd frontend
npm i
```
## Setup database
1. Copy the content in `cinema.sql` and run it in your MySQL instance
2. Create a file name `.env` in folder backend with the following contents
```env
# Main env
PORT = 5000

# Database configuration
DB_HOST="localhost"
DB_USER="sManager"
DB_PASSWORD="123456"
DB_NAME="cinemasystem"
DB_PORT=3306

# JWT authentication
JWT_SECRET="1234"
```
# Run
```sh
npm start
```

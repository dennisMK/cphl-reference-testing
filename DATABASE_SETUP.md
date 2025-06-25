# Database Setup Guide - ✅ COMPLETED

## ✅ Authentication System Status: WORKING

The database and authentication system are now fully functional!

### 1. Install MySQL (if not already installed)

#### Option A: Using Homebrew (macOS)
```bash
brew install mysql
brew services start mysql
```

#### Option B: Using MySQL Official Installer
Download from: https://dev.mysql.com/downloads/mysql/

### 2. Start MySQL Service
```bash
# macOS with Homebrew
brew services start mysql

# Or start manually
mysql.server start
```

### 3. Create Required Databases
```bash
# Connect to MySQL as root
mysql -u root -p

# Create the three required databases
CREATE DATABASE etest_users;
CREATE DATABASE etest_eid;
CREATE DATABASE etest_vl_lims;

# Exit MySQL
EXIT;
```

### 4. Create Test User (via API)
Once MySQL is running, create a test user by making a POST request to:
```
POST http://localhost:3000/api/auth/create-test-user
```

Or using curl:
```bash
curl -X POST http://localhost:3000/api/auth/create-test-user
```

This will create a test user with:
- **Username:** `testuser`
- **Password:** `password123`

### 5. Alternative: Quick Database Setup Script
Run this in your terminal after MySQL is installed and running:

```bash
mysql -u root -e "
CREATE DATABASE IF NOT EXISTS etest_users;
CREATE DATABASE IF NOT EXISTS etest_eid;  
CREATE DATABASE IF NOT EXISTS etest_vl_lims;
"
```

### 6. ✅ Ready to Use - Login Credentials
The system is now ready! You can login with:

**Test User:**
- Username: `testuser`
- Password: `password123`

**Or create a new account using the signup form.**

### Common Issues:

1. **MySQL not running**: Start MySQL service
2. **Access denied**: Make sure the MySQL root user has no password, or update the DATABASE_URL in `.env`
3. **Database doesn't exist**: Create the databases as shown above
4. **Port 3306 in use**: Check if another MySQL instance is running

### Environment Variables
Your `.env` file should have:
```
DATABASE_URL="mysql://root@localhost:3306/etest_users"
DATABASE_URL_EID="mysql://root@localhost:3306/etest_eid"  
DATABASE_URL_VL_LIMS="mysql://root@localhost:3306/etest_vl_lims"
``` 
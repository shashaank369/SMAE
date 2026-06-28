# SMAE Database Setup Guide

## Overview
This setup creates a MongoDB database to store contact form submissions from your website. The backend runs on Node.js/Express.

## Prerequisites
You'll need to install:
1. **Node.js** - Download from https://nodejs.org/
2. **MongoDB** - Download from https://www.mongodb.com/try/download/community

## Setup Instructions

### Step 1: Install MongoDB Locally
1. Download and install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically, or go to Services and start "MongoDB"
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Verify MongoDB is running:
   ```bash
   mongosh
   ```
   If you see a `>` prompt, MongoDB is running. Type `exit` to quit.

### Step 2: Install Node Dependencies
In the project directory (`c:\Users\avsss\Desktop\smae`), run:

```bash
npm install
```

This will install all required packages from `package.json`:
- Express (web framework)
- Mongoose (MongoDB connection)
- CORS (cross-origin requests)
- Body-Parser (form data handling)

### Step 3: Start the Backend Server
Run the server:

```bash
npm start
```

You should see:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

### Step 4: Test the API
Open your browser and go to:
- `http://localhost:5000` - Should show: `{"message":"SMAE Database API running"}`

### Step 5: Use the Contact Form
1. Open your website
2. Scroll to the "Get In Touch" section
3. Fill out the contact form
4. Click "Send Message"
5. If successful, you'll see a confirmation message

## Database Structure

The contact form stores:
- **Name** - Full name
- **Email** - Email address
- **Phone** - Contact number
- **Subject** - Message subject
- **Message** - Full message text
- **CreatedAt** - Timestamp (automatic)

## API Endpoints

### POST `/api/contact`
Submit a new contact form

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "subject": "Event Inquiry",
  "message": "I'm interested in attending..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us!",
  "data": { ...form data with ID and timestamp }
}
```

### GET `/api/contacts`
Retrieve all contact submissions

```bash
curl http://localhost:5000/api/contacts
```

### GET `/api/contacts/:id`
Get a specific contact by ID

```bash
curl http://localhost:5000/api/contacts/650a1b2c3d4e5f6g7h8i9j0k
```

### DELETE `/api/contacts/:id`
Delete a contact submission

```bash
curl -X DELETE http://localhost:5000/api/contacts/650a1b2c3d4e5f6g7h8i9j0k
```

## MongoDB GUI Tools (Optional)

To view data visually:

1. **MongoDB Compass** (Recommended)
   - Download: https://www.mongodb.com/products/compass
   - Connect to: `mongodb://localhost:27017`
   - Database: `smae-contact`
   - Collection: `contacts`

2. **VS Code Extension**
   - Install "MongoDB for VS Code"
   - Connect to: `mongodb://localhost:27017`

## Troubleshooting

### "MongoDB connection error"
- Check if MongoDB service is running
- Windows: `net start MongoDB`
- Verify on port 27017: `netstat -an | findstr :27017`

### "Cannot find module 'express'"
- Run: `npm install`

### "Port 5000 already in use"
- Change PORT in `.env` file
- Or stop the process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

### Form not submitting
- Check browser console (F12) for errors
- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled (it is in this setup)

## Development Tips

- Use `npm run dev` instead of `npm start` for automatic restart on code changes
- Requires: `npm install --save-dev nodemon`
- Data persists in MongoDB even if you restart the server
- To clear all contacts: use MongoDB Compass and delete the collection

## Next Steps

After testing locally:
1. Deploy MongoDB to cloud (MongoDB Atlas, AWS, etc.)
2. Deploy backend to Heroku, Render, or your own server
3. Update `.env` with production MongoDB URI
4. Update `apiUrl` in `script.js` with production backend URL

## Files Created

- `server.js` - Express backend server
- `package.json` - Node dependencies
- `.env` - Environment configuration
- Contact form in `index.html`
- Form styles in `styles.css`
- Form handler in `script.js`

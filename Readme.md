# Outfit Generator

## Project Overview

The **Outfit Generator** is an AI-powered fashion stylist that allows users to upload an outfit image and receive personalized style recommendations for different occasions such as Office, Party, and Vacation. The AI analyzes the outfit, suggests relevant styling for each occasion, and generates Pinterest-style fashion images.

## Tech Stack

- **Frontend**: React with Vite
  - Fast and modern frontend setup using Vite, providing a quick and smooth development experience for the user interface.
  
- **Backend**: Node.js with Express
  - The backend handles image file uploads and communicates with the Gemini AI API for generating style recommendations and images.
  
- **File Handling**: Multer (for handling file uploads)
  - Multer middleware is used to handle image file uploads efficiently on the backend.
  
- **AI**: Gemini AI API (for generating image descriptions and creating fashion images)
  - The Gemini AI API is used to convert an uploaded outfit image into text descriptions and then generate new images based on those descriptions.

---

## Features

1. **Image Upload**:
   - Users can upload an outfit photo using the frontend interface.
   
2. **AI-Powered Styling**:
   - The AI suggests styling ideas for three occasions: Office, Party, and Vacation.
   
3. **Image Generation**:
   - The AI generates Pinterest-style editorial fashion images based on the outfit description for each occasion.

4. **Downloadable Images**:
   - Users can download the generated fashion images for each occasion.

5. **Interactive UI**:
   - A loading animation with percentage indication is shown while the AI processes the outfit and generates recommendations.

---

## Workflow and Implementation

### 1. **Frontend (React + Vite)**

- **File Upload**: 
  The frontend is built using **React** and **Vite** for fast development and an interactive UI. The user can select an image of their outfit, and it is shown as a preview.
  
- **Uploading to Backend**:
  When the user clicks "Generate Style," the frontend sends the image file to the backend using **Axios** and **FormData** for file handling.

- **Displaying Results**:
  After the backend processes the image and returns the AI-generated results (style recommendations and generated images), the frontend displays the results, allowing the user to download the images.

### 2. **Backend (Node.js + Express)**

- **File Handling (Multer)**:
  The backend uses **Express** and **Multer** to handle the image file upload. Multer saves the uploaded image to a temporary directory before further processing.
  
- **AI Integration (Gemini API)**:
  - The backend communicates with the **Gemini AI API** to generate a description of the uploaded outfit, then uses that description to generate images for three occasions (Office, Party, and Vacation).
  
  - A custom prompt is sent to the Gemini API to retain the outfit in all three versions while ensuring the styling is realistic and fashion-forward.
  
- **Image Generation**:
  - The AI generates a description based on the uploaded image, which is then passed to a second call to Gemini to generate the corresponding fashion image.
  
  - These images are saved to a local directory and their URLs are returned to the frontend for display and download.

### 3. **Image Download Feature**

- After the images are generated, the frontend provides a **Download** button for each generated style (Office, Party, Vacation), allowing the user to save the images locally.

---

## How to Run the Project Locally

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/outfit-generator.git
cd outfit-generator
```
### 2. **Install Dependencies**

Frontend (React with Vite):

```bash
cd client
npm install
npm run dev
```
Backend (Node.js with Express):
```bash
cd server
npm install
npm run dev
```

### 3. **Set Environment Variables**

In the server directory, create a .env file and add the following environment variables:

```bash
GEMINI_API_KEY=your-gemini-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```
### 4. **Folder Structure**

```bash
outfit-generator/
├── client/              # Frontend code (React + Vite)
├── server/              # Backend code (Node.js + Express)
│   ├── public/          # Folder to store generated images
│   ├── routes/          # Express route handlers
│   ├── controllers/     # Backend logic for handling image generation
│   └── .env             # Environment variables (GEMINI_API_KEY)
└── README.md
```
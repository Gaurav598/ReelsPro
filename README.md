# ReelsPro 🎥

![ReelsPro Framework](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![ImageKit](https://img.shields.io/badge/ImageKit-000000?style=for-the-badge)

ReelsPro is a modern, full-stack video-sharing platform built exclusively for short-form video content (Reels/Shorts). It features a sleek glassmorphic UI, smooth transitions, and seamless authentication allowing users to upload, watch, and interact with video content safely and fast.

## 🚀 Key Features

- **Modern Authentication**: Secure login utilizing NextAuth.js with Credentials, **Google**, and **GitHub** OAuth providers.
- **Glassmorphic UI**: Beautiful, vibrant dynamic gradient backgrounds with light/dark theme toggling, powered by DaisyUI and Tailwind CSS V4.
- **Video Storage & Streaming**: Video uploading, background processing, and accelerated CDN delivery powered by **ImageKit**.
- **Owner-Exclusive Deletion Rules**: Videos can be safely permanently deleted straight from the app logic, simultaneously purging the video metadata in MongoDB and the video itself off ImageKit.
- **Form Interactivity**: Optional thumbnails & descriptions alongside smooth, drag-and-drop ImageKit upload capabilities.
- **Responsive HTML5 Native Player**: Built-in video controls with playback speed adjustment, muting, and full-screen modes.

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS v4, DaisyUI, Lucide React
- **Backend / API**: Next.js API Routes (Serverless)
- **Database**: MongoDB & Mongoose
- **Authentication**: NextAuth.js (JWT Strategy)
- **File Storage**: ImageKit SDK `@imagekit/next`

## ⚙️ Environment Variables

To run this project locally or deploy it to Vercel/Render, create a `.env` file in the root directory and add the following keys:

```env
# MongoDB Database (Must point to the 'Imagekit' database explicitly)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster/Imagekit

# NextAuth Settings
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000 # Update this for production

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ImageKit Configuration
NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

## 💻 Running the App Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gaurav598/ReelsPro.git
   cd ReelsPro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ☁️ Deployment Requirements

- Set up all environment variables securely inside your hosting provider settings (e.g. Vercel Environment Variables section).
- Ensure your MongoDB Atlas Network Access is set to `Allow Access From Anywhere (0.0.0.0/0)` or correctly whitelist Vercel Network IPs, otherwise DNS errors (`ENOTFOUND`) will block backend communication.
- Make sure `NEXTAUTH_URL` matches your new domain.

## 📝 License

This project was built for educational and demonstration purposes. Feel free to use and expand on the principles taught within!

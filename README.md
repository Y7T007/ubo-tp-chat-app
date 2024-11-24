# 🚀 UBO Chat App

Welcome to the UBO Chat App! This project is a fun and interactive chat application built with a sprinkle of humor and a dash of creativity. Let's dive into the steps we took to bring this masterpiece to life!

## 📚 Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Real-time Notifications](#real-time-notifications)
4. [Image Uploads](#image-uploads)
5. [Database Integration](#database-integration)
6. [Frontend Magic](#frontend-magic)
7. [Conclusion](#conclusion)

## 🏁 Getting Started

First things first, let's get you up and running with the UBO Chat App. Follow these steps to set up your environment:

1. Clone the repository:
    ```bash
    git clone https://github.com/Y7T007/ubo-chat-app.git
    cd ubo-chat-app
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

And voilà! You're ready to start chatting away.

## 🔐 Authentication

To keep things secure, we implemented a robust authentication system. Here's how we did it:

1. **Login and Registration**: We created beautiful login and registration forms using MUI Joy. Because who said security can't be stylish?
2. **Session Management**: We used JWT tokens to manage user sessions. Remember, "With great power comes great responsibility."

## 📢 Real-time Notifications

Notifications are the lifeblood of any chat app. Here's our journey to get them working:

### The Official Way
Initially, we tried to use the official way to implement notifications using Pusher. But as the saying goes, "If at first you don’t succeed, find a tunnel and skip the official way."

### The Tunnel Solution
We discovered a feature named "tunnels" in Pusher. This allowed us to create a tunnel using the external ID, so each tunnel is associated with a user and all their connected devices. When we want to push a notification, we simply push it to this tunnel instead of doing all the complicated stuff.

## 📸 Image Uploads

What's a chat app without the ability to share images? Here's how we made it happen:

1. **Formidable**: We used the formidable library to handle file uploads. Because handling files should be formidable, not impossible.
2. **Vercel Blob**: We stored the images using Vercel Blob. "Store it like it's hot."

## 🗄️ Database Integration

Our chat app wouldn't be complete without a solid database. Here's how we integrated it:

1. **PostgreSQL**: We used PostgreSQL for our database needs. Because when it comes to databases, "Go big or go home."
2. **Vercel Postgres**: We connected to our database using Vercel Postgres. "Connecting the dots, one query at a time."

## 🎨 Frontend Magic

The frontend is where the magic happens. Here's how we made it sparkle:

1. **React and TypeScript**: We built our frontend using React and TypeScript. Because "Type safety is the best safety."
2. **MUI Joy**: We styled our components using MUI Joy. "Joyful components for a joyful app."

## 🎉 Conclusion

And there you have it! The UBO Chat App is now ready for you to use and enjoy. Remember, "The journey of a thousand miles begins with a single step. Or in our case, a single npm install."

Happy chatting! 🚀
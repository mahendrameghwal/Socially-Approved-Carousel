# Video Carousel Application

A high-performance monorepo application featuring a custom horizontal video carousel feed with viewport-based autoplay, hover-based controls, direct liking, and full-screen video transitions.

## Project Structure

This project is organized as a monorepo:

- backend: Express API built with TypeScript for seeding and serving video data, tracking likes, shares, and views.
- frontend: React application built with Vite and TailwindCSS for the responsive visual layout and custom carousel.

## Core Features

- Viewport Autoplay: Videos mount and play automatically when they scroll into the viewport, and unmount when out of view to save DOM memory.
- Hover Playback Control: Playback automatically pauses when hovering over a video card, and resumes when the mouse leaves.
- Direct Likes on Feed: Users can click the heart icon directly on the home feed cards to toggle likes with optimistic UI updates and backend synchronization.
- Smooth Carousel Navigation: Left and Right navigation buttons scroll the horizontal feed with snap-proximity alignments, resolving browser scroll snapping stutters.
- Premium Brand Header: Center-aligned custom DripTrip brand logo header replacing default text navigation.
- Slide Transition Animations: Direction-based slide-left and slide-right animations trigger when navigating between videos inside the modal player.
- Dynamic Credit Footer: Minimalist footer aligned to the bottom of the viewport showing design attributions.

## Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

## Setup and Installation

Follow these instructions to run the application locally:

### 1. Backend Setup

Navigate to the backend directory, install dependencies, and run the development server:

```bash
cd backend
npm install
npm run dev
```

The server will start on port 5000 and seed 49 unique, high-quality public sample videos automatically.

### 2. Frontend Setup

Navigate to the frontend directory, install dependencies, and run the development server:

```bash
cd ../frontend
npm install
npm run dev
```

The application will run on port 5174 or 5173. Open the link in your browser to view the application.

## Production Build

To compile both services for production:

- Backend compilation:
  ```bash
  cd backend
  npm run build
  ```
  This outputs compiled JavaScript to the backend/dist directory.

- Frontend compilation:
  ```bash
  cd frontend
  npm run build
  ```
  This outputs optimized static assets to the frontend/dist directory.

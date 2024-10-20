
---

## **Frontend (`EchoEnclave-client`) `README.md`**

```markdown
# EchoEnclave Client

This is the frontend application for EchoEnclave, a music exploration platform where users can discover genres, explore artists, and chat with an AI assistant about their favorite artists.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Dockerization](#dockerization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- React application with functional components and hooks.
- Responsive design using Tailwind CSS.
- Genre and artist exploration using the Spotify API.
- Chat interface with AI assistant powered by the Google Gemini API.
- Persistent chat history per user and artist.
- Local caching of genres and artists for improved performance.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)
- Backend server running at `http://localhost:5000`
- [Docker](https://www.docker.com/) (optional, for containerization)

## Installation

### Clone the Repository

```bash
git clone https://github.com/tahazalzali/EchoEnclave-client.git
cd EchoEnclave-client
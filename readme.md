# VidStream Frontend

This repository contains the **frontend code** for **VidStream**, a modern video streaming platform. It is designed to provide users with a seamless and engaging video browsing and streaming experience, powered by a robust JavaScript-based backend.

## Features

- **Dynamic Video Display**: Fetch and display video content from the backend API.
- **Responsive Design**: Optimized for all devices, including desktops, tablets, and mobile phones.
- **Interactive Components**: Includes features like search, filters, and a video player for easy navigation.
- **User Profiles**: Supports user authentication, profile management, and channel browsing.
- **Real-Time API Integration**: Communicates with the backend for real-time updates and interactions.

## Technologies Used

### Frontend Stack:

- **HTML5**: For structuring the content.
- **CSS3**: For styling and layout.
- **JavaScript**: For dynamic interactions and API integration.
- **TailwindCSS**: For modern, responsive UI design.

### Backend:

The backend is built with **Node.js**, **Express**, and **MongoDB**. For more details, visit the [VidStream Backend Repository](https://github.com/rajLaha/VidStream-Backend-Project).

## Project Structure

```
project-folder/
|-- index.html          # Main entry point for the application
|-- assets/             # Folder for static assets (images, styles, etc.)
|-- css/                # Contains CSS files (includes Tailwind setup)
|-- js/                 # JavaScript files for API handling and interactions
|-- config.js           # Contains API base URL and configuration
|-- README.md           # Project documentation
```

## Prerequisites

- Ensure the **VidStream Backend** is set up and running. For setup instructions, refer to the backend repository.
- Update the API base URL in `config.js` to match your backend's URL.

## Getting Started

### Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/rajLaha/VidStream-Frontend
```

### Navigate to the Project Directory

```bash
cd vidstream-frontend
```

### Open in Browser

Open the `index.html` file in your preferred browser, or serve the application using a local development server such as **Live Server** or **http-server**:

```bash
npx http-server
```

### API Configuration

Ensure the API base URL in `config.js` points to the correct backend endpoint:

```javascript
const API_BASE_URL =
  'https://f6bc56bd-fded-47ac-a3b5-bad6eac9c752.e1-eu-north-azure.choreoapps.dev';
```

## Deployment

To deploy the frontend, host the files on a static server or any hosting platform (e.g., Netlify, Vercel, or GitHub Pages). Ensure the backend API is accessible from the deployed URL.

## Usage Instructions

1. **Home Page**:

   - Displays a list of videos fetched from the API.
   - Users can search User Profile based on their Name.

2. **Profile Page**:

   - Displays user information and their subscribed channels.
   - Display user's uploaded Video's, Playlist's and Post's.
   - Allows users to browse and manage their content.

3. **Video Player**:
   - Plays selected videos with an intuitive interface.

## Contributing

Contributions are welcome! If you'd like to contribute, follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Acknowledgments

- **TailwindCSS** for providing a powerful styling framework.
- **Node.js** and **Express** for powering the backend.
- **MongoDB** for a flexible and scalable database solution.

---

For any issues or feature requests, feel free to open an issue in this repository.

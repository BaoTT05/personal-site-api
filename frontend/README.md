# Frontend - Personal Website

React frontend for the personal website with visitor counter.

## Architecture

- **React 19** + **Vite** for fast development and build
- **Modern CSS** with gradients and responsive design
- **Visitor Counter** component that calls AWS Lambda API
- **Environment-based configuration** for API endpoints

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The visitor counter component calls your backend API:
- **Development**: `http://localhost:8080/visit` (update in `.env.development`)
- **Production**: Your API Gateway URL (update in `.env.production`)

## Deployment

1. Update `.env.production` with your actual API Gateway URL
2. Update `deploy.sh` with your S3 bucket name and CloudFront distribution ID
3. Run the deployment script:

```bash
./deploy.sh
```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   └── VisitorCounter.jsx
│   ├── App.jsx      # Main app component
│   ├── App.css      # Global styles
│   └── main.jsx     # Entry point
├── .env.development  # Dev environment variables
├── .env.production   # Prod environment variables
└── deploy.sh         # AWS deployment script
```

## Features

- ✅ Modern, responsive design
- ✅ Real-time visitor counter
- ✅ Error handling for API calls
- ✅ Loading states
- ✅ Environment-based configuration
- ✅ AWS deployment ready
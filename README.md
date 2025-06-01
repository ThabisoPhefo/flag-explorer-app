# Flag Explorer App

A full-stack web application for exploring countries and their flags. Built with Next.js frontend and FastAPI backend.

A full-stack web application that allows users to explore countries and their flags from around the world. The application features a modern, responsive interface with detailed country information and beautiful flag displays.

## 🌟 Features

### Frontend (Next.js + TailwindCSS)
- **Home Screen**: Grid layout displaying all country flags with search functionality
- **Detail Screen**: Comprehensive country information (name, capital, population, area, region)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean interface with smooth animations and transitions
- **Real-time Search**: Filter countries instantly as you type

### Backend (Python + FastAPI)
- **REST API**: Clean, documented API endpoints
- **Country Data**: Integration with RestCountries API
- **Modern Architecture**: Built following Clean Architecture principles
- **Comprehensive Testing**: Unit and integration tests
- **API Documentation**: Automatic OpenAPI/Swagger documentation

### CI/CD Pipeline ⚡
- **Automated Testing**: Both frontend and backend tests run on every push/PR
- **Build Verification**: Ensures application builds successfully
- **Deployment Packaging**: Automatic creation of deployment packages
- **Integration Tests**: End-to-end testing of frontend and backend integration
- **Coverage Reports**: Code coverage tracking for both components

## 🏗️ Architecture

```
FlagExplorerApp/
├── backend/          # Python FastAPI backend
│   ├── app/
│   │   ├── main.py   # FastAPI application
│   │   ├── models.py # Pydantic models
│   │   └── routes.py # API routes
│   ├── tests/        # Backend tests
│   └── README.md     # Backend documentation
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/      # Next.js app router
│   │   ├── lib/      # Utilities and API calls
│   │   └── types/    # TypeScript definitions
│   ├── __tests__/    # Frontend tests
│   └── README.md     # Frontend documentation
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 18.0+, npm
- **Docker**: Optional for containerized setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd flag-explorer-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend (choose one):
python start_server.py                                    # Option 1 (recommended)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001  # Option 2
```

The backend API will be available at:
- **API Base**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/health

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Docker Setup (Alternative)
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop all services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate  # Activate virtual environment

# Option 1: Using test runner script (with HTML coverage report)
python run_tests.py

# Option 2: Direct pytest command
pytest                    # Run all tests
pytest --cov=app tests/   # Run with coverage
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch        # Run in watch mode
npm test -- --ci --coverage --watchAll=false  # CI mode with coverage
```

## 📚 API Documentation

### Backend Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /countries` - Get all countries
- `GET /countries/{name}` - Get specific country details

### Example API Response

```json
{
  "countries": [
    {
      "name": "United States",
      "capital": "Washington, D.C.",
      "population": 331900000,
      "flag": "https://flagcdn.com/w320/us.png",
      "code": "US",
      "region": "Americas",
      "area": 9372610
    }
  ],
  "total": 250
}
```

## 🛠️ Development

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Frontend Development

```bash
cd frontend
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
ENVIRONMENT=development
API_HOST=127.0.0.1
API_PORT=8001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 🏭 Production Deployment

### Backend Production

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Frontend Production

```bash
cd frontend
npm run build
npm start
```

## 🧰 Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation and settings management
- **HTTPX**: Async HTTP client
- **Uvicorn**: ASGI server
- **Pytest**: Testing framework

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **React 19**: Latest React features
- **Jest**: Testing framework

## 🌐 External APIs

- **RestCountries API**: https://restcountries.com/v3.1/
  - Used for country information and flag images

## 📱 Features Showcase

### Home Screen
- Responsive grid layout of country flags
- Real-time search functionality
- Smooth hover animations
- Loading states and error handling

### Country Detail Screen
- Large flag display
- Comprehensive country information
- Responsive design
- Navigation controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure responsive design works across devices
- Test both backend and frontend thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting**: Ensure Python virtual environment is activated and dependencies are installed
2. **Frontend not connecting to backend**: Check that backend is running on port 8001 and CORS is configured
3. **API calls failing**: Verify internet connection for external API calls to RestCountries
4. **Tests failing**: Ensure all dependencies are installed and environment is properly set up

### Getting Help

- Check the individual README files in `backend/` and `frontend/` directories
- Review the API documentation at http://localhost:8001/docs
- Ensure all prerequisites are installed and up to date 
# Country API Backend

A FastAPI-based REST API for exploring country information using data from the [REST Countries API](https://restcountries.com/). This backend implements Clean Architecture patterns and provides comprehensive testing.

## Features

- **Modern Architecture**: Built with FastAPI using Clean Architecture principles
- **Two Main Endpoints**: List all countries and get detailed country information
- **External API Integration**: Fetches real-time data from REST Countries API
- **Comprehensive Testing**: Unit and integration tests with coverage reporting
- **Error Handling**: Robust error handling with proper HTTP status codes
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation

## API Endpoints

### 1. Get All Countries
- **Endpoint**: `GET /countries`
- **Description**: Retrieve a list of all countries with basic information
- **Response**: Array of countries with `name` and `flag` properties
- **Example**:
  ```json
  [
    {
      "name": "France",
      "flag": "https://flagcdn.com/w320/fr.png"
    },
    {
      "name": "Germany", 
      "flag": "https://flagcdn.com/w320/de.png"
    }
  ]
  ```

### 2. Get Country Details
- **Endpoint**: `GET /countries/{name}`
- **Description**: Retrieve detailed information about a specific country
- **Parameters**: 
  - `name` (path): Country name (case-insensitive)
- **Response**: Detailed country information
- **Example**:
  ```json
  {
    "name": "France",
    "population": 67391582,
    "capital": "Paris",
    "flag": "https://flagcdn.com/w320/fr.png",
    "region": "Europe",
    "area": 551695.0,
    "code": "FR"
  }
  ```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application setup
│   ├── models.py        # Pydantic models
│   ├── routes.py        # API endpoints
│   └── services.py      # Business logic layer
├── tests/
│   ├── __init__.py
│   ├── test_main.py     # Integration tests
│   └── test_services.py # Unit tests
├── requirements.txt     # Python dependencies
├── run_tests.py        # Test runner script
└── README.md           # This file
```

## Setup and Installation

### Prerequisites
- Python 3.8+
- pip

### Installation Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Spec**: http://localhost:8000/openapi.json

## Testing

### Run All Tests
```bash
python run_tests.py
```

### Manual Test Commands
```bash
# Run tests with verbose output
pytest tests/ -v

# Run tests with coverage
pytest tests/ --cov=app --cov-report=term-missing

# Run specific test file
pytest tests/test_services.py -v
```

### Test Coverage
The test suite includes:
- **Unit Tests**: Testing individual service methods
- **Integration Tests**: Testing API endpoints
- **Error Handling Tests**: Testing various error scenarios
- **Edge Case Tests**: Testing boundary conditions

## Architecture

### Clean Architecture Implementation

1. **Models** (`models.py`): Data models using Pydantic for validation
2. **Services** (`services.py`): Business logic and external API integration
3. **Routes** (`routes.py`): FastAPI endpoints and request/response handling
4. **Main** (`main.py`): Application configuration and setup

### Error Handling

The API implements comprehensive error handling:
- **404**: Country not found
- **502**: External service errors
- **504**: Service timeouts
- **500**: Internal server errors

## API Documentation

### Swagger/OpenAPI
Visit `/docs` when the server is running to access the interactive API documentation.

### Sample Requests

**Get all countries:**
```bash
curl http://localhost:8000/countries
```

**Get specific country:**
```bash
curl http://localhost:8000/countries/france
```

**Test API health:**
```bash
curl http://localhost:8000/health
```

## Development

### Code Quality
- Follow PEP 8 style guidelines
- Use type hints
- Write comprehensive tests
- Document functions and classes

### Adding New Features
1. Create models in `models.py`
2. Implement business logic in `services.py`
3. Add endpoints in `routes.py`
4. Write tests for all new functionality

## Dependencies

- **FastAPI**: Modern web framework for APIs
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation and settings management
- **HTTPX**: Async HTTP client for external API calls
- **pytest**: Testing framework
- **pytest-asyncio**: Async test support
- **pytest-cov**: Coverage reporting

## External API

This backend integrates with [REST Countries API](https://restcountries.com/):
- **Base URL**: https://restcountries.com/v3.1
- **All Countries**: `/all`
- **Country by Name**: `/name/{name}?fullText=true`

## Environment Variables

Create a `.env` file for configuration:
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO

# External API
COUNTRIES_API_TIMEOUT=30
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is part of the Flag Explorer application. 
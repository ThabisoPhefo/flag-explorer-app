# Flag Explorer Backend

A FastAPI-based REST API that provides country information and flag data by integrating with the RestCountries API.

## Features

- **Country List Endpoint**: Get all countries with basic information
- **Country Details Endpoint**: Get detailed information about a specific country
- **Modern Architecture**: Built with FastAPI following Clean Architecture principles
- **CORS Support**: Configured for frontend integration
- **Comprehensive Testing**: Unit and integration tests included
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation and settings management
- **HTTPX**: Async HTTP client for external API calls
- **Uvicorn**: ASGI server implementation
- **Pytest**: Testing framework

## Setup and Installation

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # On macOS/Linux
   source venv/bin/activate
   
   # On Windows
   venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Running the Application

### Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API Base URL: http://localhost:8000
- Interactive API Documentation: http://localhost:8000/docs
- Alternative API Documentation: http://localhost:8000/redoc

## API Endpoints

### Base Routes

- `GET /` - Welcome message
- `GET /health` - Health check

### Country Routes

- `GET /api/countries` - Get all countries
- `GET /api/countries/{country_name}` - Get specific country details

### Example Responses

#### Get All Countries
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

#### Get Country Details
```json
{
  "name": "United States",
  "capital": "Washington, D.C.",
  "population": 331900000,
  "flag": "https://flagcdn.com/w320/us.png",
  "code": "US",
  "region": "Americas",
  "area": 9372610
}
```

## Testing

Run all tests:
```bash
pytest
```

Run tests with coverage:
```bash
pytest --cov=app tests/
```

Run specific test file:
```bash
pytest tests/test_main.py
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application setup
│   ├── models.py        # Pydantic models
│   └── routes.py        # API routes
├── tests/
│   ├── __init__.py
│   └── test_main.py     # Unit tests
├── .env                 # Environment variables
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Environment Variables

- `ENVIRONMENT`: Application environment (development/production)
- `API_HOST`: Host to bind the server to
- `API_PORT`: Port to bind the server to

## External APIs

This application integrates with:
- **RestCountries API**: https://restcountries.com/v3.1/
  - Used to fetch country information and flag URLs

## Contributing

1. Follow PEP 8 style guidelines
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting 
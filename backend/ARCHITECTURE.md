# Country API Architecture - MVC Pattern

## Overview
This Country API follows the **MVC (Model-View-Controller)** architectural pattern, specifically adapted for a REST API where the "View" is represented by JSON responses.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Requests                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   ROUTES LAYER                             │
│                    (routes.py)                             │
│  • HTTP endpoint definitions                               │
│  • Request/Response mapping                                │
│  • OpenAPI documentation                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                 CONTROLLER LAYER                           │
│                 (controllers.py)                           │
│  • Business logic coordination                             │
│  • Input validation & normalization                       │
│  • Error handling & HTTP status codes                     │
│  • Service orchestration                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  SERVICE LAYER                             │
│                  (services.py)                             │
│  • External API integration                                │
│  • Data processing & transformation                       │
│  • Core business rules                                     │
│  • Error handling for external dependencies               │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   MODEL LAYER                              │
│                   (models.py)                              │
│  • Data structure definitions                              │
│  • Input/Output schemas                                    │
│  • Data validation rules                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                 EXTERNAL API                               │
│              (REST Countries API)                          │
└─────────────────────────────────────────────────────────────┘
```

## MVC Components Explained

### 1. **Model** (`models.py`)
- **Purpose**: Defines data structures and validation
- **Responsibilities**:
  - Data schema definitions using Pydantic
  - Input/output validation
  - Type safety and serialization
- **Examples**: `Country`, `CountryDetails`

### 2. **View** (JSON Responses)
- **Purpose**: Data presentation layer
- **Responsibilities**:
  - JSON serialization
  - HTTP response formatting
  - API documentation via OpenAPI
- **Location**: Handled automatically by FastAPI

### 3. **Controller** (`controllers.py`)
- **Purpose**: Business logic coordination
- **Responsibilities**:
  - Input validation and normalization
  - Orchestrating service calls
  - Error handling and HTTP status mapping
  - Business rule enforcement
- **Examples**: `CountryController`

## Additional Layers

### **Routes** (`routes.py`)
- **Purpose**: HTTP endpoint definitions
- **Responsibilities**:
  - URL routing
  - HTTP method mapping
  - Request/response documentation
  - Thin layer that delegates to controllers

### **Services** (`services.py`)
- **Purpose**: External integration and core business logic
- **Responsibilities**:
  - External API calls (REST Countries)
  - Data transformation
  - Error handling for external dependencies
  - Business logic implementation

## Request Flow

```
1. HTTP Request  →  2. Routes  →  3. Controller  →  4. Service  →  5. External API
                                     ↓
6. HTTP Response  ←  5. Routes  ←  4. Controller  ←  3. Service  ←  2. Data Processing
```

### Detailed Flow:

1. **HTTP Request** arrives at FastAPI
2. **Routes** (`routes.py`) maps URL to controller method
3. **Controller** (`controllers.py`) validates input and calls service
4. **Service** (`services.py`) makes external API call and processes data
5. **Models** (`models.py`) validate and structure the response data
6. **Response** is serialized to JSON and returned

## Benefits of This Architecture

### ✅ **Separation of Concerns**
- Each layer has a specific responsibility
- Easy to modify one layer without affecting others

### ✅ **Testability**
- Each layer can be unit tested independently
- Controllers can be tested with mocked services
- Services can be tested with mocked external APIs

### ✅ **Maintainability**
- Clear structure makes codebase easy to navigate
- New developers can quickly understand the flow
- Business logic is centralized in controllers

### ✅ **Scalability**
- Easy to add new endpoints by creating new controllers
- Service layer can be extended for new external APIs
- Models can be versioned for API evolution

## File Structure

```
backend/app/
├── main.py           # Application setup & configuration
├── routes.py         # HTTP routes (thin routing layer)
├── controllers.py    # Controllers (business logic coordination)
├── services.py       # Services (external integration & core logic)
├── models.py         # Models (data structures & validation)
└── __init__.py
```

## Example Usage

### Adding a New Endpoint

1. **Define Model** in `models.py`:
   ```python
   class CountryStatistics(BaseModel):
       total_countries: int
       total_population: int
   ```

2. **Add Service Method** in `services.py`:
   ```python
   async def get_country_statistics(self) -> CountryStatistics:
       # External API logic here
   ```

3. **Create Controller Method** in `controllers.py`:
   ```python
   async def get_statistics(self) -> CountryStatistics:
       # Validation and coordination logic
       return await self.country_service.get_country_statistics()
   ```

4. **Add Route** in `routes.py`:
   ```python
   @router.get("/countries/statistics")
   async def get_country_statistics():
       return await country_controller.get_statistics()
   ```

This architecture ensures clean separation of concerns while maintaining the MVC pattern adapted for REST APIs. 
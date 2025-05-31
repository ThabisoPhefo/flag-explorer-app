import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the API calls
jest.mock('@/lib/api', () => ({
  checkApiHealth: jest.fn(() => Promise.resolve({ status: 'healthy', service: 'Country API' })),
  getAllCountries: jest.fn(() => Promise.resolve([
    { 
      name: 'United States', 
      flag: 'https://example.com/us.png', 
      population: 331000000,
      region: 'Americas'
    },
    { 
      name: 'Canada', 
      flag: 'https://example.com/ca.png', 
      population: 38000000,
      region: 'Americas'
    }
  ]))
}))

describe('Home Page', () => {
  it('renders the main heading', async () => {
    render(<Home />)
    
    // Wait for the component to load and render the main content
    const heading = await screen.findByRole('heading', { name: /flag explorer/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the search input', async () => {
    render(<Home />)
    
    // Wait for the component to load and render the search input
    const searchInput = await screen.findByPlaceholderText(/search countries/i)
    expect(searchInput).toBeInTheDocument()
  })
}) 
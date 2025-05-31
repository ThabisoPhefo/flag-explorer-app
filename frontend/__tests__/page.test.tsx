import { render, screen, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock the API calls
jest.mock('@/lib/api', () => ({
  getAllCountries: jest.fn(() => Promise.resolve([
    { name: 'United States', flag: 'https://example.com/us.png' },
    { name: 'Canada', flag: 'https://example.com/ca.png' }
  ])),
  checkApiHealth: jest.fn(() => Promise.resolve({ status: 'healthy', service: 'Country API' }))
}))

describe('Home Page', () => {
  it('renders the main heading', async () => {
    render(<Home />)
    
    // Wait for the component to finish loading
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /flag explorer/i })
      expect(heading).toBeInTheDocument()
    })
  })

  it('renders the search input', async () => {
    render(<Home />)
    
    // Wait for the component to finish loading
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search countries/i)
      expect(searchInput).toBeInTheDocument()
    })
  })
}) 
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the API call
jest.mock('@/lib/api', () => ({
  getAllFlags: jest.fn(() => Promise.resolve([
    { name: 'United States', flag: 'https://example.com/us.png', code: 'US' },
    { name: 'Canada', flag: 'https://example.com/ca.png', code: 'CA' }
  ]))
}))

describe('Home Page', () => {
  it('renders the main heading', async () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { name: /flag explorer/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the search input', async () => {
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText(/search countries/i)
    expect(searchInput).toBeInTheDocument()
  })
}) 
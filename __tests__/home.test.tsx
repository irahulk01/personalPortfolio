import { render, screen } from '@testing-library/react'
import Home from '../src/views/Home/Home'

// Mocking useVisitCount hook
jest.mock('../src/hooks/useVisitCount', () => ({
  __esModule: true,
  default: () => 42,
}))

describe('Home', () => {
  it('renders visit count correctly', () => {
    render(<Home />)
    const countElement = screen.getByText('42')
    expect(countElement).toBeInTheDocument()
  })
})

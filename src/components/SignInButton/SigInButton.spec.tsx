import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { SignInButton } from '.'
import { useSession } from 'next-auth/client'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
  it('should Renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('should Renders correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValue([
      {
        user: {
          name: 'Jhon Doe',
          email: 'teste@teste.com',
        },
        expires: 'fake-expires',
      },
      false,
    ])

    render(<SignInButton />)

    expect(screen.getByText('Jhon Doe')).toBeInTheDocument()
  })
})

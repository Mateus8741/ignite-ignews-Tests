import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

jest.mock('next-auth/client')

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        push: jest.fn(),
      }
    },
  }
})

describe('SubscribeButton component', () => {
  it('should Renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('should redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const button = screen.getByText('Subscribe now')

    fireEvent.click(button)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('should redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'teste@teste.com',
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
      false,
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<SubscribeButton />)

    const button = screen.getByText('Subscribe now')

    fireEvent.click(button)

    expect(pushMock).toHaveBeenCalled()
  })
})

import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { BrowseMentorsPage } from '@/pages/BrowseMentorsPage';
import { MentorProfilePage } from '@/pages/MentorProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { MenteeConnectionsPage } from '@/pages/MenteeConnectionsPage';
import { MentorConnectionsPage } from '@/pages/MentorConnectionsPage';
import { ChatPage } from '@/pages/ChatPage'; // Import ChatPage
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/browse",
    element: <BrowseMentorsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/mentor/:mentorId",
    element: <MentorProfilePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: <UserProfilePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/my-connections",
    element: <MenteeConnectionsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/mentor-dashboard",
    element: <MentorConnectionsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/chat/:chatId", // New chat route
    element: <ChatPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
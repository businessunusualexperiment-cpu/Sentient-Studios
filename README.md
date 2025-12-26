# Sentient Studios
An interactive and visually stunning mentorship platform connecting professionals for growth and guidance.
[cloudflarebutton]
## Table of Contents
- [About](#about)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
- [Deployment](#deployment)
  - [Cloudflare Workers](#cloudflare-workers)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
## About
Sentient Studios is a visually stunning, modern mentorship platform designed to foster meaningful connections between aspiring professionals and experienced industry leaders. The application features a highly polished and interactive user interface, prioritizing an engaging and intuitive user experience. The core of the platform is a mentor discovery engine, allowing users to browse, filter, and view detailed profiles of mentors. The design incorporates a sophisticated dark and light theme, beautiful typography using the 'Inter' font, and smooth, delightful animations powered by Framer Motion. The user interface is built upon a card-based system for easy browsing, with a clean, spacious layout that emphasizes clarity and visual appeal. The hero section of the landing page features a captivating background image with a gradient overlay, creating a professional and inspiring first impression.
## Key Features
- **Visually Stunning UI:** Modern, clean, and professional design with a focus on user delight.
- **Interactive Experience:** Smooth animations, micro-interactions, and responsive design across all devices.
- **Mentor Discovery:** Browse, search, and filter mentors based on industry, expertise, and more.
- **Detailed Mentor Profiles:** Comprehensive view of mentor experience, skills, and biography.
- **Dark & Light Themes:** Customizable interface to suit user preferences.
- **Framer Motion Animations:** Engaging animations for a fluid user experience.
- **'Inter' Font:** Optimized for readability and a clean aesthetic.
- **Card-Based Design:** Intuitive and visually appealing presentation of mentor information.
- **Cloudflare Powered:** Built on Cloudflare Workers and Durable Objects for scalable backend infrastructure.
## Technology Stack
- **Frontend:** React, React Router DOM, Vite, Tailwind CSS, Framer Motion, Shadcn UI, Zod, React Hook Form, Lucide React, Zustand
- **Backend:** Hono, Cloudflare Workers, Cloudflare Durable Objects
- **Language:** TypeScript
## Getting Started
### Prerequisites
- **Bun:** Ensure you have Bun installed. You can install it from [bun.sh](https://bun.sh/).
- **Cloudflare Account:** Required for deployment.
- **Wrangler CLI:** Install the Cloudflare Wrangler CLI:
  ```bash
  bun install -g wrangler
  ```
### Installation
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd catalyst-connect
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
### Development
1.  **Start the development server:**
    ```bash
    bun run dev
    ```
    This will start the Vite development server, typically on `http://localhost:3000`. The application will be accessible at this address.
2.  **Access the application:** Open your browser and navigate to `http://localhost:3000`.
## Deployment
### Cloudflare Workers
This application is designed to be deployed on Cloudflare Workers.
1.  **Configure Wrangler:**
    Ensure your `wrangler.toml` (or `wrangler.jsonc`) is correctly configured for your Cloudflare account. You might need to set your `account_id`.
2.  **Deploy:**
    Use the Wrangler CLI to deploy your application:
    ```bash
    bun run deploy
    ```
    This command builds the application and deploys it to Cloudflare.
[cloudflarebutton]
## Project Structure
```
.
├── public/                  # Static assets
├── shared/                  # Shared types and mock data between frontend and worker
│   ├── mock-data.ts
│   └── types.ts
├── src/                     # Frontend application code
│   ├── components/          # Reusable UI components (Shadcn UI, custom)
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Shadcn UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and API client
│   ├── pages/               # Application pages
│   ├── App.css              # Global styles
│   ├── index.css            # Tailwind CSS base styles
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite environment types
├── worker/                  # Cloudflare Worker backend code
│   ├── core-utils.ts        # Core utilities and Durable Object implementation
│   ├── entities.ts          # Data entity definitions
│   ├── index.ts             # Worker entrypoint
│   └── user-routes.ts       # API route definitions
├── .gitignore
├── components.json          # Shadcn UI configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── wrangler.jsonc           # Wrangler configuration for Cloudflare deployment
```
## Contributing
We welcome contributions to Sentient Studios! Please follow these guidelines:
1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes** and ensure they follow the project's coding standards.
4.  **Add tests** for your changes.
5.  **Commit your changes** with clear and concise messages.
6.  **Push to the branch** and open a Pull Request.
Please refer to the `CONTRIBUTING.md` file (if available) for more detailed guidelines.
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# Process Monitor

A clean, professional enterprise dashboard for monitoring UiPath Orchestrator process executions in real-time. Built with React, TypeScript, and the official UiPath SDK.

[cloudflarebutton]

## Overview

Process Monitor provides a streamlined interface for tracking UiPath process instances with live status updates and execution details. The application features a minimal, table-based layout optimized for information density and quick scanning - delivering functional business data presentation without decorative elements.

## Key Features

- **Real-time Process Monitoring** - Live updates via polling (5s interval) with flicker-free UI
- **Advanced Filtering** - Filter by folder and process status (Running, Completed, Faulted, etc.)
- **Comprehensive Instance Details** - View process variables, execution history, and BPMN diagrams
- **Status Tracking** - Visual status badges with semantic colors for quick identification
- **Enterprise-Ready UI** - Professional aesthetic matching enterprise SaaS admin tools
- **Responsive Design** - Optimized for desktop and tablet viewing

## Technology Stack

### Core Framework
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### UI Components
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### UiPath Integration
- **@uipath/uipath-typescript** - Official UiPath SDK
- OAuth 2.0 authentication
- Process Instances API
- Maestro Processes API

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Utilities
- **date-fns** - Date formatting and manipulation
- **clsx** / **tailwind-merge** - Conditional styling
- **immer** - Immutable state updates

## Prerequisites

- **Bun** - JavaScript runtime and package manager ([Install Bun](https://bun.sh))
- **UiPath Cloud Account** - With Orchestrator access
- **OAuth Client** - Registered in UiPath Cloud Platform

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd process-monitor
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root (or update the existing one):

```env
VITE_UIPATH_BASE_URL=https://api.uipath.com
VITE_UIPATH_ORG_NAME=your-org-name
VITE_UIPATH_TENANT_NAME=your-tenant-name
VITE_UIPATH_CLIENT_ID=your-client-id
VITE_UIPATH_REDIRECT_URI=http://localhost:3000
VITE_UIPATH_SCOPE=PIMS OR.Execution OR.Execution.Read
```

**Required OAuth Scopes:**
- `PIMS` - Maestro process instance management
- `OR.Execution` or `OR.Execution.Read` - Process execution data

### 4. Start Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## Usage

### First-Time Login

1. Navigate to the application URL
2. Click the login button to authenticate with UiPath Cloud
3. Grant the requested OAuth permissions
4. You'll be redirected back to the dashboard

### Monitoring Process Instances

1. **View All Instances** - The main dashboard displays all process instances sorted by start time
2. **Filter by Folder** - Use the folder dropdown to scope instances to a specific folder
3. **Filter by Status** - Click status filter chips to show only Running, Completed, Faulted, etc.
4. **Live Updates** - The "Live" indicator shows real-time polling is active
5. **View Details** - Click on an instance row to view detailed information (future phase)

### Understanding Status Badges

- **Green** - Running or Completed
- **Yellow** - Pending
- **Red** - Faulted
- **Gray** - Cancelled

## Development

### Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
│   ├── useAuth.tsx  # Authentication hook
│   └── usePolling.ts # Real-time polling hook
├── pages/           # Page components
│   └── HomePage.tsx # Main dashboard
├── lib/             # Utility functions
└── main.tsx         # Application entry point
```

### Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run linter
bun run lint
```

### Adding New Features

1. **Create Components** - Add new components in `src/components/`
2. **Use SDK Services** - Import from `@uipath/uipath-typescript/maestro-processes`
3. **Follow Patterns** - Reference `prompts/sdk-reference/patterns.md` for best practices
4. **Type Safety** - Always import and use TypeScript types from the SDK

### SDK Usage Example

```typescript
import { useMemo, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProcessInstances } from '@uipath/uipath-typescript/maestro-processes';
import type { ProcessInstanceGetResponse } from '@uipath/uipath-typescript/maestro-processes';

function MyComponent() {
  const { sdk } = useAuth();
  const processInstances = useMemo(() => new ProcessInstances(sdk), [sdk]);
  const [instances, setInstances] = useState<ProcessInstanceGetResponse[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await processInstances.getAll({ pageSize: 50 });
      setInstances(result.items);
    };
    load();
  }, [processInstances]);

  return <div>{/* Render instances */}</div>;
}
```

## Deployment

### Deploy to Cloudflare Pages

[cloudflarebutton]

#### Manual Deployment

1. **Build the Application**

```bash
bun run build
```

2. **Deploy to Cloudflare Pages**

```bash
npx wrangler pages deploy dist
```

3. **Configure Environment Variables**

In the Cloudflare Pages dashboard, add the following environment variables:

- `VITE_UIPATH_BASE_URL`
- `VITE_UIPATH_ORG_NAME`
- `VITE_UIPATH_TENANT_NAME`
- `VITE_UIPATH_CLIENT_ID`
- `VITE_UIPATH_REDIRECT_URI` (set to your production URL)
- `VITE_UIPATH_SCOPE`

4. **Update OAuth Redirect URI**

In your UiPath OAuth client configuration, add your Cloudflare Pages URL as an allowed redirect URI.

#### Automatic Deployment

Connect your repository to Cloudflare Pages for automatic deployments on every push:

1. Go to Cloudflare Pages dashboard
2. Click "Create a project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
5. Add environment variables
6. Deploy

## Architecture

### Data Flow

1. **Authentication** - OAuth flow via `useAuth` hook provides SDK instance
2. **Service Instantiation** - Create service instances with `useMemo` for stability
3. **Data Fetching** - Use `usePolling` hook for real-time updates (5s interval)
4. **Client-Side Filtering** - Filter instances by folder and status in the browser
5. **Flicker-Free Updates** - Accumulate instances in Map to prevent row flicker

### Key Design Decisions

- **Polling over WebSockets** - Simpler implementation, works across all network configurations
- **Client-Side Filtering** - Reduces API calls, faster user experience
- **Folder-First Loading** - Fetch all folders on mount, then scope by selection
- **Compact Information Density** - Table-based layout for maximum data visibility
- **Neutral Color Palette** - Professional gray scale with semantic status colors

## Troubleshooting

### Authentication Issues

**Problem:** Redirect loop after login  
**Solution:** Ensure `VITE_UIPATH_REDIRECT_URI` matches your OAuth client configuration exactly

**Problem:** "Invalid scope" error  
**Solution:** Verify your OAuth client has the required scopes enabled

### Data Loading Issues

**Problem:** No instances displayed  
**Solution:** Check that your UiPath account has access to process instances in the selected folder

**Problem:** Instances flicker during polling  
**Solution:** Ensure you're using the `usePolling` hook with proper accumulation pattern (see `patterns.md`)

### Build Issues

**Problem:** TypeScript errors during build  
**Solution:** Run `bun install` to ensure all dependencies are installed correctly

## Contributing

This project follows the UiPath SDK best practices and patterns. When contributing:

1. Follow the existing code structure and naming conventions
2. Use TypeScript types from the SDK (never `any`)
3. Reference `prompts/sdk-reference/` for SDK usage patterns
4. Test authentication flow and data fetching thoroughly
5. Ensure UI remains flicker-free during polling updates

## License

This project is provided as-is for demonstration and development purposes.

## Support

For UiPath SDK issues, refer to:
- [UiPath SDK Documentation](https://docs.uipath.com)
- SDK reference files in `prompts/sdk-reference/`

For application-specific issues, please open an issue in the repository.
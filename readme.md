
# React magic router  <img src="https://i.pinimg.com/564x/42/ca/c8/42cac8d68009c8d2fcc54366a9eea97a.jpg" width="30" alt="Nest Logo" />

<p align="center">
  <a href="https://www.npmjs.com/package/react-magic-router" target="blank">
  <img src="https://i.pinimg.com/564x/42/ca/c8/42cac8d68009c8d2fcc54366a9eea97a.jpg" width="120" alt="React Magic Router Logo" />
  </a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/react-magic-router" target="_blank"><img src="https://img.shields.io/npm/v/react-magic-router.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/react-magic-router" target="_blank"><img src="https://img.shields.io/npm/dm/react-magic-router.svg" alt="NPM Downloads" /></a>
</p>


`react-magic-router` is a library designed to simplify and enhance the use of `react-router-dom` v6. It offers an easy setup process, type safety, and auto-completion for your routes, making your routing configuration clear and maintainable.


### Features
- Type Safety: Ensures that your route paths and parameters are type-checked.
- Auto-complete: Provides auto-completion for your route paths.
- Easy Integration: Integrate with your existing routing setup without breaking your code.
- Supports react-router-dom v6: Currently supports react-router-dom v6 with plans to support v5 and v4 very soon

### Installation

```sh
npm install react-magic-router
```

### Set up

Add type and declare global type

```ts
import type { MappedGlobalRouter, RouteObjectMagic } from 'react-magic-router';

const PUBLIC_ROUTES = [
  {
    path: 'forgot-password',
    element: <ForgotPasswordPage />,
    query: 'email'
  },
  {
    path: 'verify-otp',
    element: <VerifyOtpPage />,
    query: 'email&type' // <-- your query 'email,type'
  },
  {
    path: ':id/profile', // <-- your param ':id'
    element: <ProfilePage />,
  }
  // ... other routes
] as const satisfies RouteObjectMagic[]; // <-- Add this

export const routes = [
  {
    path: '/',
    children: [
      {
        path: '/auth',
        element: <PublicLayout />,
        children: PUBLIC_ROUTES,
      },
      // ...other routes
    ],
  },
] as const satisfies RouteObjectMagic[]; // <-- Add this

// This declaration type is required
declare module 'react-magic-router' { 
  type GlobalMagicRouter = MappedGlobalRouter<typeof routes>;
}

-------------- root app ----------------
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {routes} from './your-path'

const router = createBrowserRouter(routes); // the same way with you setup react router v6

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
```

### Usage

To navigate
```tsx
import { useMagicRouter } from './path-to-your-hook';

function MyComponent() {
  const { navigate } = useMagicRouter();
 
  const handleNavigationToVerifyOtp = () => {
    navigate({
      path: '/auth/verify-otp', // <-- this will show autocomplete path for you choose
      query: { email: '..@gmail.com',type:"..." } // <-- this type will take when you define query of path '/auth/verify-otp' is 'email&type' parse to { email: string , type: string } type
    });
  };

  const handleNavigationToProfile =(id:string)=>{
    navigate({
      path: '/auth/:id/profile',
      param: {
        id
      } // <--- this param will extract form '/auth/:id/profile' parse to { id: string } type
    });
  }

  return (
    <div>
        ...
    </div>
  );
}
```

To get param
```tsx
import { useMagicRouter } from './path-to-your-hook';

function MyComponent() {
  const { query } = useMagicRouter('/auth/verify-otp');
  // query will have { email: string , type: string } type

  const { params } = useMagicRouter('/auth/:id/profile');
  // params will have { id: string } type

  return (
    <div>
        ...
    </div>
  );
}
```

### API

```ts
import type { RouteObject } from "react-router-dom";

// RouteObjectMagic is extra type of RouteObject
type RouteObjectMagic = {
  children?: RouteObjectMagic[];
  query?: string;
} & DeepReadonly<Omit<RouteObject, "children">>;

// query will is string but this require format 
// query = 'email' -> { email: string}
// query = 'email&otp' -> { email: string , otp: string}
// query = 'email&otp&...' -> { email: string, otp: string, ...}
```


## Limitations

- **No JSX Support for Nested Routes**: Currently does not support nested routes configured with JSX.
- **react-router-dom v5 and v4**: Support for these versions is coming soon.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/cin12211/react-magic-router).


## License

This project is licensed under the MIT License.
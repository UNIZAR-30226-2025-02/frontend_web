# Frontend Web – Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📁 Project Structure

The source code is organized based on recommended Next.js practices, with a focus on separation of concerns:

src/
├── app/                         # Main entry and routing structure (App Router)
│   ├── auth/                    # Authentication flow: login, register, reset password, forgot password
│   ├── components/              # Reusable UI components (menu, header, footer, etc.)
│   ├── comun/                  
│   │   ├── game/                # game page
│   │   └── withMenu/            # Pages that include the left-side menu
│   ├── hooks/                   # Custom React hooks (e.g., socket connection)
│   ├── utils/                   # General utilities and helpers (sockets.js)
│   ├── layout.js                # Global layout definition
│   └── page.js                  # Landing page
public/                          # Static public assets (e.g., images, favicon)
.github/workflows/               # CI/CD configuration

## 🧾 Naming and Style Conventions

- **English** is used as the standard language across all files, and directory names.
- Naming conventions follow best practices for React and Next.js development.
- Consistent naming is maintained across events, state variables, and functions.
- The withMenu folder contains all pages that display the left-side navigation menu.

## 📦 Dependencies

Project dependencies are defined in the package.json file. To install them, run:

```bash
npm install
```

## ▶️ Running the App Locally

To start the development server:

```bash
npm run dev
```

Then open your browser at: http://localhost:3000

## 🚀 Deployment on Vercel

This project is automatically deployed using Vercel, which provides zero-configuration deployment for Next.js apps.
🔗 Live App: https://frontendweb-danielsalas-projects.vercel.app/

## 🌐 Environment Configuration

To run the app, environment-specific variables must be provided in a .env.local file.

Create the file by copying the example:

```bash
cp .env.example .env.local
```

Edit .env.local and replace placeholder values with your actual configuration. Example:

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-real-backend-url.com/
```

> ⚠️ The actual backend URL is not included in this repository for security reasons. Please contact the project maintainer to obtain the correct value.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

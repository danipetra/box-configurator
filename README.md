# Box Configurator – Technical Exercise

This project is a small box configurator prototype built with **Next.js, React Three Fiber and Three.js**.

The goal is to demonstrate a **template-driven approach** to map a flat dieline graphic onto a 3D box preview.

---

## Features

- 2D dieline preview
- 3D box preview with applied textures
- Image and PDF upload support
- Template-driven face mapping
- Responsive 2D overlay system

---

## Preview

### 2D preview (default dieline)

![2D default preview](docs/template.png)

### 2D preview with uploaded graphic

![2D graphic preview](docs/2d.png)

### 3D box preview

![3D preview](docs/3d.png)

---

## Architecture Overview

The application is structured around a **template-driven mapping system**.

1. The **dieline image** represents the flat layout of the box.
2. Each **box face** is mapped to a normalized rectangular region of the dieline.
3. Those regions are **cropped into textures using Canvas**.
4. The resulting textures are applied to a **Three.js box geometry**.

Flow:
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

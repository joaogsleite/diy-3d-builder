# DIY 3D Builder

Interactive 3D prototype for planning a custom wooden bed build.

The app renders a complete bed assembly in 3D, including parts, joints, and an auto-generated purchase list based on cut lengths and joinery.

## What This Project Does

- Renders a 3D bed assembly using React Three Fiber.
- Lets you orbit, zoom, and click parts to inspect details.
- Models different part types (rails, slats, boards, legs, reference mattress).
- Visualizes glued and screwed joints.
- Generates a "parts to buy" list from the modeled cuts.
- Links each purchasable item to a relevant Leroy Merlin search.

## Tech Stack

- React 19
- Vite 7
- Three.js
- @react-three/fiber
- @react-three/drei
- Tailwind CSS (via @tailwindcss/vite)

## Project Structure

- `src/App.jsx`: main scene, UI panels, selection logic, purchase list generation.
- `src/model/bedModel.js`: parametric model generator (`buildBedAssembly`) with parts and joints.
- `src/components/products/`: 3D product meshes and product-specific rendering helpers.
- `src/components/joints/`: glued and screwed joint visual components.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Build

```bash
pnpm build
pnpm preview
```

## Deploy (GitHub Pages)

This repository is configured to deploy automatically with GitHub Actions on every push to `main`.

- Workflow file: `.github/workflows/deploy.yml`
- Production base path: `/diy-3d-builder/` (configured in `vite.config.js`)
- Expected site URL: `https://joaogsleite.github.io/diy-3d-builder/`

## Notes

- Dimensions and labels in the model are currently tailored for this specific bed/carpentry use case.
- Product names and links are practical references, not an official bill of materials.

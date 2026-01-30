# Plan: Implement GitHub Actions CI Pipeline

Configure automated CI with GitHub Actions to validate builds, type safety, and tests on every push and pull request, ensuring code quality for this React Router 7 airline booking application.

## Steps

1. Create `.github/workflows/ci.yml` workflow file with Node.js 20 setup, dependency caching, and checkout steps
2. Add type checking job using `npm run typecheck` to validate TypeScript types
3. Add testing job using `npm test` to run Jest unit tests
4. Add test coverage job using `npm run test:coverage` to ensure code quality
5. Add build job using `npm run build` to ensure production builds succeed
6. Configure workflow triggers for pushes to main/dev branches and all pull requests
7. (Optional) Add linting job after configuring ESLint

## Further Considerations

1. **Testing infrastructure**: ✅ **COMPLETED** - Jest configured with 29 unit tests for checkout component (97.14% coverage)
2. **Linting**: No ESLint configured. Add ESLint + TypeScript ESLint rules now or later? Recommendation: Add later to keep initial CI simple
3. **Docker builds**: Build and push Docker images in CI workflow? Could automate container deployments to AWS ECS/Cloud Run
4. **Coverage reporting**: Consider uploading coverage reports to Codecov or similar service
5. **Matrix testing**: Test against multiple Node.js versions (18, 20, 22)?

## Project Context

### Tech Stack
- **Framework**: React Router 7 (with SSR)
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.2
- **Node.js**: Version 20 (required)
- **Styling**: TailwindCSS 4.1.13
- **Testing**: Jest 30.2.0 + React Testing Library 16.3.2

### Available npm Scripts
- `build`: react-router build
- `dev`: react-router dev
- `start`: react-router-serve ./build/server/index.js
- `typecheck`: react-router typegen && tsc
- `test`: jest
- `test:watch`: jest --watch
- `test:coverage`: jest --coverage

### Current Status
- ✅ Build script available
- ✅ Type checking script available
- ✅ Test script available (29 tests, 97.14% coverage on checkout)
- ❌ No lint script
- ❌ No existing CI/CD configuration

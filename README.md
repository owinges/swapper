# Swapper

Swapper is a user interface built with React that connects to Uniswap.

It currently provides full functionality for swapping ETH/WETH for any of the listed tokens to choose from.

You can view the deployed app at: https://swapper-rho.vercel.app/

## Current features

- Swap ETH/WETH for one of 32 available tokens on Ethereum mainnet.

## Upcoming features

- Swap ETH/WETH for DAI on Goerli, Kovan, Rinkeby or Ropsten testnets.
- Estimated gas price calculation.
- Swap tokens for ETH/WETH.
- Swap tokens for tokens.
- Select other currencies for price reference.
- Add tokens that aren't listed in the dropdown.
- WalletConnect integration.

## Prerequisites

This app uses `pnpm` for package management (hence the `pnpm-lock.yaml`). If you don't already have `pnpm` installed, you can install it by running `npm i -g pnpm`. Newer versions of node come with `pnpm` installed by default.

If you don't want to use `pnpm`, you can simply use `npm` or `yarn` instead, though that would be somewhat slower.

## Getting started

- Create a `.env` file and add an `ALCHEMY_KEY` containing your Alchemy API key.
- Run `pnpm i`.
- Run `pnpm start`.

## Available Scripts

Aside from the usual Create React App scripts, this app also includes:

### `pnpm lint`

This runs eslint on all ts/tsx files and attempts to fix any issues it finds.

### `pnpm format`

This runs the formatter (prettier) on all ts/tsx files.\

Below is the remaining Create React App boilerplate:

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `pnpm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Development

## Getting started
1. Clone this repo. Then in the project root directory, do the following:
2. Run `npm install`.
4. Edit electron-builder.yml to fill in productName, appId, copyright, and publisherName.
5. Set up code signing. Follow the instructions in https://www.electron.build/code-signing to set up code signing certificates for your platform. Also see my articles: 
   1. Windows: https://dev.to/awohletz/how-i-code-signed-an-electron-app-on-windows-30k5 
   2. Mac: https://dev.to/awohletz/how-i-sign-and-notarize-my-electron-app-on-macos-59bb
5. Edit package.json to fill in your project details. Set the `repository` property to a Github repo where you will publish releases. When you run `npm run dist`, the app will be packaged and published to the Github repo.
   1. Create a Github repo for your app releases. See https://www.electron.build/configuration/publish#githuboptions
   2. Create an access token for your Github repo. See https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
6. Create a `.env` file that looks like this:
```
DATABASE_URL=file:./app.db
# If you are signing and notarizing the app on Mac
APPLE_ID=your apple id
APPLE_ID_PASSWORD=your apple password
APPLE_TEAM_ID=your apple team ID
# If you want to publish releases to Github
GITHUB_TOKEN=your github access token
# If you want to code sign on Windows
CSC_LINK=yourWindowsCodeSigningCert.pfx
CSC_KEY_PASSWORD=your password for the Windows code signing cert
```
5. Now you can run `npm start` to start in dev mode and check out the example app. If you want to test building and publishing a release, see the below sections.


## Folder stucture

```
    ├── README.md
    ├── prisma
    │   ├── seed
    │   │   ├── data # seeding data json/csv
    │   │   │    └── tagihan.csv
    │   │   └── seed.ts 
    │   └── test
    │       └── test.ts # testing query database
    └── src
        ├── client
        │   ├── assets # static assets
        │   │   └── cars-road-near-city.jpg
        │   ├── components
        │   │   ├── Routes.tsx # add new route hear
        │   │   ├── Grid.tsx # single component
        │   │   ├── Home / # component have index.tsx, capitalized
        │   │   │   ├── Home.tsx
        │   │   │   └── index.tsx # will import Home.tsx
        │   │   └── landing/ # not a component, used for grouping
        │   │       ├── Banner.tsx # single component
        │   │       └── ContactUs/ # a component, same as Animate
        │   ├── context # store context
        │   ├── data # ideally use for placeholder while API not ready (or not)
        │   ├── hooks # stroing hooks
        │   ├── lib # helper functions
        │   └── pages # pages component
        └── server
            ├── router.ts # group of trpc routes
            └── collections
                └── customer
                    ├── customerRouter.ts # child trpc route
                    └── customerService.ts # bussiness logic

```

## Naming Conventions
  - **Extensions**: Use `.tsx` extension for React components. 
  - **Filename**: Use PascalCase for filenames. E.g., `ReservationCard.tsx`.
  - **Reference Naming**: Use PascalCase for React components and camelCase for their instances. 
    ```tsx
    // bad
    import reservationCard from './ReservationCard';

    // good
    import ReservationCard from './ReservationCard';

    // bad
    const ReservationItem = <ReservationCard />;

    // good
    const reservationItem = <ReservationCard />;
    ```

  - **Component Naming**: Use the filename as the component name. For example, `ReservationCard.tsx` should have a reference name of `ReservationCard`. However, for root components of a directory, use `index.tsx` as the filename and use the directory name as the component name:

    ```tsx
    // bad
    import Footer from './Footer/Footer';

    // bad
    import Footer from './Footer/index';

    // good
    import Footer from './Footer';
    ```

  - **Higher-order Component Naming**: Use a composite of the higher-order component’s name and the passed-in component’s name as the `displayName` on the generated component. For example, the higher-order component `withFoo()`, when passed a component `Bar` should produce a component with a `displayName` of `withFoo(Bar)`.

    > Why? A component’s `displayName` may be used by developer tools or in error messages, and having a value that clearly expresses this relationship helps people understand what is happening.

    ```tsx
    // bad
    export default function withFoo(WrappedComponent) {
      return function WithFoo(props) {
        return <WrappedComponent {...props} foo />;
      }
    }

    // good
    export default function withFoo(WrappedComponent) {
      function WithFoo(props) {
        return <WrappedComponent {...props} foo />;
      }

      const wrappedComponentName = WrappedComponent.displayName
        || WrappedComponent.name
        || 'Component';

      WithFoo.displayName = `withFoo(${wrappedComponentName})`;
      return WithFoo;
    }
    ```


## Scripts
### `npm run build` 
Builds the project code and places it in `dist`. There are two steps to building: 
  1. Use Vite to transpile the frontend TypeScript code in `src/client` and move it to `dist`. 
  2. Generate the Prisma client in `src/generated`
  2. Use the TypeScript compiler (`tsc`) to 1. check types in `src/client` (Vite does not check types) and 2. build the backend TypeScript code in `src/server` and place the output in `dist/server`.
  3. Run copy-files.js -- Copy the generated Prisma client from `src/generated` to `dist/generated`
  4. Run install-engines-on-mac.js -- Make sure that node_modules/@prisma/engines has both darwin and darwin-arm64 binaries. These will get packed into the app if you run `npm run pack`.

### `npm start` 
Build and start the app without packaging.

### `npm run pack`
Build, pack, sign, and notarize the app for the current platform. The packed app will be output to `packed` directory. This is a fast way to test packing, signing, and notarizing. It does not publish the app to Github.

Once packed, you can test the outputted app in the `packed` directory. E.g. on Mac M1, open `packed/mac-arm64` in Finder and double-click on ElectronPrismaTrpcExample to run the app.

### `npm run dist`
Build, pack, sign, and notarize the app for production. The only difference between `npm run dist` and `npm run publish` is that `npm run dist` does not publish the app to Github.

### `npm run publish`
Build, pack, sign, notarize, and publish the app. Run this to publish a release to Github. The app will be published to the Github repo specified in `package.json`.


## tRPC usage
The tRPC integration allows Renderer to communicate to Main and get responses back. From tRPC's perspective, the Renderer is a client and the Main process is a server. It does not know that it is communicating over IPC.

In `src/client/renderer.ts` I've provided a custom `fetch` implementation to tRPC client to send the requests over IPC. 

In `src/server/main.ts`, `ipcMain` listens for those IPC requests and fowards them to the tRPC server. To enable this, I built a `ipcRequestHandler` function, which is a customized version of [tRPC's fetchRequestHandler](https://trpc.io/docs/v10/fetch). Instead of sending fetch API Request and Response objects, which cannot be serialized over IPC, it sends plain JSON objects and converts them to Response objects in the Renderer code.

## Prisma usage
electron-prisma-trpc-example uses Prisma to manage the SQLite database. To enable this, I had to leave the Prisma binaries out of app.asar. They do not work when packed inside app.asar. To leave them out, I specified them as excluded files in electron-builder.yml and as extraResources. Then I pass the query engine and migration engine paths from extraResources into the Prisma client constructor and the Prisma migrate command.  

To create a universal build on Mac M1 and Mac Intel, the build and install scripts pack both sets of Prisma binaries. 

## Signing, notarizing, and publishing
The `electron-builder.yml` file has configuration to sign and notarize the app for Mac, Windows, and Linux. You'll have to customize this file to enter your own publisher and app info.

See https://github.com/awohletz/electron-prisma-trpc-example-releases for an example repo that holds the releases for this app. I publish releases to that repo using the `npm run publish` script.

Here are the steps to publish a release on Windows and Mac:
1. Make sure you've set up code signing and have the appropriate env vars in `.env`, as mentioned above in Getting Started. 
2. On your Windows computer, run `npm run publish`
2. On your Mac computer, run `npm run publish`

These commands will build for their respective platforms and upload the release files to your Github repo.

## Debugging
The key parts of the Prisma integration:
- The Prisma binaries/libraries do not work if packed inside of app.asar. Thus they have to be outside of the asar in extraResources. `npm run pack` should move them to ElectronPrismaTrpcExample/Contents/Resources/node_modules/@prisma/engines.
- The Prisma client has to be configured to look for the query engine at that extraResources location (ElectronPrismaTrpcExample/Contents/Resources/node_modules/@prisma/engines). This is done either by [environment variable](https://www.prisma.io/docs/concepts/components/prisma-engines#using-custom-engine-libraries-or-binaries) or by [passing in the path with an internal config prop on the Prisma client constructor](https://github.com/prisma/prisma/discussions/5200#discussioncomment-295575). electron-prisma-trpc-example uses both of these techniques: Env var for the Prisma migrate command (which runs in a separate process) and engine prop for the Prisma client used to do queries in the app. 

If you encounter a problem with Prisma related to it not finding the binaries, you can debug where it locates the binaries like so on a Mac:
1. Open a terminal
2. Run `export DEBUG=prisma*` (see [docs](https://www.prisma.io/docs/concepts/components/prisma-client/debugging#setting-the-debug-environment-variable))
3. `cd` to the directory where the app package is. E.g. your Applications directory.
4. Run the app directly inside the .app package by entering on your terminal: `./ElectronPrismaTrpcExample.app/Contents/MacOS/ElectronPrismaTrpcExample`
5. Now you should see a bunch of debug output written to your terminal as the app starts. Prisma will show where it is searching for the binaries. 


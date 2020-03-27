# Node Typescript Boilerplate

## Development

### Start Project

1. `yarn`
2. `yarn start:db`
3. `yarn start`
4. Check `localhost:8080/api/v1`

### Logger

The project uses `morgan` to log all the requests. Morgan outputs the data to a winston stream. To log custom messsages
`import {Logger} from utils` instead of `console.log`. The custom Logger is made of winston logging library.

`info` level is for request logs. Custom log messages can be either one of `debug`, `warn`, `error`.

### Models

Each Mongoose Model has a repository which will have wrapper of almost all the functions that a mongoose model has.
Each model also has a corresponsing Service which will be used inside the controllers to perform actions on these models.
The hierarchy will look like this Controllers --> Service --> Repositoy --> Mongoose Models. Only the service can make use of a
model's repository and only a repository can make use of a mongoose model. Controller can only use a Service.

### Code Implementation Guidelines

- Write Simple Modules with Minimal API. Remember "Simple is Beautiful".
- Controllers **Must not** have any business logic.
- Controllers should provide services data from request.
- All business logic should be inside services.
- Services **should never** have to interact with any of the underlying framework or any specific part of it. Like request, response, middleware etc.
- One controller must only interact with one service
- Service **must not** speak mongoose query language.
- Service can interact with other services.
- Only Repos **should talk** to and speak database language and communicate with Database Models.
- Code written should be async in nature whenever it can.
- Avoid writing performance costing sync code.
- All Services, Repositories and Utils modules should have corresponsding unit tests
- Controller Testing would be part of the Integration Test
- Each route module will have a corresponding integration test module for that route
- Return Lean Objects from Repositories
- Circular Dependencies don't work. (A --calls-- B and then B--calls--A in one chain of calls will throw error)

### User Authentication

Each call from the Dashboard must contain a valid Authorization header (JWT Token) for a successful authentication.

### API Authentication

Each call from the API must contain a valid Authorization header (JWT Token) for a successful authentication.

## Type Definition (`.d.ts`) Files

TypeScript uses `.d.ts` files to provide types for JavaScript libraries that were not written in TypeScript.
This is great because once you have a `.d.ts` file, TypeScript can type check that library and provide you better help in your editor.
The TypeScript community actively shares all of the most up-to-date `.d.ts` files for popular libraries on a GitHub repository called [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types).
Making sure that your `.d.ts` files are setup correctly is super important because once they're in place, you get an incredible amount of high quality type checking (and thus bug catching, IntelliSense, and other editor tools) for free.

> **Note!** Because we're using `"noImplicitAny": true`, we are required to have a `.d.ts` file for **every** library we use. While you could set `noImplicitAny` to `false` to silence errors about missing `.d.ts` files, it is a best practice to have a `.d.ts` file for every library. (Even if the `.d.ts` file is [basically empty!](#writing-a-dts-file))

### Installing `.d.ts` files from DefinitelyTyped

For the most part, you'll find `.d.ts` files for the libraries you are using on DefinitelyTyped.
These `.d.ts` files can be easily installed into your project by using the npm scope `@types`.
For example, if we want the `.d.ts` file for jQuery, we can do so with `npm install --save-dev @types/jquery`.

> **Note!** Be sure to add `--save-dev` (or `-D`) to your `npm install`. `.d.ts` files are project dependencies, but only used at compile time and thus should be dev dependencies.

In this template, all the `.d.ts` files have already been added to `devDependencies` in `package.json`, so you will get everything you need after running your first `npm install`.
Once `.d.ts` files have been installed using npm, you should see them in your `node_modules/@types` folder.
The compiler will always look in this folder for `.d.ts` files when resolving JavaScript libraries.

### What if a library isn't on DefinitelyTyped

If you try to install a `.d.ts` file from `@types` and it isn't found, or you check DefinitelyTyped and cannot find a specific library, you will want to create your own `.d.ts file`.
In the `src` folder of this project, you'll find the `types` folder which holds the `.d.ts` files that aren't on DefinitelyTyped (or weren't as of the time of this writing).

### Setting up TypeScript to look for `.d.ts` files in another folder

The compiler knows to look in `node_modules/@types` by default, but to help the compiler find our own `.d.ts` files we have to configure path mapping in our `tsconfig.json`.
Path mapping can get pretty confusing, but the basic idea is that the TypeScript compiler will look in specific places, in a specific order when resolving modules, and we have the ability to tell the compiler exactly how to do it.
In the `tsconfig.json` for this project you'll see the following:

```json
"baseUrl": ".",
"paths": {
    "*": [
        "node_modules/*",
        "src/types/*"
    ]
}
```

This tells the TypeScript compiler that in addition to looking in `node_modules/@types` for every import (`*`) also look in our own `.d.ts` file location `<baseUrl>` + `src/types/*`.
So when we write something like:

```ts
import * as flash from 'express-flash';
```

First the compiler will look for a `d.ts` file in `node_modules/@types` and then when it doesn't find one look in `src/types` and find our file `express-flash.d.ts`.

### Using `dts-gen`

Unless you are familiar with `.d.ts` files, I strongly recommend trying to use the tool [dts-gen](https://github.com/Microsoft/dts-gen) first.
The [README](https://github.com/Microsoft/dts-gen#dts-gen-a-typescript-definition-file-generator) does a great job explaining how to use the tool, and for most cases, you'll get an excellent scaffold of a `.d.ts` file to start with.
In this project, `bcrypt-nodejs.d.ts`, `fbgraph.d.ts`, and `lusca.d.ts` were all generated using `dts-gen`.

### Writing a `.d.ts` file

**[Read this first](https://github.com/Microsoft/TypeScript-Handbook/blob/fa9e2be1024014fe923d44b1b69d315e8347e444/pages/Declaration%20Merging.md#module-augmentation)**
If generating a `.d.ts` using `dts-gen` isn't working, [you should tell me about it first](https://www.surveymonkey.com/r/LN2CV82), but then you can create your own `.d.ts` file.

If you just want to silence the compiler for the time being, create a file called `<some-library>.d.ts` in your `types` folder and then add this line of code:

```ts
declare module '<some-library>';
```

If you want to invest some time into making a great `.d.ts` file that will give you great type checking and IntelliSense, the TypeScript website has great [docs on authoring `.d.ts` files](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

### Summary of `.d.ts` management

In general if you stick to the following steps you should have minimal `.d.ts` issues;

1. After installing any npm package as a dependency or dev dependency, immediately try to install the `.d.ts` file via `@types`.
2. If the library has a `.d.ts` file on DefinitelyTyped, the install will succeed and you are done.
   If the install fails because the package doesn't exist, continue to step 3.
3. Make sure you project is [configured for supplying your own `d.ts` files](#setting-up-typescript-to-look-for-dts-files-in-another-folder)
4. Try to [generate a `.d.ts` file with dts-gen](#using-dts-gen).
   If it succeeds, you are done.
   If not, continue to step 5.
5. Create a file called `<some-library>.d.ts` in your `types` folder.
6. Add the following code. At this point everything should compile with no errors and you can either improve the types in the `.d.ts` file by following this [guide on authoring `.d.ts` files](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) or continue with no types.

```ts
declare module '<some-library>';
```

## IMPROVEMENTS

- Add Caching layer above database (In Repositories)
- Improve the internal structure following the Code Implementation Guidelines
- Add More Unit Tests and Integration Test
- Add Load Testing using artillery
- Improve the Data Source Services (Apply better OOP principles)

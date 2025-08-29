# HealthDashboard

This project will complete various health checks on a GitHub repository, including if it has a LICENSE file, README.md file, .gitignore file, has had a commit within the last 6 months, and if it uses GitHub actions. Simply enter the URL for a GitHub repository and click the Check Repo button to run the health check. The health check will return various GitHub user information, their avatar image, health check criteria, and a health check score. 

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## Getting Started

Clone GitHub project files:

```bash
git init
git clone https://github.com/AggregateNinja/HealthDashboard.git
```

Navigate to root directory of project:

```bash 
cd /path/to/HealthDashboard
```

Install Angular:

```bash 
npm install -g @angular/cli
```

Install Angular dependencies:

```bash
npm install
```

For higher rate limits to the GitHub API, set your GitHub Personal Access Token in app/environments/environment.ts. This step is required in order to access the GitHub API:

```bash
githubToken: 'YOUR_TOKEN_HERE'
```

## Docker

This project includes files to be easily run with Docker, including a Dockerfile and docker-compose.yml. The Dockerfile will build the project with Node version 22, install dependencies from package.json, and serve the application with nginx. 

To run this project with Docker, navigate to the project root (health-dashboard) and run:

```bash
docker-compose build
docker-compose up
```

If you get an error stating that the container is already in use, run this instead:

```bash
docker-compose up --force-recreate
```

The website can then be viewed in a web browser with url http://localhost:4200

## Git Hook

A pre-commit hook is included the hooks directory to check that the package.json version has been updated before allowing a commit.

Copy the file from the HealthDashboard/hooks directory to the .git/hooks directory, and make it executable. 

```bash
cd /path/to/HealthDashboard/hooks
cp pre-commit ../.git/hooks/pre-commit
cd ../.git/hooks
chmod +x pre-commit
```

## CI Pipeline

A Continuous Integration pipeline is used and can be found in .github/workflows/ci.yml. It triggers on push to the main branch, and fails if any step or job fails. 

The linter uses ng lint for checking code quality, style consistency, and potential errors. test:ci tells the GitHub CI to run in Headless Chrome.

Add to package.json:
```bash
...
"scripts": {
    ...
    "lint": "ng lint",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage",
  },
...
```

In ci.yml
This run the script defined in package.json:
```bash
- name: Run unit tests (headless)
        run: npm run test:ci
```

This tells Karma to generate a coverage report and uploads it GitHub Actions as a downloadable artifact:
```bash
- name: Upload coverage (artifact)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
```

Running "npm test" uses Karma/Jasmine testing framework to test that GithubService call the expected URL, the app can be created, and it renders the title link. 



## Future Release

- Button to download Health Check PDF Report

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

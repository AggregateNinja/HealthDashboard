# HealthDashboard

This project will complete various health checks on a GitHub repository, including if it has a LICENSE file, README.md file, .gitignore file, has had a commit within the last 6 months, and if it uses GitHub actions. Simply enter the URL for a GitHub repository and click the "Check Files" button to run the health check. 

In order to keep things simple, a minimalist design was chosen, which uses Bootstrap for displaying webpage components using its grid system. 

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## Getting Started

Clone GitHub project files:

```bash
git init
git clone https://github.com/AggregateNinja/HealthDashboard.git
```

Navigate to the root directory of project:

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

The website can then be viewed in a web browser with url http://localhost:4200

## Git Hook

A pre-commit hook is included the hooks directory to check that the package.json version has been updated before allowing a commit. 

## CI Pipeline

A Continuous Integration pipeline is used and can be found in .github/workflows/ci.yml. It triggers on push to the main branch, and fails if any step or job fails. 

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

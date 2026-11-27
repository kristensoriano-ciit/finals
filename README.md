# Expense Tracker

A small React app for recording expenses, with an automated CI/CD pipeline using GitHub, Jenkins, SonarQube and Docker.

## Features

- Add an expense with a description, amount and category (Food, Transport, Bills, School, Other)
- Input checks: description is required (up to 60 characters); amount must be greater than 0, at most 1,000,000, with up to 2 decimal places
- Delete expenses
- Filter by category, with an overall total and a category total
- Expenses are saved in the browser (localStorage). No database is needed.

## Run the app locally

Requires Node.js 22 (22.12 or newer) or 24.

```
npm ci
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

## Tests and coverage

```
npm test
npm run coverage
npm run build
```

`npm run coverage` writes an LCOV report to `coverage/lcov.info`, which SonarQube imports. The tests cover input validation, totals and filtering, the form, the expense list, and the whole app (adding, saving and deleting an expense, and loading damaged saved data).

## Project files

| Path | Purpose |
|---|---|
| `src/` | React source and tests |
| `Jenkinsfile` | CI pipeline |
| `Jenkinsfile.cd` | CD pipeline |
| `Dockerfile`, `nginx.conf` | Serve the built app with Nginx |
| `sonar-project.properties` | SonarQube settings |
| `ci/` | Local Jenkins and SonarQube containers |

## Branches and CI stages

| Stage | feature/* | develop | main |
|---|---|---|---|
| Checkout | Yes | Yes | Yes |
| Install and Test | Yes | Yes | Yes |
| Coverage | Yes | Yes | Yes |
| SonarQube Analysis | | | Yes |
| Quality Gate | | | Yes |
| Build | | Yes | Yes |
| Archive Artifact | | | Yes |

A failing test stops the pipeline. On `main`, a failed quality gate stops it before the build and archive stages.

## Set up Jenkins and SonarQube

Requires Docker Desktop. Jenkins is given access to the computer's Docker engine so it can deploy, so use this setup only on your own computer and do not expose it to the internet.

```
docker compose -f ci/docker-compose.yml up -d --build
docker compose -f ci/docker-compose.yml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Jenkins runs at http://localhost:8080 and SonarQube at http://localhost:9000. The second command shows the Jenkins unlock password. Never commit or share passwords or tokens.

To stop the containers and keep their data:

```
docker compose -f ci/docker-compose.yml stop
```

### SonarQube

1. Sign in and change the default admin password.
2. Create a local project with key `expense-tracker` and main branch `main`.
3. Create the quality gate `Expense Gate`: fail when coverage on **Overall Code** is less than 80%. Assign it to the project.
4. Create an analysis token under **My Account > Security**.
5. Add a webhook with the URL `http://jenkins:8080/sonarqube-webhook/`.

If SonarQube rejects the webhook URL as an internal address, check **Administration > Configuration > General Settings > Security**. Allow only the Docker network if that option is available. Otherwise, turning off **Enable local webhooks validation** lets it through. This removes a security check, so do it only on a local setup, and turn it back on afterwards.

### Jenkins

1. Install the suggested plugins, plus **SonarQube Scanner**, **Copy Artifact** and **Pipeline: Stage View**.
2. Add the SonarQube token as a **Secret text** credential.
3. Under **System**, add a SonarQube server named `SonarQube` with URL `http://sonarqube:9000` and that token.
4. Under **Tools**, add a SonarQube Scanner named `SonarScanner` with automatic installation.
5. Create a **Multibranch Pipeline** named `expense-tracker-ci` for this repository:
   - GitHub credential: a fine-grained token limited to this repository (Contents, Metadata and Pull requests: read; Commit statuses: read and write)
   - Discover **all branches** and remove pull request discovery
   - Script path: `Jenkinsfile`
   - Scan periodically every 1 minute, so new pushes are built automatically
6. Create a **Pipeline** job named `expense-tracker-cd`: **Pipeline script from SCM**, Git, this repository, branch `*/main`, script path `Jenkinsfile.cd`.

The job names must match, because the CI pipeline only lets `expense-tracker-cd` copy its artifacts.

## Versioned artifact

After a `main` build passes the quality gate, Jenkins builds the app and archives `react-app-<build number>.tar.gz`. It contains `dist/`, `Dockerfile` and `nginx.conf`, without `node_modules`.

## Deploy (CD)

In `expense-tracker-cd`, choose **Build with Parameters**. (If it is missing on a new job, run **Build Now** once. That run fails because no build number is given.)

| Parameter | Meaning |
|---|---|
| `CI_BUILD_NUMBER` | The successful `main` build whose artifact is deployed. This is different from the CD job's own `BUILD_NUMBER`. |
| `ENVIRONMENT` | DEV, TEST, ACC or PROD |

| Environment | Container | Address |
|---|---|---|
| DEV | `expense-tracker-dev` | http://localhost:3001 |
| TEST | `expense-tracker-test` | http://localhost:3002 |
| ACC | `expense-tracker-acc` | http://localhost:3003 |
| PROD | `expense-tracker-prod` | http://localhost:3004 |

The CD job copies the selected artifact, builds a Docker image from it and starts the container. It does not run `npm run build`. Deploying again to an environment replaces its container, so there is a short interruption and no automatic rollback. To go back, deploy an earlier build number that Jenkins still has.

List the running app containers:

```
docker ps --filter "name=expense-tracker-"
```

## Failure and recovery demonstration

Done on `feature/failure-demo` using the failed test option.

- **Failure:** `getTotal` was changed to `return cents`, removing the division by 100, so totals were 100 times too large. 3 of 24 tests failed and the pipeline stopped at Install and Test.
- **Fix:** the commit was reverted, restoring `return cents / 100`. The pipeline then passed.

## Results (November 28, 2026)

- SonarQube analysis of `main`: quality gate passed, 96.6% overall coverage, 0 issues, 0.0% duplication
- `npm audit`: found 0 vulnerabilities, so no fix was needed
- CD: CI build 1 deployed to DEV

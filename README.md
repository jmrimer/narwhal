# Project Narwhal
## Overview
Crew management is currently done leveraging several tools depending on the location: excel, compass, PEX, whiteboards, Metrics, access databases, and hard copies of schedules. This is a slow and error filled process that results in wasted man hours and overstaffing of missions.  The Crew Management Tool is aimed to reduce the amount of tools that a scheduler has to review in order to plan a single mission by combining all data into a single tracker to help reduce the time wasted searching for data. The application will also integrate mission information to allow for planning to exist within the same application in order to reduce the number of errors due to transcription and to pave the way for future automatization. This is in an effort to create a corporate base line, so that data across locations is consistent. The application will reside on NGA’s NIPR PCF and use MDDS to transfer to a mirrored PCF on JWICS.


## Setup
### Dependencies
* `mysql stable 5.7.20+`
* `java 1.8`
    * `gradle 3.5.1+`
* `ruby 2.4.2+`
    * `bundler 1.16.1+`
* `node v8.9.0+`
    * `yarn 1.3.2+`

### Environment Variables
Set the following environment variables:
- `NARWHAL_DB_URL`  
- `NARWHAL_DB_USERNAME`
- `NARWHAL_DB_PASSWORD`
- `SSO_SERVICE_URL`
- `SSO_CLIENT_ID`
- `SSO_CLIENT_SECRET`
- `UNICORN_URL`

Source the following script to set the environment variables for local development:
* `source ./scripts/setup_env.sh`

### Setup the Database
* `./scripts/setup_db.sh`

## Build
### Client
* Be sure dependencies are up to date with `cd client && yarn install`. 
* `cd client && yarn build`

### Backend
* `./gradlew assemble`

## Develop
### Seed the Development Database
* `./scripts/seed_db.sh`

### Client Development Server
* `cd client && yarn start`

### Backend Development Server
* `./gradlew bootrun`

### Generate client side repository with contract tests
* `yarn generate-repo {directory} {component name}`

## Test
#### Client Tests
* `cd client && yarn test`

#### Backend Tests
* `./gradlew test`

#### Contract Tests
* Ensure that the app is running locally with `./gradlew bootrun`.
* `cd client && yarn contracts`

#### Acceptance Tests
* Ensure that the client has been built and that the app server is running locally.
* Be sure that all dependencies are installed with `cd acceptance && bundle install`.
* `cd acceptance && bundle exec rspec`

#### All tests
* `./all-tests.sh`

## Deploy
* `cf push`

## Resources
- Tracker: https://www.pivotaltracker.com/n/projects/2126100
- Continous Integration and Deployment: https://jenkins.devops.geointservices.io/job/Narwhal/job/Narwhal/
- Acceptance: https://narwhal.dev.dev.east.paas.geointservices.io/


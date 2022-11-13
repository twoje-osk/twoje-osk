<div id="top"></div>

<div align="center">
  <a href="https://github.com/twoje-osk/twoje-osk">
    <img src="logo.png" alt="" width="80" height="80">
  </a>

<h3 align="center">Twoje OSK</h3>

  <p align="center">
    Driving School Management System
    <br />
    <br />
    <a href="https://test.twoje-osk.pl">View Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#running-the-app">Running the App</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#docker">Docker</a></li>
        <li><a href="#vanilla-method">Vanilla method</a></li>
      </ul>
    </li>
    <li><a href="#development">Development</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The following repository contains the source code for [our](#contact) Engineering Thesis concluding studies on [PJAIT](https://www.pja.edu.pl/en/).

The project is an implementation of a management system for driving schools (OSK in polish).

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With
#### Frontend
* [Yarn Modern](https://yarnpkg.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [Material UI](https://mui.com/)
* [Emotion](https://emotion.sh/)
* [SWR](https://swr.vercel.app/)

#### Backend
* [Yarn Modern](https://yarnpkg.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [NestJS](https://nestjs.com/)
* [Express](https://expressjs.com/)
* [TypeORM](https://typeorm.io/)
* [Passport](https://www.passportjs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>


## Running the App

### Installation
1. Clone the repo
  ```sh
  git clone git@github.com:twoje-osk/twoje-osk.git
  ```
2. In the project root install the dependencies (unless you run the app in [Vanilla method](#vanilla-method), this is only needed for the IDE)
  ```sh
  yarn install
  ```
3. Append the following to [`/etc/hosts`](https://sslhow.com/understanding-etc-hosts-file-in-linux). This will allow you to use `test`, `other-test`, and `invalid` organizations.
  ```
  127.0.0.1       twoje-osk.loc
  127.0.0.1       test.twoje-osk.loc
  127.0.0.1       other-test.twoje-osk.loc
  127.0.0.1       invalid.twoje-osk.loc
  ```

### Docker
1. Spin up the app using `docker-compose`. In the project root folder run
```
docker-compose up --build
```
2. The backend will be available on port `8080` and frontend will be available on port `3000` (it also proxies all traffic to `/api` to port `8080`).\
  Additionally due to the fact that the organization permissions are bound to the subdomain that the users requests, you have to open the app using `organization-name.twoje-osk.loc:3000/`

### Vanilla method
1. Run `postgres`. You can do it in 2 ways.
    1. [Download it](https://www.postgresql.org/download/) and install it on your machine. Keep it running the background
    2. Run `docker-compose up postgres` in a separate terminal window (requires docker)
2. In a separate terminal window run `shared` subproject using
  ```sh
  cd shared && yarn dev
  ```
3. In a 2nd separate terminal window run `backend` subproject using
  ```sh
  cd backend && yarn dev
  ```
4. In a 3rd separate terminal window run `frontend` subproject using
  ```sh
  cd frontend && yarn dev
  ```
5. The backend will be available on port `8080` and frontend will be available on port `3000` (it also proxies all traffic to `/api` to port `8080`).\
  Additionally due to the fact that the organization permissions are bound to the subdomain that the users requests, you have to open the app using `organization-name.twoje-osk.loc:3000/`

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- DEVELOPMENT -->
## Development
### Backend
All of the following command should be run inside the `backend` folder

#### Creating migrations
```bash
yarn create-migration src/migrations/EntityMigrationName
```
Reference: [Creating a new migration](https://typeorm.io/migrations#creating-a-new-migration)

#### Run migrations
```bash
yarn migrate
```
Reference: [Running and reverting migrations](https://typeorm.io/migrations#running-and-reverting-migrations)

#### Seed Database
> **Note** This command needs to be executed after the migrations have been run. Check [Run Migrations](#run-migrations)
```bash
yarn seed
```

#### Drop database
```bash
yarn typeorm schema:drop
```
Reference: [Drop database schema](https://typeorm.io/using-cli#drop-database-schema)

#### Full Reference
https://typeorm.io/using-cli

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the GPLv3 License. See [`LICENSE.md`](./LICENSE.md) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact
**Bartosz Legięć**
  * GitHub: [@bibixx](https://github.com/bibixx)
  * Twitter: [@bibix1999](https://twitter.com/bibix1999)
  * LinkedIn: [bartoszlegiec](https://www.linkedin.com/in/bartoszlegiec/)

**Maciej Wójcik**
  * GitHub: [@vvooycik](https://github.com/vvooycik)
  * Twitter: [@Wooycik](https://twitter.com/Wooycik)
  * LinkedIn: [wooycik](https://www.linkedin.com/in/wooycik/)

**Romeo Morcia**
  * GitHub: [@maonat](https://github.com/maonat)
  * LinkedIn: [romeo-morcia-5256b491](https://www.linkedin.com/in/romeo-morcia-5256b491/)

Project Link: https://github.com/twoje-osk/twoje-osk

<p align="right">(<a href="#top">back to top</a>)</p>

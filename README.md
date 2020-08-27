<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/laperette/laperette">
    <img src="./logo.png" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">LA PERETTE</h3>

  <p align="center">
    Smoothly manage your family house
    <br />
    <a href="https://github.com/github_username/repo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://laperette-client.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/laperette/laperette/issues">Report Bug</a>
    ·
    <a href="https://github.com/laperette/laperette/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  <!-- - [Usage](#usage) -->
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

### Built With

- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org//)
- [Koa](https://koajs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Knex](http://knexjs.org/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Install Docker
- Install yarn

### Installation

1. Clone the repo

```sh
git clone https://github.com/laperette/laperette
```

2. Install the packages

```sh
yarn install
```

3. Launch the local database accessible at `postgres://postgres:postgres@localhost:5430/laperette`

```sh
docker-compose up -d
```

4. Run the migrations

```sh
yarn server migrate
```

5. Launch the server

```sh
yarn server start-dev
```

6. Launch the client

```sh
yarn client start-dev
```

<!-- USAGE EXAMPLES -->

## Usage

Just head to our [Notion page](https://www.notion.so/axelmtn/La-Perette-b9cb65b6f7e34df7abc43d80412428c4) to understand how to use our platform and have a look on how it is architectured.

<!-- Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_ -->

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/laperette/laperette/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**, especially styling!

1. Fork the Project
2. Create your Feature Branch using your initials (`git checkout -b am/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin am/amazing-feature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Axel Martin - mtn.axel@gmail.com

[Github](https://github.com/paradoux) - [LinkedIn](https://www.linkedin.com/in/martinaxel/)

Alexandre Behagel - alexandre.behaghel@club-internet.fr

[Github](https://github.com/AlexGeb) - [LinkedIn](https://www.linkedin.com/in/alexandre-behaghel/)

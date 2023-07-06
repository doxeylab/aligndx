<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/doxeylab/aligndx">
    <img src="frontend/public/assets/logo.svg" alt="Logo" width="1000" height="80">
  </a>

  <!-- <h3 align="center">AlignDx</h3> -->

  <p align="center">
    The Bioinformatics Surveillance Platform
    <br />
    <br />
    <a href="https://github.com/doxeylab/aligndx/issues">Report Bug</a>
    |
    <a href="https://github.com/doxeylab/aligndx/issues">Request Feature</a>
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
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

AlignDx is a web-first platform for running bioinformatic workflows. The core of the platform is a dynamic workflow system, that generates pipelines and their respective web-forms based on a collection of schemas. Supporting this is authentication, archiving and task queueing, to deliver a seamless experience.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![FastAPI][FastAPI]][FastAPI-url] [![Celery][Celery]][Celery-url]
* [![React.js][React]][React-url] [![Next.js][Next js]][Next js-url]
* [![Postgres][Postgres]][Postgres-url] [![Redis][Redis]][Next js-url]
* [![Docker][Docker]][Docker-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

1. Install [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/). 
3. Install [git](https://git-scm.com/) if you don't have it already.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/doxeylab/aligndx.git
   ```
2. Setup the project environmental variables in an .env file, located in the root directory. For details, see [this section](docs/environment.MD).
3. Install the app using the build script. Scripts are provided for both production and local usage respectively.
    
    ```sh
    ./build.sh 
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

1. Users can register on the platform by accessing the appropriate URL (as setup in the environment file)
2. The following is a diagram outlining the typical workflow a user might follow using the platform UI.

    <img src="docs/images/Lookout-surveillance%20diagram.svg" alt="Logo">

    *Stepwise utilization of Lookout in the AlignDx Platform. (A) Workflow/pipeline selection menu and (B) available workflow options. (C) Surveillance specific form components. (D) Filled out surveillance form, with input dataset, and chosen options. (E) Status card for monitoring submissions. (F)  Workflow output report. (G) Archive entry for submission.*


<p align="right">(<a href="#readme-top">back to top</a>)</p>

 

<!-- LICENSE -->
## License

To be determined ...

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Manjot Hunjan - manjothunjan@gmail.com

Project Link: [https://github.com/doxeylab/aligndx](https://github.com/doxeylab/aligndx)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thanks to our many collaborators!


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->


[FastAPI]: https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi
[FastAPI-url]: https://fastapi.tiangolo.com/

[Next JS]: https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white
[Next JS-url]: https://nextjs.org/

[React]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev/

[Celery]: https://img.shields.io/badge/-Celery-37814A?style=for-the-badge&logo=celery
[Celery-url]: https://docs.celeryq.dev/en/stable/getting-started/introduction.html

[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/


[Postgres]: https://img.shields.io/badge/Postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/

[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
 
 
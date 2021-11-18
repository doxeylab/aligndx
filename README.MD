# Sequence Analysis Project
RNA-sequence analysis workflows in the cloud, delivered to you in an intuitive and easy to use manner.

- [Sequence Analysis Project](#sequence-analysis-project)
- [Introduction](#introduction)
  * [**Setup and Installation**](#--setup-and-installation--)
    + [**With Docker (Recommended)**](#--with-docker--recommended---)
    + [**Without Docker**](#--without-docker--)
    + [**Technologies**](#--technologies--)
- [Project Status](#project-status)
 
# Introduction

AlignDx is a framework for implementing Bioinformatic pipelines, with our main focus being RNA-sequencing. With the goal of reaching the masses, we strive to implement a modern Frontend, with a robust Backend. Below are the setup instructions for 1st time users.
  
## **Setup and Installation** 

### **With Docker (Recommended)** 
**1.** Clone this repo into whatever directory you want using `git clone https://github.com/doxeylab/aligndx.git`   

**2.** Change directories into /path/aligdnx/app and create an .env file.

> **_Note:_** Please contact Manjot for the environment variables.

**3.** Add this folder https://drive.google.com/drive/folders/1UjjzFRjntQQs1ugaGORrAej7W-d1rWji?usp=sharing  to the backend/indexes folder.

**_Note:_** Please contact Manjot for the environment variables.

**4.** In /path/aligdnx/app, run `./scripts/build.sh`

> **_Note:_** If you are running an m1 mac, please run `./scripts/m1_mac_build.sh` instead

**5.** Watch logs via Docker Desktop, or utilize optional logs.sh script `./scripts/logs.sh` 


### **Without Docker** 
**1.** A unix system is preferred, but any system that can utilized docker will do: 
  - One of the major linux distros (ubuntu, debian, etc.) is recommended 

**2.** Install python. First check if you already have it.  
  - `python3 --v`
  - If you don't have it:
    - `sudo apt-get update`
    - `sudo apt-get install python3.8` 

**3.** Install npm (and check for nodejs). First check if you have it:
  - `npm --v`
  - If you don't have it:
    - `sudo apt install npm` 
      - also check if nodejs was installed along as a dependency via `node --v`
      - if it wasn't, install via `sudo apt install nodejs` 

**4.** Clone this repo into whatever directory you want using `git clone https://github.com/doxeylab/aligndx.git`  
 
**5.** Install the frontend dependencies:
  - `cd path/aligndx/app`
  - `npm install`

**6.** Install the backend dependencies:  
  - `cd path/aligndx/app/backend`
  - `python3 -m venv venv`
  - `source venv/bin/activate`
    - Your console should now have the prefix "venv"
  - `pip install -r requirements.txt` 
  - Next deactivate the virtual environment (venv)
  - `deactivate`
  - There are 2 more things you need to enable backend functionality. These are large files, thus they can't be push to github. 
  - Access them using this google drive link: https://drive.google.com/drive/folders/1XUYFlie-Enl7AiW3C2HMH-t8Kjba3R-x?usp=sharing
  - Note that the salmon folder contains the binaries for linux. It won't work on Windows or Mac OS
    - Download them into the path/aligndx/app/ folder
    - Create a folder called indexes
    - Move the 'sars_with_human_decoys' folder into path/aligndx/app/backend/indexes

**Congrats! You are done setting up your development environment**



### **Technologies**
Javascript + React.js 
Python + Flask 

# Project Status
**Ongoing** 
- [] web app

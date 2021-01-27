# Point of Care Diagnostics Projects
Sequene analysis and image analysis apps 

**NOTE FOR EVERYONE ON THE TEAM**
I've made several changes to the file structures of the repo. pocd-seq-app contains the full stack code for the web app. Design is a folder for any frontend designs you have created and want to store in the repo. Experimental is a chaotic folder for all our garbage collection. I have yet to make a folder for the image_analysis.

# Table of Contents
- [Point of Care Diagnostics Projects](#point-of-care-diagnostics-projects)
- [Table of Contents](#table-of-contents)
  * [Introduction](#introduction)
    + [Web app](#web-app)
  * [Smartphone app](#smartphone-app)
    + [Technologies](#technologies)
  * [Web app](#web-app)
    + [Technologies](#technologies-1)
    + [Setup and Installation](#setup-and-installation)
  * [Project Status](#project-status)
 

## Introduction

In the following github repository, you will find the codebases for 2 primary projects, which ultimately have a goal of coming together. In summary, the goal is software able to greatly increase the bridging gap between healthcare and the patient. Initially, we are aiming for diagnosticians, clinicians, and possibly researchers that have interest in simplifying sequence analysis and popular assay analysis. Eventually we seek to deliver a user experience to every person, where the aforementioned tasks are easily accessible and understood.

## Smartphone app
Intakes an image, analyzes it and produces a result

### Technologies
Flutter + Dart
Python + Flask 
Android OS

## Web app
Intakes a fastq sequence, analyzes it and produces a result based on the workflow

### Setup and Installation 
1. You need the following to correctly replicate our current dev environment: 
- You have one of the major linux distros installed on your computer (ubuntu, debian, etc.)
- I (Manjot) am using Ubuntu 20.04
- If you don't want to dual boot or use a vm, I recommend using WSL, which is what I use. Really convenient for web dev
2. Install python. First check if you already have it. Note that python3.8 is shipped with Ubuntu 20.04.
- `python3 --v`
If you don't have it:
- `sudo apt-get update`
- `sudo apt-get install python3.8` 
2. Install npm
- `npm --v`
If you don't have it:
- `sudo apt install npm` 
also check if nodejs was installed along as a dependency via `node --v`
if it wasn't, install via `sudo apt install nodejs`
3. Install yarn using `npm install yarn`
4. Clone this repo into whatever directory you want using `git clone https://github.com/mshunjan/POCD.git`  
5. Install dependencies using `npm install`
6. Install flask and dotenv as follows:
- `python3 -m venv venv`
- `source /venv/bin/activate`
Your console should now have the prefix "venv"
- `python3 -m pip install flask python-dotenv`
7. Enter the app directory
`cd pocd-seq-app`
8. Start hot-reloading front-end
`yarn start`
Just open the link that outputs to the terminal
9. Start hot-reloading back-end
`yarn api-start` (note do this in another terminal window)
10. Open one final terminal window for actual development and you're setup!
### Technologies
Javascript + React.js
HTML + CSS
Python + Flask 

## Project Status
**Ongoing**
- [] smartphone app
- [] web app

# Sequence Analysis Project
RNA-sequence analysis workflows in the cloud, delivered to you in an intuitive and easy to use manner.

# Table of Contents 
- [Introduction](#introduction)
  * [Setup and Installation](#setup-and-installation)
  * [Quickstart](#quickstart)
  * [Technologies](#technologies)
- [Project Status](#project-status)
 
## Introduction

In the following github repository, you will find the codebases for software able to greatly increase the bridging gap between healthcare and the patient. Initially, we are aiming for diagnosticians, clinicians, and possibly researchers that have interest in simplifying sequence analysis. Eventually we seek to deliver a user experience to every person, where the aforementioned tasks are easily accessible and understood.
  
### **Setup and Installation** 
**1.** You need the following to correctly replicate our current dev environment: 
  - You have one of the major linux distros installed on your computer (ubuntu, debian, etc.)
  - I (Manjot) am using Ubuntu 20.04
  - If you don't want to dual boot or use a vm, I recommend using WSL.

**2.** Install python. First check if you already have it. Note that python3.8 is shipped with Ubuntu 20.04.
  - `python3 --v`
  If you don't have it:
    - `sudo apt-get update`
    - `sudo apt-get install python3.8` 

**3.** Install npm (and check for nodejs). First check if you have it:
  - `npm --v`
  If you don't have it:
    - `sudo apt install npm` 
      - also check if nodejs was installed along as a dependency via `node --v`
      - if it wasn't, install via `sudo apt install nodejs` 

**4.** Clone this repo into whatever directory you want using `git clone https://github.com/mshunjan/POCD.git`  
 
**5.** Install the frontend dependencies:
  - `cd path/POCD/pocd-seq-app`
  - `npm install`

**6.** Install the backend dependencies:  
  - `cd path/POCD/pocd-seq-app/api`
  - `python3 -m venv venv`
  - `source venv/bin/activate`
    - Your console should now have the prefix "venv"
  - `pip install -r requirements.txt` 
  - Next deactivate the virtual environment (venv)
  - `deactivate`
  - There are 2 more things you need to enable backend functionality. These are large files, thus they can't be push to github. 
  - Access them using this google drive link: https://drive.google.com/drive/folders/1XUYFlie-Enl7AiW3C2HMH-t8Kjba3R-x?usp=sharing
  - Note that the salmon folder contains the binaries for linux. It won't work on Windows or Mac OS
    - Download them into the path/POCD/pocd-seq-app/api folder
    - Create a folder called indexes
    - Move the 'sars_with_human_decoys' folder into path/POCD/pocd-seq-app/api/indexes

**Congrats! You are done setting up your development environment**

### **Quickstart**
**1.** Open three seperate terminal tabs/windows.

**2.** Start hot-reloading front-end in one of those three terminal tabs/windows using this command:
    - `cd /path/POCD/pocd-seq-app/`
    - `npm start`
    - The terminal will output a link for the frontend
      - **NOTE**: If it doesn't, don't worry. Just type this into your browser:
      - 'https://localhost:3000/ 
    - **To close the frontend**

**3.** In another terminal tab/window run the backend server via:
    - The easy way:
    - `cd /path/POCD/pocd-seq-app/`
    - `npm run startapi`
    - The terminal will output a link for the frontend
      - **NOTE**: If it doesn't, don't worry. Just type this into your browser:
      - 'https://localhost:5000/ 

**4.** Use the last terminal tab/window to move around your development folder. You're set to go!
### **Technologies**
Javascript + React.js 
Python + Flask 

## Project Status
**Ongoing** 
- [] web app

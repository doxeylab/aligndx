# Test datasets for alignDx

A demo server for AlignDx is available here: aligndx.uwaterloo.ca

A test dataset containing .fastq files of five samples is available here:

* SRR13094571
* SRR13094574
* SRR13094577
* SRR7615344
* ERR7912883

Instructions:

* Download the above files
* Register / sign-in to AligDx if you have not already
* Select the "PathogenScreen pipeline" with the "Human Pathogenic Viruses" panel
* Upload the above five files
* Submit

Expected output:

* Dengue virus should be detected with the highest abundance in SRR13094571, SRR13094574, SRR13094577
* Coronavirus NL63 should be detected with the highest abundance in SRR7615344
* SARS-CoV-2 should be detected with the highest abundance in ERR7912883


More information about the test dataset is described below. 

## Detection of dengue virus from febrile illness samples:

From manuscript: Gaye et al. (2021) "Genomic investigation of a dengue virus outbreak in Thiès, Senegal, in 2018"

https://www.nature.com/articles/s41598-021-89070-1

NCBI Project ID: PRJNA662334

Samples:

SRR13094571, SRR13094574, SRR13094577


## Detection of coronavirus NL63 in febrile illness samples from Tororo, Uganda

From manuscript: Ramesh et al. (2019) "Metagenomic next-generation sequencing of samples from pediatric febrile illness in Tororo, Uganda"

https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0218318

NCBI Project ID: PRJNA483304


Sample: SRR7615344


## Detection of SARS-CoV-2 in nasal swab from patient with symptoms of SARS-CoV-2

NCBI Project ID: PRJEB49843

Sample: ERR7912883

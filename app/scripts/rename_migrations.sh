# !/bin/bash

FILES="$1/*"

for f in $FILES
do 
    echo -e "\nProcessing $f file ..."

    filename=$(echo $(basename $f))
    line=$(grep Create $f )
    digits=$(grep -Po 'Create Date: \K.*' $f )
    wo_trail=${digits%.*}
    replace_sp=${wo_trail// /-}
    datestamp=${replace_sp//:/-}
    
    new_file_name="${datestamp}_${filename}"
    rename=$(echo "$(dirname $f)/${new_file_name}")

    mv $f $rename
done
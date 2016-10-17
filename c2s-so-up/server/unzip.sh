#! /bin/sh
echo 'unzip the file'
file=$1
                                                                                                                                                                                                                                                             
echo 'filename':$file
cd /var/www/uploadfile

unzip -u $file
rm $file
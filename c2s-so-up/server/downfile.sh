#! /bin/sh
echo $1 ##path
echo $2 ##filename
echo $3 ##filepath

filepath='.'$3

echo $filepath

cd /var/www/uploadfiles

if [ ! -d $2 ];then
mkdir -p $filepath
fi

cd $filepath
echo $1
if [ ! -d $2 ];then
wget $1
fi
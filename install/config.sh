#!/bin/sh
set -e
#################################################################################################
############################################ Global variables ###################################
#################################################################################################

#
PRODUCTION=true

# For log output
readonly NORMAL="\\033[0;39m"
readonly GREEN="\\033[1;92m"
readonly RED="\\033[1;31m"
CURRENT_DATE=$(date "+%D %r")

# root UID
readonly ROOT_UID=0

# Apache configuration path
APACHE_CONFIG_DIRECTORY="/etc/apache2/sites-available"
APACHE_HTML_DIRECTORY="/var/www/html"
APACHE_SYSTEMD_DIRECTORY="/etc/systemd/system/apache2.service.d"

# php path
PHP_DIRECTORY=$(php --ini | head -n 1 | sed -E "s/.*Path: (.*)\/cli/\\1/")


# NextDom path
CONFIG_DIRECTORY="/etc/nextdom"
LIB_DIRECTORY="/var/lib/nextdom"
LOG_DIRECTORY="/var/log/nextdom"
TMP_DIRECTORY="/tmp"
LOG_FILE="install.log"

ROOT_DIRECTORY="/usr/share/nextdom"


### MySQL/MariaDB

MYSQL_HOSTNAME=
MYSQL_PORT=
MYSQL_ROOT_PASSWD=
MYSQL_NEXTDOM_DB=
MYSQL_NEXTDOM_USER=
MYSQL_NEXTDOM_PASSWD=


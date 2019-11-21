#!/bin/sh
set -e

source ./config.sh
source ./utils.sh


#################################################################################################
########################################### NextDom Steps #######################################
#################################################################################################

create_prerequisite_files_and_directories() {
    result=true

    local directories=("${ROOT_DIRECTORY}/plugins" "${LIB_DIRECTORY}" "${LIB_DIRECTORY}/market_cache"
    "${LIB_DIRECTORY}/cache" "${LIB_DIRECTORY}/backup" "${LIB_DIRECTORY}/custom/desktop" "${LIB_DIRECTORY}/public/css"
    "${LIB_DIRECTORY}/public/img/plan" "${LIB_DIRECTORY}/public/img/profils" "${LIB_DIRECTORY}/public/img/market_cache"
     "${LOG_DIRECTORY}/scenarioLog")
    for c_dir in ${directories[*]}; do
    createDirectory ${c_dir}
    done

    removeDirectoryOrFile "${LOG_DIRECTORY}/${LOG_FILE}"

    local files=("${LOG_DIRECTORY}/${LOG_FILE}" "${LOG_DIRECTORY}/cron" "${LOG_DIRECTORY}/cron_execution"
    "${LOG_DIRECTORY}/event" "${LOG_DIRECTORY}/http.error" "${LOG_DIRECTORY}/plugin" "${LOG_DIRECTORY}/scenario_execution")
    for c_file in ${files[*]}; do
    createFile ${c_file}
    done

    if [[ ! ${result} ]] ; then
        addLogSuccess "Files and directories are created with success"
    fi
}


configure_php() {
    result=true

    { //try
        removeDirectoryOrFile ${ROOT_DIRECTORY}/assets/config/default.config.ini
    } || { //catch
        addLogError "Error while removing default.config.ini file"
    }
    { //try
        removeDirectoryOrFile ${PHP_DIRECTORY}/apache2/conf.d/10-opcache.ini
    } || { //catch
        addLogError "Error while removing 10-opcache.ini file"
    }

    if [[ ${PRODUCTION} ]]; then
        addLogInfo "production mode"
        { //try
            cp -f ${ROOT_DIRECTORY}/assets/config/dist/default.config.ini.dist ${ROOT_DIRECTORY}/assets/config/default.config.ini
        } || { //catch
            addLogError "Error while copying default.config.ini file"
        }
        addLogInfo "enable PHP opcache"
        { //try
            cp -f ${ROOT_DIRECTORY}/assets/config/dist/opcache.ini.dist ${PHP_DIRECTORY}/apache2/conf.d/10-opcache.ini
        } || { //catch
            addLogError "Error while copying 10-opcache.ini file"
        }
    else
        addLogInfo "development mode"
        { //try
            cp -f ${ROOT_DIRECTORY}/assets/config/dist/default.config.ini.dev ${ROOT_DIRECTORY}/assets/config/default.config.ini
        } || { //catch
            addLogError "Error while copying default.config.ini file"
        }
        addLogInfo "disable PHP opcache"
        { //try
            cp -f ${ROOT_DIRECTORY}/assets/config/dist/opcache.ini.dev ${PHP_DIRECTORY}/apache2/conf.d/10-opcache.ini
        } || { //catch
            addLogError "Error while copying 10-opcache.ini file"
        }
    fi
    addLogInfo "restart Apache"
    { //try
        restartService apache2
    } || { //catch
        addLogError "Error while restarting apache2"
    }

    if [[ ! ${result} ]] ; then
        addLogSuccess "PHP is configured with success"
    fi
}

configure_file_permissions() {
    # configure file permissions
    # ${ROOT_DIRECTORY}/plugins and ${ROOT_DIRECTORY}/public/img should not be given
    # www-data ownership, still needed until proper migration handling
    result=true
    { //try
      local directories=("${LIB_DIRECTORY}" "${LOG_DIRECTORY}" "${TMP_DIRECTORY}" "${ROOT_DIRECTORY}/plugins" "${ROOT_DIRECTORY}/public/img")
      for c_dir in ${directories[*]}; do
        checkIfDirectoryExists ${c_dir}
        chown -R www-data:www-data ${c_dir}
        find ${c_dir} -type d -exec chmod 0755 {} \;
        find ${c_dir} -type f -exec chmod 0644 {} \;
        addLogInfo "set file owner: www-data, perms: 0755/0644 on directory ${c_dir}"
      done
    } || { //catch
        addLogError "Error while checking file permission"
    }

    if [[ ! ${result} ]] ; then
        addLogSuccess "Files permissions are configured with success"
    fi
}


configure_mysql_database() {
    # Debian package configuration...
    # nextdom-mysql preconfiguration
    result=true

    if [[ -f /etc/nextdom/mysql/secret ]] ; then
        source /etc/nextdom/mysql/secret
    fi
    MYSQL_NEXTDOM_PASSWD=${MYSQL_NEXTDOM_PASSWD:-$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 15)}
    MYSQL_HOSTNAME=${MYSQL_HOSTNAME:-localhost}
    MYSQL_PORT=${MYSQL_PORT:-3306}
    MYSQL_NEXTDOM_DB=${MYSQL_NEXTDOM_DB:-nextdom}
    MYSQL_NEXTDOM_USER=${MYSQL_NEXTDOM_USER:-nextdom}

    # All parameters
    MYSQL_OPTIONS=""
    if [[ -n "${MYSQL_ROOT_PASSWD}" ]]; then
      MYSQL_OPTIONS="${MYSQL_OPTIONS} -p${MYSQL_ROOT_PASSWD}"
    fi
    if [[ -n "${MYSQL_HOSTNAME}" ]]; then
      MYSQL_OPTIONS="${MYSQL_OPTIONS} -h${MYSQL_HOSTNAME}"
    fi
    if [[ -n "${MYSQL_PORT}" ]]; then
      MYSQL_OPTIONS="${MYSQL_OPTIONS} --port=${MYSQL_PORT}"
    fi

    { //try
        checkMySQLIsRunning ${MYSQL_OPTIONS}
    } || { //catch
        addLogError "MySQL/MariaDB is not running"
    }

    if [[ ! ${result} ]] ; then
        addLogSuccess "MySQL/MariaDB is configured with success"
    fi
}

configure_apache() {
  # These prerequistes are instaled by nextdom-common or nextdom-minimal package,
  # but this part is for other distribution compatibility
  result=true

  if [[ ! -d "${APACHE_CONFIG_DIRECTORY}" ]] ; then
      addLogError "apache is not installed"
  fi

  # check that APACHE_HTML_DIRECTORY is readable by www-data
  { //try
    sudo -u www-data test -r "${APACHE_HTML_DIRECTORY}"
   } || {
    addLogError "${APACHE_HTML_DIRECTORY} is not readable by www-data user"
    addLogError "enabled compatibility mode, DocumentRoot targets /var/www/html"
  }

  for c_file in nextdom.conf nextdom-ssl.conf nextdom-common; do
    if [[ ! -f ${APACHE_CONFIG_DIRECTORY}/${c_file} ]] ; then
        { //try
            cp "${ROOT_DIRECTORY}/install/apache/"/${c_file} ${APACHE_CONFIG_DIRECTORY}/${c_file} >> ${DEBUG} 2>&1
            sed -i -r "s%\s+Define\s+wwwdir\s.*%Define wwwdir \"${APACHE_HTML_DIRECTORY}\"%gI" ${APACHE_CONFIG_DIRECTORY}/${c_file} >> ${DEBUG} 2>&1
            sed -i -r "s%\s+Define\s+logdir\s.*%Define logdir \"${LOG_DIRECTORY}\"%gI" ${APACHE_CONFIG_DIRECTORY}/${c_file} >> ${DEBUG} 2>&1
            addLogInfo "created file: ${APACHE_CONFIG_DIRECTORY}/${c_file}"
        } || { //catch
            addLogError "Error while creating file: ${APACHE_CONFIG_DIRECTORY}/${c_file}"
        }
    fi
  done

  { //try
      # Configure private tmp
      if [[ ! -f "${APACHE_SYSTEMD_DIRECTORY}/privatetmp.conf" ]] ; then
          createDirectory ${APACHE_SYSTEMD_DIRECTORY}
          cp "${ROOT_DIRECTORY}/install/apache/"privatetmp.conf ${APACHE_SYSTEMD_DIRECTORY}/privatetmp.conf >> ${DEBUG} 2>&1
          addLogInfo "created file: ${APACHE_SYSTEMD_DIRECTORY}/privatetmp.conf"
      fi
  } || { //catch
      addLogError "Error while creating file: ${APACHE_SYSTEMD_DIRECTORY}/privatetmp.conf"
  }

  { //try
      # Windows hack (bash for windows)
      if [[ ! $(uname -r | grep -i microsoft) = "" ]] ; then
          bash ${APACHE_HTML_DIRECTORY}/install/OS_specific/windows/pre_inst.sh >> ${DEBUG} 2>&1
      fi
  } || { //catch
      addLogError "Error while hacking bash for windows"
  }

  # Certificat SSL auto signe
  if [[ ! -f ${CONFIG_DIRECTORY}/ssl/nextdom.crt ]] || [[ ! -f ${CONFIG_DIRECTORY}/ssl/nextdom.csr ]] || [[ ! -f ${CONFIG_DIRECTORY}/ssl/nextdom.key ]] ; then
      createDirectory ${CONFIG_DIRECTORY}/ssl/ >> ${DEBUG} 2>&1
      goToDirectory ${CONFIG_DIRECTORY}/ssl/ >> ${DEBUG} 2>&1
      { //try
            openssl genrsa -out nextdom.key 2048 >> ${DEBUG} 2>&1
            openssl req -new -key nextdom.key -out nextdom.csr -subj "/C=FR/ST=Paris/L=Paris/O=Global Security/OU=IT Department/CN=example.com" >> ${DEBUG} 2>&1
            openssl x509 -req -days 3650 -in nextdom.csr -signkey nextdom.key -out nextdom.crt >> ${DEBUG} 2>&1
            addLogInfo "created SSL self-signed certificates in /etc/nextdom/ssl/"
      } || { //catch
            addLogError "Error while creating SSL self-signed certificates in /etc/nextdom/ssl/"
      }
  fi

  { //try
    a2enmod ssl               >> ${DEBUG} 2>&1
    addLogInfo "apache: enable module ssl"
    a2enmod rewrite           >> ${DEBUG} 2>&1
    addLogInfo "apache: enable module rewrite"
    a2dismod status           >> ${DEBUG} 2>&1
    addLogInfo "apache: disable module status"
    a2dissite 000-default     >> ${DEBUG} 2>&1
    addLogInfo "apache: disabled site default"
    a2dissite default-ssl     >> ${DEBUG} 2>&1
    addLogInfo "apache: disabled site default-ssl"
    a2ensite nextdom-ssl      >> ${DEBUG} 2>&1
    addLogInfo "apache: enabled site nextdom-ssl"
    a2ensite nextdom          >> ${DEBUG} 2>&1
    addLogInfo "apache: enabled site nextdom"
    restartService apache2
  } || { //catch
    addLogError "Error while configuring Apache service"
  }
  if [[ ! ${result} ]] ; then
    addLogSuccess "Apache is configured with success"
  fi
}

step_nextdom_directory_layout() {
  # we delete existing config since it is regenerated from asset sample (step_nextdom_configuration)
  removeDirectoryOrFile ${LIB_DIRECTORY}/config
  cp -r  ${ROOT_DIRECTORY}/assets/config ${LIB_DIRECTORY}
  addLogInfo "created configuration directory ${LIB_DIRECTORY}/config"

  # we delete existing data, since its re-imported from assets
  removeDirectoryOrFile ${LIB_DIRECTORY}/data
  cp -r  ${ROOT_DIRECTORY}/assets/data   ${LIB_DIRECTORY}
  addLogInfo "created data directory ${LIB_DIRECTORY}/data"

  # jeedom backup compatibility: ./core/config is a symlink
  if [[ -L ${ROOT_DIRECTORY}/core/config ]]; then
      removeDirectoryOrFile ${ROOT_DIRECTORY}/core/config
  fi
  ln -s ${LIB_DIRECTORY}/config ${ROOT_DIRECTORY}/core/config
  addLogInfo "created core configuration symlink: ${ROOT_DIRECTORY}/core/config"

  # jeedom backup compatibility:  ./var is a symlink
  if [[ -L ${ROOT_DIRECTORY}/var ]]; then
      removeDirectoryOrFile ${ROOT_DIRECTORY}/var
  fi
  if [[ -d ${ROOT_DIRECTORY}/var ]]; then
      content=$(ls -A ${ROOT_DIRECTORY}/var)
      if [[ ! -z "${content}" ]]; then
          tmpvar=$(mktemp -d ${ROOT_DIRECTORY}/var.XXXXXXXX)
          mv ${ROOT_DIRECTORY}/var/* ${tmpvar}/
      fi
      removeDirectoryOrFile ${ROOT_DIRECTORY}/var
  fi
  ln -s ${LIB_DIRECTORY} ${ROOT_DIRECTORY}/var
  addLogInfo "created var symlink: ${ROOT_DIRECTORY}/var"

  # jeedom backup compatibility:  ./core/css is a symlink
  # -> some important plugins like widget are writing direclty to core/css/...
  #    and there fore need www-data write permission
  if [[ -L ${ROOT_DIRECTORY}/core/css ]]; then
      removeDirectoryOrFile ${ROOT_DIRECTORY}/core/css
  fi
  if [[ -d ${ROOT_DIRECTORY}/core/css ]]; then
      mv ${ROOT_DIRECTORY}/core/css/* ${LIB_DIRECTORY}/public/css/
      removeDirectoryOrFile ${ROOT_DIRECTORY}/core/css
  fi
  ln -s ${LIB_DIRECTORY}/public/css/ ${ROOT_DIRECTORY}/core/css
  addLogInfo "created core/css symlink: ${ROOT_DIRECTORY}/core/css"

  # jeedom javascript compatibility
  if [[ ! -e ${ROOT_DIRECTORY}/core/js ]]; then
      ln -s ${ROOT_DIRECTORY}/assets/js/core/ ${ROOT_DIRECTORY}/core/js
  fi
  addLogInfo "created core/js symlink: ${ROOT_DIRECTORY}/assets/js/core"

  # jeedom template location compatibility
  if [[ ! -e ${ROOT_DIRECTORY}/core/template ]]; then
      ln -s ${ROOT_DIRECTORY}/views/templates/ ${ROOT_DIRECTORY}/core/template
  fi
  addLogInfo "created core/template symlink: ${ROOT_DIRECTORY}/core/template"

  # jeedom backup compatibility:  ./data is a symlink
  if [[ -L ${ROOT_DIRECTORY}/data ]]; then
      removeDirectoryOrFile ${ROOT_DIRECTORY}/data
  fi
  if [[ -d ${ROOT_DIRECTORY}/data ]]; then
      content=$(ls -A ${ROOT_DIRECTORY}/data)
      if [[ ! -z "${content}" ]]; then
          tmpvar=$(mktemp -d ${ROOT_DIRECTORY}/data.XXXXXXXX)
          mv ${ROOT_DIRECTORY}/data/* ${tmpvar}/
      fi
      removeDirectoryOrFile ${ROOT_DIRECTORY}/data
  fi
  { //try
      if [[ -f ${ROOT_DIRECTORY}/data ]]; then
          removeDirectoryOrFile ${ROOT_DIRECTORY}/data
      fi
      if [[ ! -e ${ROOT_DIRECTORY}/data ]]; then
          ln -s ${LIB_DIRECTORY}/data ${ROOT_DIRECTORY}/data
      fi
      addLogInfo "created data symlink: ${ROOT_DIRECTORY}/data"
  } || { //catch
      addLogError "Error while linking ${ROOT_DIRECTORY}/data"
  }
  { //try
      # jeedom logs compatibility
      if [[ ! -f ${ROOT_DIRECTORY}/log ]]; then
        removeDirectoryOrFile ${ROOT_DIRECTORY}/log
      fi
      if [[ ! -e ${ROOT_DIRECTORY}/log ]]; then
          ln -s ${LOG_DIRECTORY} ${ROOT_DIRECTORY}/log
      fi
  } || { //catch
      addLogError "Error while linking ${LOG_DIRECTORY}"
  }
  { //try
      #clear cache
      sh ${ROOT_DIRECTORY}/scripts/clear_cache.sh
      addLogInfo "cache cleared"
  } || { //catch
      addLogError "Error while clearing cache"
  }
}

configure_nextdom() {
  result=true

  { //try
    # recreate configuration from sample
    cp ${ROOT_DIRECTORY}/core/config/common.config.sample.php ${ROOT_DIRECTORY}/core/config/common.config.php
  } || { //catch
    addLogError "Error while copying ${ROOT_DIRECTORY}/core/config/common.config.php"
  }
  { //try
      SECRET_KEY=$(</dev/urandom tr -dc '1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN_@;=' | head -c30; echo "")
      # Add a special char
      SECRET_KEY=$SECRET_KEY$(</dev/urandom tr -dc '*&!@#' | head -c1; echo "")
      # Add numeric char
      SECRET_KEY=$SECRET_KEY$(</dev/urandom tr -dc '1234567890' | head -c1; echo "")
  } || { //catch
    addLogError "Error while generating Secret key"
  }

  { //try
    sed -i "s/#PASSWORD#/${MYSQL_NEXTDOM_PASSWD}/g" ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s/#DBNAME#/${MYSQL_NEXTDOM_DB}/g"       ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s/#USERNAME#/${MYSQL_NEXTDOM_USER}/g"   ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s/#PORT#/${MYSQL_PORT}/g"               ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s/#HOST#/${MYSQL_HOSTNAME}/g"           ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s%#LOG_DIR#%${LOG_DIRECTORY}%g"         ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s%#LIB_DIR#%${LIB_DIRECTORY}%g"         ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s%#TMP_DIR#%${TMP_DIRECTORY}%g"         ${ROOT_DIRECTORY}/core/config/common.config.php
    sed -i "s%#SECRET_KEY#%${SECRET_KEY}%g"         ${ROOT_DIRECTORY}/core/config/common.config.php
    addLogInfo "wrote configuration file: ${ROOT_DIRECTORY}/core/config/common.config.php"
  } || { //catch
    addLogError "Error while writing in: ${ROOT_DIRECTORY}/core/config/common.config.php"
  }

  { //try
      # some other compatibilty ugly stuff
      if [[ -d "/tmp/jeedom" ]]; then
          if [[ -L "/tmp/jeedom" ]]; then
              removeDirectoryOrFile /tmp/jeedom
              if [[ ! -d "${TMP_DIRECTORY}" ]]; then
                  mkdir -p ${TMP_DIRECTORY} >> ${DEBUG} 2>&1
              fi
              ln -s ${TMP_DIRECTORY} /tmp/jeedom
          else
            if [[ -d "${TMP_DIRECTORY}" ]]; then
                mv /tmp/jeedom/* ${TMP_DIRECTORY}/
            else
              mv /tmp/jeedom ${TMP_DIRECTORY}
              ln -s ${TMP_DIRECTORY} /tmp/jeedom
            fi
          fi
      else
        if [[ ! -d "${TMP_DIRECTORY}" ]]; then
            mkdir -p ${TMP_DIRECTORY}
        fi
        removeDirectoryOrFile /tmp/jeedom
        ln -s ${TMP_DIRECTORY} /tmp/jeedom
      fi
      addLogInfo "created temporary directory: ${TMP_DIRECTORY}"
  } || { //catch
    addLogError "Error while creating tmp folders/links"
  }

  { //try
    # allow www-data to use usb/serial ports
    usermod -a -G dialout,tty www-data
  } || { ##catch
    addLogError "Error while setting rights for usb/serial ports to www-data user"
  }
  { //try
    # set tmp directory as ramfs mount point if enough memory is available
      if [[ -f "/proc/meminfo" ]] ; then
          if [[ $(cat /proc/meminfo | grep MemTotal | awk '{ print $2 }') -gt 600000 ]]; then
              if [[ -f "/etc/fstab" ]] ; then
                  if [[ $(cat /etc/fstab | grep ${TMP_DIRECTORY} | grep tmpfs | wc -l) -eq 0 ]]; then
                      cat - >> /etc/fstab <<EOS
tmpfs ${TMP_DIRECTORY} tmpfs defaults,size=128M 0 0
EOS
                  fi
              fi
          fi
      fi
      echo truc
  } || { //catch
    addLogError "Error while adding tmp directory as ramfs mount"
  }

  { //try
      # add www-data in sudoers with no password
      if [[ $(grep "www-data ALL=(ALL) NOPASSWD: ALL" /etc/sudoers | wc -l ) -eq 0 ]]; then
          echo "www-data ALL=(ALL) NOPASSWD: ALL" | (EDITOR="tee -a" visudo) >/dev/null
          if [[ $? -ne 0 ]]; then
              print_error "unable to add www-data to sudoers"
          fi
      fi
      addLogInfo "added user as sudoer: www-data"
  } || { //catch
    addLogError "Error while adding www-data as sudoer"
  }
  if [[ ! ${result} ]] ; then
    addLogSuccess "NextDom is configured with success"
  fi
}


configure_mysql() {
  # check that mysql is locally installed before any further configuration
  # default value for mysql_host is localhost
  result=true

  [[ "localhost" != "$HOSTNAME" ]] && {
    addLogInfo "Remote mysql server detected"
    return 0
  }

  { //try
      service mysql status 2>&1 >>${DEBUG}
      isService=$?
      if [[ ! -f /etc/init.d/mysql -o ${isService} -gt 0 ]]; then
        addLogInfo "no mysql service locally"
        return 0
      fi
  } || { //catch
    addLogError "Error while checking mysql status"
  }

  stopService mysql

  { //try
    rm -f /var/lib/mysql/ib_logfile*
  } || { //catch
    addLogError "Error while cleaning mysql data"
  }

  { //try
      if [ -d /etc/mysql/conf.d ]; then
          cat - > /etc/mysql/conf.d/nextdom_my.cnf <<EOS
[mysqld]
skip-name-resolve
key_buffer_size = 16M
thread_cache_size = 16
tmp_table_size = 48M
max_heap_table_size = 48M
query_cache_type =1
query_cache_size = 32M
query_cache_limit = 2M
query_cache_min_res_unit=3K
innodb_flush_method = O_DIRECT
innodb_flush_log_at_trx_commit = 2
innodb_log_file_size = 32M
EOS
      fi
      addLogInfo "created nextdom mysql configuration: /etc/mysql/conf.d/nextdom_my.cnf"
  } || { //catch
    addLogError "Error while creating /etc/mysql/conf.d/nextdom_my.cnf"
  }

  startService mysql

  if [[ ! ${result} ]] ; then
    addLogSuccess "MySQL is configured with success"
  fi
}

configure_crontab() {
  result=true
  { //try
    cat - > /etc/cron.d/nextdom << EOS
* * * * * www-data /usr/bin/php ${WEBSERVER_HOME}/src/Api/start_cron.php >> /dev/null
EOS
    addLogInfo "created nextdom cron configuration: /etc/cron.d/nextdom"
  } || { //catch
    addLogError "Error while creating /etc/cron.d/nextdom"
  }
  {
    cat - > /etc/cron.d/nextdom_watchdog << EOS
*/5 * * * * root /usr/bin/php ${WEBSERVER_HOME}/scripts/watchdog.php >> /dev/null
EOS
    addLogInfo "created nextdom cron configuration: /etc/cron.d/nextdom_watchdog"
  } || { //catch
    addLogError "Error while creating /etc/cron.d/nextdom_watchdog"
  }

  reloadService cron

  if [[ ! ${result} ]] ; then
    addLogSuccess "Cron is configured with success"
  fi
}

generate_nextdom_assets() {
  # Generate CSS files
  if [[ ! ${PRODUCTION} ]]; then
      # A faire dans une version developpeur (apres git clone)
      cd ${ROOT_DIRECTORY}
      ./scripts/gen_global.sh >> ${DEBUG} 2>&1 || {
        addLogError "error during asset generation"
      }
      addLogInfo "installed nodejs"
      addLogInfo "installed composer manager"
      addLogInfo "installed project dependencies"
      addLogInfo "copied icons, themes and images from assets"
      addLogInfo "generated css files"
      addLogInfo "generated javascript files"
  fi
}
check_nextdom() {
  result=true
  { //try
    php ${WEBSERVER_HOME}/scripts/sick.php >> ${DEBUG} 2>&1
  } || { //catch
    addLogError "Error while checking nextdom"
  }
  if [[ ! ${result} ]] ; then
    addLogSuccess "Check is done with success"
  fi
}

specific_action_for_OS(){
  result=true
  { //try
      if [[ -f /etc/armbian.txt ]]; then
          cat ${WEBSERVER_HOME}/install/OS_specific/armbian/post-install.sh | bash >> ${DEBUG} 2>&1
      fi
  } || { //catch
    addLogError "Error while specific action for armbian"
  }

  { //try
      if [[ -f /usr/bin/raspi-config ]]; then
          cat ${WEBSERVER_HOME}/install/OS_specific/rpi/post-install.sh | bash >> ${DEBUG} 2>&1
      fi
  } || { //catch
    addLogError "Error while specific action for raspberry pi"
  }
  if [[ ! ${result} ]] ; then
    addLogSuccess "OS specific actions are done with success"
  fi
}


step_nextdom_var_www_html() {
  # Link ${ROOT_DIRECTORY} to /var/www/html. Required by old plugins that may hardcode this path.
  # Any previously installed content are moved to temporairy directories in check_var_www_html()
  # (useless for docker since this directory is empty)
  result=true

  if [[ "${ROOT_DIRECTORY}" == "${APACHE_HTML_DIRECTORY}" ]] ; then
      return 0
  fi

  { //try
      # moving any content of /var/www/html to /var/www/html.XXXXXXXX
      if [[ -d "${APACHE_HTML_DIRECTORY}" ]] ; then
          count="$( find ${APACHE_HTML_DIRECTORY} -mindepth 1 -maxdepth 1 | wc -l )"
          if [[ $count -gt 0 ]] ; then
              tmpd="$(mktemp -d -u ${APACHE_HTML_DIRECTORY}.XXXXXXXX)"
              mv "${APACHE_HTML_DIRECTORY}" "${tmpd}"
              addLogInfo "warning : directory ${APACHE_HTML_DIRECTORY} isn't empty, renamed to ${tmpd}"
          fi
      fi
  } || { //catch
      addLogError "Error while moving any content of ${APACHE_HTML_DIRECTORY} to ${APACHE_HTML_DIRECTORY}.XXXXXXXX"
  }
  { //try
      # rename any pre-exiting link
      if [[ -L "${APACHE_HTML_DIRECTORY}" ]] ; then
          dest=$(readlink "${APACHE_HTML_DIRECTORY}")
          if [[ "${dest}" == "${ROOT_DIRECTORY}" ]]; then
              rm -f "${APACHE_HTML_DIRECTORY}"
          else
              tfile="$(mktemp -u ${APACHE_HTML_DIRECTORY}.XXXXXXXX)"
              cd /var/www/
              mv "${APACHE_HTML_DIRECTORY}" "${tfile}"
              addLogInfo "warning : directory ${APACHE_HTML_DIRECTORY} is a link, renamed it ${tfile}"
          fi
      fi
  } || { //catch
      addLogError "Error while renaming ${APACHE_HTML_DIRECTORY} to ${APACHE_HTML_DIRECTORY}.XXXXXXXX"
  }
  { //try
      # strange but why not
      if [[ -f "${APACHE_HTML_DIRECTORY}" ]] ; then
          tfile=$(mktemp -u ${APACHE_HTML_DIRECTORY}.XXXXXXXX)
          mv "${APACHE_HTML_DIRECTORY}" "${tfile}"
          addLogInfo "warning : ${APACHE_HTML_DIRECTORY} is a file, renamed it ${tfile}"
      fi
  } || { //catch
      addLogError "Error while moving ${APACHE_HTML_DIRECTORY} to ${APACHE_HTML_DIRECTORY}.XXXXXXXX"
  }
  # link /var/www/html to nextdom root
  { //try
        ln -s "${ROOT_DIRECTORY}" ${APACHE_HTML_DIRECTORY}
  } || { //catch
        addLogError "Error while linking ${ROOT_DIRECTORY} to ${APACHE_HTML_DIRECTORY}"
  }

  if [[ ! ${result} ]] ; then
    addLogSuccess "${ROOT_DIRECTORY} linked with success to ${APACHE_HTML_DIRECTORY}"
  fi
}

change_owner_for_nextdom_directories() {
result=true
  { //try
    chown -R www-data:www-data "${ROOT_DIRECTORY}"
  } || { //catch
    addLogError "Error while changing owner on ${ROOT_DIRECTORY}"
  }
  { //try
    if [[ -d "${TMP_DIRECOTRY}" ]]; then
     chown -R www-data:www-data "${TMP_DIRECOTRY}"
    fi
  } || { //catch
    addLogError "Error while changing owner on ${TMP_DIRECTORY}"
  }

  if [[ ! ${result} ]] ; then
    addLogSuccess "${ROOT_DIRECTORY} and ${TMP_DIRECTORY} owner is changed with success"
  fi
}

generate_mysql_structure() {
  result=true
  CONSTRAINT="%";
  if [[ ${MYSQL_HOSTNAME} == "localhost" ]]; then
      CONSTRAINT='localhost';
  fi
  { //try
      QUERY="DROP USER IF EXISTS '${MYSQL_NEXTDOM_USER}'@'${CONSTRAINT}';"
      mysql -uroot -h${MYSQL_HOSTNAME} ${HOSTPASS} -e "${QUERY}" >> ${DEBUG} 2>&1
      addLogInfo "deleted mysql user: ${MYSQL_NEXTDOM_USER}"
  } || { //catch
    addLogError "Error while deleting user : ${MYSQL_NEXTDOM_USER}"
  }
  { //try
      QUERY="CREATE USER '${MYSQL_NEXTDOM_USER}'@'${CONSTRAINT}' IDENTIFIED BY '${MYSQL_NEXTDOM_PASSWD}';"
      mysql -uroot -h${MYSQL_HOSTNAME} ${HOSTPASS} -e "${QUERY}" >> ${DEBUG} 2>&1
      addLogInfo "created mysql user: ${MYSQL_NEXTDOM_USER}"
  } || { //catch
    addLogError "Error while creating user : ${MYSQL_NEXTDOM_USER}"
  }
  { //try
      QUERY="DROP DATABASE IF EXISTS ${MYSQL_NEXTDOM_DB};"
      mysql -uroot -h${MYSQL_HOSTNAME} ${HOSTPASS} -e "${QUERY}" >> ${DEBUG} 2>&1
      addLogInfo "deleted mysql table: ${MYSQL_NEXTDOM_DB}"
  } || { //catch
    addLogError "Error while deleting table : ${MYSQL_NEXTDOM_DB}"
  }
  { //try
      QUERY="CREATE DATABASE ${MYSQL_NEXTDOM_DB};"
      mysql -uroot -h${MYSQL_HOSTNAME} ${HOSTPASS} -e "${QUERY}" >> ${DEBUG} 2>&1
      addLogInfo "created mysql table: ${MYSQL_NEXTDOM_DB}"
  } || { //catch
    addLogError "Error while creating table : ${MYSQL_NEXTDOM_DB}"
  }
  { //try
      QUERY="GRANT ALL PRIVILEGES ON ${MYSQL_NEXTDOM_DB}.* TO '${MYSQL_NEXTDOM_USER}'@'${CONSTRAINT}';"
      mysql -uroot -h${MYSQL_HOSTNAME} ${HOSTPASS} -e "${QUERY}" >> ${DEBUG} 2>&1
  } || { //catch
    addLogError "Error while granting privileges on : ${MYSQL_NEXTDOM_DB}"
  }
  { //try
      QUERY="FLUSH PRIVILEGES;"
      mysql -uroot -h${MYSQL_HOSTNAME} ${HOSTPASS} -e "${QUERY}" >> ${DEBUG} 2>&1
      addLogInfo "configured table privileges: ${MYSQL_NEXTDOM_DB}"
  } || { //catch
    addLogError "Error while flushing privileges"
  }
  { //try
    php ${ROOT_DIRECTORY}/install/install.php mode=force >> ${DEBUG} 2>&1
  } || { //catch
    addLogError "NextDom installation script failed"
  }

  if [[ ! ${result} ]] ; then
    addLogSuccess "Database structure generated with success"
  fi
}

#################################################################################################
############################################# Installation ######################################
#################################################################################################

checkIfDirectoryExists ${LOG_DIRECTORY}
addLogError "Test d\'une eerroor"

addLogInfo "Test d\'une info, ca doit être intéressant"
addLogSuccess "Tout va bien"
goToDirectory ${ROOT_DIRECTORY}

exit 0;
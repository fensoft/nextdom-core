<?php
require_once __DIR__ . '/../../core/php/core.inc.php';
echo 'Add NextDom watchdog';
$cdir = __DIR__;
if (!file_exists('/etc/cron.d/nextdom_watchdog')) {
    file_put_contents('/tmp/nextdom_watchdog', '* * * * * root /usr/bin/php ' . $cdir . '/../../core/php/watchdog.php >> /dev/null' . "\n");
    exec('sudo mv /tmp/nextdom_watchdog /etc/cron.d/nextdom_watchdog;sudo chown root:root /etc/cron.d/nextdom_watchdog');
}
if (file_exists('/etc/cron.d/nextdom_watchdog')) {
    echo " OK\n";
} else {
    echo " NOK\n";
}
if (file_exists('/media/boot/multiboot/meson64_odroidc2.dtb.linux')) {
    echo 'Remove deb-multimedia repository';
    exec('sudo rm -rf /etc/apt/sources.list.d/deb-multimedia.list');
    echo " OK\n";
    echo 'Update APT sources\n';
    exec('sudo apt-get update');
}
if (config::byKey('core::branch') == 'beta') {
    config::save('core::branch', 'master', 'core');
}
?>

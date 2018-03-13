<?php
require_once( dirname(__FILE__)."/../../php/util.php" );

$theSettings->registerPlugin("whatbox-helpers");

$XDG_CONFIG_DIR = '/config/'.posix_getpwuid(posix_geteuid())['name'];

// rutorrent can't load if the $XDG_CONFIG_DIR is unreadable, so we can't provide a nice error for that case

if (!is_readable($XDG_CONFIG_DIR.'/rtorrent/socket')) {
    $jResult .= "noty('whatbox: Cannot read rtorrent socket','error');";
}


if (is_dir($XDG_CONFIG_DIR.'/rutorrent/webui')) {
    $jResult .= "noty('whatbox: Using a user customized version of ruTorrent, automatic updates will not be applied.','alert');";
}


if (!is_dir(getUploadsPath())) {
    $jResult .= "noty('whatbox: Upload directory \"".getUploadsPath()."\" does not exist.','error');";
}

// We don't actually need to be able to read this, so only run these checks if we can
if (!file_exists($XDG_CONFIG_DIR.'/rtorrent/rtorrent.rc')) {
    $jResult .= "noty('whatbox: ".$XDG_CONFIG_DIR."/.config/rtorrent/rtorrent.rc does not exist.','alert');";
} elseif (filesize($XDG_CONFIG_DIR.'/rtorrent/rtorrent.rc') === 0) {
    $jResult .= "noty('whatbox: ".$XDG_CONFIG_DIR."/.config/rtorrent/rtorrent.rc is empty.','alert');";
}


if (!is_dir(rTorrentSettings::get()->directory)) {
    $jResult .= "noty('whatbox: rTorrents Download directory \"".rTorrentSettings::get()->directory."\" doesn\\'t exist.','error');";
}

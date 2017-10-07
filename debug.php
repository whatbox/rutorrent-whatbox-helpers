<?php
require('../../php/util.php');
require_once( '../../php/settings.php' );

header('Content-type: text/plain');
?>
ruTorrent Facts
---------------
Running User: <?=posix_getpwuid(posix_geteuid())['name']?>  
User: <?=getUser()?>  
Settings: <?=getSettingsPath()?>  
SCGI Port: <?=$scgi_port?>  
SCGI Host: <?=$scgi_host?>  
Local Mode: <?=(isLocalMode()?'true':'false')?>  

rTorrent Facts
--------------
Download directory: <?=rTorrentSettings::get()->directory?>  
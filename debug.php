<?php
require('../../php/util.php');
require_once( '../../php/settings.php' );

header('Content-type: text/plain');
?>
PHP Facts
---------
Version: <?=phpversion()?>  

ruTorrent Facts
---------------
Running User: <?=posix_getpwuid(posix_geteuid())['name']?>  
User: <?=getUser()?>  
Settings: <?=getSettingsPath()?>  
SCGI Port: <?=$scgi_port?>  
SCGI Host: <?=$scgi_host?>  
Local Mode: <?=(isLocalMode() ? 'true' : 'false')?>  
Diagnostic Mode: <?=($do_diagnostic ? 'true' : 'false')?>  

rTorrent Facts
--------------
Download directory: <?=rTorrentSettings::get()->directory?>  

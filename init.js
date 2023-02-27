/* eslint-env jquery */
/* global plugin, theWebUI, theContextMenu, askYesNo, noty */
plugin.loadMainCSS();

// Modify the default settings, but
// still respect user customization
theWebUI.addSettings({
	// The labelsize option causes issues
	// for users with high torrent counts
	// and can still be enabled manually
	'webui.show_labelsize': 0,

	// Timeouts generally occur when rtorrent
	// is busy. Yet if we tell the user that a
	// timeout has occurred, they're more likely
	// to hit the refresh button, overloading
	// rTorrent further.
	'webui.ignore_timeouts': 1,
});

// Disable pushbullet column by default, but
// still respect a users choice to enable it
theWebUI.tables.trt.columns.origPush = theWebUI.tables.trt.columns.push;
theWebUI.tables.trt.columns.push = function (values) {
	if (values.id === 'pushbullet') {
		values.enabled = false;
	}
	return this.origPush(values);
};

theWebUI.restartDaemon = function(){
	$.ajax({
		type: 'POST',
		timeout: theWebUI.settings['webui.reqtimeout'],
		async: true,
		cache: false,
		url: '/api/restart',
		data: {'app': 'rtorrent'},
		dataType : 'json'
	}).done(function(){
		location.reload();
	});
};

theWebUI.checkDaemon = function(){
	$.ajax({
		type: 'GET',
		timeout: theWebUI.settings['webui.reqtimeout'],
		async : true,
		cache: false,
		url : '/api/rtorrent_status',
		dataType : 'json'
	}).done(function(json){
		if (json.client_running === false) {
			askYesNo('Restart rtorrent', 'Your rtorrent daemon appears to be offline. Would you like us to start it for you?', 'theWebUI.restartDaemon()');
		}
	});
};

theWebUI.checkDownloadLimit = function(){
	$.ajax({
		type: 'GET',
		timeout: theWebUI.settings['webui.reqtimeout'],
		async : true,
		cache: false,
		url : '/api/download_limit',
		dataType : 'json'
	}).done(function(json){
		if (json !== 0) {
			noty('whatbox: Your download speed has been throttled because you are over your storage allocation.', 'alert');
		}
	});
};

plugin.init = function() {
	if(this.enabled) {
		this.addButtonToToolbar('logoff','Logout','window.location = \'/logout\';','logoff');
		theWebUI.showBunnyMenu = function() {
			theContextMenu.clear();
			theContextMenu.add(['HTTP Listing', 'window.open(\'/private\',\'_blank\');']);
			theContextMenu.add(['Labs', 'window.open(\'/labs\',\'_blank\');']);
			theContextMenu.add(['Manage', 'window.open(\'https://whatbox.ca/manage\',\'_blank\');']);
			theContextMenu.add(['Renew', 'window.open(\'https://whatbox.ca/manage/payments\',\'_blank\');']);

			var offs = $('#bunnybutton').offset();
			theContextMenu.show(offs.left-5,offs.top+5+$('#plugins').height());
		};
		this.addButtonToToolbar('bunnybutton','Whatbox...','theWebUI.showBunnyMenu()','bunnybutton');
		this.addSeparatorToToolbar('bunnybutton');

		theWebUI.checkDaemon();
		theWebUI.checkDownloadLimit();

		// Every 20 minutes do an API no-op so the server knows the session is still active
		// Server only records activity every 15 minutes, so we want to be above that
		// Normally this would be handled by the disk_usage checks, but we disable
		// those to save battery life when a tab is in the background
		fetch('/api/noop', {
			credentials: 'include',
		});
		setInterval(function () {
			fetch('/api/noop', {
				credentials: 'include',
			});
		}, 1200000);
	}
};

plugin.onRemove = function() {
	this.removeButtonFromToolbar('logoff');
	this.removeButtonFromToolbar('bunnybutton');
};

plugin.init();


$(document).ajaxComplete(function(e, jqXHR){
	// https://github.com/jquery/jquery/issues/4339
	if (jqXHR.getResponseHeader('X-Whatbox') === 'login'){
		window.location = '/login';
	}
});

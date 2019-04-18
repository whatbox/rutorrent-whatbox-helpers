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

theWebUI.restartDaemon = function(){
	$.ajax({
		type: "POST",
		timeout: theWebUI.settings["webui.reqtimeout"],
		async : true,
		cache: false,
		url : "/api/rtorrent_restart",
		dataType : "json"
	}).done(function(){
		location.reload();
	});
};

theWebUI.checkDaemon = function(){
	$.ajax({
		type: "GET",
		timeout: theWebUI.settings["webui.reqtimeout"],
		async : true,
		cache: false,
		url : "/api/rtorrent_status",
		dataType : "json"
	}).done(function(json){
		if (json.client_running === false) {
			askYesNo("Restart rtorrent", "Your rtorrent daemon appears to be offline. Would you like us to start it for you?", "theWebUI.restartDaemon()");
		}
	});
}

theWebUI.checkDownloadLimit = function(){
	$.ajax({
		type: "GET",
		timeout: theWebUI.settings["webui.reqtimeout"],
		async : true,
		cache: false,
		url : "/api/download_limit",
		dataType : "json"
	}).done(function(json){
		if (json !== 0) {
			noty("whatbox: Your download speed has been throttled because you are over your storage allocation.", 'alert');
		}
	});
}

plugin.init = function() {
	if(this.enabled) {
		this.addButtonToToolbar("logoff","Logout","window.location = '/logout';","logoff");
		theWebUI.showBunnyMenu = function() {
			theContextMenu.clear();
			theContextMenu.add(["HTTP Listing", "window.open('/private','_blank');"]);
			theContextMenu.add(["Labs", "window.open('/labs','_blank');"]);
			theContextMenu.add(["Manage", "window.open('https://whatbox.ca/manage','_blank');"]);
			theContextMenu.add(["Renew", "window.open('https://whatbox.ca/manage/payments','_blank');"]);

			var offs = $("#bunnybutton").offset();
			theContextMenu.show(offs.left-5,offs.top+5+$("#plugins").height());
		};
		this.addButtonToToolbar("bunnybutton","Whatbox...","theWebUI.showBunnyMenu()","bunnybutton");
		this.addSeparatorToToolbar("bunnybutton");

		theWebUI.checkDaemon();
		theWebUI.checkDownloadLimit();
	}
};

plugin.onRemove = function() {
	this.removeButtonFromToolbar("logoff");
	this.removeButtonFromToolbar("bunnybutton");
};

plugin.init();


$(document).ajaxComplete(function(e, xhr, opts){
	if (typeof xhr.responseURL !== 'undefined') console.log(xhr.responseURL);
	if (xhr.getResponseHeader('X-Whatbox') === 'logout'){
		window.location = '/login';
	}
});

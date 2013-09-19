var irc 	= require('irc'),
	http 	= require('http'),
	url 	= require('url'),
	nconf 	= require('nconf'),
	fs    	= require('fs') ;
	
	
nconf.file({ file: 'config.js' }) ;
var client = new irc.Client(nconf.get('irc_server'), nconf.get('irc_nick')) ;


http.createServer(function (req, res) {
	req.setEncoding("utf8");
    req.content = '';

    var url_parts = url.parse(req.url),
		queryData = url.parse(req.url, true).query ;
        
    switch(url_parts.pathname) {
    	case '/commit':
			req.addListener("data", function(chunk) {
            	req.content += chunk;
            });

            req.addListener("end", function() {
            	var data = JSON.parse(req.content) ;
				console.log(data) ;
                client.join('#' + queryData.channel ) ;
				
				var reponame = data.repository.url.split(":").pop().replace(".git", "") ;
				var branch   = data.ref.split("/").pop() ;

                client.say('#' + queryData.channel, "["+ reponame +"#"+branch+"] "  + data.commits.length + " new commits by '" + data.user_name ) ;
                var commit_messages = data.commits.map( function(commit) {
					client.say('#' + queryData.channel, "- '" + commit.message + "' - url: " + commit.url ) ;
                }) ;
                
				client.part('#'+queryData.channel) ;
                
				res.writeHead(202, {}) ;
                res.write('ok') ;
                res.end() ;
			});
			break;
            
			default:
            	display_404(url_parts.pathname, req, res);
        }
        return;


        function display_404(url, req, res) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.write("<h1>404 Not Found</h1>");
                res.end("The page you were looking for: "+url+" can not be found");
         }


}).listen(nconf.get('http_port')) ;

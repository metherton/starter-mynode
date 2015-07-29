var Twilio=function(){var g=function(){function a(d,a){d=d||[];this.object=a||null;this.queue=[];for(var c=0;c<d.length;c++)this.addCommand(d[c])}a.prototype.run=function(d){for(var a=0;a<this.queue.length;a++){var c=this.queue[a],b=d[c.name].apply(d,c.args);c.proxy&&c.proxy.run(b)}this.object=d;this.queue=[]};a.prototype.addCommand=function(a,b){var c=this;this[a]=function(){if(c.object)return c.object[a].apply(c.object,arguments);var e=b?b():null;c.queue.push({name:a,args:arguments,proxy:e});return e}};
return a}(),f=new g("setup disconnectAll disconnect presence status ready error offline incoming destroy cancel showPermissionsDialog".split(" "));f.addCommand("status",function(){return"offline"});f.addCommand("connect",function(){var a=new g("accept disconnect error mute unmute sendDigits".split(" "));a.addCommand("status",function(){return"pending"});return a});var k=new g("setup incoming ready offline sms call twiml error".split(" ")),b=function(){for(var a=document.createElement("a"),d=document.getElementsByTagName("script"),
b=0;b<d.length;b++)if(a.href=d[b].src,/(twilio\.js)|(twilio\.min\.js)$/.test(a.pathname))return{host:a.host,minified:/\.min\.js$/.test(a.pathname)}}(),h=b.minified?"/twilio.min.js":"/twilio.js",l=document.getElementsByTagName("script")[0],e=document.createElement("script");e.type="text/javascript";e.src="//"+b.host+"/libs/twiliojs/refs/3716fe1"+h;e.onload=e.onreadystatechange=function(){e.readyState&&"loaded"!=e.readyState||(f.run(Twilio.Device),k.run(Twilio.EventStream))};l.parentNode.insertBefore(e,
l);b="function"===typeof Object.create?function(a){return Object.create(a)}:function(a){function b(){}b.prototype=a;return new b};h=eval("(function(){function Loader(){};return Loader})()");b=b(h.prototype);b.Device=f;b.EventStream=k;return b}();

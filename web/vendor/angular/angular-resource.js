/*
 AngularJS v1.4.5
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(I,c,B){'use strict';function D(s,e){e=e||{};c.forEach(e,function(c,k){delete e[k]});for(var k in s)!s.hasOwnProperty(k)||"$"===k.charAt(0)&&"$"===k.charAt(1)||(e[k]=s[k]);return e}var x=c.$$minErr("$resource"),C=/^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;c.module("ngResource",["ng"]).provider("$resource",function(){var s=/^https?:\/\/[^\/]*/,e=this;this.defaults={stripTrailingSlashes:!0,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}}};
this.$get=["$http","$q",function(k,F){function v(c,h){this.template=c;this.defaults=r({},e.defaults,h);this.urlParams={}}function y(l,h,p,f){function d(b,q){var d={};q=r({},h,q);t(q,function(a,q){w(a)&&(a=a());var m;if(a&&a.charAt&&"@"==a.charAt(0)){m=b;var c=a.substr(1);if(null==c||""===c||"hasOwnProperty"===c||!C.test("."+c))throw x("badmember",c);for(var c=c.split("."),g=0,h=c.length;g<h&&m!==B;g++){var e=c[g];m=null!==m?m[e]:B}}else m=a;d[q]=m});return d}function G(b){return b.resource}function g(b){D(b||
{},this)}var s=new v(l,f);p=r({},e.defaults.actions,p);g.prototype.toJSON=function(){var b=r({},this);delete b.$promise;delete b.$resolved;return b};t(p,function(b,q){var h=/^(POST|PUT|PATCH)$/i.test(b.method);g[q]=function(a,z,m,e){var f={},l,p,A;switch(arguments.length){case 4:A=e,p=m;case 3:case 2:if(w(z)){if(w(a)){p=a;A=z;break}p=z;A=m}else{f=a;l=z;p=m;break}case 1:w(a)?p=a:h?l=a:f=a;break;case 0:break;default:throw x("badargs",arguments.length);}var v=this instanceof g,n=v?l:b.isArray?[]:new g(l),
u={},y=b.interceptor&&b.interceptor.response||G,C=b.interceptor&&b.interceptor.responseError||B;t(b,function(b,a){"params"!=a&&"isArray"!=a&&"interceptor"!=a&&(u[a]=H(b))});h&&(u.data=l);s.setUrlParams(u,r({},d(l,b.params||{}),f),b.url);f=k(u).then(function(a){var d=a.data,m=n.$promise;if(d){if(c.isArray(d)!==!!b.isArray)throw x("badcfg",q,b.isArray?"array":"object",c.isArray(d)?"array":"object",u.method,u.url);b.isArray?(n.length=0,t(d,function(a){"object"===typeof a?n.push(new g(a)):n.push(a)})):
(D(d,n),n.$promise=m)}n.$resolved=!0;a.resource=n;return a},function(a){n.$resolved=!0;(A||E)(a);return F.reject(a)});f=f.then(function(a){var b=y(a);(p||E)(b,a.headers);return b},C);return v?f:(n.$promise=f,n.$resolved=!1,n)};g.prototype["$"+q]=function(a,b,d){w(a)&&(d=b,b=a,a={});a=g[q].call(this,a,this,b,d);return a.$promise||a}});g.bind=function(b){return y(l,r({},h,b),p)};return g}var E=c.noop,t=c.forEach,r=c.extend,H=c.copy,w=c.isFunction;v.prototype={setUrlParams:function(l,h,e){var f=this,
d=e||f.template,k,g,r="",b=f.urlParams={};t(d.split(/\W/),function(c){if("hasOwnProperty"===c)throw x("badname");!/^\d+$/.test(c)&&c&&(new RegExp("(^|[^\\\\]):"+c+"(\\W|$)")).test(d)&&(b[c]=!0)});d=d.replace(/\\:/g,":");d=d.replace(s,function(b){r=b;return""});h=h||{};t(f.urlParams,function(b,e){k=h.hasOwnProperty(e)?h[e]:f.defaults[e];c.isDefined(k)&&null!==k?(g=encodeURIComponent(k).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"%20").replace(/%26/gi,
"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),d=d.replace(new RegExp(":"+e+"(\\W|$)","g"),function(a,b){return g+b})):d=d.replace(new RegExp("(/?):"+e+"(\\W|$)","g"),function(a,b,c){return"/"==c.charAt(0)?c:b+c})});f.defaults.stripTrailingSlashes&&(d=d.replace(/\/+$/,"")||"/");d=d.replace(/\/\.(?=\w+($|\?))/,".");l.url=r+d.replace(/\/\\\./,"/.");t(h,function(b,c){f.urlParams[c]||(l.params=l.params||{},l.params[c]=b)})}};return y}]})})(window,window.angular);
//# sourceMappingURL=angular-resource.map
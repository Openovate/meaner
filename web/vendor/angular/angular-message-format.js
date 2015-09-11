/*
 AngularJS v1.4.5
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(h){'use strict';function C(a){if(null==a)return"";switch(typeof a){case "string":return a;case "number":return""+a;default:return D(a)}}function f(a,b){for(var d=a.split(/\n/g),k=0;k<d.length;k++){var c=d[k];if(b>=c.length)b-=c.length;else return{h:k+1,f:b+1}}}function t(a){function b(){return a}var d=u[a];if(null!=d)return d;b.$$watchDelegate=function(b,d,c){var e=b.$watch(v,function(){m(d)&&d.call(null,a,a,b);e()},c);return e};u[a]=b;b.exp=a;b.expressions=[];return b}function F(a,b){function d(a){return void 0==
a?a:a-b}function c(b){return d(a(b))}if(0===b)return a;var e;c.$$watchDelegate=function(b,c,k){return e=b.$watch(a,function(a,k){m(c)&&c.call(null,d(a),d(k),b)},k)};return c}function l(a,b){var d=this;this.b=a;this.e=b;if(void 0===b.other)throw e("reqother");this.d=function(a){return d.D(a)};this.d.$$watchDelegate=function(a,b,c){return d.P(a,b,c)};this.d.exp=a.exp;this.d.expressions=a.expressions}function n(a,b,d,c){var e=this;this.scope=b;this.oa=a;this.v=d;this.qa=c;this.U=void 0;this.K=v;this.ka=
b.$watch(a.b,function(a){return e.ja(a)},c)}function p(a,b){l.call(this,a,b)}function w(){}function q(a,b,d,c){l.call(this,a,b);this.offset=d;this.M=c}function x(){}function g(a,b){this.u=a;this.B=b;this.i=[];this.g=[];this.J=[];this.s="";this.q=null}function r(a,b,d){this.c=a;this.scope=b;this.W=void 0;this.v=d;var c=this;this.la=b.$watchGroup(a.g,function(a,b){c.Ea(a,b)})}function s(a,b){b.b=a.b;b.C=a.C;b.w=a.w;b.e=a.e;b.k=a.k;b.c=a.c;b.n=a.n;b.F=a.F;b.l=a.l}function y(a){s(a,this)}function c(a,
b,d,c,e,E,f,g){this.text=a;this.index=b||0;this.A=d;this.M=c;this.Da=e;this.pa=!!E;this.u=f;this.B=!!g;this.F=this.c=this.k=this.e=this.w=this.C=this.b=null;this.L=[];this.G=this.j=this.ca=this.O=this.da=this.l=this.n=this.o=this.a=this.d=null}function z(a){switch(a){case "{":return"}";case "[":return"]";case "(":return")";default:return null}}function G(a){switch(a){case "}":return"{";case "]":return"[";case ")":return"(";default:return null}}var e=h.angular.$interpolateMinErr,v=h.angular.noop,m=
h.angular.isFunction,D=h.angular.toJson,u=Object.create(null);l.prototype.T=function(a){return this.e[this.R(a)]};l.prototype.D=function(a){return this.T(this.b(a))(a)};l.prototype.P=function(a,b,d){var c=new n(this,a,b,d);return function(){c.I()}};n.prototype.ja=function(a){var b=this;this.K();a=this.oa.T(a);this.K=this.scope.$watch(a,function(a,c){return b.na(a,c)},this.qa)};n.prototype.na=function(a,b){m(this.v)&&this.v.call(null,a,a===b?a:this.U,this.scope);this.U=a};n.prototype.I=function(){this.ka();
this.K()};w.prototype=l.prototype;p.prototype=new w;p.prototype.R=function(a){return void 0!==this.e[a]?a:"other"};x.prototype=l.prototype;q.prototype=new x;q.prototype.R=function(a){if(isNaN(a))return"other";if(void 0!==this.e[a])return a;a=this.M(a-this.offset);return void 0!==this.e[a]?a:"other"};g.prototype.S=function(){this.s&&(null==this.q?this.i.push(this.s):(this.i.push(this.q.join("")),this.q=null),this.s="")};g.prototype.p=function(a){a.length&&(this.s?this.q?this.q.push(a):this.q=[this.s,
a]:this.s=a)};g.prototype.H=function(a){this.S();this.J.push(this.i.length);this.g.push(a);this.i.push("")};g.prototype.ma=function(a){for(var b=Array(this.g.length),d=0;d<this.g.length;d++)b[d]=this.g[d](a);return b};g.prototype.D=function(a){for(var b=0;b<this.J.length;b++){var d=a[b];if(this.B&&void 0===d)return;this.i[this.J[b]]=d}return this.i.join("")};g.prototype.ea=function(a,b){var d=this;this.S();if(!a||0!==this.g.length){if(0===this.i.length)return t("");this.u&&1<this.i.length&&e.throwNoconcat(b);
if(0===this.g.length)return 1!=this.i.length&&this.r(),t(this.i[0]);var c=function(a){return d.D(d.ma(a))};c.$$watchDelegate=function(a,b,c){return d.P(a,b,c)};c.exp=b;c.expressions=Array(this.g.length);for(var f=0;f<this.g.length;f++)c.expressions[f]=this.g[f].exp;return c}};g.prototype.P=function(a,b){var c=new r(this,a,b);return function(){c.I()}};r.prototype.Ea=function(a,b){var c=this.c.D(a);m(this.v)&&this.v.call(null,c,a===b?c:this.W,this.scope);this.W=c};r.prototype.I=function(){this.la()};
var H=new y(new c("",0,null,null,null,!1,null,!1));c.prototype.pushState=function(){this.L.push(new y(this));s(H,this)};c.prototype.V=function(){0===this.L.length&&this.r();var a=this.L.pop();s(a,this)};c.prototype.m=function(a,b){a.lastIndex=this.index;var c=a.exec(this.text);return null==c||!0!==b&&c.index!=this.index?null:(this.index=a.lastIndex,c)};c.prototype.t=function(a){return this.m(a,!0)};c.prototype.ha=function(a){return!!this.m(a)};c.prototype.Ba=function(a){this.o=[a];do{for(this.a=this.o.pop();this.a;)this.a();
this.ga(this.a)}while(0<this.o.length)};c.prototype.r=function(){throw e("logicbug",this.text);};c.prototype.ga=function(a){void 0===a&&this.r()};var I=/\s*(\w+)\s*/g;c.prototype.ia=function(){var a=this.m(I);if(null==a)throw a=f(this.text,this.index),e("reqarg",a.h,a.f,this.text);var b=a[1];if("select"==b||"plural"==b)throw a=f(this.text,this.index),e("reqcomma",b,a.h,a.f,this.text);a=f(this.text,this.index);throw e("unknarg",b,a.h,a.f,this.text);};c.prototype.Ca=function(a){this.da=a.index;this.O=
a[0];this.ca="'"==this.O?J:K;this.a=this.ua};var J=/\\(?:\\|'|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2}|[0-7]{3}|\r\n|\n|[\s\S])|'/g,K=/\\(?:\\|"|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2}|[0-7]{3}|\r\n|\n|[\s\S])|"/g;c.prototype.ua=function(){var a=this.t(this.ca);if(null==a)throw a=f(this.text,this.da),e("untermstr",a.h,a.f,this.text);a==this.O&&(this.a=null)};var L=/\s*(plural|select)\s*,\s*/g;c.prototype.ya=function(){var a=this.t(L);null==a&&this.ia();switch(a[1]){case "plural":this.a=this.za;break;case "select":this.a=
this.Aa;break;default:this.r()}};c.prototype.za=function(){this.e=Object.create(null);this.n=this.N;this.a=this.xa};c.prototype.Aa=function(){this.e=Object.create(null);this.a=this.n=this.ba};var A=/[0]|(?:[1-9][0-9]*)/g,M=new RegExp("\\s*offset\\s*:\\s*("+A.source+")","g");c.prototype.xa=function(){var a=this.m(M);this.w=null==a?0:parseInt(a[1],10);this.C=F(this.b,this.w);this.a=this.N};c.prototype.Q=function(a,b){if(void 0!==this.e[a]){var c=f(this.text,b);throw e("dupvalue",a,c.h,c.f,this.text);
}};var N=/\s*(\w+)/g;c.prototype.ba=function(){var a=this.m(N);null==a?(this.d=(new p(this.b,this.e)).d,this.a=null):(this.k=a[1],this.Q(this.k,a.index),this.a=this.aa)};var O=new RegExp("\\s*(?:(?:=("+A.source+"))|(\\w+))","g");c.prototype.N=function(){var a=this.m(O);null==a?(this.d=(new q(this.b,this.e,this.w,this.M)).d,this.a=null):(this.k=null!=a[1]?parseInt(a[1],10):a[2],this.Q(this.k,a.index),this.a=this.aa)};var P=/\s*{/g;c.prototype.aa=function(){if(!this.ha(P)){var a=f(this.text,this.index);
throw e("reqopenbrace",this.k,a.h,a.f,this.text);}this.F=this.index;this.c=new g(this.u,this.B);this.a=this.$};var Q=/\\.|{{|}/g,R=/\\.|{{|#|}/g,B=/\\.|{{/g;c.prototype.fa=function(){var a=this.index,b;if(null==this.n){if(b=this.t(B),null==b)return this.G=this.text.substring(a),this.index=this.text.length,null}else if(b=this.t(this.n==this.N?R:Q),null==b)throw a=f(this.text,this.F),e("reqendbrace",this.k,a.h,a.f,this.text);var c=b[0];this.G=this.text.substring(a,b.index);return c};c.prototype.$=function(){var a=
this.index,b=this.fa();null==b?(this.index=this.text.length,this.c.p(this.text.substring(a)),this.a=null):"\\"==b[0]?this.c.p(this.G+b[1]):(this.c.p(this.G),"{{"==b?(this.pushState(),this.o.push(this.ta),this.a=this.X):"}"==b?(this.e[this.k]=this.c.ea(!1,this.text),this.a=this.n):"#"==b?this.c.H(this.C):this.r())};c.prototype.va=function(){this.c=new g(this.u,this.B);this.a=this.Z};c.prototype.Z=function(){var a=this.index,b=this.t(B);if(null==b)this.index=this.text.length,this.c.p(this.text.substring(a)),
this.d=this.c.ea(this.pa,this.text),this.a=null;else{var c=b[0];"\\"==c[0]?this.c.p(this.text.substring(a,b.index)+c[1]):(this.c.p(this.text.substring(a,b.index)),this.pushState(),this.o.push(this.wa),this.a=this.X)}};c.prototype.wa=function(){var a=this.d;this.V();this.c.H(a);this.a=this.Z};c.prototype.X=function(){this.d=null;this.o.push(this.sa);this.a=this.ra};c.prototype.ta=function(){var a=this.d;this.V();this.c.H(a);this.a=this.$};var S=/\s*}}/g;c.prototype.sa=function(){if(null==this.m(S)){var a=
f(this.text,this.index);throw e("reqendinterp","}}",a.h,a.f,this.text);}null==this.d&&(this.d=this.A(this.b,this.Da),this.d.exp=this.b.exp,this.d.expressions=this.b.expressions);this.a=null};c.prototype.ra=function(){this.j=[];this.l=this.index;this.a=this.Y};var T=/[[\]{}()'",]/g;c.prototype.Y=function(){var a=this.t(T);if(null==a){if(0===this.j.length){this.index=this.text.length;this.b=this.A(this.text.substring(this.l,this.index));this.b.exp=this.text.substring(this.l,this.index);this.b.expressions=
this.b.expressions;this.a=null;return}throw e("badexpr",this.Ga(this.j[0]),this.text);}var b=a[0];if("'"==b||'"'==b)this.o.push(this.Y),this.Ca(a);else if(","==b){if(this.u)throw a=f(this.text,this.index),e("unsafe",this.u,a.h,a.f,this.text);0===this.j.length&&(this.b=this.A(this.text.substring(this.l,a.index)),this.b.exp=this.text.substring(this.l,a.index),this.b.expressions=this.b.expressions,this.a=null,this.a=this.ya)}else if(null!=z(b))this.j.unshift(b);else{var c=G(b);null==c&&this.r();if(0<
this.j.length){if(c==this.j[0]){this.j.shift();return}a=f(this.text,this.index);throw e("badexpr",b,a.h,a.f,z(this.j[0]),this.text);}this.index=a.index;this.b=this.A(this.text.substring(this.l,this.index));this.b.exp=this.text.substring(this.l,this.index);this.b.expressions=this.b.expressions;this.a=null}};var U=["$$messageFormat","$delegate",function(a,b){if("{{"!=b.startSymbol()||"}}"!=b.endSymbol())throw e("nochgmustache");var c=a.interpolate;c.startSymbol=b.startSymbol;c.endSymbol=b.endSymbol;
return c}];h=h.angular.module("ngMessageFormat",["ng"]);h.factory("$$messageFormat",["$parse","$locale","$sce","$exceptionHandler",function(a,b,d,f){function g(a,b,c){return function(g){try{return g=a?d.getTrusted(a,g):d.valueOf(g),b&&void 0===g?g:C(g)}catch(h){f(e.interr(c,h))}}}return{interpolate:function(d,e,f,h){d=new c(d,0,a,b.pluralCat,g(f,h,d),e,f,h);d.Ba(d.va);return d.d}}}]);h.config(["$provide",function(a){a.decorator("$interpolate",U)}])})(window,window.Fa);
//# sourceMappingURL=angular-message-format.map

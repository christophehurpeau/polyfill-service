/*eslint no-loop-func: "off"*/
/* eslint-env mocha */

"use strict";

const axios = require("axios");
const URL = require("url").URL;
const host = require("./helpers").host;
const proclaim = require("proclaim");
const expect = require("expect");

const testCases = [
	"/v2/polyfill.js?features=requestAnimationFrame|gated,Element.prototype.classList|gated,Object.values|gated&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Intl,fetch,MutationObserver,Object.entries,Object.values,performance.now,scrollintoviewifneeded,String.prototype.repeat,UserTiming&ua=ios_saf%2F9.1.0",
	"/v2/polyfill.js?features=default,es6,fetch,Array.prototype.includes,Array.prototype.find,IntersectionObserver&flags=gated&ua=chrome%2F67.0.0",
	"/v2/polyfill.min.js?callback=tmg.polyfill.complete&features=default,fetch,IntersectionObserver&ua=ios_saf%2F4.1.0",
	"/v2/polyfill.min.js?features=Array.prototype.find&ua=firefox%2F41.0.0",
	"/v2/polyfill.js?features=default,fetch,es6,es7,HTMLCanvasElement.prototype.toBlob,IntersectionObserver,IntersectionObserverEntry&flags=gated&rum=0&ua=safari%2F12.0.0&unknown=polyfill",
	"/v2/polyfill.js?features=Promise,Array.prototype.includes,Array.prototype.find,Object.assign&ua=op_mob%2F49.1.0",
	"/v2/polyfill.min.js?features=default|gated,Intl.~locale.de|gated,Intl.~locale.fr|gated,Intl.~locale.it|gated&ua=ios_saf%2F11.0.0",
	"/v2/polyfill.js?features=default,es6,Array.prototype.includes,IntersectionObserver&flags=gated&ua=safari%2F11.1.0",
	"/v2/polyfill.js?features=Array.prototype.includes,Element.prototype.classList,Object.assign,Object.values,URL&flags=always,gated&rum=0&ua=chrome/50",
	"/v2/polyfill.min.js?features=Array.prototype.includes,Element.prototype.classList,Object.assign,Object.values,URL&flags=always,gated&rum=0&ua=chrome/50",
	"/v2/polyfill.min.js?features=Array.prototype.find,Object.assign&flags=always&ua=chrome%2F49.0.0&unknown=polyfill&unknown=polyfill,Array.prototype.includes",
	"/v2/polyfill.min.js?features=Element.prototype.matches%2CElement.prototype.closest%2CElement.prototype.remove%2Cfetch%2CObject.assign%2CPromise%2CCustomEvent%2CIntersectionObserver&ua=Mozilla%2F5.0+%28Windows+NT+6.1%3B+rv%3A35.0%29+Gecko%2F20100101+Firefox%2F35.0",
	"/v2/polyfill.min.js?features=default,Promise|always|gated,Symbol|always|gated,Array.prototype.includes,String.prototype.includes,es5,es6&flags=gated&ua=firefox%2F60.0.0",
	"/v2/polyfill.min.js?features=Symbol,Promise,Object.assign,String.prototype.startsWith,String.prototype.endsWith,String.prototype.includes,Array.prototype.includes,WeakMap,Set,Map,Number.isFinite,fetch,URL,IntersectionObserver&ua=firefox%2F64.0.0",
	"/v2/polyfill.min.js?features=default,IntersectionObserver,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Intl.~locale.de,Intl.~locale.at,Intl.~locale.en,Intl.~locale.ch&ua=chrome%2F63.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Number.isInteger,Intl.~locale.de-DE&rum=0&ua=safari%2F10.0.0",
	"/v2/polyfill.min.js?features=promise,fetch,IntersectionObserver&ua=facebook%2F40.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.lv-LV&ua=yandexsearch%2F5.23.0",
	"/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.nl&ua=ie%2F17.17134.0",
	"/v2/polyfill.min.js?flags,gated&ua=op_mob%2F5.1.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=Intl&ua=safari%2F12.0.0",
	"/v2/polyfill.js?features=Promise,Object.assign,Object.values,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,String.prototype.includes,String.prototype.startsWith,String.prototype.endsWith&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?features=Array.prototype.includes,Array.from,fetch,HTMLPictureElement,Object.values,String.prototype.includes,URL,WeakMap&flags=always,gated&rum=0&ua=chrome/50",
	"/v2/polyfill.min.js?features=default,es6,es7,fetch,Intl.~locale.en-JE&flags=gated&ua=chrome%2F71.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?excludes=Object.assign&features=default,fetch,Array.prototype.find,Array.prototype.includes&ua=chrome%2F32.0.0",
	"/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL&ua=chrome%2F4.0.0",
	"/v2/polyfill.js?features=fetch&ua=Mozilla/5.0%20(iPhone;%20CPU%20iPhone%20OS%206_0%20like%20Mac%20OS%20X)%20AppleWebKit/536.26%20(KHTML,%20like%20Gecko)%20Version/6.0%20Mobile/10A5376e%20Safari/8536.25",
	"/v2/polyfill.min.js?features=default,es6,es7,fetch,Intl.~locale.en-GB&flags=gated&ua=op_mini%2F15.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=Intl.~locale.de,Intl.~locale.en,Intl.~locale.fi,Intl.~locale.fr,Intl.~locale.no,Intl.~locale.sv&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?features=default,fetch|gated&ua=ie%2F17.17134.0",
	"/v2/polyfill.min.js?features=all&ua=chrome%2F59.0.0",
	"/v2/polyfill.min.js?features=default,Intl.~locale.en|always,Intl.~locale.he|always,WeakMap&ua=ios_saf%2F9.0.0&unknown=polyfill",
	"/v2/polyfill.js?features=default,Array.prototype.includes,Array.prototype.findIndex&ua=chrome%2F40.0.0",
	"/v2/polyfill.min.js?features=Element.prototype.matches,Element.prototype.closest,Element.prototype.classList&ua=ios_saf%2F11.4.0",
	"/v2/polyfill.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Intl.~locale.es,Number.isInteger|always,Object.values,WeakMap&flags=gated&ua=safari%2F12.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,fetch,URLSearchParams,Element.prototype.after,Element.prototype.before&flags=gated,always&ua=yandex%20browser%2F18.7.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,Intl.~locale.en,Intl.~locale.cs|gated&ua=ie%2F17.17134.0",
	"/v2/polyfill.min.js?features=Intl.~locale.ru&ua=yandex%20browser%2F17.11.0",
	"/v2/polyfill.min.js?features=Array.prototype.includes,String.prototype.includes,Element.prototype.closest,Object.prototype.entries,IntersectionObserver,fetch,Symbol&ua=chrome%2F37.0.0",
	"/v2/polyfill.min.js?features=requestAnimationFrame|always|gated,Symbol|gated,fetch|gated,Element.prototype.dataset|gated,HTMLCanvasElement.protoype.toBlob,Promise|always|gated,Intl.~locale.en|gated,Intl.~locale.it|gated&ua=ios_saf%2F8.3.0",
	"/v2/polyfill.min.js?features=Array.prototype.includes,fetch,Promise,default&ua=chrome%2F42.0.0",
	"/v2/polyfill.min.js?features=CustomEvent,fetch,Promise,Object.assign&flags=gated&ua=samsung_mob%2F8.2.0",
	"/v2/polyfill.js?features=es6,es5&ua=ie%2F15.15063.0",
	"/v2/polyfill.min.js?callback=polyfillsAreLoaded&features=IntersectionObserver,MutationObserver&ua=firefox%2F49.0.0",
	"/v2/polyfill.min.js?callback=pal&features=Intl.~locale.fr-CA|gated,fetch|gated,Array.from|gated,Object.entries|gated,Object.values|gated&ua=firefox%2F64.0.0",
	"/v2/polyfill.js?features=default,es5,es6&ua=op_mob%2F44.6.0",
	"/v2/polyfill.js?features=CustomEvent,es6,es7&flags=gated&ua=Mozilla/5.0%20(Linux;%20Android%207.1.2;%20T96)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/71.0.3578.99%20Safari/537.36",
	"/v2/polyfill.min.js?callback=polyfill&features=default,fetch,performance.now,Symbol,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Promise|always|gated&flags=gated&ua=chrome%2F31.0.0&unknown=polyfill",
	"/v2/polyfill.js?callback=window.xola.populateLinksFromExternalLinks&features=fetch,forEach&ua=firefox%2F56.0.0",
	"/v2/polyfill.min.js?features=default,es6,es7,fetch,Intl.~locale.cs-CZ&flags=gated&ua=chrome%2F67.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?callback=pal&features=Intl.~locale.pl-PL|gated,fetch|gated,Array.from|gated,Object.entries|gated,Object.values|gated&ua=ie%2F17.17134.0",
	"/v2/polyfill.js?features=default,Array.prototype.includes,Array.prototype.findIndex,Array.prototype.find,Object.entries,EventSource&ua=ios_saf%2F6.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.de,Intl.~locale.en&ua=firefox%2F51.0.0",
	"/v2/polyfill.min.js?callback=loadMainScript&features=default-3.6&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?features=IntersectionObserver&rum=0&ua=ie%2F10.0.0",
	"/v2/polyfill.min.js?features=default,es6,es7,fetch,Intl.~locale.fr-FR&flags=gated&ua=firefox_mob%2F46.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,IntersectionObserver&ua=samsung_mob%2F1.0.0",
	"/v2/polyfill.min.js?features=Promise,JSON&ua=android%2F4.2.0",
	"/v2/polyfill.min.js?features=default,Object.values,Object.entries,Array.prototype.values,Array.prototype.findIndex,Array.prototype.find,Array.from,Array.prototype.includes&ua=ios_saf%2F11.3.0",
	"/v2/polyfill.min.js?features=HTMLPictureElement,Promise,Array.prototype.find,Element.prototype.closest&ua=firefox%2F63.0.0",
	"/v2/polyfill.min.js?features=IntersectionObserver,IntersectionObserverEntry&ua=firefox%2F56.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.sk-SK&ua=firefox%2F64.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.en,CustomEvent&ua=chrome%2F64.0.0",
	"/v2/polyfill.min.js?features=es5,es2015,es2016,es2017,es2018,IntersectionObserver|always&flags=gated&ua=chrome%2F46.0.0",
	"/v2/polyfill.min.js?features=Array.prototype.includes,Intl.~locale.en,Intl.~locale.de&ua=ie%2F14.14393.0",
	"/v2/polyfill.js?features=default-3.6,es6,es7,fetch,Promise.prototype.finally&ua=chrome%2F48.0.0",
	"/v2/polyfill.js?features=CustomEvent,es6,es7&flags=gated&ua=Mozilla/5.0%20(Linux;%20Android%206.0.1;%20SM-G800F%20Build/MMB29K;%20wv)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Version/4.0%20Chrome/52.0.2743.98%20Mobile%20Safari/537.36",
	"/v2/polyfill.min.js?callback=tmg.polyfill.complete&features=default,fetch,IntersectionObserver&ua=op_mob%2F37.1.0",
	"/v2/polyfill.min.js?features=es6,IntersectionObserver,IntersectionObserverEntry,intersectionRatio&ua=chrome%2F70.0.0",
	"/v2/polyfill.min.js?features=Promise,Object.assign,Object.entries,Number.isFinite,Number.isInteger,fetch,URL,dataset&ua=firefox%2F52.0.0",
	"/v2/polyfill.min.js?features=es2015,es2016,es2017&flags=gated&ua=chrome%2F42.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=Intl.~locale.fr,Intl.~locale.de&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.it-IT&ua=chrome%2F38.0.0",
	"/v2/polyfill.js?features=Promise,URL,Object.entries,Symbol,fetch,Number.isInteger&ua=chrome%2F40.0.0",
	"/v2/polyfill.min.js?features=Element.prototype.classList,Element.prototype.matches&ua=chrome%2F63.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,es6,Intl.~locale.en,Object.assign,Object.values,Object.entries,fetch&flags=gated&ua=firefox%2F45.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,Object.values,Array.prototype.includes,Array.prototype.@@iterator&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=Promise,CustomEvent,URL,Set,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Array.from,Element.prototype.closest,Element.prototype.classlist,Element.prototype.matches,String.prototype.endsWith,String.prototype.startsWith,String.prototype.includes,Object.assign,Object.entries,navigator.sendBeacon,Intl.~locale.de&ua=opera%2F57.0.0",
	"/v2/polyfill.min.js?features=fetch,Math.sign,String.prototype.startsWith,String.prototype.endsWith,Intl.~locale.de-US,Intl.~locale.de&ua=ios_saf%2F12.1.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=IntersectionObserver,fetch,Element.prototype.classList,Event,CustomEvent,Element.prototype.closest&ua=chrome%2F64.0.0",
	"/v2/polyfill.js?features=default,es6,fetch,Array.prototype.includes,Array.prototype.find,IntersectionObserver&flags=gated&ua=chrome%2F64.0.0",
	"/v2/polyfill.js?features=es5,es6&ua=chrome%2F66.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.id|gated&ua=chrome%2F64.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Object.entries,Object.values,Set,Map,WeakSet,WeakMap,Intl&ua=ios_saf%2F9.0.0",
	"/v2/polyfill.min.js?features=default,es6,es7,fetch,Intl.~locale.hu-HU&flags=gated&ua=chrome%2F63.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,symbol,IntersectionObserver,IntersectionObserverEntry,Intl.~locale.az,Intl.~locale.da,Intl.~locale.de,Intl.~locale.en,Intl.~locale.es,Intl.~locale.id,Intl.~locale.kk,Intl.~locale.nl,Intl.~locale.pt,Intl.~locale.ru,Intl.~locale.sr,Intl.~locale.sv,Intl.~locale.tr,Intl.~locale.vi,Intl.~locale.uk&flags=gated&ua=chrome%2F68.0.0&unknown=polyfill",
	"/v2/polyfill.js?excludes=Element&ua=chrome%2F30.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,fetch,Promise&ua=chrome%2F34.0.0",
	"/v2/polyfill.min.js?features=Element.prototype.classList,Element.prototype.closest,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry&ua=yandex%20browser%2F18.7.0",
	"/v2/polyfill.min.js?features=IntersectionObserver,MutationObserver,fetch,es6,Promise&ua=safari%2F12.0.0",
	"/v2/polyfill.js?features=Promise,fetch,Array.prototype.includes&ua=chrome%2F55.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=es6,Array.prototype.includes,CustomEvent,Object.entries,Object.values,URL&ua=firefox%2F33.0.0",
	"/v2/polyfill.js?features=Promise,URL,Object.entries,Symbol,fetch,Number.isInteger&ua=ios_saf%2F12.0.0",
	"/v2/polyfill.min.js?features=default-3.6,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Array.prototype.@@iterator,Array.prototype.keys,Array.prototype.values,Array.prototype.entries,Element.prototype.remove,Symbol&ua=opera%2F12.10.0",
	"/v2/polyfill.min.js?features=EventSource,es2015,es2016,es2017,fetch,Array.prototype.includes&flags=gated&rum=0&ua=firefox%2F50.0.0",
	"/v2/polyfill.js?features=CustomEvent,es6,es7&flags=gated&ua=Mozilla/5.0%20(Linux;%20Android%205.1;%20itel%20it1508%20Build/LMY47D;%20wv)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Version/4.0%20Chrome/69.0.3497.100%20Mobile%20Safari/537.36",
	"/v2/polyfill.min.js?features=Intl.~locale.nl&ua=ios_saf%2F6.0.0",
	"/v2/polyfill.js?features=Promise&ua=amazon%20silk%2F70.5.0",
	"/v2/polyfill.min.js?features=Intl,Intl.~locale.fr-fr&flags=always&ua=uc%20browser%2F12.9.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Number.isInteger,Intl.~locale.en-AU&rum=0&ua=ios_saf%2F8.0.0",
	"/v2/polyfill.min.js?features=Array.from,Element.prototype.dataset,IntersectionObserver,IntersectionObserverEntry,Map,Object.assign,Object.keys,Promise,fetch&flags=gated&ua=samsung_mob%2F2.1.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=Intl.~locale.it&ua=ie%2F11.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=fetch,URL,IntersectionObserver&ua=ie%2F14.14393.0",
	"/v2/polyfill.min.js?features=default,es5,es6,Promise&ua=ie%2F11.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.fr&ua=chrome%2F60.0.0",
	"/v2/polyfill.js?features=Element.prototype.matches,Element.prototype.closest,Element.prototype.classList,Object.assign,Array.from,Set,Map,Document&flags=gated&ua=ios_saf%2F11.2.0",
	"/v2/polyfill.min.js?features=Promise,fetch,Element.prototype.classlist&flags=gated&ua=ie%2F17.17134.0",
	"/v2/polyfill.min.js?features=IntersectionObserver,fetch,Element.prototype.dataset,Array.prototype.forEach&ua=op_mob%2F5.1.0",
	"/v2/polyfill.min.js?features=default,Object.values,Intl.~locale.de,Array.prototype.includes,HTMLPictureElement&ua=firefox_mob%2F58.0.0",
	"/v2/polyfill.min.js?features=default,find,WeakMap,matchMedia,IntersectionObserver,IntersectionObserverEntry&ua=opera%2F57.0.0",
	"/v2/polyfill.min.js?features=Element.prototype.closest,Element.prototype.classList,Array.prototype.find&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?features=Promise,Intl.~locale.en-US&ua=chrome%2F59.0.0",
	"/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL&ua=seamonkey%2F2.51.0",
	"/v2/polyfill.min.js?features=default,es6,Array.prototype.includes,IntersectionObserver&ua=firefox%2F64.0.0",
	"/v2/polyfill.min.js?features=default-3.4,Array.prototype.find,Intl.~locale.fr&ua=safari%2F12.0.0",
	"/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL&ua=firefox%2F31.0.0",
	"/v2/polyfill.js?features=CustomEvent,es6,es7&flags=gated&ua=Mozilla/5.0%20(Windows%20NT%206.1;%20WOW64;%20rv:48.0)%20Gecko/20100101%20Firefox/48.0",
	"/v2/polyfill.js?features=Object.values%2CElement.prototype.classList&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?excludes=Object.defineProperty&features=Promise,Array.prototype.fill,String.prototype.repeat,Intl.~locale.de,Intl.~locale.en,Intl.~locale.es,Intl.~locale.fr,Intl.~locale.id,Intl.~locale.nl,Intl.~locale.pt,Intl.~locale.tr,Intl.~locale.zh&ua=ie%2F11.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?callback=polyfill&features=default,fetch,performance.now,Symbol,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Promise|always|gated&flags=gated&ua=samsung_mob%2F4.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?flags,gated&ua=chrome%2F34.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.-NL&ua=ie%2F11.0.0",
	"/v2/polyfill.min.js?flags,gated&ua=firefox%2F38.3.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=Intl.~locale.fr&ua=chrome%2F49.0.0",
	"/v2/polyfill.min.js?features=default,es2015,es2016&flags=gated&ua=id%20bot%2F53.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,Array.prototype.find&ua=chrome%2F67.0.0",
	"/v2/polyfill.min.js?features=Intl,Array.prototype.includes,String.prototype.includes,fetch,Set,Symbol,Element.prototype.remove&ua=safari%2F12.1.0",
	"/v2/polyfill.js?features=Intl.~locale.cs&ua=firefox%2F64.0.0",
	"/v2/polyfill.js?features=default,ES6,Array.prototype.find,Array.prototype.includes,String.prototype.includes,Promise&ua=ie%2F11.0.0",
	"/v2/polyfill.min.js?features=default,Object.values&ua=opera%2F57.0.0",
	"/v2/polyfill.js?features=es5,es6,es2016,es2017,MutationObserver|gated&flags=gated&ua=firefox%2F21.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Number.isInteger,Intl.~locale.fr-FR&rum=0&ua=firefox%2F14.0.0",
	"/v2/polyfill.min.js?features=fetch,Promise,MutationObserver&ua=opera%2F56.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.pt,IntersectionObserver&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=default-3.6,fetch,Intl,Intl.~locale.pt-BR,Array.prototype.find,Array.prototype.includes,Object.values&flags=gated&ua=ios_saf%2F9.3.0",
	"/v2/polyfill.min.js?features=default,Object.values,Intl.~locale.de,Array.prototype.includes,HTMLPictureElement&ua=samsung_mob%2F3.3.0",
	"/v2/polyfill.min.js?features=Intl.~locale.es|gated&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.fr&ua=opera%2F57.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.en,Intl.~locale.de,Intl.~locale.fr,Intl.~locale.it&ua=chrome%2F43.0.0",
	"/v2/polyfill.min.js?features=NodeList.prototype.@@iterator,Array.prototype.includes,Array.from&ua=ios_saf%2F9.2.0",
	"/v2/polyfill.min.js?features=Intl.~locale.pt|gated&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=default,Intl,fetch,Object.values,Object.entries,String.prototype.padEnd,String.prototype.padStart,Array.prototype.includes,Array.prototype.find&ua=ios_saf%2F9.1.0",
	"/v2/polyfill.min.js?features=default,fetch,Object.entries&ua=samsung_mob%2F3.2.0",
	"/v2/polyfill.min.js?features=Symbol,Symbol.iterator,Promise,Intl.~locale.en,Intl.~locale.fi&ua=ios_saf%2F11.2.0",
	"/v2/polyfill.min.js?features=fetch,Math.sign,String.prototype.startsWith,String.prototype.endsWith,Intl.~locale.en-US,Intl.~locale.en&ua=yandex%20browser%2F15.9.0&unknown=polyfill",
	"/v2/polyfill.min.js?callback=polyfillsAreLoaded&features=es2015,es2016,es2017,fetch&flags=always,gated&rum=0&ua=uc%20browser%2F10.10.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=es6|gated|always&ua=chrome%2F55.0.0&unknown=polyfill",
	"/v2/polyfill.js?features=CustomEvent,es6,es7&flags=gated&ua=Mozilla/5.0%20(Linux;%20Android%204.4.4;%20SM-G530H%20Build/KTU84P)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/40.0.2214.109%20Mobile%20Safari/537.36",
	"/v2/polyfill.min.js?features=Promise,Object.assign&ua=samsung_mob%2F9.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Number.isInteger,Intl.~locale.it-IT&rum=0&ua=ios_saf%2F10.3.0",
	"/v2/polyfill.js?features=es6,HTMLPictureElement,getComputedStyle,requestAnimationFrame,Element.prototype.classList,Element.prototype.remove,Element.prototype.dataset,Element.prototype.closest&ua=apple%20mail%2F601.7.0",
	"/v2/polyfill.min.js?excludes=Object.setPrototypeOf&features=es5,es6,Array.prototype.includes,Object.values,String.prototype.padStart,Intl.~locale.fr-CA&ua=ios_saf%2F12.0.0",
	"/v2/polyfill.min.js?features=Promise,fetch,Element.prototype.dataset,Element.prototype.closest,Math.sign,Array.from,String.prototype.startsWith,String.prototype.endsWith,IntersectionObserver&ua=chrome%2F71.0.0",
	"/v2/polyfill.js?features=default,es6,Array.prototype.includes&flags=gated&ua=firefox%2F37.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.sv&ua=ie%2F11.0.0",
	"/v2/polyfill.min.js?features=Object.entries,Object.keys,Object.values,Array.from,Array.prototype.find,Array.prototype.findIndex,Array.prototype.keys,Array.prototype.includes,Intl.~locale.es,Intl.~locale.en,Intl.~locale.eu,Intl.~locale.fr&ua=ie%2F15.15063.0",
	"/v2/polyfill.min.js?features=Intl.~locale.de,Intl.~locale.en,Promise,Array.prototype.find,Array.prototype.@@iterator,Array.prototype.includes,String.prototype.includes,String.prototype.startsWith,Object.assign,Map,Symbol.iterator,requestAnimationFrame,fetch&ua=firefox_mob%2F63.0.0",
	"/v2/polyfill.min.js?features=Map,Set,WeakSet,WeakMap,Object.assign,Array.prototype.find,requestAnimationFrame,IntersectionObserver,fetch&ua=samsung_mob%2F8.2.0",
	"/v2/polyfill.min.js?features=Promise,String.prototype.repeat,String.prototype.startsWith,Number.isInteger,Intl.~locale.en-US&ua=ios_saf%2F8.0.0",
	"/v2/polyfill.min.js?features=HTMLPictureElement&ua=chrome%2F52.0.0",
	"/v2/polyfill.min.js?features=Element.prototype.matches%2CElement.prototype.closest%2CElement.prototype.remove%2Cfetch%2CObject.assign%2CPromise%2CCustomEvent%2CIntersectionObserver&ua=Mozilla%2F5.0+%28Linux%3B+Android+7.0%3B+SAMSUNG+SM-G928F+Build%2FNRD90M%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+SamsungBrowser%2F8.2+Chrome%2F63.0.3239.111+Mobile+Safari%2F537.36",
	"/v2/polyfill.min.js?features=default,Array.prototype.@@iterator&flags=gated&ua=ie%2F8.0.0",
	"/v2/polyfill.min.js?features=Promise,Element.prototype.remove,Object.assign,Array.prototype.find,Promise.prototype.finally&ua=firefox%2F64.0.0",
	"/v2/polyfill.min.js?excludes=Array.from&features=es6,Array.prototype.includes,String.prototype.includes,Array.prototype.entries,Object.entries|always&ua=chrome%2F58.4.0",
	"/v2/polyfill.min.js?features=default-3.6,Array.prototype.entries,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Array.prototype.keys,Element.prototype.dataset,Object.entries,Object.values,String.prototype.padEnd,String.prototype.padStart,Symbol.iterator&ua=facebook%2F171.0.0",
	"/v2/polyfill.min.js?features=default&flags=gated&ua=opera%2F55.0.0",
	"/v2/polyfill.min.js?features=default,fetch,Array.prototype.find,Element.prototype.matches&ua=opera%2F49.0.0",
	"/v2/polyfill.min.js?features=Array.from,CustomEvent,Array.prototype.find,IntersectionObserver&ua=opera%2F49.0.0",
	"/v2/polyfill.min.js?features=Array.prototype.@@iterator&ua=ie%2F8.0.0",
	"/v2/polyfill.min.js?features=String.prototype.startsWith,Array.prototype.includes&ua=firefox%2F63.0.0",
	"/v2/polyfill.min.js?features=Promise,Object.assign,Object.values,Object.keys,Object.create,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Array.prototype.filter,Array.prototype.forEach,String.prototype.includes,String.prototype.startsWith,String.prototype.endsWith,Element.prototype.closest&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.nl&ua=samsung_mob%2F6.2.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.contains,Array.prototype.findIndex,HTMLPictureElement,String.prototype.trim,performance.now,IntersectionObserver&ua=opera%2F8.00.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.find,Array.prototype.includes,Array.prototype.findIndex,fetch,Intl.~locale.de,HTMLPictureElement,matchMedia,IntersectionObserver,IntersectionObserverEntry&ua=ie%2F11.0.0",
	"/v2/polyfill.min.js?features=default,String.prototype.startsWith,Array.from,Array.prototype.keys,Array.prototype.find,Array.prototype.includes,Array.prototype.findIndex,Object.values,Object.entries,Intl&flags=gated&ua=samsung_mob%2F3.5.0",
	"/v2/polyfill.min.js?features=Array.from,Array.prototype.includes,Element.prototype.closest,Promise,fetch,Array.prototype.find,Array.prototype.findIndex,Element.prototype.matches,Element.prototype.after,Element.prototype.before,Element.prototype.remove,IntersectionObserver&ua=safari%2F12.0.0",
	"/v2/polyfill.js?features=es6,Array.prototype.includes&ua=chrome%2F50.0.0",
	"/v2/polyfill.js?features=default,Array.prototype.includes,Array.prototype.findIndex,Array.prototype.find,Object.entries,EventSource&ua=op_mob%2F33.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.contains,Array.prototype.findIndex,HTMLPictureElement,String.prototype.trim,performance.now,IntersectionObserver&ua=nokia%20browser%2F7.2.0",
	"/v2/polyfill.min.js?features=default,fetch,Promise.prototype.finally&ua=chrome%2F71.0.0",
	"/v2/polyfill.js?features=Object.keys,Object.is,Object.defineProperties,Object.defineProperty,Object.create,Object.assign,Object.getOwnPropertyNames,Object.getOwnPropertyDescriptor,Object.getPrototypeOf,modernizr:es5array,requestAnimationFrame,screen.orientation,setImmediate,Promise,Event.DOMContentLoaded,Intl.~locale.es&ua=safari%2F12.0.0",
	"/v2/polyfill.min.js?features=default,fetch,Promise.prototype.finally,Object.values&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?features=default-3.6,fetch,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex,Intl|gated,matchMedia&ua=ios_saf%2F12.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.findIndex&flags=gated&ua=chrome%2F61.0.0",
	"/v2/polyfill.min.js?features=fetch,Array.prototype.find&flags=gated&ua=ie%2F15.15063.0",
	"/v2/polyfill.js?features=CustomEvent,es6,es7&flags=gated&ua=Mozilla/5.0%20(Linux;%20Android%205.1.1;%20SM-G531F%20Build/LMY48B)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/52.0.2743.98%20Mobile%20Safari/537.36",
	"/v2/polyfill.js?features=Element.prototype.dataset,Element.prototype.classList,Array.prototype.includes,es6&ua=safari%2F9.1.0",
	"/v2/polyfill.min.js?callback=loadMain&features=default-3.3,fetch,promise,Array.prototype.includes&ua=firefox%2F48.0.0",
	"/v2/polyfill.min.js?features=default,IntersectionObserver,Array.prototype.find,fetch&ua=ie%2F12.10240.0",
	"/v2/polyfill.min.js?features=es6,Array.prototype.includes,CustomEvent&ua=chrome%2F54.0.0",
	"/v2/polyfill.min.js?features=default,es6,fetch,Intl.~locale.fi,Intl.~locale.en,Intl.~locale.sv,Intl.~locale.sv,Intl.~locale.de,Intl.~locale.et,Intl.~locale.it,Intl.~locale.fr,Intl.~locale.es,Intl.~locale.zh,Intl.~locale.nl,Intl.~locale.ru,Intl.~locale.pl,Intl.~locale.no&ua=safari%2F11.1.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,es6,Array.prototype.includes,IntersectionObserver&ua=chrome%2F69.0.0",
	"/v2/polyfill.min.js?features=Symbol,Object.assign,fetch&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?features=es6|gated&ua=maxthon%2F5.2.0",
	"/v2/polyfill.min.js?features=IntersectionObserver,Array.prototype.includes,Array.from,String.prototype.includes,Array.prototype.fill,Object.values,Set,Map,String.prototype.endsWith,Promise.prototype.finally&ua=safari%2F12.0.0",
	"/v2/polyfill.js?features=Element.prototype.matches,Element.prototype.closest,Element.prototype.classList,Object.assign,Array.from,Set,Map,Document&flags=gated&ua=firefox%2F54.0.0",
	"/v2/polyfill.js?features=default&ua=ios_saf%2F11.0.0",
	"/v2/polyfill.min.js?features=fetch,IntersectionObserver,Array.from,Element.prototype.closest&ua=chrome%2F71.0.0",
	"/v2/polyfill.min.js?callback=tmg.polyfill.complete&features=default,fetch,IntersectionObserver&ua=firefox%2F30.0.0",
	"/v2/polyfill.min.js?features=Intl.~locale.ru?v,27&ua=ie_mob%2F10.0.0",
	"/v2/polyfill.js?features=fetch&ua=firefox_mob%2F45.0.0",
	"/v2/polyfill.min.js?features=default,IntersectionObserver,Intl.~locale.nb,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,WeakMap,console,Math.log2,Array.prototype.@@iterator&ua=chrome%2F71.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=fetch,Math.sign,String.prototype.startsWith,String.prototype.endsWith,Intl.~locale.fr-BE,Intl.~locale.fr&ua=firefox%2F52.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default-3.4,Array.prototype.find,Intl.~locale.ro&ua=safari%2F4.0.0",
	"/v2/polyfill.min.js?features=default,fetch,Promise,Object.setPrototypeOf,Object.entries,Number.isInteger,MutationObserver,startsWith,Array.prototype.includes,Array.from,IntersectionObserver&flags=gated&ua=firefox_mob%2F55.0.0",
	"/v2/polyfill.min.js?features=default,es2015,es2016,es2017&ua=chrome%2F64.0.0",
	"/v2/polyfill.min.js?callback=polyfill&features=default,fetch,performance.now,Symbol,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Promise|always|gated&flags=gated&ua=op_mob%2F37.0.0&unknown=polyfill",
	"/v2/polyfill.js?features=fetch,Promise&flags=gated&ua=firefox_mob%2F55.0.0",
	"/v2/polyfill.min.js?features=Promise&ua=firefox%2F39.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.includes,Object.freeze,Object.assign,Promise,Array.prototype.find,Array.prototype.findIndex&ua=chrome%2F29.0.0",
	"/v2/polyfill.min.js?excludes=Array.from&features=es6,Array.prototype.includes,String.prototype.includes,Array.prototype.entries,Object.entries|always&ua=samsung_mob%2F7.4.0",
	"/v2/polyfill.min.js?features=default|gated,es6|gated,Object.values|gated,Object.entries|gated,Array.prototype.find|gated,Array.prototype.includes|gated,IntersectionObserver|gated,IntersectionObserverEntry&ua=safari%2F8.0.0",
	"/v2/polyfill.min.js?features=IntersectionObserver&flags=gated&ua=opera%2F57.0.0",
	"/v2/polyfill.js?features=Array.prototype.find,Promise&rum=0&ua=safari%2F11.1.0",
	"/v2/polyfill.min.js?excludes=Array.from&features=es6,Array.prototype.includes,String.prototype.includes,Array.prototype.entries,Object.entries|always&ua=ios_saf%2F12.0.0",
	"/v2/polyfill.js?features=Object.assign,Promise&ua=ie%2F11.0.0",
	"/v2/polyfill.min.js?features=default,Array.prototype.find,Array.prototype.findIndex&ua=ie%2F15.15063.0",
	"/v2/polyfill.min.js?features=Array.from,Array.isArray,Array.prototype.every,Array.prototype.some,Array.prototype.find,Array.prototype.includes,Object.assign,Promise,String.prototype.startsWith,String.prototype.endsWith,String.prototype.includes,HTMLPictureElement,Element.prototype.closest,fetch,WeakMap,Set,Map,requestAnimationFrame&flags=gated&rum=0&ua=chrome%2F62.0.0&unknown=polyfill",
	"/v2/polyfill.min.js?features=default,es6,IntersectionObserver,Object.values,Array.prototype.includes,Array.prototype.findIndex,Promise.prototype.finally,Intl.~locale.fr&ua=firefox%2F50.0.0&unknown=polyfill",
	"/v2/polyfill.js?features=all&ua=biscuito&unknown=polyfill&flags=always,gated"
];

function adapter(url) {
	// Only need to adapt the url if we are not running through Fastly because our Fastly config will adapt the url for us.
	if (url.startsWith("http://localhost")) {
		url = url.replace("/v2", "/v3");
		const myURL = new URL(url);
		myURL.searchParams.set("version", "3.25.1");
		if (!myURL.searchParams.has("unknown")) {
			myURL.searchParams.set("unknown", "ignore");
		}
		return myURL.toString();
	} else {
		return url;
	}
}

describe("ensure v2 bundles are exactly the same when adapted to work with v3", function() {
	this.timeout(10000);

	for (const bundle of testCases) {
		describe(`GET ${adapter(host + bundle)} vs https://polyfill.io${bundle}`, function() {
			it("responds with correct bundle", async () => {
				// https://polyfill.io
				const originalV2Bundle = (await axios.get(`https://polyfill.io${bundle}`)).data;
				const v3tov2adaptedBundle = (await axios.get(adapter(host + bundle))).data;
				proclaim.strictEqual(v3tov2adaptedBundle, originalV2Bundle);
				expect(v3tov2adaptedBundle).toStrictEqual(originalV2Bundle);
			});
		});
	}
});

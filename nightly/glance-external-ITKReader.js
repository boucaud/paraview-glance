!function(e,r){if("object"==typeof exports&&"object"==typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{var n=r();for(var a in n)("object"==typeof exports?exports:e)[a]=n[a]}}(window,(function(){return(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{513:function(e,r){},891:function(e,r,n){"use strict";n.r(r);var a=n(361),t=n(362),o=n(588),i=n.n(o),s=n(589),f=n(205),c=n.n(f),u=n(590),d=(n(884),n(0)),l=n(105),m=n(598),p=l.a.convertItkToVtkImage;var y={fileName:"",arrayName:null};function w(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};Object.assign(r,y,n),d.b.obj(e,r),d.b.algo(e,r,0,1),d.b.setGet(e,r,["fileName","arrayName"]),function(e,r){r.classHierarchy.push("vtkITKDicomImageReader"),e.readFileSeries=function(n){return n&&n.length&&n!==r.files?(r.files=n,Object(m.a)(n).then((function(e){return e.image})).then((function(n){var a,t,o,i=p(n,{scalarArrayName:r.arrayName||(a=r.fileName,t=a.lastIndexOf("."),o=t>-1?a.substring(0,t):a,"Scalars ".concat(o))});r.output[0]=i,e.modified()}))):Promise.resolve()},e.requestData=function(){e.readFileSeries(r.files,r.fileName)}}(e,r)}var v={newInstance:d.b.newInstance(w,"vtkITKDicomImageReader"),extend:w};n.d(r,"imageExtensions",(function(){return g})),n.d(r,"polyDataExtensions",(function(){return N})),n.d(r,"extensions",(function(){return h})),n.d(r,"registerToGlance",(function(){return x})),a.a.setReadImageArrayBufferFromITK(s.a),t.a.setReadPolyDataArrayBufferFromITK(u.a);var b=new Set(Array.from(i.a.keys()).map((function(e){return e.toLowerCase()})));b.delete("json");var g=Array.from(b),N=Array.from(new Set(Array.from(c.a.keys()).map((function(e){return e.toLowerCase()})))),h=g.concat(N);function x(e){e&&(g.filter((function(e){return"dcm"!==e})).forEach((function(r){return e.registerReader({extension:r,name:"".concat(r.toUpperCase()," Reader"),vtkReader:a.a,binary:!0,fileNameMethod:"setFileName"})})),N.forEach((function(r){return e.registerReader({extension:r,name:"".concat(r.toUpperCase()," Reader"),vtkReader:t.a,binary:!0,fileNameMethod:"setFileName"})})),e.registerReader({extension:"dcm",name:"DICOM File Series Reader",vtkReader:v,fileNameMethod:"setFileName",fileSeriesMethod:"readFileSeries",binary:!0}))}r.default={extensions:h,registerToGlance:x};x(("undefined"==typeof window?{}:window).Glance)}},[[891,0,1]]])}));
(this["webpackJsonpfood-logger"]=this["webpackJsonpfood-logger"]||[]).push([[0],{32:function(e,t,n){},33:function(e,t,n){},76:function(e,t,n){"use strict";n.r(t);var c=n(1),r=n(0),o=n.n(r),a=n(10),i=n.n(a),s=(n(32),n(9)),l=(n(33),n(16)),d=n(13),u=n(26),j=n(80),h=n(83),b=n(81),f=n(82),p=n(84),m=n(7),O=n(22),g=n(6),x=n(34),v=[48.1351,11.582],k=(new m.Icon({iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"}),new m.Icon.Default({className:"huechange-190"})),y=new m.Icon.Default({className:"huechange-140"}),w=new m.Icon.Default({className:"huechange-280"}),S=new m.Icon.Default;var C=function(e){var t=e.onUpdateMarkets,n=e.supermarkets,o=e.selectedMarkets,a=Object(r.useState)(null),i=Object(s.a)(a,2),l=i[0],d=i[1],u=function(e){t(e)};function m(){return Object(j.a)({click:function(e){d(e.latlng)},locationfound:function(e){console.log("location found:",e)}}),null}return Object(c.jsxs)(f.a,{center:v,zoom:13,scrollWheelZoom:!1,children:[Object(c.jsx)(p.a,{attribution:'\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),Object(c.jsx)(m,{}),Object(c.jsx)(h.a,{position:v,icon:y,children:Object(c.jsxs)(b.a,{children:["This is Munich on OSM. ",Object(c.jsx)("br",{})," Try to click somewhere else."]})}),l?Object(c.jsx)(h.a,{position:l,icon:k,children:Object(c.jsx)(b.a,{children:Object(c.jsx)(O.a,{variant:"outline-primary",onClick:function(){var e=l;if(null!==e){var t="\n            [out:json][timeout:25];\n            node\n                [shop=supermarket]\n                (around:1000, ".concat(e.lat,", ").concat(e.lng,");\n                out;\n        ");x(t,{fetchMode:"cors"}).then(u).catch(console.error)}},children:"Find markets around here"})})}):null,function(){if(null===n)return null;return n.map((function(e,t,n){return function(e){var t=[e.lat,e.lon],n=e.tags,r=function(e){return void 0!==e?e:""},a="".concat(r(n["addr:street"])," ").concat(r(n["addr:housenumber"]),",\n            ").concat(r(n["addr:postcode"])," ").concat(r(n["addr:city"]),"\n            "),i=o.includes(e.id)?w:S;return Object(c.jsx)(h.a,{position:t,icon:i,children:Object(c.jsx)(b.a,{children:Object(c.jsx)(g.a,{children:Object(c.jsxs)(g.a.Body,{children:[Object(c.jsx)(g.a.Title,{children:n.name?n.name:"Unknown"}),n.brand?Object(c.jsx)(g.a.Text,{children:"Brand: "+n.brand}):null,void 0!==n["addr:street"]?Object(c.jsxs)(g.a.Text,{children:[a," "]}):null,Object(c.jsx)(O.a,{variant:"outline-primary",onClick:function(t){return u([e])},children:"Find products at this market"})]})})})},e.id.toString())}(e)}))}()]})},M=n(17),T={0:{name:"Vegan blu",description:"A vegan blue cheese"},1:{name:"Simply V w\xfcrzige Genie\xdferscheiben",description:"The best",image:"https://static.openfoodfacts.org/images/products/426/044/496/0339/front_de.7.full.jpg"},3:{name:"Primitivo goes vegan",description:"reddish goodness"},4:{name:"Chardonnay vegan",description:"weird mix of white grapes"}},I=[{name:"Cheeses",products:[0,1]},{name:"Wines",products:[3,4]}];function P(e){var t=e.product,n=e.onClick,r=e.selected;return Object(c.jsxs)(g.a,{onClick:n,bg:r?"primary":void 0,text:r?"light":void 0,children:[t.image?Object(c.jsx)(g.a.Img,{variant:"top",src:t.image}):"",Object(c.jsxs)(g.a.Body,{children:[Object(c.jsx)(g.a.Title,{children:t.name}),Object(c.jsx)(g.a.Text,{children:t.description})]})]})}var B=function(e){var t=e.categories,n=e.products,r=e.onSelectProduct,o=e.selectedProduct,a=t.map((function(e,t,a){return Object(c.jsxs)(g.a,{children:[Object(c.jsx)(M.a.Toggle,{as:g.a.Header,eventKey:t.toString(),children:e.name}),Object(c.jsx)(M.a.Collapse,{eventKey:t.toString(),children:Object(c.jsx)(g.a.Body,{children:Object(c.jsx)(l.a,{children:(i=e.products,i.map((function(e){return void 0===n[e]?null:Object(c.jsx)(d.a,{xs:12,md:6,lg:4,children:Object(c.jsx)(P,{product:n[e],onClick:function(){r(e)},selected:o===e})},e)})))})})})]},t);var i}));return Object(c.jsx)(M.a,{defaultActiveKey:"0",children:a})};var F=function(){var e=Object(r.useState)(T),t=Object(s.a)(e,2),n=t[0],o=t[1],a=Object(r.useState)(void 0),i=Object(s.a)(a,2),j=i[0],h=i[1],b=Object(r.useState)(null),f=Object(s.a)(b,2),p=f[0],m=f[1],O=Object(r.useState)([]),g=Object(s.a)(O,2),x=g[0],v=g[1];return Object(r.useEffect)((function(){if(null!==p)if(void 0===j)v([]);else{var e=p.map((function(e){return e.id})).filter((function(e){return Math.random()>=.5}));v(e)}}),[j,p]),Object(c.jsx)(u.a,{fluid:!0,children:Object(c.jsxs)(l.a,{children:[Object(c.jsx)(d.a,{xs:12,md:9,lg:6,children:Object(c.jsx)(C,{supermarkets:p,onUpdateMarkets:function(e){m(e),function(e){var t=Object.keys(T).map((function(e){return Number(e)})).filter((function(e){return Math.random()>=.5})),n=t.reduce((function(e,t){return e[t]=T[t],e}),{});void 0===j||t.includes(j)||h(void 0),o(n)}()},selectedMarkets:x})}),Object(c.jsx)(d.a,{children:Object(c.jsx)(B,{products:n,categories:I,selectedProduct:j,onSelectProduct:function(e){h(e===j?void 0:e)}})})]})})},D=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,85)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,o=t.getLCP,a=t.getTTFB;n(e),c(e),r(e),o(e),a(e)}))};n(75);i.a.render(Object(c.jsx)(o.a.StrictMode,{children:Object(c.jsx)(F,{})}),document.getElementById("root")),D()}},[[76,1,2]]]);
//# sourceMappingURL=main.fe4c09be.chunk.js.map
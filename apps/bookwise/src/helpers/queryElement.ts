/**
* querySelector by property
* @param {element} el
* @param {string} sel selector string
* @param {object[]} props
* @returns {element[]} elements
* @memberof Core
*/
export function qsp(el: Element | Document, sel: string, props: {[key: string]: string}) {
 let q, filtered;

 if (typeof el.querySelector != "undefined") {
   sel += "[";

   for (const prop in props) {
     sel += prop + "~='" + props[prop] + "'";
   }

   sel += "]";

   return el.querySelector(sel);
 } else {
   q = el.getElementsByTagName(sel);

   filtered = Array.prototype.slice.call(q, 0).filter(function(el) {
     for (const prop in props) {

       if(el.getAttribute(prop) === props[prop]){
         return true;
       }
     }
     return false;
   });

   if (filtered) {
     return filtered[0];
   }
 }
}

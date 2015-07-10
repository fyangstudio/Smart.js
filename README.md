# iModalJs - Easier and faster project builder
### Responsive design 2.0
  &nbsp;&nbsp;With the development of the hardware, I think the responsive design not just deliver web pages in variable sizes, and it should be contains data response(templating ), pixel response(Retina and Retina HD), and browser response(SAMD -  Selective Asynchronous Module Definition).
### Web vs. native: let’s concede defeat
  &nbsp;&nbsp;It’s time to recognise that this is the wrong approach. We shouldn’t try to compete with native apps in terms set by the native apps. Instead, we should concentrate on the unique web selling points: its reach, which, more or less by definition, encompasses all native platforms, URLs, which are fantastically useful and don’t work in a native environment, and its hassle-free quality. So let's start -- Responsive design 2.0
### SAMD - Selective Asynchronous Module Definition
  &nbsp;&nbsp;The SAMD format comes from wanting a module format that was better than today's "write a bunch of script tags with implicit dependencies that you have to manually order" and something that was easy to use directly in the browser.
  
#####SAMD vs AMD
AMD
```javascript
//Calling define with a dependency array and a factory function
define(['dep1', 'dep2'], function (dep1, dep2) {

    //Define the module value by returning a value.
    return function () {};
});
```
SAMD
```javascript
//Calling define with a selective dependency array and a factory function
//Such as $chrome!, $ie!, $firefox!, $safari!, $opera! and $pixel!
define([
  '$chrome!dep1',             //chrome dependency   
  '6<=$ie<9!dep2',            //IE6~IE9 dependency
  '^$ie!dep3',                //except IE dependency ('^' means not) 
  '$pixel>1!dep4'             //retina and retina HD dependency 
], function (chrome_dep, oldIE_dep, notIE_dep, retina_dep) {
    //[macbook pro's chrome], Don't load the dep3 and the oldIE_dep will be an empty object.
    
    //Define the module value by returning a value.
    return {};
});
```
##Quirk Start


import 'core-js/stable';
//Polyfilling async functions
import 'regenerator-runtime/runtime'
const hello = 'hello'
console.log(hello);

if(module.hot) {
  module.hot.accept()
}
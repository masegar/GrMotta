angular.module('app.services', [])

.factory('shareData', function(){
    var finalData = [];
    return {
        sendData: function(nuevos) {
            finalData = nuevos;
        },
        getData: function() {
            return finalData;
        }
    }
})

// .factory('shareData', function(){

//   var finalData = ["Hello World",'more data'];

//   return {
//     sendData: function(data) {
//         finalData = data; 
//     },
//     getData: function() {
//         return finalData;
//     },
//     getItem:function(_id) {
//        return finalData[_id];
//     }
//   }
// });

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);
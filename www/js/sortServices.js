angular.module('sortServices', [])
  .service('sortSvc', [function(){
    this.bubbleSort = function(unsortedArray){
        var sortedArray = unsortedArray;
        var swapped = false;
        do {
          for( var i=0; i<sortedArray.length-2; i++){
            if( sortedArray[i].localeCompare(sortedArray[i+1]) > 0) {
              var temp = sortedArray[i];
              sortedArray[i] = sortedArray[i+1];
              sortedArray[i+1] = temp;
              
              swapped = true;
            }
          }
        } while(swapped);
        
        return sortedArray;
    };
  }]);
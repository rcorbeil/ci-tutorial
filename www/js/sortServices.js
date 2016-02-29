angular.module('sortServices', [])
  .service('sortSvc', [function(){
    this.bubbleSort = function(unsortedArray){
        var sortedArray = unsortedArray;
        var swapped;
        do {
          swapped = false;
          for( var i=0; i<sortedArray.length-1; i++){
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
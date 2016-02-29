describe('Services', function(){
    var sortSvcObj;
    
    // load the service's module 
    beforeEach(module('sortServices'));
    beforeEach(inject(function( sortSvc ){
      sortSvcObj=sortSvc;
    }));

    
    // tests start here
    it('sorts in ascending order by default', function() {
    var users = ['jack', 'igor', 'jeff'];
    var sorted = sortSvcObj.bubbleSort(users);
    expect(sorted).toEqual(['jeff', 'jack', 'igor']);
  });
});
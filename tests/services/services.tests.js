describe('Services', function(){
    var sortSvcObj;
    
    // load the service's module 
    beforeEach(module('sortServices'));
    beforeEach(inject(function( sortSvc ){
      sortSvcObj=sortSvc;
    }));

    
    // tests start here
    it('sorts in ascending order by default', function() {
    var users = ['robin', 'ryn', 'shawn', 'piper', 'lark', 'per', 'teal'];
    var sorted = sortSvcObj.bubbleSort(users);
    expect(sorted).toEqual(['lark', 'per', 'piper', 'robin', 'ryn', 'shawn', 'teal']);
  });
});
describe('Services', function(){
  
    //Test the sort routine
    var sortSvcObj;
    
    // load the service's module 
    beforeEach(module('sortServices'));
    beforeEach(inject(function( sortSvc ){
      sortSvcObj=sortSvc;
    }));

    // tests start here
    it('sorts in ascending order', function() {
    var users = ['robin', 'ryn', 'shawn', 'piper', 'lark', 'per', 'teal'];
    var sorted = sortSvcObj.bubbleSort(users);
    expect(sorted).toEqual(['lark', 'per', 'piper', 'robin', 'ryn', 'shawn', 'teal']);
    });
  
    //Test the TKanswers routine
    var answersSvcObj;
    beforeEach(module('TKServicesModule'));
    beforeEach(inject(function( TKAnswersService ){
      answersSvcObj=TKAnswersService;
    }));
    
    it('sets and gets the answer categories', function() {
        var answerCategories = {
            "competing": 6,
            "collaborating": 5,
            "compromising": 4,
            "avoiding": 10,
            "accommodating": 12
        };
        
        answersSvcObj.setAnswers(answerCategories);
        var gottenAnswers = {};//answersSvcObj.getAnswers();
        
        expect(gottenAnswers).toEqual(answerCategories);
    });
      
});
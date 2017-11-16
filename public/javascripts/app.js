angular.module('app', [])
.controller('MainCtrl', [
  '$scope','$http',
  function($scope,$http){

    $scope.stickies = [];

    var test = {
      id: "1",
      text: "Our Sticky Note Page :D",
      height: 250,
      width: 250,
      top: 10,
      left: 9
    };


    // Functions on Stickies ------------------------------------------------------------------------------

    $scope.create = function(sticky){

      $('.container').append("<div id=" + sticky.id +"div"+ " class='sticky_note'>"+
      "<div class='inner_container'>"+
        "<textarea id=" + sticky.id+"text"+ " class='content'>" + sticky.text + "</textarea>"+
        "<button id="+sticky.id+"button" + ">Save</button>" + 
      "</div>");

      $('#'+sticky.id+"button").css({'visibility': 'hidden'});
      $('#'+sticky.id+"button").click(function(){

        //Call PUT method for text here
        $('#'+sticky.id+"button").css({'visibility': 'hidden'});
      });
      $('#'+sticky.id+"text").click(function(){
        $('#'+sticky.id+"button").css({'visibility': 'visible'}); // ON Edit enable save button
      });

      // Set up position and size of sticky
      $('#'+sticky.id+"div").css({'top': sticky.top, 'left' :sticky.left});
      $('#'+sticky.id+"div").css({'height': sticky.height, 'width': sticky.width})   
      $('#'+sticky.id+"div").draggable({
        handle: "div.inner_container",
        stop: function(event, ui) {
            //var Stoppos = $(this).position();
            //var height = $(this).height();
            //var width = $(this).width();
            //alert("Position: " + "\nTop: " + Stoppos.top + "\nLeft: " + Stoppos.left);
            //alert("Size: " + "\nWidth: " + width + "\nHeight: " + height);

            // Call position save
        }
      });
      
      
    };


    // Functions accessing Server -----------------------------------------------------------------------------
    $scope.getStickiesFromServer = function(){
      return $http.get('/stickies').success(function(data){
        console.log(data);
        angular.copy(data, $scope.stickies);
        console.log($scope.stickies);
      });
    }

    $scope.sendSticky = function(sticky){
      $http.post('/sticky', sticky).success(function(data){
        $scope.stickies.push(data);
        $scope.create(data);
      });
    }

    // $scope.updateText = function(sticky, id){
    //   $http.put('/sticky/id/text', sticky.text)
    // }


    // Page functions ----------------------------------------------------------------------------------------
    $scope.getAll = function(){
      $scope.getStickiesFromServer();
      $scope.stickies.forEach(function(sticky){
        create(sticky);
      });
    }

    $scope.addNew = function(){
      var newSticky = {
        text: "New Sticky",
        height: 250,
        width: 250,
        top: 10,
        left: 9
      };
      $scope.sendSticky(newSticky);
    }

    //$scope.create(test);

    // Run on start up
    $scope.getAll();
  }
]);



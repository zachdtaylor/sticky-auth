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

      $('.container').append("<div id=" + sticky._id +"div"+ " class='sticky_note'>"+
      "<div class='inner_container'>"+
        "<textarea id=" + sticky._id+"text"+ " class='content'>" + sticky.text + "</textarea>"+
        "<button id="+sticky._id+"button" + ">Save</button>" + 
        "<button id="+sticky._id+"delButton" + " class='deleteButton' >Delete</button>" + 
        "</div>" +
      "</div>");

      $('#'+sticky._id+"button").css({'visibility': 'hidden'});
      $('#'+sticky._id+"delButton").css({'visibility': 'hidden'});
      $('#'+sticky._id+"button").click(function(){

        //Call PUT method for text here
        $('#'+sticky._id+"button").css({'visibility': 'hidden'});
        $('#'+sticky._id+"delButton").css({'visibility': 'hidden'});
      });
      $('#'+sticky._id+"text").click(function(){
        $('#'+sticky._id+"button").css({'visibility': 'visible'}); // ON Edit enable save button
        $('#'+sticky._id+"delButton").css({'visibility': 'visible'}); // ON Edit enable save button
      });
      $('#'+sticky._id+"delButton").click(function(){
          $scope.deleteSticky(sticky, function(){
            $('#'+sticky._id+"delButton").remove();
            var index = $scope.stickies.indexOf(sticky);
            if(index>=0)$scope.stickies = $scope.stickies.splice(index, 1);
          });
      });

      // Set up position and size of sticky
      $('#'+sticky._id+"div").css({'top': sticky.top, 'left' :sticky.left});
      $('#'+sticky._id+"div").css({'height': sticky.height, 'width': sticky.width})  
      $('#'+sticky._id+"div").draggable({
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
    $scope.getAll = function(){
      return $http.get('/sticky').success(function(data){
        console.log(data);
        angular.copy(data, $scope.stickies);
        $scope.stickies.forEach(function(sticky){
          console.log(sticky);
          $scope.create(sticky);
        });
      });
    }

    $scope.deleteSticky = function(sticky, callback){
      $http.delete('/sticky/' + sticky._id).success(callback);
    }

    $scope.sendSticky = function(sticky){
      $http.post('/sticky', sticky).success(function(data){
        $scope.stickies.push(data);
        $scope.create(data);
      });
    }


    // Page functions ----------------------------------------------------------------------------------------

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

    $scope.deleteAll = function(){
      $http.delete('/sticky').success(function(){
        $scope.stickies.forEach(function(sticky){
          console.log("removing");
          $('#'+sticky._id +"div").remove();
        })
        $scope.stickies = [];
      })
    }
    // Run on start up
    $scope.getAll();
  }
]);



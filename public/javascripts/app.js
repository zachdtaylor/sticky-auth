angular.module('app', [])
.controller('MainCtrl', [
  '$scope','$http',
  function($scope,$http){

    $scope.stickies = [];
    $scope.colors = ['#ffc', '#A4D555', '#FF5992', '#99D3DF'];

    // Functions on Stickies ------------------------------------------------------------------------------

    $scope.create = function(sticky){

      $('.container').append("<div id=" + sticky._id +"div"+ " class='sticky_note'>"+
      "<div class='inner_container'>"+
        "<textarea id=" + sticky._id+"text"+ " class='content'>" + sticky.text + "</textarea>"+
        "<div class='footer'>"+
        "<button id="+sticky._id+"button" + ">Save</button>" + 
        "<button id="+sticky._id+"delButton" + " class='deleteButton' >Delete</button>" + 
        "</div>"+
        "</div>" +
      "</div>");

      $('#'+sticky._id+"button").css({'visibility': 'hidden'});
      $('#'+sticky._id+"delButton").css({'visibility': 'hidden'});
      $('#'+sticky._id+"button").click(function(){
        $scope.updateText(sticky._id, $('#'+sticky._id+"text").val());
        $('#'+sticky._id+"button").css({'visibility': 'hidden'});
        $('#'+sticky._id+"delButton").css({'visibility': 'hidden'});
      });
      $('#'+sticky._id+"text").click(function(){
        $('#'+sticky._id+"button").css({'visibility': 'visible'}); // ON Edit enable save button
        $('#'+sticky._id+"delButton").css({'visibility': 'visible'}); // ON Edit enable save button
      });
      $('#'+sticky._id+"delButton").click(function(){
          $scope.deleteSticky(sticky, function(){
            $('#'+sticky._id+"div").remove();
            var index = $scope.stickies.indexOf(sticky);
            if(index>=0)$scope.stickies = $scope.stickies.splice(index, 1);
          });
      });
      $('#'+sticky._id+"div").mouseup(function(){
          $scope.updateSize(sticky._id, $('#'+sticky._id+"div").height(), $('#'+sticky._id+"div").width());
      });

      // Set up position and size of sticky
      $('#'+sticky._id+"div").css({'top': sticky.top, 'left' :sticky.left});
      $('#'+sticky._id+"div").css({'height': sticky.height, 'width': sticky.width}) 
      $('#'+sticky._id+"div").css({'background': sticky.color}) 
      $('#'+sticky._id+"div").draggable({
        handle: "div.inner_container",
        stop: function(event, ui) {
            var Stoppos = $(this).position();
            //var height = $(this).height();
            //var width = $(this).width();
            //alert("Size: " + "\nWidth: " + width + "\nHeight: " + height);
            $scope.updatePosition(sticky._id,Stoppos.top, Stoppos.left);
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

    $scope.updateText = function(id, text){
      $http.put('/sticky/' + id + '/text', {"text": text}).success(function(){
          console.log("Successful update text");
      });
    }

    $scope.updatePosition = function(id, top, left){
      $http.put('/sticky/' + id + '/loc', {"top": top, "left": left}).success(function(){
        console.log("Successful update of position");
      })
    }
    

    $scope.updateSize = function(id, height, width){
      $http.put('/sticky/' + id + '/size', {"height": height, "width": width}).success(function(){
        console.log("Successful update of size");
      })
    }


    // Page button functions ----------------------------------------------------------------------------------------
    $scope.currentColor = 0;
    $scope.addNew = function(){
      var newSticky = {
        text: "New Sticky",
        height: 250,
        width: 250,
        top: 284,
        left: 11,
        color: $scope.colors[currentColor]
      };
      if($scope.currentColor == $scope.currentColor.length){
        $scope.currentColor = 0;
      }
      else{
        $scope.currentColor = $scope.currentColor+1;
      }
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



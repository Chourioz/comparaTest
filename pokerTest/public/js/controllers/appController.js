
angular.module("initController",[])

  .controller('pokerController', function ($scope, $http) {

    // Variable
    $scope.game = false;

    $scope.users = [
      {name: 'Hand 1', cards: [], result: ''},
      {name: 'Hand 2', cards: [], result: ''}
    ]
    $scope.cards = [];

    $scope.table = [];

    $scope.scale = ["1 Pair", "2 Pairs", "3 of a Kind", "Straight", "Flush","Full House", "Poker", "Ace Straight"];
    $scope.suitSymbols = [
      {symbol:"♠", name: 'spades'},
      {symbol: "♣", name: 'clubs'},
      {symbol: "♥", name: 'hearts'},
      {symbol: "♦", name: 'diamonds'}
    ];

    $scope.hightCard = "2";
    $scope.player;

    // Variable

    // function to analyze the hand of a player
    $scope.checkHand = function (user, table) {
      var hand = [];
      var valuesArray = [];
      var suitsArray = [];
      var hand = user.concat(table);
      var resultString = "";


      convertHand();

      switch(duplicateCards()){
           case "2":
                resultString = "1 Pair";
                break;
            case "22":
                resultString = "2 Pairs";
                break;
           case "3":
                resultString = "3 of a Kind";
                break;
           case "23":
           case "32":
                resultString = "Full House";
                break;
           case "4":
                resultString = "Poker";
                break;
           default:
                if(isStraight()){
                     resultString = "Straight";
                }
                if(isAceStraight()){
                     resultString = "Ace Straight";
                }
                break;
      }

      if(isFlush()){
           if(resultString){
                resultString += " and Flush";
           }
           else{
                resultString = "Flush";
           }
      }

      if(!resultString){
           resultString = "Nothing";
      }

      function convertHand(){

           for(var i = 0; i < hand.length; i ++){
                valuesArray[i] = hand[i].number;
                suitsArray[i] = hand[i].suit;
           }
      }

      function isFlush(){
           for(var i = 0; i < 4; i ++){
                if(suitsArray[i] != suitsArray[i+1]){
                     return false;
                }
           }
           return true;
      }

      function isStraight(){
           var lowest = getLowest();
           for(var i = 1; i < 5; i++){
                if(occurrencesOf(lowest + i) != 1){
                     return false
                }
           }
           return true;
      }

      function isAceStraight(){
           var lowest = 9;
           for(var i = 1; i < 4; i++){
                if(occurrencesOf(lowest + i) != 1){
                     return false
                }
           }
           return occurrencesOf(1) == 0;
      }

      function getLowest(){
           var min = "2";
           for(var i = 0; i < valuesArray.length; i++){
             if (valuesArray < min) {
               min = valuesArray
             }
           }
           return min;
      }

      function duplicateCards(){
           var occurrencesFound = [];
           var result = "";
           for(var i = 0; i < valuesArray.length; i++){
                var occurrences = occurrencesOf(valuesArray[i]);
                if(occurrences > 1 && occurrencesFound.indexOf(valuesArray[i]) == -1){
                     result += occurrences;
                     occurrencesFound.push(valuesArray[i]);
                }
           }
           return result;
      }

      function occurrencesOf(n){
           var count = 0;
           var index = 0;
           do{
                index = valuesArray.indexOf(n, index) + 1;
                if(index == 0){
                     break;
                }
                else{
                     count ++;
                }
           } while(index < valuesArray.length);
           return count;
      }

      return resultString;
    };

    // function to display the winner player
    $scope.winner = function () {
      if ($scope.scale.indexOf($scope.users[0].result) > $scope.scale.indexOf($scope.users[1].result)) {
        $scope.player = $scope.users[0].name;
        $scope.result = $scope.users[0].result;
      }else if ($scope.scale.indexOf($scope.users[0].result) == $scope.scale.indexOf($scope.users[1].result)) {
        $scope.users.forEach(function (element) {
          element.cards.forEach(function (elm) {
            if ((elm.number > $scope.hightCard) && elm.number !== 'A') {
              $scope.hightCard = elm.number;
              $scope.player = element.name;
              $scope.result = element.result+ " & High card"
            }else if (elm.number === 'A') {
              $scope.hightCard = 'A'
              $scope.player = element.name;
              $scope.result = element.result + " & High card"
            }else if (elm.number === 'K' && elm.number !== 'A') {
              $scope.hightCard = 'K'
              $scope.player = element.name;
              $scope.result = element.result+ " & High card"
            }
          })
        })
      }else {
        $scope.player = $scope.users[1].name;
        $scope.result = $scope.users[1].result;
      }
    };

    // Function to initialize the game
    $scope.play = function () {
      $http.post('https://services.comparaonline.com/dealer/deck')
      .then(function (token) {
        $http.get("https://services.comparaonline.com/dealer/deck/"+token.data+"/deal/9")
        .then(function (cards) {
          cards.data.forEach(function (card) {
            $scope.suitSymbols.forEach(function (elment) {
              if (card.suit === elment.name) {
                $scope.cards.push({number: card.number, suit: card.suit, symbol: elment.symbol})
              }
            })
          });

          var i = 0;
          while (i < 4) {
            $scope.users[0].cards.push($scope.cards[i])
            $scope.users[1].cards.push($scope.cards[i+1])
            $scope.cards.splice(i,2)
            i = i +1;
            i++;
          }

        },function (dealError) {
          if (dealError.status === 500 || dealError.status === 502) {
            $scope.play();
          }
        })
      }, function(tokenError) {
        if (tokenError.status === 500 || tokenError.status === 502) {
          $scope.play();
        }
      })
      $scope.game = true;

    }

    // Function to clean program variables
    $scope.clean = function () {
      $scope.cards = [];
      $scope.table = [];
      $scope.player = '';
      $scope.result = "";
      $scope.users[0].cards = [];
      $scope.users[1].cards = []
    }

    // Function to display cards on the table
    $scope.deal = function () {
      $scope.table = $scope.cards;

      $scope.users[0].result = $scope.checkHand($scope.users[0].cards, $scope.table);
      $scope.users[1].result = $scope.checkHand($scope.users[1].cards, $scope.table);
      $scope.winner();
    }

  });

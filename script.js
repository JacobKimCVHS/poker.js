
const deck = [];


let playerHand = [];
let aiHand = [];
let community = [];
let playerMoney = 1000;
let aiMoney = 1000;
let round = 0;

//Creates a deck of cards to use for Poker
const suits = ['spades', 'clubs', 'diamonds', 'hearts'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
function startDeck() {
    deck.length = 0;
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }
}
// Creates the 52 cards in a deck

//Shuffles the card deck fully by using Math.random in order to swap a random card from the deck with card positioned from deck[i]
function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}


// Removes 2 cards each from the deck to give for player's hand and ai's hand. Players card is displayed while the AI's card is hidden. Shows Pot for the Round and the money.
function dealCards(deck) {
    playerCards = [deck.pop(), deck.pop()];
    aiCards = [deck.pop(), deck.pop()];
}

// Remove cards from deck and places it into the community with the input of the round provided
function dealCommunityCards(round) {
    if (round == 1) {
        community = [deck.pop(), deck.pop(), deck.pop()];
    } 
    else if (round == 2 || round == 3) {
        community.push(deck.pop());
    }
}

// use concat do combine arrays to get the full hand of the player and get the strength of the hand.
function sameCard(rankCards){
    rankCards.sort((a, b) => a - b);
    let count = 0;
    let pairCount = 0;
    for (let i = 0; i < rankCards.length - 1; i++){
        if (rankCards[i] == rankCards[i + 1]) {
            for(let j = i + 1; j < rankCards.length - 1; j++){
                if (rankCards[i] == rankCards[j]){
                    pairCount = rankCards[i];
                    count++;
                }
                if (pairCount != rankCards[i]){
                    break;
                }
            }
        }
    }
    if (count == 3){
        return 4; // four of a kind
    }
    else if (count == 2){
        return 3; // three of a kind
    }

    else if (count == 1){
        return 2; // pair
    }
}






function straight(rankCards){
    rankCards.sort((a, b) => a - b); // used google to find the sort code
    let count = 0;
    for (let i = 0; i < rankCards.length - 1; i++) {
        if (rankCards[i] + 1 == rankCards[i + 1]) {
            count++;
        } 
        else {
            count = 0;
        }
        if (count === 4) {
            return true;
        }
    }
}


function flush(suitCards){
    suitCards.sort();
    let count = 0;
    for (let i = 0; i < suitCards.length - 1; i++)
        if (suitCards[i] == suitCards[i + 1]) {
            count++;
        }
        else {
            count = 0;
        }
        if (count === 4){
            return true;
        }
}

function royalFlush(rankCards, suitCards){
    if (straight(rankCards) && flush(suitCards) && rankCards.includes(14)){
        return true;
    }
}

function straightFlush(rankCards, suitCards){
    if (straight(rankCards) && flush(suitCards)){
        return true;
    }
}
function fourOfAKind(rankCards){
    if (sameCard(rankCards) == 4){
        return true;
    }
}
function threeOfAKind(rankCards){
    if (sameCard(rankCards) == 3){
        return true;
    }
}

function Pair(rankCards){
    if (sameCard(rankCards) == 2){
        return true;
    }
}

function fullHouse(rankCards){
    let three = false;
    let two = false;
    for (let i = 0; i < rankCards.length - 1; i++){
        let count = 0;
        while (rankCards[i] == rankCards[i + 1]) {
            count += 1;
            i += 1;
        }
        if (count == 2){
            three = true;
        }
        else if (count == 1){
            two = true;
        }
    }
    if (three == true && two == true){
        return true;
    }
}
function twoPair(rankCards){
    let count = 0;
    for (let i = 0; i < rankCards.length - 1; i++){

        if (rankCards[i] == rankCards[i + 1]) {
            count += 1;
        }
    }
    if (count == 2){
        return true;
    }

}

//.map(Number)
function valueHand(playerHand, community) {
    const rankValue = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
      '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14};
    let cards = playerHand.concat(community);
    let rankCards = cards.map(card => rankValue[card.rank]); // used google to find the map code
    let suitCards = cards.map(card => card.suit); // used google to find the map code
    let strength = 0;
    if (royalFlush(rankCards, suitCards)){
        strength = 9000 + Math.max(rankCards);
    }
    else if (straightFlush(rankCards, suitCards)){
        strength = 8000 + Math.max(rankCards);
    }
    else if (fourOfAKind(rankCards)){
        strength = 7000 + Math.max(rankCards);
    }
    else if (fullHouse(rankCards)){
        strength = 6000 + Math.max(rankCards);
    }
    else if (flush(suitCards)){
        strength = 5000 + Math.max(rankCards);
    }
    else if (straight(rankCards)){
        strength = 4000 + Math.max(rankCards);
    }
    else if (threeOfAKind(rankCards)){
        strength = 3000 + Math.max(rankCards);
    }
    else if (twoPair(rankCards)){
        strength = 2000 + Math.max(rankCards);
    }
    else if (Pair(rankCards)){
        strength = 1000 + Math.max(rankCards);
    }
    else {
        strength = Math.max(rankCards);
    }
    return strength;
}

function aiDecision(aiCards, community) {
    let choice = 0;

    const aiHandStrength = valueHand(aiCards, community);
    const decision = Math.random();

    // If the player checked, the AI can only check or raise
        // if AI has a weak hand (high card) and decision through Math.random less than 0.3, AI checks
    // 4 = raise
    // 3 = call
    // 2 = check
    // 1 = fold
    if (aiHandStrength >= 5000) {
        choice = 4;
    } 
    else if (aiHandStrength >= 1000){
        if (decision < 0.3){
            choice = 3;
        }
        else {
            choice = 4;
        }
    else if (aiHandStrength < 1000){
        if (decision > 0.6){
            choice = 2;
        }
        else {
            choice = 1;
        }
    }
    return choice;
}
}
function aiBet(aiCards, community, currentBet, currentPot, aiMoney, playerMoney){
    let raise = 0;
    if (aiDecision(aiCards, community) == 4){
        raise = Math.min(aiMoney, currentPot * 2);
        if (playerMoney - raise < 0){
            raise = playerMoney;
        }
        currentPot += raise;
        aiMoney -= raise;
        currentBet = raise;
    }
    else if (aiDecision(aiCards, community) == 3){
        currentPot += currentBet;
        aiMoney -= currentBet;
    }
    else if (aiDecision(aiCards, community) == 2){
        currentPot += 0;
    }
    else if (aiDecision(aiCards, community) == 1){
        playerMoney += currentPot;
        currentPot = 0;
    }
}
function playerDecision(playerCards, community, currentBet, currentPot, playerMoney, aiMoney){
    let playerChoice = 0;
    console.log("Your hand is: " + playerCards);
    console.log("The community cards are: " + community);
    console.log("The current bet is: " + currentBet);
    console.log("The current pot is: " + currentPot);
    console.log("Your money is: " + playerMoney);
    console.log("The AI's money is: " + aiMoney);
    while (playerChoice != 1 && playerChoice != 2 && playerChoice != 3 && playerChoice != 4){
        playerChoice = prompt("What would you like to do? 1. Fold 2. Check 3. Call 4. Raise (Enter the number)");
    if (playerChoice == 1){
        aiMoney += currentPot;
        currentPot = 0;
    }
    else if (playerChoice == 2 && currentBet = 0){
        currentPot += 0;
    }
    else if (playerChoice == 4){
        let raise = prompt("How much would you like to raise? (Enter a number greater than Current Bet)");
        if (raise > playerMoney){
            raise = playerMoney;
        }
        if (raise < currentBet){
            raise = currentBet;
        }
        currentPot += raise;
        playerMoney -= raise;
        currentBet = raise;
    }
    else {
        playerMoney -= currentBet;
        currentPot += currentBet;
        currentBet = 0;
    }
}



}

function end(outcome, playerMoney, aiMoney, currentPot){
    if (outcome == 1){
        playerMoney += currentPot;
        currentPot = 0;
    }
    else if (outcome == 2){
        aiMoney += currentPot;
        currentPot = 0;
    }
    else if (outcome == 3){
        playerMoney += currentPot / 2;
        aiMoney += currentPot / 2;
        currentPot = 0;
    }
}
function nextRound(round) {
    if (round == 0) {
        round = 1;
        dealCommunityCards(round); // Deal the flop

    } 
    else if (round == 1) {
        round = 2;
        dealCommunityCards(round); // Deal the turn
    } 
    else if (round == 2) {
        round = 3;
        dealCommunityCards(round); // Deal the river
    }
    else if (round == 3) {
        // Compare hands and determine the winner
        const playerHand = valueHand(playerCards, community);
        const aiHand = valueHand(aiCards, community);

        if (playerHand > aiHand) {
            end(1, playerMoney, aiMoney, currentPot);
        } else if (playerHand.strength < aiHand.strength) {
            end(2, playerMoney, aiMoney, currentPot);
        } else {
            end(3, playerMoney, aiMoney, currentPot);
        }
        round = 4;
    }
}
while(playerMoney > 0 && aiMoney > 0){
    startDeck();
    shuffleDeck(deck);
    dealCards(deck);
    dealCommunityCards(round);
    while (round <= 3 && aiDecision(aiCards, community) != 1 && playerDecision(playerCards, community, currentBet, currentPot, playerMoney, aiMoney) != 1){
    playerDecision(playerCards, community, currentBet, currentPot, playerMoney, aiMoney);
    aiBet(aiCards, community, currentBet, currentPot, aiMoney, playerMoney);
    nextRound(round);
    }
}






pragma solidity ^0.4.17;

contract SingleBet {
    address private owner;
    address private oracle;
    uint expiration;

    bool private isOpen;
    uint8 private winner;

    string private homeTeamName;
    string private awayTeamName;

    uint8 private choiceHome = 1;
    uint8 private choiceAway = 2;
    uint8 private choiceDraw = 3;

    /**
    * @dev Mapping of placed bets per choice
    * choice 1 = home team win
    * choice 2 = away team win
    * choice 3 = draw
    * @param choice => address => amount
    */
    mapping (uint8=>mapping (address=>uint)) bets;
    mapping (uint8=>uint) totalBetsAmount;
    mapping (address=>bool) payedCustomers;

    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    modifier isSettled() {
        require(isOpen == false);
        _;
    }

    modifier isNotOver() {
        require(isOpen == true);
        _;
    }

    modifier isValidChoice(uint8 choice) {
        require(choice == choiceHome || choice == choiceAway || choice == choiceDraw);
        _;
    }

    event Settle(uint8 wnr);
    event Bet(uint8 choice, address addr, uint256 amount);
    event CollectWinnigs(address addr, uint initalBet, uint totalWinnigs);

    function SingleBet(address _oracle, string _homeTeamName, string _awayTeamName) public {
        owner = msg.sender;
        oracle = _oracle;
        homeTeamName = _homeTeamName;
        awayTeamName = _awayTeamName;
        isOpen = true;
        expiration = now + 5 minutes; //+ 1 weeks; For demo purposes commented out
    }

    function getBetMetaInfo() public view returns(bool, string, string, uint) {
        return (isOpen, homeTeamName, awayTeamName, expiration);
    }

    function getWinner() isSettled public view returns(uint8) {
        return winner;
    }

    /**
    * @dev Oracle settles the bet. Recieves 10% of losing money
    * as reward for giving the result.
    * @param _winner 1 - home team, 2 - away team, 3 - draw
    */
    function settleBet(uint8 _winner) isNotOver isValidChoice(_winner) public {
        require(msg.sender == oracle);
        isOpen = false;
        winner = _winner;
        Settle(_winner);
        
        uint8 loser1;
        uint8 loser2;
        (loser1, loser2) = getLosers(_winner);

        uint reward1 = totalBetsAmount[loser1] / 10;
        totalBetsAmount[loser1] -= reward1;
        uint reward2 = totalBetsAmount[loser2] / 10;
        totalBetsAmount[loser2] -= reward2;

        msg.sender.transfer(reward1 + reward2);
    }

    /**
    * @dev Place bet on open event.
    * @param choice 1 - home team, 2 - away team, 3 - draw
    */
    function bet(uint8 choice) isNotOver isValidChoice(choice) public payable {
        require(bets[choice][msg.sender] + msg.value > bets[choice][msg.sender]);
        require(totalBetsAmount[choice] + msg.value > totalBetsAmount[choice]);
        require(totalBetsAmount[choice] * 10 ** 6 >= totalBetsAmount[choice]);
        
        bets[choice][msg.sender] += msg.value;
        totalBetsAmount[choice] += msg.value;
        Bet(choice, msg.sender, msg.value);
    }

    /**
    * @dev Get bets placed by Address
    * @param addr Betting address
    * @return (home team bet amount, away team bet amount, draw bet amount)
    */
    function getBets(address addr) public view returns(uint, uint, uint) {
        return (bets[choiceHome][addr], bets[choiceAway][addr], bets[choiceDraw][addr]);
    }

    function checkTotalBalance() public view returns(uint) {
       return this.balance; 
    }

    function getPossibleWinnig(uint8 choice, uint amount) isValidChoice(choice) public view returns(uint) {
        uint8 loser1;
        uint8 loser2;
        (loser1, loser2) = getLosers(choice);
        uint winnings = totalBetsAmount[choice] + amount;
        uint percentageOfWins = getPercent(amount, winnings);
        uint losings = totalBetsAmount[loser1] + totalBetsAmount[loser2];
        uint afterOracle = (losings - (losings / 10));
        
        return (afterOracle * percentageOfWins) / 10 ** 4;
    }

    function collectWinnigs() isSettled public {
        require(payedCustomers[msg.sender] == false);
        uint initialBet = bets[winner][msg.sender];
        assert(initialBet > 0);
        
        uint winningsForCustomer = getWinnings();

        payedCustomers[msg.sender] = true;
        CollectWinnigs(msg.sender, initialBet, winningsForCustomer);
        
        msg.sender.transfer(winningsForCustomer);
    }

    function getWinnings() isSettled public view returns(uint) {
        uint initialBet = bets[winner][msg.sender];
        if (initialBet == 0 || payedCustomers[msg.sender] == true) {
            return 0;
        }

        uint8 loser1;
        uint8 loser2;
        (loser1, loser2) = getLosers(winner);
        uint winnings = totalBetsAmount[winner];

        
        uint percentageOfWins = getPercent(initialBet, winnings);
        uint losings = totalBetsAmount[loser1] + totalBetsAmount[loser2];
        uint winningsForCustomer = ((losings * percentageOfWins) / 10 ** 4) + initialBet;
        
        return winningsForCustomer;
    }

    function destroyExpiredEvent() isOwner public {
        require(now > expiration);
        selfdestruct(owner);
    }
    
    function getLosers(uint8 _winner) private view returns(uint8, uint8) {
        if (_winner == choiceHome) {
            return (choiceAway, choiceDraw);
        }

        if (_winner == choiceAway) {
            return (choiceHome, choiceDraw);
        }

        if (_winner == 3) {
            return (choiceHome, choiceAway);
        }
    }

    /**
    * @dev Get percentage, rouding down after 2nd decimal point
    * https://stackoverflow.com/questions/42738640/division-in-ethereum-solidity/42739843
    * @param numerator number to be divided
    * @param denominator number dividing
    * @return integer, percentage is 8773 => 87.73% 
    */
    function getPercent(uint numerator, uint denominator) private pure returns(uint) {
        uint _numerator = numerator * 10 ** (5);
        uint _quotient = ((_numerator / denominator)) / 10;

        return _quotient;
    }
}
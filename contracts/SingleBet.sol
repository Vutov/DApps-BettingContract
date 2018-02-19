pragma solidity ^0.4.17;

contract SingleBet {
    address private owner;
    address private oracle;

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

    modifier isSettled() {
        require(isOpen == false);
        _;
    }

    modifier isNotOver() {
        require(isOpen == true);
        _;
    }

    event Settle(uint8 wnr);
    event Bet(uint8 choice, address addr, uint256 amount);

    function SingleBet(address _oracle, string _homeTeamName, string _awayTeamName) public {
        owner = msg.sender;
        oracle = _oracle;
        homeTeamName = _homeTeamName;
        awayTeamName = _awayTeamName;
        isOpen = true;
        // TODO time close bets?
    }

    function getBetMetaInfo() public view returns(bool, string, string) {
        return (isOpen, homeTeamName, awayTeamName);
    }

    function getWinner() isSettled public view returns(uint8) {
        return winner;
    }

    /**
    * @dev Oracle settles the bet.
    * @param _winner 1 - home team, 2 - away team, 3 - draw
    */
    function settleBet(uint8 _winner) public {
        require(msg.sender == oracle);
        Settle(_winner);
        isOpen = false;
        winner = _winner;

        // TODO payout
    }

    /**
    * @dev Place bet on open event.
    * @param choice 1 - home team, 2 - away team, 3 - draw
    */
    function bet(uint8 choice) isNotOver public payable {
        require(choice == choiceHome || choice == choiceAway || choice == choiceDraw);
        Bet(choice, msg.sender, msg.value);
        // todo require for overflow + tests
    }

    /**
    * @dev Get bets placed by Address
    * @param addr Betting address
    * @return (home team bet amount, away team bet amount, draw bet amount)
    */
    function getBets(address addr) public view returns(uint, uint, uint) {
        return (bets[choiceDraw][addr], bets[choiceDraw][addr], bets[choiceDraw][addr]);
    }

    function checkTotalBalance() public view returns(uint) {
       return this.balance; 
    }

    // TODO
    function getPossibleWinnig() public pure returns(uint) {
        return 0;
    }

    // TODO
    function manualGetWinnigs() public pure {

    }

    // TODO
    function manualSettleBet() public pure {

    }

    // TODO
    function changeOracle() public pure {
        
    }

    // TODO
    function cancleEvent() public pure {

    }
}
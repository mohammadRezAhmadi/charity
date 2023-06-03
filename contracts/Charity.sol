//SPDX-License-Identifier:MIT
    pragma solidity ^0.8.0;
    import "hardhat/console.sol";

    contract Charity{

        address public owner;
        uint48 public deadline;
        uint32 public counterNeedy;
        uint32 public counterFunders = 0;
        uint48 public minCharityPrice = 0.0001 ether;
        uint32 public CounterTotal = 0;

        enum status {Start,Pending,End}
        status public level;
        
        struct helper{
            uint32 Id;
            address payable Person;
            bool voteStatus;
            uint256 value;
        }
        struct poor{
            uint32 id;
            address payable person;
            uint32 vote;
            bool condition;
            uint256 percentage;
            uint256 liquidyShare;
        }
        mapping(uint32 => helper) public helpers;
        mapping(uint32 => poor)public needy;

        modifier OnlyOwner(){
            require(msg.sender == owner , "caller is not Owner!");
            _;
        }
        modifier levelStart() {
            require(level == status.Start , "The stage must be started!");
            _;
        }
        modifier levelPending(){
            require(level == status.Pending , "The step must be pending!");
            _;
        }
        modifier levelEnd(){
            require(level == status.End , "The step must be end!");
            _;
        }

        receive()external payable{}

        constructor(uint _deadline){
            owner = msg.sender;
            deadline = uint40(block.timestamp + _deadline);
        }
        function getBalance()public view returns(uint){
            return address(this).balance;
        }
        function IntroNeeded(address _addr)public OnlyOwner levelStart{
            require(needy[counterNeedy].condition == false , "This address has been entered");
            needy[counterNeedy] = poor(counterNeedy, payable(_addr) , 0 , true ,0 , 0);
            counterNeedy++;
            console.log("debugging on sol" , _addr);
        }
            function cahangeLevelToPending()public OnlyOwner levelStart{
                level = status.Pending;
        }
        function assist(uint24 _id)public payable levelPending{
            require(msg.value >= minCharityPrice , "There is little money coming in");
            require(helpers[counterFunders].voteStatus == false , "This address has been voted");
            require(needy[_id].condition == true , "this address not true!");
            payable(address(this)).transfer(msg.value);
            helpers[counterFunders] = helper(counterFunders , payable(msg.sender) , true , msg.value);
            CounterTotal++;
             needy[_id].vote++;
            counterFunders++;
            for(uint24 x ; x <= counterNeedy ; x++){
            needy[x].percentage = (needy[x].vote * 100) / CounterTotal;
            needy[x].liquidyShare = (address(this).balance * needy[x].percentage) / 100;
            }
     
        }
        function changeLevelToEnd()public OnlyOwner levelPending{
            require(block.timestamp >= deadline , "The charity is active!");
            level = status.End; 
        }
        function payOff(uint32 _id)public payable levelEnd{
            //Possibility of attack (denial of service) 
            // for(uint24 x ; x <= counterNeedy;x++){
            // address payable person = needy[x].person;
            // person.transfer(needy[x].liquidyShare);
            require(needy[_id].person == msg.sender , "caller not needy");
            if(needy[_id].vote == 0){
                revert();
            }
            else{
                payable(msg.sender).transfer(needy[_id].liquidyShare);
            }
        }
    }
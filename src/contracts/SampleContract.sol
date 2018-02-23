pragma solidity ^0.4.4;

contract SampleContract {

    // This value is visible in etherscan.io explorer
    uint public value;

    event valueChanged(uint val);

    // Anyone can call this contract and override the value of the previous caller
    function setValue(uint value_) public {
        value = value_;
        valueChanged(value);
    }
    function getValue() public constant returns (uint) {
        return value;
    }

}

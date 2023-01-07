// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./PlatformStructs.sol";
import "./Tasks.sol";
import "./Services.sol";
import "./Profiles.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";


contract PlatformFactory is Ownable, Tasks, Services, Profiles {

    uint8 public arbiterRewardPercentage; // arbiter reward in %

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet internal invitedArbiters;

    constructor() {
        arbiterRewardPercentage = 10;
        invitedArbiters.add(msg.sender);
    }

    event DisputeOpened(uint taskId);
    event DisputeResolved(uint taskId);

    function withdrawFees()
        public
        payable
        onlyOwner
        nonReentrant
        returns (bool)
    {
        (bool success, ) = payable(msg.sender).call{value: totalFees}("");
        require(success, "Tranfer failed.");
        totalFees = 0;
        return true;
    }

    function setPlatformFee(uint8 _fee) public onlyOwner returns (bool) {
        platformFeePercentage = _fee;
        emit FeeUpdated(_fee);
        return true;
    }

    function rateUser(address _address, uint8 _rating) public returns (bool) {
        require(_rating <= 5, "Rating is invalid.");
        ratings[_address] = calculateRating(ratings[_address], _rating);
        return true;
    }

    function getRating(address _address) public view returns (uint8) {
        return ratings[_address];
    }

    function getAllTasks() public view returns (PlatformStructs.Task[] memory) {
        PlatformStructs.Task[] memory taskList = new PlatformStructs.Task[](allTasks.length);
        for (uint256 i; i < allTasks.length; i++) {
            if (tasks[allTasks[i]].id > 0) {
                taskList[i] = tasks[allTasks[i]];
            }
        }
        return taskList;
    }

    function get20Tasks(uint _from) view public returns(PlatformStructs.Task[20] memory, uint) {
        PlatformStructs.Task[20] memory tempTasks;
        uint count = 0;
        uint i = allTasks.length-1 - _from;
        for(i; i >= 0 && count < 20; i--){
            if(tasks[allTasks[i]].id != 0) {
                tempTasks[count] = tasks[allTasks[i]];
                count++;
            }
        }
        return (tempTasks, allTasks.length-1-i);
    }

    function getTask(uint256 _id)
        public
        view
        taskExists(_id)
        returns (PlatformStructs.Task memory)
    {
        return (tasks[_id]);
    }

    function getAllServices() public view returns (PlatformStructs.Service[] memory) {
        PlatformStructs.Service[] memory serviceList = new PlatformStructs.Service[](allServices.length);
        for (uint256 i; i < allServices.length; i++) {
            if (services[allServices[i]].id > 0) {
                serviceList[i] = services[allServices[i]];
            }
        }
        return serviceList;
    }

    function get20Services(uint _from) view public returns(PlatformStructs.Service[20] memory, uint) {
        PlatformStructs.Service[20] memory tempServices;
        uint count = 0;
        uint i = allServices.length-1 - _from;
        for(i; i >= 0 && count < 20; i--){
            if(services[allServices[i]].id != 0) {
                tempServices[count] = services[allServices[i]];
                count++;
            }
        }
        return (tempServices, allServices.length-1-i);
    }

    function getService(uint256 _id)
        public
        view
        serviceExists(_id)
        returns (PlatformStructs.Service memory)
    {
        return (services[_id]);
    }

    function getProfile(address _address)
        public
        view
        returns (PlatformStructs.Profile memory)
    {
        return (profiles[_address]);
    }

    struct Dispute {
        uint taskId;
        address creator;
        uint amount;
        bool resolved;
    }
    mapping (uint => Dispute) public disputes;
    uint[] disputeIds;

  function previousDisputeFound(uint _id) internal view returns (bool) {
    for(uint i = 0; i < disputeIds.length; i++) {
      if(disputes[disputeIds[i]].taskId == _id) {
        return true;
      }
    }
    return false;
  }

  function openDispute(
    uint _taskId
  ) public {
    require(tasks[_taskId].author != address(0), "Task not found");
    require(tasks[_taskId].author == msg.sender || tasks[_taskId].assignee == msg.sender, "Only author or assignee.");
    require(previousDisputeFound(_taskId) == false, "Dispute already opened.");
    require(tasks[_taskId].status == PlatformStructs.TaskStatuses.InReview
        || tasks[_taskId].status == PlatformStructs.TaskStatuses.ChangeRequested,
        "Invalid task status");
    tasks[_taskId].status = PlatformStructs.TaskStatuses.Disputed;
    disputes[_taskId] = Dispute(_taskId, msg.sender, tasks[_taskId].reward, false);
    disputeIds.push(_taskId);
    emit DisputeOpened(_taskId);
  }

  function resolveDispute(
    uint _taskId,
    address payable _winner
  ) public nonReentrant {
    require(disputes[_taskId].creator != address(0), "Dispute not found.");
    require(disputes[_taskId].resolved == false, "Already resolved.");
    require(invitedArbiters.contains(msg.sender), "Only invited arbiter can resolve disputes");
    require(_winner == tasks[_taskId].author || _winner == tasks[_taskId].assignee, "Only author or assignee.");
    disputes[_taskId].resolved = true;

    tasks[_taskId].status = PlatformStructs.TaskStatuses.Completed;

    uint256 arbiterReward = (tasks[_taskId].reward / 100) * arbiterRewardPercentage;
    uint256 platformFee = calculatePlatformFee(tasks[_taskId].reward);
    totalFees += platformFee;

    (bool success, ) = _winner.call{
        value: tasks[_taskId].reward - arbiterReward - platformFee
    }("");
    require(success, "Tranfer failed.");

    (success, ) = msg.sender.call{
        value: arbiterReward
    }("");
    require(success, "Tranfer failed.");

    emit DisputeResolved(_taskId);
  }
}

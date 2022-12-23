// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./PlatformStructs.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Tasks is ReentrancyGuard {

    using Counters for Counters.Counter;
    Counters.Counter private _idCounter;

    uint8 public platformFeePercentage; // Platform fee in %
    uint256 public totalFees;
    uint256[] public allTasks;
    mapping(uint256 => PlatformStructs.Task) public tasks;
    mapping(address => uint8) public ratings;

    constructor() {
        platformFeePercentage = 3;
        _idCounter.increment();
    }

    event TaskAdded(PlatformStructs.Task _task);
    event TaskUpdated(PlatformStructs.Task _task);
    event TaskDeleted(uint256 _id);
    event FeeUpdated(uint8 _fee);

    modifier onlyAuthor(uint256 _id) {
        require(
            msg.sender == tasks[_id].author,
            "Only author"
        );
        _;
    }

    modifier onlyAssignee(uint256 _id) {
        require(
            msg.sender == tasks[_id].assignee,
            "Only assignee"
        );
        _;
    }

    modifier taskExists(uint256 _id) {
        require(tasks[_id].author != address(0), "Task not found.");
        _;
    }

    function isAddressApplied(uint256 _id, address _address)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < tasks[_id].candidates.length; i++) {
            if (tasks[_id].candidates[i] == _address) return true;
        }
        return false;
    }

    function calculateRating(uint256 _prevRating, uint8 _newRating)
        public
        pure
        returns (uint8)
    {
        if (_prevRating == 0) return _newRating;
        return uint8(_prevRating + _newRating) / 2;
    }

    function calculatePlatformFee(uint256 _reward)
        public
        view
        returns (uint256)
    {
        uint256 platformFee = (_reward / 100) * platformFeePercentage;
        return platformFee;
    }

    function addTask(PlatformStructs.ReceivedTask calldata _newTask)
        public
        payable
        returns (uint256)
    {
        require(bytes(_newTask.title).length > 0, "Title is required.");
        require(
            bytes(_newTask.description).length > 0,
            "Description is required."
        );
        require(_newTask.reward > 0, "Reward is required.");
        uint256 platformFee = calculatePlatformFee(_newTask.reward);
        uint256 amount = _newTask.reward + platformFee;
        require(msg.value == amount, "Wrong amount submitted.");
        totalFees += platformFee;
        uint256 _id = _idCounter.current();
        tasks[_id].id = _id;
        tasks[_id].category = _newTask.category;
        tasks[_id].title = _newTask.title;
        tasks[_id].description = _newTask.description;
        tasks[_id].taskType = _newTask.taskType;
        tasks[_id].author = payable(msg.sender);
        tasks[_id].createdAt = block.timestamp;
        tasks[_id].reward = _newTask.reward;
        tasks[_id].assignee = _newTask.assignee;
        tasks[_id].allTasksIndex = allTasks.length;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        allTasks.push(_id);
        _idCounter.increment();
        if (tasks[_id].assignee != address(0)) {
            tasks[_id].status = PlatformStructs.TaskStatuses.Assigned;
        }
        emit TaskAdded(tasks[_id]);
        return _id;
    }

 function assignTask(uint256 _id, address payable _candidateAddress)
        public
        taskExists(_id)
        onlyAuthor(_id)
        returns (bool)
    {
        require(_candidateAddress != address(0), "Address required.");
        require(
            tasks[_id].taskType == PlatformStructs.TaskTypes.SelectedByAuthor,
            "Invalid task type"
        );
        require(
            tasks[_id].status != PlatformStructs.TaskStatuses.Assigned,
            "Task already assigned."
        );
        require(
            isAddressApplied(_id, _candidateAddress),
            "Invalid address."
        );
        tasks[_id].assignee = _candidateAddress;
        tasks[_id].status = PlatformStructs.TaskStatuses.Assigned;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function unassignTask(uint256 _id)
        public
        taskExists(_id)
        returns (bool)
    {
        require(
            msg.sender == tasks[_id].author ||
                msg.sender == tasks[_id].assignee,
            "Only author or assignee"
        );
        require(
            tasks[_id].status == PlatformStructs.TaskStatuses.Assigned,
            "Task is not assigned."
        );
        delete tasks[_id].assignee;
        tasks[_id].status = PlatformStructs.TaskStatuses.Active;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function applyForTask(uint256 _id)
        public
        taskExists(_id)
        returns (bool)
    {
        require(
            tasks[_id].status != PlatformStructs.TaskStatuses.Assigned,
            "Task already assigned."
        );
        if (tasks[_id].taskType == PlatformStructs.TaskTypes.FCFS) {
            tasks[_id].assignee = payable(msg.sender);
            tasks[_id].status = PlatformStructs.TaskStatuses.Assigned;
            tasks[_id].lastStatusChangeAt = block.timestamp;
            emit TaskUpdated(tasks[_id]);
        } else {
            tasks[_id].candidates.push(msg.sender);
        }
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function submitResult(uint256 _id, string calldata _result)
        public
        taskExists(_id)
        onlyAssignee(_id)
        returns (bool)
    {
        require(bytes(_result).length > 0, "Result cannot be empty.");
        require(tasks[_id].status == PlatformStructs.TaskStatuses.Assigned || tasks[_id].status == PlatformStructs.TaskStatuses.ChangeRequested, "Invalid task status.");
        tasks[_id].result = _result;
        tasks[_id].status = PlatformStructs.TaskStatuses.InReview;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function requestChange(uint256 _id, string calldata _message)
        public
        taskExists(_id)
        onlyAuthor(_id)
        returns (bool)
    {
        require(
            tasks[_id].status == PlatformStructs.TaskStatuses.InReview,
            "Invalid status"
        );
        require(
            tasks[_id].changeRequests.length < 3,
            "Limit exceeded"
        );
        tasks[_id].changeRequests.push(_message);
        tasks[_id].status = PlatformStructs.TaskStatuses.ChangeRequested;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function completeTask(uint256 _id, uint8 _rating)
        public
        taskExists(_id)
        onlyAuthor(_id)
        nonReentrant
        returns (bool)
    {
        require(tasks[_id].completedAt == 0, "Task already completed.");
        require(bytes(tasks[_id].result).length > 0, "Result is required.");
        require(_rating <= 5, "Rating is invalid.");
        tasks[_id].completedAt = block.timestamp;
        tasks[_id].status = PlatformStructs.TaskStatuses.Completed;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        ratings[tasks[_id].assignee] = calculateRating(
            ratings[tasks[_id].assignee],
            _rating
        );
        (bool success, ) = tasks[_id].assignee.call{
            value: tasks[_id].reward
        }("");
        require(success, "Tranfer failed.");
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function requestPayment(uint256 _id)
        public
        taskExists(_id)
        onlyAssignee(_id)
        nonReentrant
        returns (bool)
    {
        require(tasks[_id].status == PlatformStructs.TaskStatuses.InReview);
        require(
            tasks[_id].lastStatusChangeAt < block.timestamp - 10 days,
            "Need to wait 10 days."
        );
        tasks[_id].completedAt = block.timestamp;
        tasks[_id].status = PlatformStructs.TaskStatuses.Completed;
        tasks[_id].lastStatusChangeAt = block.timestamp;
        (bool success, ) = tasks[_id].assignee.call{
            value: tasks[_id].reward
        }("");
        require(success, "Tranfer failed.");
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function deleteTask(uint256 _id)
        public
        payable
        taskExists(_id)
        onlyAuthor(_id)
        nonReentrant
        returns (bool)
    {
        require(
            tasks[_id].assignee == address(0),
            "Task assigned."
        );
        (bool success, ) = tasks[_id].author.call{
            value: tasks[_id].reward
        }("");
        require(success, "Tranfer failed.");
        uint index = tasks[_id].allTasksIndex;
        delete tasks[_id];
        delete allTasks[index];
        if (allTasks[index] == allTasks[allTasks.length - 1]) {
            allTasks.pop();
        } else {
            allTasks[index] = allTasks[allTasks.length - 1];
            allTasks.pop();
            tasks[allTasks[index]].allTasksIndex = index;
        }
        emit TaskDeleted(_id);
        return true;
    }
}

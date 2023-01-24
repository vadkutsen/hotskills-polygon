// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract HotSkills is Ownable, ReentrancyGuard {
    // using Counters for Counters.Counter;
    // Counters.Counter private _idCounter;

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet internal invitedArbiters;


    enum TaskTypes {
        FCFS,
        Casting
    }

    enum TaskStatuses {
        Active,
        Assigned,
        InReview,
        ChangeRequested,
        Disputed,
        Completed
    }

    struct Task {
        uint256 id;
        // string category;
        // string title;
        // string description;
        address payable author;
        address payable assignee;
        // uint256 dueDate;
        address[] candidates;
        // uint256 createdAt;
        // uint256 completedAt;
        TaskTypes taskType;
        uint256 reward;
        string result;
        // string[] changeRequests;
        // uint256 allTasksIndex;
        TaskStatuses status;
        // uint256 lastStatusChangeAt;
    }

    struct ReceivedTask {
        uint256 id;
        // string category;
        // string title;
        // string description;
        TaskTypes taskType;
        uint256 reward;
        address payable assignee;
        // uint256 dueDate;
    }

    struct Dispute {
        uint256 taskId;
        address creator;
        uint256 amount;
        bool resolved;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256[] disputeIds;
    uint8 public platformFeePercentage; // Platform fee in %
    uint256 public totalFees;
    uint256[] public allTasks;
    mapping(uint256 => Task) public tasks;
    // mapping(address => uint8) public ratings;
    uint8 public arbiterRewardPercentage; // arbiter reward in %

    constructor() {
        platformFeePercentage = 3;
        // _idCounter.increment();
        arbiterRewardPercentage = 10;
        invitedArbiters.add(msg.sender);
    }

    event TaskAdded(Task _task);
    event TaskUpdated(Task _task);
    event TaskDeleted(uint256 _id);
    event FeeUpdated(uint8 _fee);
    event DisputeOpened(uint256 taskId);
    event DisputeResolved(uint256 taskId);

    modifier onlyAuthor(uint256 _id) {
        require(msg.sender == tasks[_id].author, "Only author");
        _;
    }

    modifier onlyAssignee(uint256 _id) {
        require(msg.sender == tasks[_id].assignee, "Only assignee");
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

    // function calculateRating(uint256 _prevRating, uint8 _newRating)
    //     public
    //     pure
    //     returns (uint8)
    // {
    //     if (_prevRating == 0) return _newRating;
    //     return uint8(_prevRating + _newRating) / 2;
    // }

    function calculatePlatformFee(uint256 _reward)
        public
        view
        returns (uint256)
    {
        return (_reward / 100) * platformFeePercentage;
    }

    function addTask(ReceivedTask calldata _newTask)
        public
        payable
        returns (bool)
    {
        require(_newTask.id > 0, "Id is required.");
        // require(
        //     bytes(_newTask.description).length > 0,
        //     "Description is required."
        // );
        require(_newTask.reward > 0, "Reward is required.");
        // uint256 platformFee = calculatePlatformFee(_newTask.reward);
        // uint256 amount = _newTask.reward + platformFee;
        require(msg.value == _newTask.reward, "Wrong amount submitted.");
        // totalFees += platformFee;
        // uint256 _id = _newTask.id;
        tasks[_newTask.id].id = _newTask.id;
        // tasks[_id].category = _newTask.category;
        // tasks[_id].title = _newTask.title;
        // tasks[_id].description = _newTask.description;
        tasks[_newTask.id].taskType = _newTask.taskType;
        tasks[_newTask.id].author = payable(msg.sender);
        // tasks[_id].createdAt = block.timestamp;
        tasks[_newTask.id].reward = _newTask.reward;
        tasks[_newTask.id].assignee = _newTask.assignee;
        // tasks[_id].dueDate = _newTask.dueDate;
        // tasks[_id].allTasksIndex = allTasks.length;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
        // _idCounter.increment();
        if (tasks[_newTask.id].assignee != address(0)) {
            tasks[_newTask.id].status = TaskStatuses.Assigned;
        }
        allTasks.push(_newTask.id);
        emit TaskAdded(tasks[_newTask.id]);
        return true;
    }

    function assignTask(uint256 _id, address payable _candidateAddress)
        public
        taskExists(_id)
        onlyAuthor(_id)
        returns (bool)
    {
        require(_candidateAddress != address(0), "Address required.");
        require(
            tasks[_id].taskType == TaskTypes.Casting,
            "Invalid task type"
        );
        require(
            tasks[_id].status != TaskStatuses.Assigned,
            "Task already assigned."
        );
        require(isAddressApplied(_id, _candidateAddress), "Invalid address.");
        tasks[_id].assignee = _candidateAddress;
        tasks[_id].status = TaskStatuses.Assigned;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function unassignTask(uint256 _id) public taskExists(_id) returns (bool) {
        require(
            msg.sender == tasks[_id].author ||
                msg.sender == tasks[_id].assignee,
            "Only author or assignee"
        );
        require(
            tasks[_id].status == TaskStatuses.Assigned,
            "Task is not assigned."
        );
        delete tasks[_id].assignee;
        tasks[_id].status = TaskStatuses.Active;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function applyForTask(uint256 _id) public taskExists(_id) returns (bool) {
        require(
            tasks[_id].status != TaskStatuses.Assigned,
            "Task already assigned."
        );
        if (tasks[_id].taskType == TaskTypes.FCFS) {
            tasks[_id].assignee = payable(msg.sender);
            tasks[_id].status = TaskStatuses.Assigned;
            // tasks[_id].lastStatusChangeAt = block.timestamp;
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
        require(
            tasks[_id].status == TaskStatuses.Assigned ||
                tasks[_id].status ==
                TaskStatuses.ChangeRequested,
            "Invalid task status."
        );
        tasks[_id].result = _result;
        tasks[_id].status = TaskStatuses.InReview;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
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
            tasks[_id].status == TaskStatuses.InReview,
            "Invalid status"
        );
        // require(tasks[_id].changeRequests.length < 3, "Limit exceeded");
        // tasks[_id].changeRequests.push(_message);
        tasks[_id].status = TaskStatuses.ChangeRequested;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
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
        require(tasks[_id].status != TaskStatuses.Completed, "Task already completed.");
        require(bytes(tasks[_id].result).length > 0, "Result is required.");
        // require(_rating <= 5, "Rating is invalid.");
        // tasks[_id].completedAt = block.timestamp;
        tasks[_id].status = TaskStatuses.Completed;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
        // ratings[tasks[_id].assignee] = calculateRating(
        //     ratings[tasks[_id].assignee],
        //     _rating
        // );
        // uint256 platformFee = calculatePlatformFee(tasks[_id].reward);
        totalFees += calculatePlatformFee(tasks[_id].reward);
        (bool success, ) = tasks[_id].assignee.call{
            value: tasks[_id].reward - calculatePlatformFee(tasks[_id].reward)
        }("");
        require(success, "Tranfer failed.");
        emit TaskUpdated(tasks[_id]);
        return true;
    }

    function requestPayment(uint256 _id, uint256 _lastStatusChangeAt)
        public
        taskExists(_id)
        onlyAssignee(_id)
        nonReentrant
        returns (bool)
    {
        require(tasks[_id].status == TaskStatuses.InReview);
        require(
            _lastStatusChangeAt < block.timestamp - 10 days,
            "Need to wait 10 days."
        );
        // tasks[_id].completedAt = block.timestamp;
        tasks[_id].status = TaskStatuses.Completed;
        // tasks[_id].lastStatusChangeAt = block.timestamp;
        // uint256 platformFee = calculatePlatformFee(tasks[_id].reward);
        totalFees += calculatePlatformFee(tasks[_id].reward);
        (bool success, ) = tasks[_id].assignee.call{
            value: tasks[_id].reward - calculatePlatformFee(tasks[_id].reward)
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
        require(tasks[_id].assignee == address(0), "Task assigned.");
        // uint256 platformFee = calculatePlatformFee(tasks[_id].reward);
        totalFees += calculatePlatformFee(tasks[_id].reward);
        (bool success, ) = tasks[_id].author.call{
            value: tasks[_id].reward - calculatePlatformFee(tasks[_id].reward)
        }("");
        require(success, "Tranfer failed.");
        // uint256 index = tasks[_id].allTasksIndex;
        delete tasks[_id];
        // delete allTasks[index];
        // if (allTasks[index] == allTasks[allTasks.length - 1]) {
        //     allTasks.pop();
        // } else {
        //     allTasks[index] = allTasks[allTasks.length - 1];
        //     allTasks.pop();
        //     tasks[allTasks[index]].allTasksIndex = index;
        // }
        emit TaskDeleted(_id);
        return true;
    }

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

    // function rateUser(address _address, uint8 _rating) public returns (bool) {
    //     require(_rating <= 5, "Rating is invalid.");
    //     ratings[_address] = calculateRating(ratings[_address], _rating);
    //     return true;
    // }

    // function getRating(address _address) public view returns (uint8) {
    //     return ratings[_address];
    // }

    // function getAllTasks() public view returns (PlatformStructs.Task[] memory) {
    //     PlatformStructs.Task[] memory taskList = new PlatformStructs.Task[](
    //         allTasks.length
    //     );
    //     for (uint256 i; i < allTasks.length; i++) {
    //         if (tasks[allTasks[i]].id > 0) {
    //             taskList[i] = tasks[allTasks[i]];
    //         }
    //     }
    //     return taskList;
    // }

    // function get20Tasks(uint256 _from)
    //     public
    //     view
    //     returns (PlatformStructs.Task[20] memory, uint256)
    // {
    //     PlatformStructs.Task[20] memory tempTasks;
    //     uint256 count = 0;
    //     uint256 i = allTasks.length - 1 - _from;
    //     for (i; i >= 0 && count < 20; i--) {
    //         if (tasks[allTasks[i]].id != 0) {
    //             tempTasks[count] = tasks[allTasks[i]];
    //             count++;
    //         }
    //     }
    //     return (tempTasks, allTasks.length - 1 - i);
    // }

    // function getTask(uint256 _id)
    //     public
    //     view
    //     taskExists(_id)
    //     returns (PlatformStructs.Task memory)
    // {
    //     return (tasks[_id]);
    // }

    function previousDisputeFound(uint256 _id) internal view returns (bool) {
        for (uint256 i = 0; i < disputeIds.length; i++) {
            if (disputes[disputeIds[i]].taskId == _id) {
                return true;
            }
        }
        return false;
    }

    function openDispute(uint256 _taskId) public {
        require(tasks[_taskId].author != address(0), "Task not found");
        require(
            tasks[_taskId].author == msg.sender ||
                tasks[_taskId].assignee == msg.sender,
            "Only author or assignee."
        );
        require(
            previousDisputeFound(_taskId) == false,
            "Dispute already opened."
        );
        require(
            tasks[_taskId].status == TaskStatuses.InReview ||
                tasks[_taskId].status ==
                TaskStatuses.ChangeRequested,
            "Invalid task status"
        );
        tasks[_taskId].status = TaskStatuses.Disputed;
        disputes[_taskId] = Dispute(
            _taskId,
            msg.sender,
            tasks[_taskId].reward,
            false
        );
        disputeIds.push(_taskId);
        emit DisputeOpened(_taskId);
    }

    function resolveDispute(uint256 _taskId, address payable _winner)
        public
        nonReentrant
    {
        require(disputes[_taskId].creator != address(0), "Dispute not found.");
        require(disputes[_taskId].resolved == false, "Already resolved.");
        require(
            invitedArbiters.contains(msg.sender),
            "Only invited arbiter can resolve disputes"
        );
        require(
            _winner == tasks[_taskId].author ||
                _winner == tasks[_taskId].assignee,
            "Only author or assignee."
        );
        disputes[_taskId].resolved = true;

        tasks[_taskId].status = TaskStatuses.Completed;

        // uint256 arbiterReward = (tasks[_taskId].reward / 100) *
            // arbiterRewardPercentage;
        // uint256 platformFee = calculatePlatformFee(tasks[_taskId].reward);
        totalFees += calculatePlatformFee(tasks[_taskId].reward);

        (bool success, ) = _winner.call{
            value: tasks[_taskId].reward - (tasks[_taskId].reward / 100) *
            arbiterRewardPercentage - calculatePlatformFee(tasks[_taskId].reward)
        }("");
        require(success, "Tranfer failed.");

        (success, ) = msg.sender.call{value: (tasks[_taskId].reward / 100) *
            arbiterRewardPercentage}("");
        require(success, "Tranfer failed.");

        emit DisputeResolved(_taskId);
    }
}

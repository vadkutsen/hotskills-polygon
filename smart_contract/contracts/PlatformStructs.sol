// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract PlatformStructs {

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
        string category;
        string title;
        string description;
        address payable author;
        address payable assignee;
        uint256 dueDate;
        address[] candidates;
        uint256 createdAt;
        uint256 completedAt;
        TaskTypes taskType;
        uint256 reward;
        string result;
        string[] changeRequests;
        uint256 allTasksIndex;
        TaskStatuses status;
        uint256 lastStatusChangeAt;
    }

    struct ReceivedTask {
        string category;
        string title;
        string description;
        TaskTypes taskType;
        uint256 reward;
        address payable assignee;
        uint256 dueDate;
    }

    enum ServiceStatuses {
        Active,
        Paused
    }

    struct Service {
        uint256 id;
        string[] images;
        string category;
        string title;
        string description;
        address payable author;
        uint256 createdAt;
        uint256 price;
        uint8 deliveryTime;
        uint256 allServicesIndex;
        ServiceStatuses status;
        uint256 lastStatusChangeAt;
    }

    struct ReceivedService {
        string[] images;
        string category;
        string title;
        string description;
        uint256 price;
        uint8 deliveryTime;
    }

    struct Profile {
        string avatar;
        string username;
        uint16[] skills;
        string[] languages;
        uint16 rate;
        uint8 availability;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct ReceivedProfile {
        string avatar;
        string username;
        uint16[] skills;
        string[] languages;
        uint16 rate;
        uint8 availability;
    }
}

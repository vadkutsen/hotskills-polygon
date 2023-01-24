// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./PlatformStructs.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract Services {

    using Counters for Counters.Counter;
    Counters.Counter private _mappingLength;

    uint256[] public allServices;
    mapping(uint256 => PlatformStructs.Service) public services;

    constructor() {
        _mappingLength.increment();
    }

    event ServiceAdded(PlatformStructs.Service _service);
    event ServiceUpdated(PlatformStructs.Service _service);
    event ServiceDeleted(uint256 _id);

    modifier onlyServiceAuthor(uint256 _id) {
        require(
            msg.sender == services[_id].author,
            "Only author"
        );
        _;
    }

    modifier serviceExists(uint256 _id) {
        require(services[_id].author != address(0), "Service not found.");
        _;
    }

    function addService(PlatformStructs.ReceivedService calldata _newService)
        public
        returns (bool)
    {
        require(bytes(_newService.category).length > 0, "category is required.");
        require(bytes(_newService.title).length > 0, "Title is required.");
        require(bytes(_newService.description).length > 0,"Description is required.");
        require(_newService.price > 0, "Price is required.");
        require(_newService.deliveryTime > 0, "Delivery time is required.");
        uint256 _id = _mappingLength.current();
        services[_id].id = _mappingLength.current();
        string[] memory img = _newService.images;
        services[_id].images = img;
        services[_id].category = _newService.category;
        services[_id].title = _newService.title;
        services[_id].description = _newService.description;
        services[_id].author = payable(msg.sender);
        services[_id].createdAt = block.timestamp;
        services[_id].price = _newService.price;
        services[_id].deliveryTime = _newService.deliveryTime;
        services[_id].allServicesIndex = allServices.length;
        services[_id].lastStatusChangeAt = block.timestamp;
        allServices.push(_mappingLength.current());
        _mappingLength.increment();
        emit ServiceAdded(services[_mappingLength.current()]);
        return true;
    }

    function updateService(uint256 _id, PlatformStructs.ReceivedService calldata _newService)
        public
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        require(bytes(_newService.category).length > 0, "category is required.");
        require(bytes(_newService.title).length > 0, "Title is required.");
        require(bytes(_newService.description).length > 0,"Description is required.");
        require(_newService.price > 0, "Price is required.");
        string[] memory img = _newService.images;
        services[_id].images = img;
        services[_id].category = _newService.category;
        services[_id].title = _newService.title;
        services[_id].description = _newService.description;
        services[_id].price = _newService.price;
        emit ServiceUpdated(services[_id]);
        return true;
    }

    function pauseService(uint256 _id)
        public
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        require(services[_id].status == PlatformStructs.ServiceStatuses.Active, "Invalid service status.");
        services[_id].status = PlatformStructs.ServiceStatuses.Paused;
        services[_id].lastStatusChangeAt = block.timestamp;
        emit ServiceUpdated(services[_id]);
        return true;
    }

    function resumeService(uint256 _id)
        public
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        require(services[_id].status == PlatformStructs.ServiceStatuses.Paused, "Invalid service status.");
        services[_id].status = PlatformStructs.ServiceStatuses.Active;
        services[_id].lastStatusChangeAt = block.timestamp;
        emit ServiceUpdated(services[_id]);
        return true;
    }


    function deleteService(uint256 _id)
        public
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        uint index = services[_id].allServicesIndex;
        delete services[_id];
        delete allServices[index];
        if (allServices[index] == allServices[allServices.length - 1]) {
            allServices.pop();
        } else {
            allServices[index] = allServices[allServices.length - 1];
            allServices.pop();
            services[allServices[index]].allServicesIndex = index;
        }
        emit ServiceDeleted(_id);
        return true;
    }
}

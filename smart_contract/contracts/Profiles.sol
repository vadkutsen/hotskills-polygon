// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./PlatformStructs.sol";

contract Profiles {

    mapping(address => PlatformStructs.Profile) public profiles;

    event ProfileAdded(PlatformStructs.Profile _profile);
    event ProfileUpdated(PlatformStructs.Profile _profile);
    event ProfileDeleted(PlatformStructs.Profile _profile);

    function addProfile(PlatformStructs.ReceivedProfile calldata _newProfile)
        public
        returns (bool)
    {
        require(bytes(_newProfile.username).length > 0, "Username is required.");
        profiles[msg.sender].avatar = _newProfile.avatar;
        profiles[msg.sender].username = _newProfile.username;
        uint16[] memory skills = _newProfile.skills;
        profiles[msg.sender].skills = skills;
        string[] memory lang = _newProfile.languages;
        profiles[msg.sender].languages = lang;
        profiles[msg.sender].rate = _newProfile.rate;
        profiles[msg.sender].availability = _newProfile.availability;
        profiles[msg.sender].createdAt = block.timestamp;
        emit ProfileAdded(profiles[msg.sender]);
        return true;
    }

    function updateProfile(PlatformStructs.ReceivedProfile calldata _newProfile)
        public
        returns (bool)
    {
        require(bytes(_newProfile.username).length > 0, "Username is required.");
        profiles[msg.sender].avatar = _newProfile.avatar;
        profiles[msg.sender].username = _newProfile.username;
        uint16[] memory skills = _newProfile.skills;
        profiles[msg.sender].skills = skills;
        string[] memory lang = _newProfile.languages;
        profiles[msg.sender].languages = lang;
        profiles[msg.sender].rate = _newProfile.rate;
        profiles[msg.sender].availability = _newProfile.availability;
        profiles[msg.sender].updatedAt = block.timestamp;
        emit ProfileUpdated(profiles[msg.sender]);
        return true;
    }

    function deleteProfile()
        public
        returns (bool)
    {
        delete profiles[msg.sender];
        emit ProfileDeleted(profiles[msg.sender]);
        return true;
    }
}

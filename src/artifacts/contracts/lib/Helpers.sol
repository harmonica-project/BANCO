// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.8.0;

library Helpers {
    function strCmp(string memory _str1, string memory _str2)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encode(_str1)) == keccak256(abi.encode(_str2)));
    }

    function searchStringInArray(string memory _str, string[] memory _strs)
        public
        pure
        returns (int256)
    {
        for (uint256 i = 0; i < _strs.length; i++) {
            if (strCmp(_str, _strs[i])) return int256(i);
        }

        return -1;
    }

    function searchAddressInArray(address _addr, address[] memory _addrs)
        public
        pure
        returns (int256)
    {
        for (uint256 i = 0; i < _addrs.length; i++) {
            if (_addr == _addrs[i]) return int256(i);
        }

        return -1;
    }

    function doArrayHasDuplicates(string[] memory _array) 
        public
        pure 
        returns (bool) 
    {
        for (uint i = 0; i < _array.length; i++) {
            for (uint j = 0; j < _array.length; j++) {
                if (strCmp(_array[i], _array[j]) && i != j) return false;
            }
        }

        return true;
    }
}

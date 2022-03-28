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
}

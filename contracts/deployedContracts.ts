import { GenericContractsDeclaration } from '~~/utils/scaffold-eth/contract'

const deployedContracts = {
  919: {
    ModeDisperse: {
      address: '0x8e3c51Fc652aF6DaB4120095Eb55424478BEC0e3',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialOwner',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'AddressInsufficientBalance',
          type: 'error',
        },
        {
          inputs: [],
          name: 'FailedInnerCall',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'OwnableInvalidOwner',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'OwnableUnauthorizedAccount',
          type: 'error',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address[]',
              name: 'recipients',
              type: 'address[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
          ],
          name: 'EtherDispersed',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_recipients',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: '_values',
              type: 'uint256[]',
            },
          ],
          name: 'disperseEther',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'renounceOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      inheritedFunctions: {
        owner: '@openzeppelin/contracts/access/Ownable.sol',
        renounceOwnership: '@openzeppelin/contracts/access/Ownable.sol',
        transferOwnership: '@openzeppelin/contracts/access/Ownable.sol',
      },
    },
  },
} as const

export default deployedContracts satisfies GenericContractsDeclaration

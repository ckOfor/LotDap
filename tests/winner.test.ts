import { describe, it, expect, beforeEach } from 'vitest';

// Mock data
let currentLotteryId = 1;
let lotteryStatus = false; // false means the lottery is closed
let participantsCount = 5; // Simulate 5 participants
let contractOwner = 'owner-principal';
let txSender = 'owner-principal'; // Simulate the contract owner as the sender

// Mock contract functions

// Select winner function
const selectWinner = () => {
  if (lotteryStatus) return { err: 1001 }; // Lottery is open
  if (participantsCount === 0) return { err: 1000 }; // No participants
  if (txSender !== contractOwner) return { err: 1002 }; // Unauthorized
  
  const winnerIndex = Math.floor(Math.random() * participantsCount); // Random winner
  return { ok: winnerIndex };
};

// Close the lottery function
const closeLottery = () => {
  lotteryStatus = false; // Close the lottery
  return { ok: true };
};

// Set participants function
const setParticipants = (number) => {
  participantsCount = number;
  return { ok: true };
};

// Set contract owner function
const setContractOwner = (owner) => {
  contractOwner = owner;
  return { ok: true };
};

// Resetting state before each test
beforeEach(() => {
  currentLotteryId = 1;
  lotteryStatus = false; // Lottery starts closed
  participantsCount = 0; // Reset participants
  contractOwner = 'owner-principal'; // Reset contract owner
  txSender = 'owner-principal'; // Reset transaction sender
});

// Tests
describe('Winner Selection Contract Tests', () => {
  it('should select a winner when lottery is closed and participants exist', () => {
    setParticipants(5); // Set participants
    const result = selectWinner();
    expect(result.ok).toBeDefined(); // Should return a winner index
  });
  
  it('should not select a winner if the lottery is open', () => {
    lotteryStatus = true; // Open the lottery
    const result = selectWinner();
    expect(result).toEqual({ err: 1001 }); // Lottery is open
  });
  
  it('should not select a winner if there are no participants', () => {
    lotteryStatus = false; // Close the lottery
    const result = selectWinner();
    expect(result).toEqual({ err: 1000 }); // No participants
  });
  
  it('should not select a winner if the sender is not the contract owner', () => {
    txSender = 'another-principal'; // Simulate unauthorized sender
    setParticipants(5); // Set participants
    const result = selectWinner();
    expect(result).toEqual({ err: 1002 }); // Unauthorized
  });
  
  it('should close the lottery successfully', () => {
    lotteryStatus = true; // Open the lottery
    closeLottery();
    expect(lotteryStatus).toEqual(false); // Lottery should be closed
  });
  
  it('should set the number of participants successfully', () => {
    const result = setParticipants(10);
    expect(result).toEqual({ ok: true });
    expect(participantsCount).toEqual(10); // Participants count should be updated
  });
});

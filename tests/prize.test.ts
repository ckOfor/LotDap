import { describe, it, expect, beforeEach } from 'vitest';

// Mock data
let contractOwner = 'owner-principal'; // Simulated contract owner
let txSender = 'owner-principal'; // Simulated transaction sender
let prizePool = 0; // Initial prize pool amount

// Mock contract functions

// Function to simulate distributing a prize
const distributePrize = (winner, amount) => {
  if (txSender !== contractOwner) return { err: 1000 }; // Unauthorized
  if (amount > prizePool) return { err: 1001 }; // Insufficient balance
  
  prizePool -= amount; // Deduct amount from prize pool
  return { ok: amount }; // Return the amount distributed
};

// Function to add funds to the prize pool
const addToPrizePool = (amount) => {
  // Simulate the transfer to the contract (in practice, you'd check if the transfer was successful)
  prizePool += amount; // Increase prize pool
  return { ok: prizePool }; // Return new prize pool amount
};

// Function to get the current prize pool
const getPrizePool = () => {
  return { ok: prizePool }; // Return current prize pool amount
};

// Resetting state before each test
beforeEach(() => {
  contractOwner = 'owner-principal'; // Reset contract owner
  txSender = 'owner-principal'; // Reset transaction sender
  prizePool = 0; // Reset prize pool amount
});

// Tests
describe('Prize Pool Management Contract Tests', () => {
  it('should allow the owner to distribute a prize if sufficient balance is available', () => {
    addToPrizePool(100); // Add funds to the prize pool
    const result = distributePrize('winner-principal', 50); // Distribute a prize
    expect(result).toEqual({ ok: 50 }); // Should return the amount distributed
    expect(prizePool).toEqual(50); // Prize pool should be updated
  });
  
  it('should not allow unauthorized users to distribute a prize', () => {
    txSender = 'another-principal'; // Simulate unauthorized user
    const result = distributePrize('winner-principal', 50); // Attempt to distribute a prize
    expect(result).toEqual({ err: 1000 }); // Should return unauthorized error
  });
  
  it('should not allow distributing a prize if there are insufficient funds', () => {
    addToPrizePool(30); // Add funds to the prize pool
    const result = distributePrize('winner-principal', 50); // Attempt to distribute more than available
    expect(result).toEqual({ err: 1001 }); // Should return insufficient balance error
    expect(prizePool).toEqual(30); // Prize pool should remain unchanged
  });
  
  it('should allow the owner to add funds to the prize pool', () => {
    const result = addToPrizePool(100); // Add funds to the prize pool
    expect(result).toEqual({ ok: 100 }); // Should return the new prize pool amount
    expect(prizePool).toEqual(100); // Prize pool should be updated
  });
  
  it('should allow checking the current prize pool amount', () => {
    addToPrizePool(200); // Add funds to the prize pool
    const result = getPrizePool(); // Get current prize pool amount
    expect(result).toEqual({ ok: 200 }); // Should return the current prize pool amount
  });
});

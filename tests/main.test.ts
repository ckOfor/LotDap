import { describe, it, expect, beforeEach } from 'vitest';

// Mock data
let contractOwner = 'owner-principal'; // Simulated contract owner
let txSender = 'owner-principal'; // Simulated transaction sender
let currentLotteryId = 0; // Initial lottery ID
let ticketPrice = 100; // Initial ticket price
let lotteryStatus = true; // Lottery is open
let participantsCount = 0; // Initial participants count

// Mock contract functions

// Function to buy a ticket
const buyTicket = () => {
  if (!lotteryStatus) return { err: 1001 }; // Lottery is closed
  // Simulate STX transfer
  participantsCount += 1; // Increment participants count
  return { ok: participantsCount }; // Return the new participants count
};

// Function to start a new lottery
const startNewLottery = () => {
  if (txSender !== contractOwner) return { err: 1000 }; // Unauthorized
  currentLotteryId += 1; // Increment lottery ID
  lotteryStatus = true; // Set lottery to open
  participantsCount = 0; // Reset participants count
  return { ok: currentLotteryId }; // Return the new lottery ID
};

// Function to end the current lottery
const endLottery = () => {
  if (txSender !== contractOwner) return { err: 1000 }; // Unauthorized
  lotteryStatus = false; // Set lottery to closed
  return { ok: currentLotteryId }; // Return current lottery ID
};

// Function to set the ticket price
const setTicketPrice = (newPrice) => {
  if (txSender !== contractOwner) return { err: 1000 }; // Unauthorized
  ticketPrice = newPrice; // Update ticket price
  return { ok: ticketPrice }; // Return the new ticket price
};

// Function to get the current lottery status
const getLotteryStatus = () => {
  return { ok: lotteryStatus }; // Return current lottery status
};

// Function to get the number of participants
const getParticipants = () => {
  return { ok: participantsCount }; // Return current participants count
};

// Function to get the current lottery ID
const getCurrentLotteryId = () => {
  return { ok: currentLotteryId }; // Return current lottery ID
};

// Function to get the ticket price
const getTicketPrice = () => {
  return { ok: ticketPrice }; // Return current ticket price
};

// Resetting state before each test
beforeEach(() => {
  contractOwner = 'owner-principal'; // Reset contract owner
  txSender = 'owner-principal'; // Reset transaction sender
  currentLotteryId = 0; // Reset lottery ID
  ticketPrice = 100; // Reset ticket price
  lotteryStatus = true; // Reset lottery status to open
  participantsCount = 0; // Reset participants count
});

// Tests
describe('Main Lottery Contract Tests', () => {
  it('should allow buying a ticket when the lottery is open', () => {
    const result = buyTicket(); // Buy a ticket
    expect(result).toEqual({ ok: 1 }); // Should return participants count of 1
  });
  
  it('should not allow buying a ticket when the lottery is closed', () => {
    endLottery(); // Close the lottery
    const result = buyTicket(); // Attempt to buy a ticket
    expect(result).toEqual({ err: 1001 }); // Should return lottery closed error
  });
  
  it('should allow the owner to start a new lottery', () => {
    const result = startNewLottery(); // Start a new lottery
    expect(result).toEqual({ ok: 1 }); // Should return new lottery ID of 1
    expect(lotteryStatus).toEqual(true); // Lottery should be open
    expect(participantsCount).toEqual(0); // Participants should reset to 0
  });
  
  it('should not allow unauthorized users to start a new lottery', () => {
    txSender = 'another-principal'; // Simulate unauthorized user
    const result = startNewLottery(); // Attempt to start a new lottery
    expect(result).toEqual({ err: 1000 }); // Should return unauthorized error
  });
  
  it('should allow the owner to end the lottery', () => {
    const result = endLottery(); // End the lottery
    expect(result).toEqual({ ok: 0 }); // Should return current lottery ID
    expect(lotteryStatus).toEqual(false); // Lottery should be closed
  });
  
  it('should not allow unauthorized users to end the lottery', () => {
    txSender = 'another-principal'; // Simulate unauthorized user
    const result = endLottery(); // Attempt to end the lottery
    expect(result).toEqual({ err: 1000 }); // Should return unauthorized error
  });
  
  it('should allow the owner to set a new ticket price', () => {
    const newPrice = 200;
    const result = setTicketPrice(newPrice); // Set new ticket price
    expect(result).toEqual({ ok: newPrice }); // Should return new ticket price
    expect(ticketPrice).toEqual(newPrice); // Ticket price should be updated
  });
  
  it('should not allow unauthorized users to set a ticket price', () => {
    txSender = 'another-principal'; // Simulate unauthorized user
    const result = setTicketPrice(150); // Attempt to set ticket price
    expect(result).toEqual({ err: 1000 }); // Should return unauthorized error
  });
  
  it('should return the current lottery status', () => {
    const result = getLotteryStatus(); // Get current lottery status
    expect(result).toEqual({ ok: true }); // Should return current status
  });
  
  it('should return the current number of participants', () => {
    buyTicket(); // Buy a ticket
    const result = getParticipants(); // Get current participants count
    expect(result).toEqual({ ok: 1 }); // Should return participants count of 1
  });
  
  it('should return the current lottery ID', () => {
    startNewLottery(); // Start a new lottery
    const result = getCurrentLotteryId(); // Get current lottery ID
    expect(result).toEqual({ ok: 1 }); // Should return current lottery ID
  });
  
  it('should return the current ticket price', () => {
    const result = getTicketPrice(); // Get current ticket price
    expect(result).toEqual({ ok: 100 }); // Should return current ticket price
  });
});

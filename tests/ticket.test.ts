import { describe, it, expect, beforeEach } from 'vitest';

// Mock data maps and variables
const tickets = new Map();
let maxTickets = 100;
let ticketPrice = 100;
let lotteryStatus = true; // true means the lottery is open

// Mock contract functions

// Buy ticket function
const buyTicket = (lotteryId: number) => {
  if (!lotteryStatus) return { err: 1000 }; // Lottery is closed
  const currentTickets = tickets.get(lotteryId) || 0;
  if (currentTickets >= maxTickets) return { err: 1001 }; // Max tickets reached
  tickets.set(lotteryId, currentTickets + 1); // Increment participants
  return { ok: true };
};

// Close lottery function
const closeLottery = () => {
  lotteryStatus = false;
  return { ok: true };
};

// Set max tickets function
const setMaxTickets = (newMax: number) => {
  maxTickets = newMax;
  return { ok: true };
};

// Resetting state before each test
beforeEach(() => {
  tickets.clear();
  maxTickets = 100;
  ticketPrice = 100;
  lotteryStatus = true;
});

// Tests
describe('Simple Lottery Contract Tests', () => {
  it('should allow buying a ticket if the lottery is open and tickets are available', () => {
    const result = buyTicket(1);
    expect(result).toEqual({ ok: true });
    expect(tickets.get(1)).toEqual(1); // One participant should be recorded
  });
  
  it('should not allow buying a ticket if the lottery is closed', () => {
    closeLottery(); // Close the lottery
    const result = buyTicket(1);
    expect(result).toEqual({ err: 1000 }); // Lottery is closed
  });
  
  it('should not allow buying a ticket if max tickets are reached', () => {
    setMaxTickets(1); // Set max tickets to 1
    buyTicket(1); // First ticket
    const result = buyTicket(1); // Try to buy a second ticket
    expect(result).toEqual({ err: 1001 }); // Max tickets reached
  });
  
  it('should close the lottery successfully', () => {
    const result = closeLottery();
    expect(result).toEqual({ ok: true });
    expect(lotteryStatus).toEqual(false); // Lottery should be closed
  });
  
  it('should set a new max ticket limit successfully', () => {
    const result = setMaxTickets(50);
    expect(result).toEqual({ ok: true });
    expect(maxTickets).toEqual(50); // Max tickets should be updated
  });
});

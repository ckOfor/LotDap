;; Constants
(define-constant ERR_UNAUTHORIZED (err u1000))
(define-constant ERR_LOTTERY_CLOSED (err u1001))
(define-constant ERR_INSUFFICIENT_FUNDS (err u1002))

;; Data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var current-lottery-id uint u0)
(define-data-var ticket-price uint u100)
(define-data-var lottery-status bool true) ;; true = open, false = closed
(define-data-var participants uint u0)

;; Buy ticket function
(define-public (buy-ticket)
  (begin
    (asserts! (var-get lottery-status) ERR_LOTTERY_CLOSED)
    (try! (stx-transfer? (var-get ticket-price) tx-sender (as-contract tx-sender)))
    (var-set participants (+ (var-get participants) u1))
    (ok (var-get participants))
  )
)

;; Start new lottery
(define-public (start-new-lottery)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (var-set current-lottery-id (+ (var-get current-lottery-id) u1))
    (var-set lottery-status true)
    (var-set participants u0)
    (ok (var-get current-lottery-id))
  )
)

;; End current lottery
(define-public (end-lottery)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (var-set lottery-status false)
    (ok (var-get current-lottery-id))
  )
)

;; Set ticket price
(define-public (set-ticket-price (new-price uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (var-set ticket-price new-price)
    (ok (var-get ticket-price))
  )
)

;; Get current lottery status
(define-read-only (get-lottery-status)
  (ok (var-get lottery-status))
)

;; Get current number of participants
(define-read-only (get-participants)
  (ok (var-get participants))
)

;; Get current lottery ID
(define-read-only (get-current-lottery-id)
  (ok (var-get current-lottery-id))
)

;; Get ticket price
(define-read-only (get-ticket-price)
  (ok (var-get ticket-price))
)

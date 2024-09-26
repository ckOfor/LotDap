;; Constants
(define-constant ERR_UNAUTHORIZED (err u1000))
(define-constant ERR_INSUFFICIENT_BALANCE (err u1001))

;; Data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var prize-pool uint u0)

;; Distribute prize to winner
(define-public (distribute-prize (winner principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (asserts! (<= amount (var-get prize-pool)) ERR_INSUFFICIENT_BALANCE)
    (try! (as-contract (stx-transfer? amount tx-sender winner)))
    (var-set prize-pool (- (var-get prize-pool) amount))
    (ok amount)
  )
)

;; Add funds to prize pool
(define-public (add-to-prize-pool (amount uint))
  (begin
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set prize-pool (+ (var-get prize-pool) amount))
    (ok (var-get prize-pool))
  )
)

;; Get current prize pool amount
(define-read-only (get-prize-pool)
  (ok (var-get prize-pool))
)

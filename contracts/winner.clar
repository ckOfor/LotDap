;; winner-selection.clar

;; Constants
(define-constant ERR_NO_PARTICIPANTS (err u1000))
(define-constant ERR_LOTTERY_OPEN (err u1001))
(define-constant ERR_UNAUTHORIZED (err u1002))

;; Data variables
(define-data-var current-lottery-id uint u0)
(define-data-var lottery-status bool true) ;; true = open, false = closed
(define-data-var participants uint u0)
(define-data-var contract-owner principal tx-sender)

;; Select winner function
(define-public (select-winner)
  (let
    (
      (lottery-id (var-get current-lottery-id))
    )
    (asserts! (is-eq (var-get lottery-status) false) ERR_LOTTERY_OPEN)
    (asserts! (> (var-get participants) u0) ERR_NO_PARTICIPANTS)
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)

    (let
      (
        (winner-index (mod burn-block-height (var-get participants)))
      )
      (ok winner-index)
    )
  )
)

;; Getter for current lottery ID
(define-read-only (get-current-lottery-id)
  (ok (var-get current-lottery-id))
)

;; Setter for current lottery ID (only callable by contract owner)
(define-public (set-current-lottery-id (new-id uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (ok (var-set current-lottery-id new-id))
  )
)

;; Set lottery status
(define-public (set-lottery-status (new-status bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (ok (var-set lottery-status new-status))
  )
)

;; Set number of participants
(define-public (set-participants (number uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (ok (var-set participants number))
  )
)

;; Get lottery status
(define-read-only (get-lottery-status)
  (ok (var-get lottery-status))
)

;; Get number of participants
(define-read-only (get-participants)
  (ok (var-get participants))
)

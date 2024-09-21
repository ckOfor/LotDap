(define-data-var participants (list 100 principal) (list))
(define-data-var ticket-count {principal: uint, count: uint} {})
(define-data-var prize-pool uint u0)
(define-data-var lottery-active bool true)

(define-constant ticket-price u100)

(define-public (buy-ticket)
    (begin
        (asserts! (is-eq (var-get lottery-active) true) (err u100)) ;; Ensure lottery is active
        (let (
                (sender (tx-sender))
                (price (var-get ticket-price))
            )
            (if (is-some (map-get ticket-count {principal: sender}))
                (let (
                    (ticket-entry (default-to {principal: sender, count: u0} (map-get ticket-count {principal: sender})))
                    (new-ticket-count (+ (get count ticket-entry) u1))
                )
                    (map-set ticket-count {principal: sender} {principal: sender, count: new-ticket-count})
                )
                (map-set ticket-count {principal: sender} {principal: sender, count: u1})
            )
            ;; Add user to the participants list
            (var-set participants (append (var-get participants) (list sender)))
            ;; Add to prize pool
            (var-set prize-pool (+ (var-get prize-pool) price))
            (ok u1)
        )
    )
)

(define-private (get-random-winner)
    (let ((participants-list (var-get participants)))
        ;; For simplicity, we assume there's a function that generates randomness
        ;; In production, randomness should be derived from an oracle or off-chain source
        (let ((winner-index (mod (block-height) (len participants-list))))
            (element-at winner-index participants-list)
        )
    )
)

(define-public (pick-winner)
    (begin
        (asserts! (is-eq (var-get lottery-active) true) (err u101)) ;; Ensure lottery is active
        (var-set lottery-active false) ;; End the lottery round
        (let ((winner (get-random-winner)))
            (ok winner)
        )
    )
)

(define-public (distribute-prize)
    (let ((winner (unwrap-panic (get-random-winner)))
          (pool (var-get prize-pool)))
        (begin
            (stx-transfer? pool tx-sender winner)
            (var-set prize-pool u0) ;; Reset the prize pool
            (var-set participants (list)) ;; Reset the participants
            (var-set lottery-active true) ;; Activate the next round
            (ok pool)
        )
    )
)

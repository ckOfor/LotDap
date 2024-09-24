(define-map tickets
  { lottery-id: uint } ;; key
  { participants: uint }) ;; simplified value to track the number of participants

(define-data-var max-tickets uint u100)
(define-data-var ticket-price uint u100) ;; price per ticket in STX
(define-data-var lottery-status bool true) ;; true = open, false = closed

;; Buy a ticket
(define-public (buy-ticket (lottery-id uint))
  (let ((current-tickets (map-get? tickets { lottery-id: lottery-id })))
    (asserts! (var-get lottery-status) (err u1000)) ;; lottery is closed
    (match current-tickets
      ticket-data
        (let ((participants (get participants ticket-data)))
          (asserts! (< participants (var-get max-tickets)) (err u1001)) ;; max tickets reached
          ;; Increment participant count
          (ok (map-set tickets
                       { lottery-id: lottery-id }
                       { participants: (+ participants u1) })))
      (begin
        ;; Initialize with 1 participant
        (ok (map-set tickets
                     { lottery-id: lottery-id }
                     { participants: u1 }))))))

;; Close lottery
(define-public (close-lottery)
  (begin
    (ok (var-set lottery-status false))))

;; Get participants count
(define-read-only (get-participants (lottery-id uint))
  (default-to u0 (get participants (map-get? tickets { lottery-id: lottery-id }))))

;; Get max tickets
(define-read-only (get-max-tickets)
  (ok (var-get max-tickets)))

;; Set max tickets
(define-public (set-max-tickets (new-max uint))
  (begin
    (ok (var-set max-tickets new-max))))

;; Get lottery status
(define-read-only (get-lottery-status)
  (ok (var-get lottery-status)))

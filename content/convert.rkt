#!/usr/bin/env racket
#lang racket

;; Let's read in a filename
(define md
  (command-line
   #:args
   (str) str))

;; And make it into a port
(define file-port (open-input-file md))

;; process-file: file-in-port -> str
(define (process-file file-in-port)
  (define line (read-line file-in-port))

  (cond
    [(eof-object? line) ""]
    [else ])
  )

;; process-line: str -> str
(define (process-line s)
  (cond
    [(eq? s "---") "+++"]
    [(regexp-match #rx"^title")]
    ))

;;conver-and-wrap: string? string? -> string?
;; This function does not check sanity! Make sure the input is good
;; Before: title: Intro to Blah blah
;; After: title = "Intro to Blah blah"
(define (convert-and-wrap keyword s)
  (string-append keyword " = " )

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useId, useRef, useState } from 'react'

import {
  levelKey,
  markComplete,
  useCompletedLevels,
} from '@/components/learn/progress-store'
import { saveQuizResult, useQuizResults } from '@/components/learn/quiz-store'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { LearnLevelId, QuizQuestion } from '@/data/learn/types'
import { cn } from '@/lib/cn'
import { formatPercent } from '@/lib/format'

/**
 * Wissenscheck am Ende einer Lernstufe.
 *
 * Ablauf: eine Frage pro Schritt, nach dem Bestätigen sofortiges Feedback samt
 * Begründung, am Ende eine Auswertung. Die Frage-für-Frage-Führung ist bewusst
 * gewählt – bei allen Fragen gleichzeitig überspringen Lernende die Begründungen,
 * und genau darin liegt der Lernwert.
 *
 * Barrierefreiheit: Jede Frage ist eine `fieldset`/`legend`-Gruppe mit echten
 * Radio-Buttons (Pfeiltasten funktionieren dadurch von selbst). Das Feedback
 * steht in einer `aria-live`-Region und erhält den Fokus, damit Screenreader-
 * Nutzer es nicht übersehen.
 */

/** Ab diesem Anteil richtiger Antworten gilt die Stufe als bestanden. */
const PASS_RATIO = 0.6

export function Quiz({
  topicSlug,
  levelId,
  levelLabel,
  questions,
}: {
  topicSlug: string
  levelId: LearnLevelId
  levelLabel: string
  questions: QuizQuestion[]
}) {
  const groupId = useId()
  const key = levelKey(topicSlug, levelId)

  const results = useQuizResults()
  const completed = useCompletedLevels()
  const bestResult = results[key]
  const isLevelComplete = completed.includes(key)

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  /** Bereits bestätigte Antwort der aktuellen Frage. */
  const [checked, setChecked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  /** Erst nach dem ersten „Quiz starten“ werden Fragen gezeigt. */
  const [started, setStarted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)

  const question = questions[index]
  const isLast = index === questions.length - 1
  const wasCorrect = checked !== null && checked === question?.correctIndex

  function check() {
    if (selected === null) return
    setChecked(selected)
    if (selected === question.correctIndex) setCorrectCount((count) => count + 1)
    // Fokus auf das Feedback, damit die Begründung angekündigt wird.
    window.setTimeout(() => feedbackRef.current?.focus(), 50)
  }

  function next() {
    if (isLast) {
      const finalCorrect = correctCount
      saveQuizResult(key, finalCorrect, questions.length)
      setFinished(true)
      return
    }
    setIndex((current) => current + 1)
    setSelected(null)
    setChecked(null)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setChecked(null)
    setCorrectCount(0)
    setFinished(false)
    setStarted(true)
  }

  const ratio = questions.length === 0 ? 0 : correctCount / questions.length
  const passed = ratio >= PASS_RATIO

  // ------------------------------------------------------------- Startzustand
  if (!started && !finished) {
    return (
      <section
        aria-labelledby={`${groupId}-titel`}
        className="rounded-card border-learn/30 bg-learn-soft border p-6 sm:p-7"
      >
        <p className="fk-chip bg-learn text-white">
          <Icon name="target" className="size-3.5" />
          Wissenscheck
        </p>
        <h2 id={`${groupId}-titel`} className="text-fg mt-4 text-xl font-bold">
          Teste dein Wissen zu „{levelLabel}“
        </h2>
        <p className="text-fg-muted mt-2 text-sm leading-relaxed">
          {questions.length} Fragen, eine richtige Antwort pro Frage. Nach jeder Antwort
          bekommst du die Begründung – auch wenn du richtig lagst. Es gibt kein Zeitlimit
          und keine Bewertung, die irgendwo landet.
        </p>

        {bestResult && (
          <p className="text-fg mt-4 flex items-center gap-2 text-sm font-medium">
            <Icon name="check-circle" className="text-success size-4" />
            Deine Bestleistung: {bestResult.correct} von {bestResult.total} richtig
          </p>
        )}

        <button
          type="button"
          onClick={() => setStarted(true)}
          className="fk-btn-primary mt-6"
        >
          {bestResult ? 'Erneut versuchen' : 'Quiz starten'}
          <Icon name="arrow-right" className="size-4" />
        </button>
      </section>
    )
  }

  // ------------------------------------------------------------- Auswertung
  if (finished) {
    return (
      <section
        aria-labelledby={`${groupId}-ergebnis`}
        className={cn(
          'rounded-card border p-6 sm:p-7',
          passed
            ? 'border-success/40 bg-success-soft'
            : 'border-warning/40 bg-warning-soft'
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <p className="fk-chip bg-surface text-fg">
            <Icon name={passed ? 'sparkles' : 'target'} className="size-3.5" />
            Auswertung
          </p>

          <h2 id={`${groupId}-ergebnis`} className="text-fg mt-4 text-2xl font-bold">
            {correctCount} von {questions.length} richtig
          </h2>

          <p className="text-fg-muted mt-2 text-sm leading-relaxed" role="status">
            {passed
              ? `Das sind ${formatPercent(ratio * 100, 0)} – die Stufe sitzt. Wenn du magst, geht es weiter zur nächsten.`
              : `Das sind ${formatPercent(ratio * 100, 0)}. Kein Problem: Lies die Abschnitte oben noch einmal durch, die Begründungen zeigen, worauf es ankommt.`}
          </p>

          <ProgressBar
            value={correctCount}
            max={questions.length}
            label={`${correctCount} von ${questions.length} Fragen richtig`}
            barClassName={passed ? 'bg-success' : 'bg-warning'}
            className="mt-5"
          />

          {bestResult && bestResult.correct > correctCount && (
            <p className="text-fg-subtle mt-4 text-sm">
              Deine Bestleistung bleibt bei {bestResult.correct} von {bestResult.total}.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={restart} className="fk-btn-secondary">
              <Icon name="arrow-left" className="size-4" />
              Nochmal versuchen
            </button>

            {passed && !isLevelComplete && (
              <button
                type="button"
                onClick={() => markComplete(key)}
                className="fk-btn-primary"
              >
                <Icon name="check" className="size-4" />
                Stufe als erledigt markieren
              </button>
            )}

            {isLevelComplete && (
              <span className="fk-chip bg-success-soft text-success">
                <Icon name="check-circle" className="size-3.5" />
                Stufe ist als erledigt markiert
              </span>
            )}
          </div>
        </motion.div>
      </section>
    )
  }

  // ------------------------------------------------------------- Fragenlauf
  return (
    <section
      aria-labelledby={`${groupId}-titel`}
      className="rounded-card border-learn/30 bg-surface border p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="fk-chip bg-learn-soft text-learn">
          <Icon name="target" className="size-3.5" />
          Wissenscheck
        </p>
        <p className="text-fg-subtle text-sm font-medium tabular-nums">
          Frage {index + 1} von {questions.length}
        </p>
      </div>

      <h2 id={`${groupId}-titel`} className="sr-only">
        Wissenscheck zu {levelLabel}
      </h2>

      <ProgressBar
        value={index + (checked !== null ? 1 : 0)}
        max={questions.length}
        label={`Frage ${index + 1} von ${questions.length}`}
        showValue={false}
        className="mt-4"
      />

      <fieldset className="mt-6" disabled={checked !== null}>
        <legend className="text-fg text-lg font-semibold">{question.question}</legend>

        <div className="mt-4 space-y-2">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex
            const isCorrectOption = optionIndex === question.correctIndex
            const showAsCorrect = checked !== null && isCorrectOption
            const showAsWrong = checked !== null && isSelected && !isCorrectOption

            return (
              <label
                key={optionIndex}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition',
                  checked === null && 'hover:border-learn/50 hover:bg-surface-muted',
                  checked === null && isSelected
                    ? 'border-learn bg-learn-soft'
                    : 'border-border',
                  showAsCorrect && 'border-success bg-success-soft',
                  showAsWrong && 'border-danger bg-danger-soft',
                  checked !== null && 'cursor-default'
                )}
              >
                <input
                  type="radio"
                  name={`${groupId}-frage-${index}`}
                  value={optionIndex}
                  checked={isSelected}
                  onChange={() => setSelected(optionIndex)}
                  className="accent-learn mt-0.5 size-4 shrink-0"
                />
                <span className="text-fg min-w-0 flex-1 text-sm leading-relaxed">
                  {option}
                </span>
                {showAsCorrect && (
                  <Icon
                    name="check-circle"
                    className="text-success mt-0.5 size-4 shrink-0"
                    label="Richtige Antwort"
                  />
                )}
                {showAsWrong && (
                  <Icon
                    name="close"
                    className="text-danger mt-0.5 size-4 shrink-0"
                    label="Deine Antwort war falsch"
                  />
                )}
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Feedback mit Begründung – fokussierbar, damit es angekündigt wird. */}
      <AnimatePresence>
        {checked !== null && (
          <motion.div
            ref={feedbackRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'mt-5 rounded-xl border p-4',
              wasCorrect
                ? 'border-success/40 bg-success-soft'
                : 'border-warning/40 bg-warning-soft'
            )}
          >
            <p className="text-fg flex items-center gap-2 text-sm font-semibold">
              <Icon name={wasCorrect ? 'check-circle' : 'info'} className="size-4" />
              {wasCorrect ? 'Richtig' : 'Nicht ganz'}
            </p>
            <p className="text-fg-muted mt-2 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-fg-subtle text-xs tabular-nums">
          {correctCount} richtig bisher
        </p>

        {checked === null ? (
          <button
            type="button"
            onClick={check}
            disabled={selected === null}
            className="fk-btn-primary"
          >
            Antwort prüfen
          </button>
        ) : (
          <button type="button" onClick={next} className="fk-btn-primary">
            {isLast ? 'Ergebnis anzeigen' : 'Nächste Frage'}
            <Icon name="arrow-right" className="size-4" />
          </button>
        )}
      </div>
    </section>
  )
}

import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchCountries, getResultCopy, makeQuestions, OPTION_LETTERS, TOTAL_ROUNDS } from "../lib/game.js"
import "../styles/game.css"

const arrow = "→"

function ArrowButton({ children, ...props }) {
  return <button {...props}>{children}<span aria-hidden="true">{arrow}</span></button>
}

export default function Game() {
  const [countries, setCountries] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)

  const current = questions[currentIndex]
  const progress = ((currentIndex + 1) / TOTAL_ROUNDS) * 100

  const startNewGame = useCallback((source = countries) => {
    if (!source.length) return
    setQuestions(makeQuestions(source))
    setCurrentIndex(0)
    setScore(0)
    setFinished(false)
  }, [countries])

  useEffect(() => {
    let active = true
    fetchCountries().then((data) => {
      if (!active) return
      setCountries(data)
      setLoading(false)
      setQuestions(makeQuestions(data))
    })
    return () => { active = false }
  }, [])

  const updateCurrent = useCallback((update) => {
    setQuestions((items) => items.map((item, index) => index === currentIndex ? { ...item, ...update } : item))
  }, [currentIndex])

  const confirm = useCallback(() => {
    if (!current || !current.selectedOption || current.confirmed) return
    const isCorrect = current.selectedOption === current.country.capital
    updateCurrent({ confirmed: true, isCorrect })
    if (isCorrect) setScore((value) => value + 1)
  }, [current, updateCurrent])

  const next = useCallback(() => {
    if (currentIndex + 1 < TOTAL_ROUNDS) setCurrentIndex((value) => value + 1)
    else setFinished(true)
  }, [currentIndex])

  const pass = useCallback(() => {
    if (!current || current.confirmed) return
    updateCurrent({ confirmed: true, isCorrect: false, passed: true })
  }, [current, updateCurrent])

  useEffect(() => {
    function onKeyDown(event) {
      if (!current || finished) return
      const key = event.key.toUpperCase()
      if (!current.confirmed) {
        const index = ["A", "B", "C", "D"].indexOf(key) >= 0 ? ["A", "B", "C", "D"].indexOf(key) : Number(key) - 1
        if (index >= 0 && index < 4 && current.options[index]) updateCurrent({ selectedOption: current.options[index] })
        if (event.key === "Enter" && current.selectedOption) confirm()
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        next()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [confirm, current, finished, next, updateCurrent])

  const result = useMemo(() => getResultCopy(score), [score])

  if (loading || !current) {
    return <div className="game-container"><div className="game-loading"><div className="game-loading__line" /><span>Consultando archivo cartográfico...</span></div></div>
  }

  if (finished) {
    return (
      <main className="game-container game-container--results">
        <section className="game-results" aria-label="Resultados de la expedición">
          <span className="game-results__badge">EXPEDICIÓN FINALIZADA · 10 RONDAS</span>
          <h1>{result.title}</h1>
          <p>{result.summary}</p>
          <div className="game-results__score-box"><strong>{score} / {TOTAL_ROUNDS}</strong><span>Aciertos oficiales registrados</span></div>
          <div className="game-results__history">
            {questions.map((question, index) => (
              <div className="game-results__item" key={question.country.iso_code}>
                <span className="game-results__item-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{question.country.name}</strong>
                <span>{question.country.capital}</span>
                <b className={question.isCorrect ? "is-good" : question.passed ? "is-pass" : "is-bad"}>{question.isCorrect ? "✓" : question.passed ? "↷" : "×"}</b>
              </div>
            ))}
          </div>
          <div className="game-results__actions">
            <ArrowButton className="quiz-btn-primary" onClick={() => startNewGame()}>NUEVA EXPEDICIÓN</ArrowButton>
            <a className="quiz-btn-pass" href="/">VOLVER AL INICIO</a>
          </div>
        </section>
      </main>
    )
  }

  const { country } = current
  const flagUrl = country.flag_url || `https://flagcdn.com/w640/${country.iso_code.toLowerCase()}.png`

  return (
    <div className="game-container">
      <nav className="game-breadcrumb" aria-label="Navegación geográfica">
        <div><a href="/">ATLAS</a><span>/</span><span>{country.region.toUpperCase()}</span><span>/</span><strong>{country.name.toUpperCase()}</strong></div>
        <span className="game-breadcrumb__iso">ISO: {country.iso_code}</span>
      </nav>
      <div className="game-stage">
        <aside className="vexillo-plate" aria-label="Ficha vexilológica">
          <div className="vexillo-plate__header"><span>{country.region.toUpperCase()}</span><b>{country.iso_code}</b></div>
          <div className="vexillo-plate__flag-frame"><img src={flagUrl} alt={`Pabellón oficial de ${country.name}`} /></div>
          <div className="vexillo-plate__footer"><h2>{country.name}</h2><span>{country.region.toUpperCase()}</span></div>
        </aside>
        <section className="quiz-module" aria-label="Módulo de examen">
          <div className="quiz-module__meta"><span>{country.region.toUpperCase()} · CAPITALES</span><strong>RONDA {String(currentIndex + 1).padStart(2, "0")} / 10</strong></div>
          <div className="quiz-module__progress-bar"><div style={{ width: `${progress}%` }} /></div>
          <div className="quiz-module__question"><span>¿Cuál es la capital de</span><strong>{country.name}?</strong></div>
          <div className="quiz-options" role="radiogroup" aria-label="Opciones de capital">
            {current.options.map((option, index) => {
              const selected = current.selectedOption === option
              const correct = current.confirmed && option === country.capital
              const wrong = current.confirmed && selected && !current.isCorrect
              return <button key={option} type="button" role="radio" aria-checked={selected} disabled={current.confirmed} className={`quiz-option ${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}`} onClick={() => updateCurrent({ selectedOption: option })}>
                <span className="quiz-option__content"><b>{OPTION_LETTERS[index]}</b><span>{option}</span></span><i aria-hidden="true">{correct ? "✓" : wrong ? "×" : ""}</i>
              </button>
            })}
          </div>
          <div className="quiz-actions">
            {!current.confirmed ? <button className="quiz-btn-pass" type="button" onClick={pass}>PASAR <span aria-hidden="true">↷</span></button> : <p className={`quiz-feedback ${current.isCorrect ? "is-good" : current.passed ? "is-pass" : "is-bad"}`}>{current.isCorrect ? "● ACIERTO REGISTRADO (+1)" : current.passed ? "↷ RONDA OMITIDA (0)" : `× CAPITAL CORRECTA: ${country.capital.toUpperCase()}`}</p>}
            {!current.confirmed ? <ArrowButton className="quiz-btn-primary" type="button" disabled={!current.selectedOption} onClick={confirm}>CONFIRMAR</ArrowButton> : <ArrowButton className="quiz-btn-next" type="button" onClick={next}>{currentIndex + 1 < TOTAL_ROUNDS ? "SIGUIENTE RONDA" : "VER EXPEDICIÓN"}</ArrowButton>}
          </div>
        </section>
      </div>
    </div>
  )
}

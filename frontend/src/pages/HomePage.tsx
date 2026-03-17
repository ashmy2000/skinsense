import { useState } from "react"
import "../index.css"

interface Question {
  id: keyof ProfileState
  label: string
  options: { label: string; value: string }[]
}

interface ProfileState {
  skinType: string
  sensitivity: string
  acne: string
  fragrance: string
  pregnancySafe: string
}

interface IngredientMatch {
  ingredient: string
  reason: string
}

interface AnalyseResult {
  product: string
  ingredients: string
  image?: string
  percent: number
  verdict: string
  emoji: string
  good: IngredientMatch[]
  bad: IngredientMatch[]
}

const questions: Question[] = [
  {
    id: "skinType",
    label: "Skin Type",
    options: [
      { label: "Dry", value: "dry" },
      { label: "Oily", value: "oily" },
      { label: "Combination", value: "combination" },
      { label: "Normal", value: "normal" },
    ],
  },
  {
    id: "sensitivity",
    label: "Sensitivity",
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "Very Sensitive", value: "high" },
    ],
  },
  {
    id: "acne",
    label: "Acne Prone",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "fragrance",
    label: "Fragrance",
    options: [
      { label: "Avoid Fragrance", value: "avoid" },
      { label: "Fragrance OK", value: "ok" },
    ],
  },
  {
    id: "pregnancySafe",
    label: "Pregnancy Safe Only",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
]

function HomePage() {
  const [result, setResult] = useState<AnalyseResult | null>(null)
  const [showIngredients, setShowIngredients] = useState(false)
  const [productPreview, setProductPreview] = useState<AnalyseResult | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const [product, setProduct] = useState("")

  const [profile, setProfile] = useState<ProfileState>({
    skinType: "",
    sensitivity: "",
    acne: "",
    fragrance: "",
    pregnancySafe: "",
  })

  const updateProfile = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value === prev[field] ? "" : value,
    }))
  }

  const analyseProduct = async () => {

    try {

      setLoading(true)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ product, profile })
      })

      const data = await response.json()

      setProductPreview(data)

    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const filled = Object.values(profile).filter(Boolean).length
  const total = Object.keys(profile).length
  const pct = Math.round((filled / total) * 100)

  const getColour = (percent: number) => {
    if (percent >= 70) return "green"
    if (percent >= 50) return "orange"
    return "red"
  }

  return (
    <div className="ss-root">
      <div className="ss-inner">

        <div className="ss-logo">
          <div className="ss-logo-mark">✦</div>
          <span className="ss-wordmark">SkinSense</span>
        </div>

        <h1 className="ss-heading">
          Know your <em>ingredients</em>
        </h1>

        <p className="ss-subtitle">
          Personalised analysis for your skin
        </p>

        <div className="ss-search-wrap">
          <span className="ss-search-icon">⌕</span>

          <input
            className="ss-search"
            placeholder="Search a skincare product…"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />

        </div>

        <div className="ss-profile-header">
          <span className="ss-profile-title">Your Profile</span>
          <span className="ss-profile-pct">{filled} of {total} complete</span>
        </div>

        <div className="ss-progress-track">
          <div className="ss-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="ss-card">

          {questions.map((q) => (
            <div className="ss-group" key={q.id}>

              <div className="ss-group-label">{q.label}</div>

              <div className="ss-options">

                {q.options.map((opt) => (

                  <button
                    key={opt.value}
                    className={`ss-chip${profile[q.id] === opt.value ? " selected" : ""}`}
                    onClick={() => updateProfile(q.id, opt.value)}
                  >
                    {opt.label}
                  </button>

                ))}

              </div>

            </div>
          ))}

        </div>

        <button className="ss-cta" onClick={analyseProduct}>
          Analyse Product
        </button>

        {loading && <p className="ss-loading">Analysing product...</p>}

        {productPreview && !confirmed && (

          <div className="ss-preview">

            <p className="ss-preview-title">Is this the product?</p>

            {productPreview.image && (
              <img
                src={productPreview.image}
                alt={productPreview.product}
                className="ss-preview-image"
              />
            )}

            <div className="ss-preview-actions">

              <button
                className="ss-confirm"
                onClick={() => {
                  setConfirmed(true)
                  setResult(productPreview)
                }}
              >
                Yes
              </button>

              <button
                className="ss-retry"
                onClick={() => {
                  setProduct("")
                  setProductPreview(null)
                }}
              >
                No
              </button>

            </div>

          </div>
        )}

        {result && confirmed && (

          <div className="ss-result">

            <h2 className="ss-result-title">
              Analysis for {result.product}
            </h2>

            {result.image && (
              <div className="ss-product-image">
                <img src={result.image} alt={result.product} />
              </div>
            )}

            <div
              className="ss-percent"
              style={{ color: getColour(result.percent) }}
            >
              {result.emoji} {result.percent}% match
            </div>

            {/* GOOD INGREDIENTS */}

            <div className="ss-result-section">

              <strong>Good ingredients for your profile</strong>

              {result.good.length === 0 ? (
                <p>No beneficial ingredients detected.</p>
              ) : (
                <ul>
                  {result.good.map((item, i) => (
                    <li key={i}>
                      {item.ingredient} — {item.reason}
                    </li>
                  ))}
                </ul>
              )}

            </div>

            {/* BAD INGREDIENTS */}
            <div className="ss-result-section">
            <strong>Potential concerns</strong>

            {result.bad.length === 0 ? (
                <p>No concerning ingredients detected.</p>
            ) : (
                <ul>
                {result.bad.map((item, i) => (
                    <li key={i}>
                    {item.ingredient} — {item.reason}
                    </li>
                ))}
                </ul>
            )}

            {/* NEW BUTTON */}
            <button
                className="ss-ingredients-btn"
                onClick={() => setShowIngredients(!showIngredients)}
            >
                {showIngredients ? "Hide ingredients" : "List all ingredients"}
            </button>

            {/* INGREDIENT LIST */}
            {showIngredients && (
                <div className="ss-ingredient-list">
                <p>{result.ingredients}</p>
                </div>
            )}
            </div>

          </div>

        )}

      </div>
    </div>
  )
}

export default HomePage
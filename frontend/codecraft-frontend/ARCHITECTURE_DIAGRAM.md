# 🏗️ AI Recommendations System - Architecture Diagram

## 📐 System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         TriviaAI Frontend                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────┐                            │
│  │       User Authentication       │                            │
│  │  (Login/Register Component)     │                            │
│  └──────────────┬──────────────────┘                            │
│                 │                                                │
│                 ├─→ Save playerData to localStorage             │
│                 │                                                │
│                 └─→ Check if first-time                          │
│                      ├─ YES → Show WelcomeRecommendModal        │
│                      │         [View Roadmap] → /practice       │
│                      └─ NO → Skip                               │
│                                                                  │
│  ┌─────────────────────────────────┐                            │
│  │      /practice Route            │                            │
│  │     (PracticePage.jsx)          │                            │
│  └──────────────┬──────────────────┘                            │
│                 │                                                │
│                 ├─→ Load playerData from localStorage           │
│                 │                                                │
│                 ├─→ useAIRecommendations Hook                   │
│                 │   ├─ Check ai_recommendations_${userId}       │
│                 │   │  in localStorage                          │
│                 │   ├─ If exists & fresh → Use cache (✚ fast)  │
│                 │   │  (Skip API call, instant load)           │
│                 │   │                                           │
│                 │   └─ If missing/expired → Call Gemini         │
│                 │      └─ Show Loading Skeleton (3-5s)         │
│                 │                                                │
│  ┌──────────────▼────────────────────────────────────┐          │
│  │    DECISION POINT: Cache Status                   │          │
│  ├───────────────────────────────────────────────────┤          │
│  │                                                   │          │
│  │  Cache Fresh (< 24h)?                            │          │
│  │  ├─ YES → Return cached data                     │          │
│  │  │        ├─ PlayerSummary                       │          │
│  │  │        ├─ WeeklyGoal                          │          │
│  │  │        ├─ Recommendations[]                   │          │
│  │  │        └─ WeakAreas/Strengths                 │          │
│  │  │                                               │          │
│  │  └─ NO / Missing → Call Gemini API               │          │
│  │     (proceed to next section)                    │          │
│  └────────────────────────────────────────────────── ┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │      Gemini API Call (getAIRecommendations) │               │
│  ├──────────────────────────────────────────────┤               │
│  │                                              │               │
│  │  INPUT DATA:                                 │               │
│  │  ├─ playerData                               │               │
│  │  │  ├─ name, level, tier                     │               │
│  │  │  ├─ totalSolved, easySolved, etc.         │               │
│  │  │  ├─ questionsSolved = [1, 5]              │               │
│  │  │  ├─ tagsExplored = ["Array", "BinSearch"] │               │
│  │  │  └─ preferredMode, languages              │               │
│  │  │                                            │               │
│  │  └─ problemBank (all 10 problems)             │               │
│  │                                              │               │
│  │  PROMPT ENGINEERING:                          │               │
│  │  ├─ "You are an expert coding coach"          │               │
│  │  ├─ Analyze weak areas                        │               │
│  │  ├─ Identify next difficulty                  │               │
│  │  ├─ Prioritize all unsolved problems          │               │
│  │  ├─ Return structured JSON                    │               │
│  │  └─ Personalize reasons                       │               │
│  │                                              │               │
│  │  GEMINI 2.5 FLASH MODEL:                      │               │
│  │  ├─ Fast (< 5 seconds)                        │               │
│  │  ├─ Smart analysis                            │               │
│  │  ├─ JSON structured output                    │               │
│  │  └─ Cost-effective                            │               │
│  │                                              │               │
│  │  OUTPUT STRUCTURE:                            │               │
│  │  ├─ playerSummary (string)                    │               │
│  │  ├─ weakAreas (string[])                      │               │
│  │  ├─ strengthAreas (string[])                  │               │
│  │  ├─ readyForDifficulty (Easy|Medium|Hard)     │               │
│  │  ├─ motivationalMessage (string)              │               │
│  │  ├─ recommendations (object[])                │               │
│  │  │  ├─ problemId                              │               │
│  │  │  ├─ priority (HIGH|MEDIUM|LOW)             │               │
│  │  │  ├─ reason (string)                        │               │
│  │  │  ├─ estimatedMins (number)                 │               │
│  │  │  └─ skillBuilt (string)                    │               │
│  │  └─ weeklyGoal                                │               │
│  │     ├─ targetProblems                         │               │
│  │     ├─ focusTopic                             │               │
│  │     └─ message                                │               │
│  │                                              │               │
│  └──────────────────────────────────────────────┘               │
│                 │                                                │
│                 ├─→ Store in localStorage                       │
│                 │   key: ai_recommendations_${userId}           │
│                 │   timestamp: new Date().toISOString()         │
│                 │                                                │
│                 └─→ RENDER COMPONENTS                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PracticePage (Main Container)               │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  DESKTOP LAYOUT (3 columns):                            │  │
│  │                                                          │  │
│  │  ┌─────────────────┬──────────────────────────────────┐ │  │
│  │  │ LEFT SIDEBAR    │  MAIN CONTENT (2/3)              │ │  │
│  │  │ (1/3 width)     │                                  │ │  │
│  │  ├─────────────────┼──────────────────────────────────┤ │  │
│  │  │                 │  ProblemRoadmapList              │ │  │
│  │  │ PlayerSummary   │  ├─ Header + Refresh Button      │ │  │
│  │  │ Banner          │  │                               │ │  │
│  │  │ ├─ Avatar       │  ├─ 🔴 HIGH PRIORITY            │ │  │
│  │  │ ├─ Name/Level   │  │  ├─ RecommendationCard #2    │ │  │
│  │  │ ├─ AI Summary   │  │  ├─ RecommendationCard #4    │ │  │
│  │  │ ├─ Ready For    │  │  └─ RecommendationCard #7    │ │  │
│  │  │ └─ Motivation   │  │                               │ │  │
│  │  │                 │  ├─ 🟡 MEDIUM PRIORITY          │ │  │
│  │  │ Weekly Goal     │  │  ├─ RecommendationCard #8    │ │  │
│  │  │ Card            │  │  ├─ RecommendationCard #3    │ │  │
│  │  │ ├─ Target: 3    │  │  └─ RecommendationCard #6    │ │  │
│  │  │ ├─ Topic: Stack │  │                               │ │  │
│  │  │ ├─ Progress     │  ├─ 🟢 LOW PRIORITY             │ │  │
│  │  │ └─ Message      │  │  ├─ RecommendationCard #9    │ │  │
│  │  │                 │  │  └─ RecommendationCard #10   │ │  │
│  │  │ Weak Areas      │  │                               │ │  │
│  │  │ Card            │  └─ First Timer Banner (if new) │ │  │
│  │  │                 │                                  │ │  │
│  │  │ Strengths Card  │                                  │ │  │
│  │  └─────────────────┴──────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  MOBILE LAYOUT (single column):                         │  │
│  │  All cards stack vertically, full width                │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     Each RecommendationCard (Individual Problem)        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ #1  Two Sum                  🔴 HIGH PRIORITY   │  │ │  │
│  │  │     Array · HashMap                              │  │ │  │
│  │  │                                                  │  │ │  │
│  │  │     [Easy]  [100 pts]  ⏱ ~20 mins               │  │ │  │
│  │  │                                                  │  │ │  │
│  │  │     🤖 AI says: "Start here to build your       │  │ │  │
│  │  │     foundation in hash map lookups..."          │  │ │  │
│  │  │                                                  │  │ │  │
│  │  │     🛠 Builds: Hash Map intuition               │  │ │  │
│  │  │                                    [Solve Now →]│  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           User Interactions                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  REFRESH BUTTON:                                        │  │
│  │  1. User clicks "🔄 Refresh Recommendations"           │  │
│  │  2. Show confirmation modal                            │  │
│  │  3. Clear localStorage cache                           │  │
│  │  4. Call getAIRecommendations() again                  │  │
│  │  5. Show loading skeleton                              │  │
│  │  6. Fresh recommendations appear                       │  │
│  │                                                          │  │
│  │  SOLVE BUTTON (on each card):                          │  │
│  │  1. User clicks "Solve Now →"                          │  │
│  │  2. Navigate to /problem/:problemId                    │  │
│  │  OR open in new tab                                   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

                          localStorage
                    ┌────────────────────┐
                    │ ai_recommendations │
                    │      _${userId}    │
                    │  (24h expiry)      │
                    │                    │
                    │ Stores:            │
                    │ ├─ Recommendations │
                    │ ├─ Generated time  │
                    │ └─ User ID         │
                    │                    │
                    │ Checked every time │
                    │ /practice loads    │
                    └────────────────────┘
                             │
                             └─→ < 24h old?
                                ├─ YES → Use immediately (⚡ fast)
                                └─ NO → Call Gemini again
```

---

## 🔄 Data Flow Detailed

```
INITIALIZATION
    ↓
┌─────────────────────────────────────────────────┐
│  componentDidMount() / useEffect()              │
│  readPlayerData() from localStorage             │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│  useAIRecommendations(playerData)               │
│  Hook initialized                               │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│  CHECK CACHE                                    │
│  getCachedRecommendations(userId)               │
└─────────────────────────────────────────────────┘
    ↓
    ├─ CACHE HIT (< 24h)
    │   └─ Return immediately ⚡
    │      └─ Render components with cached data
    │
    └─ CACHE MISS (expired or first time)
        ├─ Show Loading Skeleton
        │   └─ animate-pulse effect
        │   └─ 3 empty problem cards
        │   └─ "🤖 AI is analyzing your profile..."
        │
        ├─ Call getAIRecommendations()
        │   ├─ Get playerData + problemBank
        │   ├─ Build Gemini prompt
        │   ├─ Send to Gemini API
        │   ├─ Parse JSON response
        │   └─ Error handling if fails
        │
        ├─ saveRecommendations()
        │   └─ Store in localStorage
        │   └─ With timestamp
        │   └─ With userId
        │
        └─ Render Components
            ├─ PlayerSummaryBanner (left)
            ├─ WeeklyGoalCard (left)
            ├─ WeakAreasCard (left)
            ├─ ProblemRoadmapList (main)
            │  ├─ Group by priority
            │  └─ Map to RecommendationCard
            └─ FirstTimeUserBanner (if new)


MANUAL REFRESH
    ↓
User clicks [🔄 Refresh Recommendations]
    ↓
Show Modal: "Regenerate recommendations?"
    ├─ [Cancel]
    └─ [Regenerate]
        ↓
        clearRecommendationCache(userId)
        └─ Remove from localStorage
        ↓
        Call getAIRecommendations() again
        └─ Force fresh Gemini call
        ↓
        Show loading state
        ↓
        Display new recommendations


PROBLEM CLICK
    ↓
User clicks [Solve Now] on card
    ↓
Navigate to /problem/:problemId
or window.open() in new tab
```

---

## 📦 Component Hierarchy

```
PracticePage
├─ PlayerDataLoader
│  └─ Read from localStorage
│
├─ useAIRecommendations Hook
│  ├─ loadRecommendations()
│  ├─ refresh()
│  └─ State: recommendations, isLoading, error
│
├─ LoadingState
│  └─ Show skeleton if isLoading
│
├─ ErrorState
│  └─ Show error message if error
│
├─ MainContent (when data loaded)
│  ├─ FirstTimeBanner
│  │  └─ "👋 Welcome! Start here..."
│  │
│  ├─ DesktopLayout (grid 3 columns)
│  │  ├─ LeftColumn
│  │  │  ├─ PlayerSummaryBanner
│  │  │  │  ├─ Avatar circle
│  │  │  │  ├─ Name + tier
│  │  │  │  ├─ AI Assessment
│  │  │  │  ├─ Motivational Message
│  │  │  │  └─ Ready for badge
│  │  │  │
│  │  │  ├─ WeeklyGoalCard
│  │  │  │  ├─ Target problems
│  │  │  │  ├─ Progress bar
│  │  │  │  ├─ Focus topic
│  │  │  │  └─ Message
│  │  │  │
│  │  │  ├─ WeakAreasCard
│  │  │  │  └─ List of topics
│  │  │  │
│  │  │  └─ StrengthsCard
│  │  │     └─ List of topics
│  │  │
│  │  └─ MainColumn
│  │     ├─ Header + Refresh Button
│  │     └─ ProblemRoadmapList
│  │        ├─ HIGH Priority Section
│  │        │  └─ RecommendationCard[] (HIGH)
│  │        ├─ MEDIUM Priority Section
│  │        │  └─ RecommendationCard[] (MEDIUM)
│  │        └─ LOW Priority Section
│  │           └─ RecommendationCard[] (LOW)
│  │
│  └─ MobileLayout (single column)
│     └─ Stack all components vertically
│
└─ ConfirmationModal (for refresh)
   ├─ "Regenerate recommendations?"
   └─ [Cancel] [Confirm]

RecommendationCard (for each problem)
├─ Problem number circle
├─ Title + Description
├─ Difficulty badge
├─ Points
├─ Tags (chips)
├─ Priority badge
├─ AI Reason (indented, italicized)
├─ Skill Built
├─ Estimated Time
└─ [Solve Now →] button
```

---

## 🧠 AI Analysis Algorithm

```
INPUT: playerData + problemBank

STEP 1: Profile Assessment
├─ Skill Level = (totalSolved, tier, level, xp) → Beginner|Intermediate|Advanced
├─ Topic Coverage = tagsExplored → Coverage Map
└─ Performance = (fastestTimes, successRate) → Capability

STEP 2: Gap Analysis
├─ For each topic:
│  ├─ If never solved → High Priority Gap
│  ├─ If weak percentage → Medium Priority Gap
│  └─ If strong → Strength Area
├─ Weak Areas = [topics not explored]
└─ Strength Areas = [topics mastered]

STEP 3: Difficulty Assessment
├─ If level 1-5 + few solved → "Easy"
├─ If level 6-15 + some Medium → "Medium"
├─ If level 16+ + Medium cleared → "Hard"
└─ readyForDifficulty = one of above

STEP 4: Problem Prioritization
├─ For each unsolved problem:
│  ├─ If builds missing skill + right level → HIGH
│  ├─ If builds known skill + good practice → MEDIUM
│  └─ If optional/advanced → LOW
│
├─ Sort by:
│  1. Priority (HIGH → MEDIUM → LOW)
│  2. Tag necessity (gap filler first)
│  3. Difficulty (easier before harder)
│  └─ Natural learning progression

STEP 5: Personalization
├─ Generate reason for each problem
│  ├─ Reference player's specific gaps
│  ├─ Explain why THIS problem
│  ├─ Connect to their solving history
│  └─ Motivate with personal context
│
├─ Estimate time based on:
│  │  ├─ Problem difficulty
│  │  ├─ Player's speed
│  │  └─ Topic complexity
│  └─ estimatedMins = smart guess
│
└─ Identify skillBuilt for each

STEP 6: Weekly Goal
├─ Target = (level, pace) → 2-4 problems
├─ Focus = highest priority topic
└─ Message = personalized motivation

OUTPUT: Structured JSON recommendation
```

---

## 🔐 Caching Strategy

```
FIRST REQUEST
    ├─ playerData = { name: "Arjun", id: "123", ... }
    ├─ userId = "123"
    ├─ Check localStorage["ai_recommendations_123"]
    │  └─ Not found → Call Gemini
    ├─ Gemini returns { recommendations: [...], ... }
    ├─ Save to localStorage:
    │  │  key: "ai_recommendations_123"
    │  │  value: {
    │  │    data: { recommendations: [...], ... },
    │  │    generatedAt: "2024-02-22T10:30:45Z",
    │  │    userId: "123"
    │  │  }
    │  └─ Take timestamp
    └─ Display recommendations

SECOND REQUEST (1 hour later)
    ├─ Check localStorage["ai_recommendations_123"]
    │  └─ Found!
    ├─ Check age: now - generatedAt = 1 hour
    │  └─ < 24 hours → Still fresh!
    ├─ Return cached data immediately ⚡
    │  └─ No API call needed
    └─ Display (instant load)

THIRD REQUEST (25 hours later)
    ├─ Check localStorage["ai_recommendations_123"]
    │  └─ Found
    ├─ Check age: now - generatedAt = 25 hours
    │  └─ > 24 hours → STALE!
    ├─ Clear from localStorage
    ├─ Call Gemini fresh
    └─ Save new timestamp + data

MANUAL REFRESH
    ├─ User clicks button
    ├─ clearRecommendationCache(userId)
    │  └─ Delete immediately
    ├─ Check cache again
    │  └─ Not found → Call Gemini
    └─ Force fresh recommendations
```

---

## 🌐 Integration Points

```
Your App
    │
    ├─ Login Component
    │  ├─ Save userData to localStorage
    │  ├─ Check if first-time
    │  └─ Show WelcomeRecommendModal
    │
    ├─ Router
    │  ├─ /practice → <PracticePage />
    │  └─ /problem/:id → <ProblemPage />
    │
    ├─ Navbar/Sidebar
    │  └─ "Practice" link → navigate(/practice)
    │
    └─ Global State (Optional)
       └─ Supply playerData via context/redux
          instead of localStorage
```

---

This architecture is optimized for **performance**, **scalability**, and **maintainability**. 🚀

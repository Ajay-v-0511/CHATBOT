const config = require('../config/config');

// Category detection keywords and patterns
const CATEGORIES = {
  Academic: [
    'calculus', 'math', 'algebra', 'physics', 'chemistry', 'biology', 'exam', 'homework',
    'assignment', 'theorem', 'derivative', 'integral', 'formula', 'history', 'literature',
    'economics', 'psychology', 'study', 'syllabus', 'lecture', 'grade', 'gpa', 'semester'
  ],
  Programming: [
    'code', 'function', 'javascript', 'python', 'react', 'node', 'java', 'c++', 'html', 'css',
    'bug', 'error', 'debug', 'syntax', 'api', 'database', 'sql', 'nosql', 'git', 'algorithm',
    'array', 'loop', 'object', 'async', 'promise', 'backend', 'frontend', 'express', 'mongodb'
  ],
  Project: [
    'project', 'idea', 'build', 'app', 'website', 'portfolio', 'architecture', 'fullstack',
    'hackathon', 'mvp', 'capstone', 'final year', 'system design', 'tech stack', 'feature'
  ],
  Resume: [
    'resume', 'cv', 'ats', 'bullet point', 'cover letter', 'linkedin', 'experience section',
    'summary', 'action verb', 'portfolio link', 'formatting'
  ],
  Interview: [
    'interview', 'behavioral', 'star method', 'mock interview', 'hr round', 'technical round',
    'coding challenge', 'leetcode', 'tell me about yourself', 'strengths', 'weaknesses'
  ],
  Career: [
    'career', 'internship', 'job', 'salary', 'offer', 'networking', 'referral', 'recruiter',
    'software engineer', 'data scientist', 'product manager', 'remote work', 'transition'
  ]
};

/**
 * Detect the question category based on content analysis
 */
function detectCategory(text = '') {
  const lower = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    for (const kw of keywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
      if (regex.test(lower)) {
        return category;
      }
    }
  }
  return 'General';
}

/**
 * Built-in Intelligent Academic & Student AI Engine
 * Provides rich, context-aware, structured markdown responses with code, examples, and follow-ups.
 */
function generateBuiltInResponse(userMessage, history = [], category = 'General') {
  const query = userMessage.toLowerCase().trim();

  // 1. Coding / Programming help
  if (category === 'Programming' || query.includes('code') || query.includes('error') || query.includes('function') || query.includes('javascript') || query.includes('python')) {
    if (query.includes('react') || query.includes('hook') || query.includes('state')) {
      return {
        category: 'Programming',
        content: `### Understanding React State & Lifecycle

In modern React, **hooks** like \`useState\` and \`useEffect\` manage component state and side effects cleanly without class components.

#### Key Principles:
1. **Immutability:** Never mutate state directly (e.g., do not do \`state.count++\`).
2. **Batching:** React 18+ automatically batches state updates across event handlers and promises.

\`\`\`javascript
import React, { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Document title update side effect
    document.title = \`You clicked \${count} times\`;
  }, [count]); // Only re-runs if count changes

  return (
    <div className="p-4 bg-slate-900 text-white rounded-lg">
      <p className="text-lg font-semibold">Count: {count}</p>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        className="mt-2 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
      >
        Increment
      </button>
    </div>
  );
}
\`\`\`

#### Best Practice Tip:
Always use functional updates \`setCount(prev => prev + 1)\` when the new state depends on the previous state.`,
        followUpSuggestions: [
          'How does useEffect cleanup work?',
          'What is the difference between useMemo and useCallback?',
          'How do I handle asynchronous data fetching with error states?'
        ]
      };
    }

    if (query.includes('python') || query.includes('list') || query.includes('dict')) {
      return {
        category: 'Programming',
        content: `### Python Fundamentals & Data Structures

Python is designed for readability and simplicity. Here is a breakdown of core collections and comprehension syntax:

| Structure | Syntax | Mutable? | Ordered? | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **List** | \`[1, 2, 3]\` | Yes | Yes | Dynamic sequences, stacks |
| **Tuple** | \`(1, 2, 3)\` | No | Yes | Fixed records, dictionary keys |
| **Dict** | \`{'a': 1}\` | Yes | Yes (3.7+) | Fast key-value lookups $O(1)$ |
| **Set** | \`{1, 2, 3}\` | Yes | No | Unique items, membership test |

\`\`\`python
# List comprehension with filtering example
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = [x**2 for x in numbers if x % 2 == 0]

print(f"Even squares: {evens_squared}")
# Output: [4, 16, 36, 64, 100]
\`\`\`

#### Step-by-Step Guidance:
1. Always prefer list/dict comprehensions over verbose \`for\` loops for simple transformations.
2. Use \`.get('key', default_value)\` to prevent \`KeyError\` exceptions in dictionaries.`,
        followUpSuggestions: [
          'Explain generators and the yield keyword in Python',
          'How do Python decorators work under the hood?',
          'What are the time complexities of common Python operations?'
        ]
      };
    }

    return {
      category: 'Programming',
      content: `### Programming Guidance & Code Structure

Here is a structured approach to solving your technical problem:

#### 1. Core Logic & Algorithm
When structuring algorithms or debugging functions:
- **Clarify inputs and constraints** (edge cases: empty inputs, null values, negative numbers).
- **Time & Space Complexity:** Always aim for optimal algorithmic efficiency before micro-optimizing.

\`\`\`javascript
/**
 * Example: Robust error-handled API fetch helper
 */
async function fetchSafeData(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error('Fetch operation failed:', err.message);
    return { success: false, error: err.message };
  }
}
\`\`\`

#### 2. Key Takeaways:
- Wrap async calls in structured \`try/catch\` blocks.
- Return explicit success/failure objects instead of crashing silently.`,
      followUpSuggestions: [
        'How can I write automated unit tests for this function?',
        'What is the best way to handle global state management?',
        'Can you show an equivalent implementation in Python or TypeScript?'
      ]
    };
  }

  // 2. Project Ideas
  if (category === 'Project' || query.includes('project') || query.includes('portfolio') || query.includes('idea')) {
    return {
      category: 'Project',
      content: `### High-Impact Full-Stack Student Project Ideas

Building standout portfolio projects is the single best way to land tech internships. Here are 3 impressive, resume-ready concepts:

#### 1. 🎓 PeerNotes AI (Collaborative Smart Study Workspace)
- **Concept:** Students upload lecture slides or PDFs; the app extracts text, creates interactive flashcards, quizzes, and a collaborative note editor.
- **Tech Stack:** React, Node.js/Express, MongoDB/PostgreSQL, LangChain or OpenAI API.
- **Unique Hook:** Real-time multiplayer synchronization using WebSockets + AI automated quiz generator.

#### 2. ⚡ Campus Gig & Skill Exchange Portal
- **Concept:** A micro-freelance and tutoring marketplace exclusively for university campuses with verified student emails.
- **Tech Stack:** Next.js / React, Tailwind CSS, Node.js, Stripe Test Mode for escrow payments.
- **Key Features:** Review system, automated booking calendar, category search with filters.

#### 3. 🔍 Algorithmic Code Review & Complexity Analyzer
- **Concept:** Web app where students paste code and receive instant AST-based syntax analysis, time complexity estimation ($O(n)$), and optimization tips.
- **Tech Stack:** React, Prism.js/Monaco Editor, Python (FastAPI backend) or Node.js.

#### Architecture Checklist:
- [x] Responsive SaaS UI with dark/light mode
- [x] Role-based access control & JWT authentication
- [x] Comprehensive automated test coverage`,
      followUpSuggestions: [
        'How should I structure the database schema for the first project?',
        'What are the best free hosting services to deploy these projects?',
        'How can I highlight this project on my resume and GitHub README?'
      ]
    };
  }

  // 3. Resume Help
  if (category === 'Resume' || query.includes('resume') || query.includes('cv') || query.includes('ats')) {
    return {
      category: 'Resume',
      content: `### High-Conversion Tech Resume Blueprint (ATS-Optimized)

Recruiters spend an average of **6 to 8 seconds** scanning each resume. Use the **Google X-Y-Z formula** to make your bullet points pop:

> *"Accomplished [X] as measured by [Y], by doing [Z]"*

#### ❌ Weak Bullet Point vs ✅ Strong Bullet Point:
- ❌ *Weak:* "Created a chatbot for student homework assistance using React and Node.js."
- ✅ *Strong:* "Engineered an AI-powered student assistant using React and Express, serving **500+ active campus users** and reducing peer query response times by **65%**."

#### Essential Resume Sections Order:
1. **Header:** Full Name, University Email, LinkedIn URL, GitHub URL, Portfolio link.
2. **Education:** University name, Degree, Expected Graduation Date, GPA (if 3.5+).
3. **Technical Skills:** Languages, Frameworks, Developer Tools, Databases.
4. **Projects:** 2–3 featured full-stack projects with live links and GitHub repos.
5. **Work Experience / Leadership:** Internships, Teaching Assistant, or Club Executive roles.

#### ATS Formatting Rules:
- Keep to a clean, single-column layout (avoid multi-column tables or Canva graphic graphics).
- Use standard fonts like Inter, Roboto, Arial, or Calibri (10-11pt body).
- Always export and submit as a standard PDF.`,
      followUpSuggestions: [
        'Can you review my specific project bullet point if I paste it?',
        'What technical skills should I prioritize for Full-Stack Internships?',
        'How do I write an impactful LinkedIn summary?'
      ]
    };
  }

  // 4. Interview Preparation
  if (category === 'Interview' || query.includes('interview') || query.includes('star') || query.includes('behavioral')) {
    return {
      category: 'Interview',
      content: `### Complete Technical & Behavioral Interview Masterclass

Landing the offer requires mastering both algorithm challenges and behavioral communication.

#### 1. The STAR Method for Behavioral Questions:
When asked *"Tell me about a time you faced a difficult technical challenge"*:
- **Situation:** Set the scene (e.g., *"During our final year team capstone project..."*)
- **Task:** Explain what needed to be accomplished (e.g., *"We had to reduce database query latency before deadline..."*)
- **Action:** Highlight *your* specific technical choices (e.g., *"I indexed high-frequency foreign keys and added Redis caching..."*)
- **Result:** Quantify the outcome (e.g., *"Query response times dropped by 72% and our app passed load testing with zero dropped requests."*)

#### 2. Coding Interview Step-by-Step Strategy:
1. **Clarify (1-2 mins):** Ask about constraints, edge cases (empty arrays, negative numbers, duplicates).
2. **Brute Force First (2-3 mins):** State the obvious approach and its time complexity (e.g., $O(n^2)$).
3. **Optimize (5 mins):** Discuss hash maps, two pointers, sliding window, or binary search.
4. **Code Cleanly (15 mins):** Write modular code with clear variable names.
5. **Dry Run (5 mins):** Walk through the code line-by-line with sample input.`,
      followUpSuggestions: [
        'Give me a mock question: "Tell me about yourself"',
        'What are the most common sliding window coding patterns?',
        'What smart questions should I ask the interviewer at the end?'
      ]
    };
  }

  // 5. Study Plan
  if (category === 'Academic' && (query.includes('study plan') || query.includes('schedule') || query.includes('exam') || query.includes('revision'))) {
    return {
      category: 'Academic',
      content: `### High-Efficiency Student Study Plan & Exam Preparation Framework

Here is a scientifically proven study schedule based on **Spaced Repetition** and **Active Recall**:

#### The 4-Phase Study Framework:
1. **Day 1 (Capture):** Review lecture notes, summarize key formulas into high-yield flashcards.
2. **Day 2 (Active Recall):** Solve end-of-chapter problems without looking at solutions.
3. **Day 4 (Spaced Review):** Test yourself on previously missed questions; teach the concept aloud (Feynman Technique).
4. **Day 7 (Simulation):** Timed mock exam under realistic testing conditions.

#### Recommended Daily Schedule (The 50/10 Pomodoro Model):
| Time Block | Focus | Technique |
| :--- | :--- | :--- |
| **Session 1 (50 min)** | Hardest concept / Problem sets | Deep work, zero phone notifications |
| **Break (10 min)** | Hydration, physical stretch | Rest eyes from screen |
| **Session 2 (50 min)** | Application & Practice Coding/Math | Hands-on exercises |
| **Review (20 min)** | Reflection & Error Log | Log mistakes in a "Bug/Mistake Journal" |

> **Pro Tip:** Never passively re-read textbooks. Testing your memory forces neural pathway consolidation!`,
      followUpSuggestions: [
        'How can I organize a 2-week final exam cramming schedule?',
        'How do I stop procrastinating on difficult subjects?',
        'Can you create a custom study plan for my course syllabus?'
      ]
    };
  }

  // 6. Academic Question
  if (category === 'Academic') {
    return {
      category: 'Academic',
      content: `### Academic Concept Breakdown

Here is a clear, step-by-step explanation of your academic question:

#### 1. Core Principle
In scientific and mathematical analysis, complex topics are best understood by decomposing them into fundamental axioms:
- **Foundational Definition:** Every dynamic system can be modeled through state variables and transition rules.
- **Mathematical Expression:** Relationships between rates of change and quantities are represented via differential or discrete relations:
  $$\\frac{dy}{dx} = f(x, y)$$

#### 2. Practical Step-by-Step Example:
1. Identify given variables and boundary conditions.
2. Select the governing theorem or mathematical formulation.
3. Substitute known values and verify dimensional consistency.
4. Check edge values ($x = 0$, $x \\to \\infty$) for physical plausibility.

#### 3. Summary & Memory Aid:
Formulate an intuitive mental model before memorizing formal proofs. Relating abstract equations to real-world physical systems enhances long-term retention.`,
      followUpSuggestions: [
        'Can you show a worked-out numerical example?',
        'What are the typical pitfalls students make on this topic?',
        'How does this concept connect to advanced courses?'
      ]
    };
  }

  // General / Fallback
  return {
    category: 'General',
    content: `Hello! I am **SmartAssist AI**, your dedicated college companion.

I am here to guide you with:
- 📚 **Academic Topics:** Calculus, Physics, Chemistry, Data Structures, Algorithms.
- 💻 **Programming & Debugging:** React, Node.js, Python, Java, SQL, Git, and Web Development.
- 🚀 **Projects:** Brainstorming impactful portfolio projects, software architecture, and APIs.
- 📄 **Resume & Career:** ATS-friendly bullet points, LinkedIn optimization, tech recruiting.
- 🎯 **Interview Prep:** LeetCode strategies, STAR method behavioral answers, and mock questions.
- 📅 **Study Plans:** Spaced repetition schedules, time management, and exam revision.

How can I assist you with your studies or career goals today?`,
    followUpSuggestions: [
      'Give me 3 impressive project ideas for a computer science student',
      'How do I write an ATS-friendly bullet point for my resume?',
      'Can you explain how React handles state updates under the hood?'
    ]
  };
}

/**
 * Main Service Method: Generates response using configured LLM or fallback engine
 */
async function generateResponse({ message, history = [], userPreferences = {} }) {
  const category = detectCategory(message);

  // If OpenAI API key is configured, use OpenAI
  if (config.openaiApiKey && config.openaiApiKey.startsWith('sk-')) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are SmartAssist AI, a friendly, intelligent, and highly knowledgeable college student mentor.
The student's preferred language is ${userPreferences.language || 'English'}.
Guidelines:
1. Always be encouraging, clear, and structured.
2. Auto-categorize response context into: Academic, Programming, Project, Career, Interview, Resume, or General.
3. For programming queries, provide clean code blocks with syntax highlighting and step-by-step explanations.
4. Keep answers concise, direct, and well-formatted using markdown headers, bullet points, and tables.
5. Provide 2-3 short, relevant follow-up questions at the very end formatted as:
---FOLLOW_UPS---
- Question 1
- Question 2
- Question 3`
        },
        ...history.slice(-8).map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        },
        body: JSON.stringify({
          model: config.openaiModel || 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1200
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices[0]?.message?.content || '';
        
        // Parse follow-up questions if present
        let content = rawContent;
        let followUpSuggestions = [];
        if (rawContent.includes('---FOLLOW_UPS---')) {
          const parts = rawContent.split('---FOLLOW_UPS---');
          content = parts[0].trim();
          followUpSuggestions = parts[1]
            .split('\n')
            .map(line => line.replace(/^[-*•\d.]\s*/, '').trim())
            .filter(q => q.length > 5)
            .slice(0, 3);
        }

        if (followUpSuggestions.length === 0) {
          followUpSuggestions = [
            'Can you explain this with another example?',
            'What are the common mistakes to avoid here?',
            'How can I practice this topic further?'
          ];
        }

        return {
          content,
          category,
          followUpSuggestions
        };
      }
    } catch (err) {
      console.warn('[AI Service] OpenAI API call failed, falling back to built-in student AI engine:', err.message);
    }
  }

  // Fallback to high-quality built-in student engine
  return generateBuiltInResponse(message, history, category);
}

module.exports = {
  detectCategory,
  generateResponse
};

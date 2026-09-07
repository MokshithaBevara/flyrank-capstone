\# AI-Powered Habit Tracker & AI Coach

A production-deployed habit tracking application with an AI coach that uses real habit statistics through tool calling to provide personalized, actionable advice.

Built during the **FlyRank AI Internship — Front-End AI Engineering track**.

## 🚀 Live Demo

**Production:** https://flyrank-capstone-gamma.vercel.app/

**GitHub:** https://github.com/MokshithaBevara/flyrank-capstone

## ✨ Key Features

* 🤖 **AI Habit Coach** with streaming chat
* 🔧 **AI Tool Calling** using `getHabitStats`
* 📊 Real habit streak and completion statistics
* 📝 Validated habit creation
* 🎨 Interactive 3D streak visualization
* ✨ Custom GLSL shader experience
* 🧪 Unit, component, and end-to-end testing
* ♿ Accessibility and performance testing
* ⚡ GitHub Actions CI
* 🚀 Production deployment with Vercel
* 🛡️ Rate limiting and input validation for the AI route
* 🔄 Designed error and retry states for failed requests

## 📸 Screenshots

### Dashboard

![Dashboard with AI chat and habit stats](public/dashboard.png)

### Shader Hero

![Custom GLSL shader hero](public/hero.png)

### Test Coverage

![Test coverage report](public/coverage-report.png)

## 💡 What It Does

The application combines habit tracking with an AI coach so users can receive advice based on their actual habit data rather than generic motivational responses.

### AI Coach

Users can chat with the AI coach for short, practical suggestions.

The AI can call the `getHabitStats` tool to retrieve a habit's streak and completion statistics and use that structured information when generating its response.

This makes the AI interaction data-aware instead of relying only on conversational context.

### Habit Tracking

* Add habits through a validated form
* Track habit-related statistics
* Display streak and completion information
* Provide structured statistics to the AI coach

### Interactive Experience

The application also includes:

* Interactive 3D streak visualization
* Custom GLSL shader hero
* Stateful animated button interactions
* Responsive interface
* Designed loading, error, and empty states

## 🏗️ Architecture & Tech Stack

### Frontend

* **Next.js 16** — App Router
* **React 19**
* **Tailwind CSS**

### AI

* **Vercel AI SDK**
* **Google Gemini**
* `streamText`
* `useChat`
* AI tool calling
* **Zod** for typed tool input/output

The chat API is implemented in:

```text
app/api/chat/route.ts
```

The route defines the `getHabitStats` tool and streams the AI response back to the client.

### 3D & Graphics

* **React Three Fiber**
* **Drei**
* **GLSL fragment shaders**

### Testing

* **Vitest**
* **React Testing Library**
* **Playwright**

The project includes component tests for chat states, tool-result rendering, and form validation, along with an end-to-end test covering the primary user flow.

### CI/CD

* **GitHub Actions**
* Automated test execution
* Production deployment through **Vercel**

## 🧪 Testing

The project includes:

* **11 component tests** using Vitest + React Testing Library
* **1 Playwright end-to-end test**
* AI route mocked during E2E testing
* Automated testing through GitHub Actions
* **65% overall statement coverage**

### Test Coverage

![Test coverage report](public/coverage-report.png)

## ♿ Accessibility & Performance

Accessibility and performance were treated as part of the development process rather than an afterthought.

The project was tested using:

* Lighthouse
* WAVE
* Keyboard navigation
* Responsive viewport testing
* Reduced-motion testing

An accessibility issue involving the chat input label was identified and fixed, and streamed responses use appropriate live-region behavior.

## 🛡️ Production Considerations

The AI chat route includes basic safeguards:

* Per-IP rate limiting
* Message-length limit
* `maxDuration = 30`
* Input validation
* Designed error and retry states

The current rate limiter is intentionally implemented in memory as a lightweight solution for this project. It is not intended to provide distributed production-grade rate limiting across serverless instances.

## 🚀 Deployment

The application is deployed on **Vercel**.

### Production

https://flyrank-capstone-gamma.vercel.app/

### Deployment Checklist

* [x] Production build succeeds
* [x] Vercel deployment configured
* [x] Environment variables configured
* [x] GitHub Actions CI configured
* [x] Test suite passing
* [x] Accessibility audit completed
* [x] Production README verified
* [x] Chrome tested
* [x] Edge tested
* [x] Firefox tested

### Known Limitations

* Safari and mobile Safari were not tested on physical devices
* Habit data currently uses sample in-memory data
* Rate limiting is currently in-memory
* Dedicated production monitoring/alerting is not configured
* Custom domain is not configured

These limitations are documented intentionally rather than presenting the project as having capabilities it does not currently provide.

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

For production, configure the same variable in the Vercel project settings.

## 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/MokshithaBevara/flyrank-capstone.git
```

Move into the project:

```bash
cd flyrank-capstone
```

Install dependencies:

```bash
npm install
```

Create `.env.local` and add your Gemini API key.

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Run Tests

Component tests:

```bash
npm test
```

End-to-end tests:

```bash
npm run test:e2e
```

## 📁 Additional Routes

The repository also contains several focused experiences developed during the internship:

* `/habits` — validated habit-entry form
* `/button-demo` — stateful animated button interactions
* `/scene` — interactive 3D streak orb
* `/hero` — custom GLSL shader experience

Some earlier coursework is also retained in the repository as documented development exercises.

## 🤖 How AI Tools Were Used

Claude was used throughout development as a development and debugging assistant.

Its use included:

* Debugging AI SDK integration issues
* Migrating the chat client to the AI SDK `useChat` hook
* Developing and explaining the GLSL shader
* Setting up Vitest, React Testing Library, and Playwright
* Configuring GitHub Actions CI
* Debugging CI-specific failures
* Interpreting Lighthouse and WAVE results
* Implementing accessibility fixes

The application was not generated blindly. Changes were tested manually, bugs were investigated using actual runtime behavior, and implementation decisions were reviewed during development.

## 🧠 Engineering Decisions

### Sample Habit Data

The current `getHabitStats` tool uses sample in-memory data rather than a persistent database.

The tool interface was designed so that a database-backed implementation can replace the sample data later without requiring the AI interaction itself to be redesigned.

### In-Memory Rate Limiting

The current rate limiter is implemented in memory.

A distributed solution such as Redis would be more appropriate for a larger production deployment, but the current implementation provides a lightweight protection layer for this project.

## 📈 Future Improvements

Planned improvements include:

* Persistent habit storage using a database
* Database-backed AI statistics
* Production-grade distributed rate limiting
* Real Safari/mobile Safari testing
* Production monitoring and alerting
* Connecting the 3D streak visualization to real-time habit progress
* Completing the Calendar, Stats, and Health experiences

## 🎯 What I Learned

This project brought together frontend engineering, AI integration, testing, accessibility, 3D graphics, and deployment into one application.

One of the most valuable parts of the project was debugging real integration problems with fast-moving AI SDK dependencies. Instead of relying on assumptions, I learned to investigate actual error messages, package versions, runtime behavior, and CI failures.

The project also reinforced the importance of building testing and accessibility into the development workflow rather than treating them as final-stage checks.

## 👩‍💻 Internship

Built as the capstone project for the **FlyRank AI Internship — Front-End AI Engineering track**, completed in September 2026.

The internship included practical frontend and AI engineering assignments covering areas such as:

* React application development
* AI-assisted development workflows
* Streaming AI interfaces
* Structured AI tool results
* Accessibility
* Performance
* 3D web experiences
* GLSL shaders
* Testing
* Production deployment

---

**Built by Mokshitha Bevara**

**B.Tech CSE | Front-End AI Engineering | AI-Powered Applications**

# Architect AI Interview Guide

## Scope of this first half

This guide is based on the code at commit `2c83e76c825ecfebb50de7ebb3c4bf8d949f91bf` in `JyoAdityaaa/gemini3_init_vbv`. This first half covers sections 1 through 7 of the requested interview preparation. Statements are tied to files in the repository. Where the code does not prove a claim, I say **not implemented** or **not verified**.

## 1. Problem and purpose

### What I can say in an interview

Architect AI is a browser application that sends a written system description to an external n8n workflow. That workflow uses Gemini models to produce an architecture review. The application then displays a risk score, a cost value, findings, recommendations, and optional architecture diagrams.

The intended users are people making early cloud or software architecture decisions. The code supports a user entering a description in `client/src/pages/SimulationPage.tsx`. The landing page describes the product as a way to reason about cloud architecture before implementation, but the code does not prove that the tool is accurate enough for production decisions.

The reason to review architecture before building is that design problems can become expensive after implementation. For example, a missing redundancy plan, a scaling bottleneck, or an unrealistic budget can force changes across many services later. This application tries to make those concerns visible early. It should be described as an analysis aid, not as a source of verified engineering truth.

### What is actually in the user input

The main simulation page stores one text field in the `input` state. When the user presses **RUN**, it sends this request:

```json
{
  "description": "the text entered by the user"
}
```

The page does not send provider, budget, users, or uptime values. The separate `client/src/lib/n8nService.ts` helper supports those optional fields, but `SimulationPage.tsx` does not use that helper. Therefore, the complete metadata flow described in `server/types.ts` is **not implemented in the main user interface**.

## 2. Architecture

### Text diagram of the implemented runtime flow

```text
Browser loads React application
        |
        v
client/src/main.tsx mounts App
        |
        v
App.tsx routes /app to SimulationPage
        |
        v
User enters description and clicks RUN
        |
        v
SimulationPage sends POST /api/analyze
        |
        v
Express server in server/index.ts receives JSON
        |
        v
server/routes.ts sends description to N8N_WEBHOOK_URL
        |
        v
n8n Webhook node in workflow.json
        |
        v
Wait node, then Normalizer Agent
        |
        v
Performance Agent, Cost Agent, and Reliability Agent
run from the normalized architecture
        |
        v
Aggregate node collects their results
        |
        v
Critic Agent reviews the collected reports
        |
        v
Deterministic Resolver transforms the critic result
        |
        v
Consensus Engine produces the final JSON
        |
        v
Respond to Webhook returns JSON to Express
        |
        v
Express transforms the response for the user interface
        |
        v
SimulationPage stores result in React state
        |
        +--> agent report cards and findings
        +--> Mermaid architecture diagram, if a diagram is returned
        +--> text topology view, if Mermaid connections can be parsed
        +--> generated text report and clipboard copy button
```

There is a second route, `/api/analyze-architecture`, which uses a hardcoded ngrok URL instead of `N8N_WEBHOOK_URL`. The main simulation page does not call this route. The client helper `client/src/lib/n8nService.ts` does call it, but that helper is not imported by `SimulationPage.tsx`.

### Stage 1: Browser startup and routing

`client/src/main.tsx` mounts the React application into the element with the identifier `root`. `client/src/App.tsx` wraps the application in a React Query provider, a tooltip provider, and a toast provider. It uses Wouter, which is a small client-side routing library, to map `/` to `LandingPage`, `/app` to `SimulationPage`, and all other paths to `not-found.tsx`.

The development server is started by `server/index.ts`. In development it loads Vite through `server/vite.ts`. In production it serves the built client through `server/static.ts`. The server and client use one HTTP port, defaulting to port 5000 in `server/index.ts`.

### Stage 2: User input and request

`SimulationPage.tsx` has a text area controlled by React state. React state means data held by a component that causes the component to render again when it changes. The initial example text is `Design a high-scale e-commerce backend...`.

The `runSimulation` function sets a loading flag, clears the previous result, and calls `fetch("/api/analyze", ...)`. It sends only the description. It does not perform schema validation in the browser. It accepts any text that the text area provides.

### Stage 3: Express request handling

`server/index.ts` creates an Express application. Express is a Node.js web framework used here to define HTTP routes. It enables JSON parsing and URL-encoded form parsing. It also records the raw request body, although no route uses that raw body.

The server logs the method, path, status code, duration, and returned JSON for paths beginning with `/api`. The global error handler returns a JSON object containing a message, but the analysis routes also catch their own errors and return their own error objects.

### Stage 4: n8n orchestration

The `/api/analyze` handler builds a payload containing `description`, `budget`, `users`, and `uptime`. Missing description values are replaced with `No description`. It reads the webhook URL from `process.env.N8N_WEBHOOK_URL`. It then uses the standard `fetch` function to send a `POST` request with JSON.

The workflow in `workflow.json` receives the request through its Webhook node. It waits for two units in the Wait node. The workflow then normalizes the user description, runs the specialist agents, aggregates their results, runs a critic, runs a code node called Deterministic Resolver, and asks the Consensus Engine for the final result.

### Stage 5: Response transformation

The `/api/analyze` route accepts either an array or an object from n8n. It unwraps an `n8nItem.json` property when present. It also tries to parse a nested Gemini response at `content.parts[0].text`. The route maps different possible field names such as `monthlyCost`, `cost`, `budget`, and `estimatedCost` to one user interface field.

The route converts the incoming risk value by calculating `100 - rawRisk`. This is important because the route assumes the n8n value is the opposite kind of score from the score shown in the user interface. The code does not validate that the result is between 0 and 100.

The route creates a simplified `agentData` array. It does not return the full specialist output from the n8n workflow. For example, the Cost Architect card is built from the final cost string, and the Reliability Architect card is built from `keyFindings` or `bottlenecks`.

### Stage 6: Rendering the report

When the response is successful, `SimulationPage.tsx` stores it in `result`. It renders the returned agent data, bottlenecks, and suggested improvements. If `architectureDiagram` exists and is longer than ten characters, it renders both `ArchitectureDiagram` and `SystemTopology`.

`ArchitectureDiagram.tsx` uses Mermaid. Mermaid is a diagram library that converts text syntax into diagrams. The component cleans code fences, adds a `graph TD` header when needed, calls `mermaid.render`, and places the returned SVG markup into a DOM element. It has a raw-code view and a fallback display when Mermaid cannot render the input.

`SystemTopology.tsx` does not use Mermaid to draw a graph. It parses a limited subset of Mermaid text itself, finds arrow connections using `-->`, and displays each connection as a row with an icon selected from words such as `db`, `web`, `security`, or `lambda`. It is a text list, not a graph layout.

## 3. Agent design

There are two different agent designs in this repository. `server/geminiService.ts` contains a direct Gemini design, while `workflow.json` contains the n8n design used by the HTTP routes. The routes do not import or call `analyzeArchitecture` from `server/geminiService.ts`, so the n8n design is the active path used by the main interface.

### 3.1 Active n8n agents

#### Normalizer Agent

Purpose: The workflow prompt identifies this as a parser. It asks Gemini to extract structured architecture information from the user's text and return fields named `primary_cloud`, `components`, and `constraints`. The prompt explicitly says not to infer and not to analyze.

Input: The request body fields `description`, `budget`, `users`, and `uptime`, referenced in the workflow as `$json.body...`.

Output: Strict JSON with the three fields named above, according to the visible workflow prompt. The exact field types are not verified from the truncated long line in the repository response.

Model: `models/gemini-3-flash-preview`.

#### Performance Architect

Purpose: Reviews performance and scalability. Its visible prompt identifies it as a Performance and Scalability Architect and asks for strict JSON containing an agent name, findings, warnings, and a risk score component. The complete prompt line is stored as one long JSON string in `workflow.json`; its full field list is not completely visible in the repository file excerpt.

Input: The normalized architecture text at `$json.content.parts[0].text`.

Output: Structured JSON requested by the prompt. The workflow enables JSON output and retries the node, with a maximum of two tries.

Model: `models/gemini-2.5-flash`.

#### Cost Agent

Purpose: Performs cloud cost analysis. Its prompt identifies it as a FinOps Cloud Cost Optimization Expert specializing in Amazon Web Services. FinOps means financial operations for cloud spending. The prompt asks for strict JSON and analyzes the normalized architecture.

Input: The normalized architecture at `$json.content.parts[0].text`.

Output: Strict JSON containing the cost analysis fields requested by the prompt. The exact complete schema is not fully verifiable from the long line as returned by the repository reader. The backend later searches for fields including `monthlyCost`, `cost`, `estimatedCost`, `estimatedMonthlyCost`, `total_cost`, `totalCost`, and `budget`.

Model: `models/gemini-2.5-flash`.

#### Reliability Agent

Purpose: Reviews uptime, fault tolerance, and recovery concerns. Its prompt identifies it as a Site Reliability Engineer. Site reliability engineering is the discipline of operating reliable software systems. The prompt asks for strict JSON with an agent name, findings, warnings, and a risk score component.

Input: The normalized architecture at `$json.content.parts[0].text`.

Output: Structured JSON requested by the prompt. The complete schema is not fully verifiable from the long line as returned by the repository reader. The workflow enables JSON output and allows a maximum of two tries.

Model: `models/gemini-3-flash-preview`.

#### Critic Agent

Purpose: Reviews the collected specialist reports. Its prompt identifies it as the Lead Auditor and says it receives exactly three architecture reports: FinOps, Performance, and SRE. It is intended to identify validated findings and critique the specialist reports before final synthesis.

Input: The Aggregate node output, which contains the collected specialist results.

Output: JSON output from Gemini. The exact complete schema is not fully verifiable from the long prompt line. The node has retry enabled.

Model: `models/gemini-3-flash-preview`.

#### Deterministic Resolver

Purpose: A code node placed after the Critic Agent. It is named `Deterministic Resolver` and is intended to extract or normalize the critic result before the final model call.

Input and output: The JavaScript source is embedded in the `jsCode` property of `workflow.json`. The source is stored as a long JSON string and is not fully visible in the repository excerpt available here. Therefore, the exact transformations and schema are **not verified**. The name alone is not enough to claim that it performs mathematically deterministic conflict resolution.

#### Consensus Engine

Purpose: Produces the final architecture review. Its prompt identifies it as a Senior Cloud Architecture Reviewer and asks for strict JSON with `riskScore`, `keyFindings`, `recommendations`, and related result fields. The exact complete prompt is stored in the workflow, but the long line is not fully visible in the repository response.

Input: The result from the Deterministic Resolver.

Output: JSON returned by the Respond to Webhook node. The backend expects possible fields such as `riskScore`, `keyFindings`, `bottlenecks`, `recommendations`, `improvements`, `securityRisks`, `scalabilityLimits`, `spof`, `reasoning`, and a diagram field.

Model: `models/gemini-2.5-flash`.

### 3.2 Direct Gemini agent design in `server/geminiService.ts`

This design is separate from the active n8n route. It defines four specialist names in the `AGENTS` array: Performance Architect, Cost Architect, Reliability Architect, and Security Architect. It then defines a fifth stage called the Consensus Architecture Engine.

Every direct specialist receives the same `baseContext`, which contains cloud provider, expected users, monthly budget, uptime target, description, and a constraint mode. Constraint mode is `HARD` only when the description includes the exact text `Constraint Mode: HARD`; otherwise it is `SOFT`.

The exact direct specialist prompt purpose is to act as the named specialist and optimize only for that domain. The requested specialist schema is:

```json
{
  "findings": "string[]",
  "warnings": "string[]",
  "violatedConstraints": "string[]",
  "reasoning": "string"
}
```

The direct consensus prompt receives `JSON.stringify(agentResults, null, 2)` and the same base context. Its requested schema is:

```json
{
  "riskScore": "number",
  "monthlyCost": "string",
  "bottlenecks": "string[]",
  "spof": "string[]",
  "securityRisks": "string[]",
  "scalabilityLimits": "string[]",
  "suggestedImprovements": "string[]",
  "architectureSummary": "string"
}
```

The direct implementation does not define an algorithm for resolving disagreements. It gives all specialist results to the Consensus Architecture Engine and asks the model to produce one final object. Therefore, model-based synthesis is implemented, but a documented voting rule, weighted score, evidence hierarchy, or deterministic tie-breaker is **not implemented** in `server/geminiService.ts`.

### 3.3 Parallel or sequential execution

The direct Gemini implementation runs specialists sequentially. `geminiService.ts` uses a `for...of` loop and awaits `generate(prompt)` before starting the next specialist. It then calls the consensus model after all four specialist calls finish. This is not parallel execution.

The n8n workflow branches after the Normalizer Agent into Performance, Cost, and Reliability nodes. The connections show these branches feeding Aggregate. That design is intended to run specialist work as separate branches, but `workflow.json` does not provide timing evidence proving whether n8n executes all branches concurrently in the deployed instance. Security is not a specialist node in the workflow. The workflow's visible specialist set is Normalizer, Performance, Cost, Reliability, Critic, and Consensus.

## 4. n8n workflow

### Node by node

1. **Webhook** accepts a `POST` request at the path `analyze-architecture`. Its response mode is `lastNode`.
2. **Wait** pauses for an amount of `2` before normalization.
3. **Normalizer Agent** extracts `primary_cloud`, `components`, and `constraints` from the body values.
4. **Performance Architect** reviews the normalized architecture for performance and scalability.
5. **Cost Agent** reviews the normalized architecture for cloud cost, specifically with an Amazon Web Services FinOps framing.
6. **Reliability Agent** reviews the normalized architecture as a site reliability engineer.
7. **Aggregate** collects the specialist outputs.
8. **Critic Agent** receives the collected reports and reviews them as a lead auditor.
9. **Deterministic Resolver** runs embedded JavaScript between the critic and final synthesis.
10. **Consensus Engine** produces the final cloud architecture review JSON.
11. **Respond to Webhook** returns the final item as JSON.

All visible Gemini nodes set `jsonOutput: true`. Several nodes have retry enabled with a maximum of two tries. The workflow contains credential identifiers and names, but credentials themselves are not present in the repository. A deployed n8n instance must have matching credentials configured for the workflow to work.

### How the backend calls n8n

The active browser path calls `/api/analyze`. The route reads `N8N_WEBHOOK_URL`, builds a JSON payload, and sends a `POST` request. It does not add an authorization header. It treats any non-successful HTTP response as an error and returns status 500 to the browser.

The second route, `/api/analyze-architecture`, calls a hardcoded public ngrok address and adds the header `ngrok-skip-browser-warning: true`. This creates two different configuration paths. The hardcoded route is not controlled by `N8N_WEBHOOK_URL`.

### What happens when n8n is unavailable

The route's `fetch` call rejects, or the response is non-successful, and the route returns status 500 with an error object. The browser catches the failure and displays a destructive toast. There is no queue, cached result, circuit breaker, health check before analysis, or retry in the Express route.

There is also no fallback from the route to direct Gemini. Although `server/geminiService.ts` contains `analyzeArchitecture`, `server/routes.ts` never imports it. Therefore, a direct Gemini fallback is **not implemented in the active request path**.

## 5. Gemini integration

### Active integration

The active integration is in n8n, not in the imported TypeScript service. The workflow uses these model names:

- `models/gemini-3-flash-preview` for Normalizer Agent, Reliability Agent, and Critic Agent.
- `models/gemini-2.5-flash` for Performance Architect, Cost Agent, and Consensus Engine.

The n8n nodes request JSON output with `jsonOutput: true`. The workflow does not show temperature values in the visible `options` objects. Therefore, an explicit temperature setting in the n8n workflow is **not implemented or not verified**.

The prompts have a staged structure: parse the user description, analyze it from specialist perspectives, aggregate the results, critique them, resolve or normalize the critique, and synthesize a final answer. The final response is passed to the webhook response node as JSON.

### Direct Gemini service, which is currently unused by the routes

`server/geminiService.ts` creates a `GoogleGenAI` client from `process.env.API_KEY`. It defines `gemini-1.5-flash` as `FAST` and `gemini-1.5-pro` as `SMART`, but `generate` always uses `MODELS.FAST`, which is `gemini-1.5-flash`. The `SMART` model is defined but unused.

The direct service does not set generation temperature. It sends a user content object containing one prompt string. The prompt tells Gemini to return only valid JSON.

The `safeJsonParse` function removes Markdown JSON fences, finds the first opening brace and the last closing brace, and parses the substring with `JSON.parse`. If parsing fails, it logs the raw text and throws `Model returned invalid JSON`.

The `generate` function retries once after any generation, empty-response, or parse error. This is a general retry, not special rate-limit handling. There is no check for HTTP status, quota metadata, retry-after headers, or exponential backoff. Specific free-tier or rate-limit handling is **not implemented**.

## 6. Risk score and cost estimate

### Risk score

The main active backend does not calculate a risk score from architecture facts. It reads a model or workflow value:

```text
rawRisk = data.riskScore or data.score or 0
riskScore = 100 - rawRisk
```

The displayed score is therefore generated by the n8n model and then inverted by the route. If the workflow already returns a risk score where a larger number means more risk, this inversion is semantically wrong. The code provides no comment or validation establishing which direction the workflow score uses.

The direct Gemini service also accepts `final.riskScore` from the consensus model and returns it. It does not calculate the score, clamp it, validate its range, or derive it from the specialist findings.

The result is not guaranteed to be consistent across repeated runs. Gemini output can vary, and there is no temperature setting shown in the active workflow, no seeded generation, no persisted result, and no deterministic scoring formula. Repeated identical requests may produce different scores.

### Monthly cost

The active backend searches the returned object for one of several possible fields, including `monthlyCost`, `cost`, `estimatedCost`, `estimatedMonthlyCost`, `total_cost`, `totalCost`, and `budget`. If it finds one, it converts it to a string. If it cannot find one, it returns `N/A`.

The direct Gemini service returns `final.monthlyCost` from the consensus model, or `Unknown` when absent. Neither path uses a cloud pricing database, resource quantities, region pricing, traffic calculations, or a formula. The monthly cost is model-generated text or a pass-through field. It is not a verified billing estimate, and consistency across repeated runs is not guaranteed.

## 7. Backend

### Express application

`server/index.ts` creates the Express application and an HTTP server. It loads environment variables through `dotenv/config`, parses JSON, logs API requests, registers routes, installs an error handler, and then configures either Vite development serving or production static serving.

The server binds to `127.0.0.1`, using `PORT` when available and 5000 otherwise. The Vite development configuration separately declares host `0.0.0.0`, but the actual HTTP server in `server/index.ts` listens on `127.0.0.1`.

### Routes

- `GET /api/health` returns `{ "status": "ok" }`.
- `POST /api/analyze-architecture` calls the hardcoded ngrok n8n webhook, parses several response shapes, and returns a transformed user interface result.
- `POST /api/analyze` calls the URL from `N8N_WEBHOOK_URL`, performs a smaller transformation, and returns a transformed user interface result.

The main user interface calls `/api/analyze`, not `/api/analyze-architecture`.

### Request validation

The analysis routes do not use Zod or another validation schema. They read fields directly from `req.body`. Missing description is replaced by `No description` in both handlers. There is no maximum description length, no type check, no budget format check, no user-count format check, no uptime format check, and no authentication requirement.

The repository does contain a Zod schema for the database user object in `shared/schema.ts`, but that schema is not used to validate analysis requests.

### Timeouts and duration

The backend does not configure a timeout for the outbound `fetch` call. It also does not set an Express request timeout around the analysis route. The only timing behavior is the two-unit Wait node in the n8n workflow and the duration logging middleware in `server/index.ts`.

A full analysis takes the time of the webhook network request plus n8n processing plus model calls, and the code does not define a maximum duration. Therefore, the exact full-analysis time is **not specified**. The server logs the actual duration after the response finishes, but the repository does not contain measured performance data.

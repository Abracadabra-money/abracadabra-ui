<template>
  <div class="v2-page">
    <div class="page">
      <!-- Navigation -->
      <header class="nav reveal">
        <a href="/" class="logo">
          <div class="logo-mark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <path fill="#5552FD" d="M9.354 3.264h5.294v1.588H9.354z" />
              <path fill="#9695F8" d="M9.354 17.56h5.294v1.588H9.354z" />
              <path fill="#5552FD"
                d="M7.764 4.854h1.588v1.588H7.764zM6.176 6.442h1.588V8.03H6.176zm3.176 3.176h1.588v1.588H9.352zm3.706 0h1.588v1.588h-1.588zM4.588 8.03h1.588v1.588H4.587z" />
              <path fill="#9695F8" d="M6.176 14.382h1.588v1.588H6.176z" />
              <path fill="#5552FD" d="M6.176 15.972h1.588v1.588H6.176z" />
              <path fill="#9695F8" d="M7.765 15.972h1.588v1.588H7.765z" />
              <path fill="#5552FD" d="M7.764 17.558h1.588v1.588H7.764zm-3.177-3.176h1.589v1.588H4.587z" />
              <path fill="#9695F8" d="M17.824 14.382h-1.589v1.588h1.589z" />
              <path fill="#5552FD" d="M17.824 15.972h-1.589v1.588h1.589z" />
              <path fill="#9695F8" d="M16.235 15.972h-1.588v1.588h1.588z" />
              <path fill="#5552FD"
                d="M16.235 17.56h-1.588v1.588h1.588zm3.177-3.177h-1.588v1.588h1.588zM7.765 8.03h1.588v7.941H7.765zm6.882 0h1.588v7.941h-1.588zm3.176 0h1.589v1.588h-1.588zm-3.176-3.176h1.588v1.588h-1.588zm1.588 1.588h1.588V8.03h-1.588z" />
              <path fill="#9695F8" d="M9.354 4.854h5.294v1.588H9.354z" />
              <path fill="#5552FD" d="M9.354 19.148h5.294v1.588H9.354z" />
              <path fill="#9695F8" d="M7.765 6.441h1.588V8.03H7.765z" />
              <path fill="#FED955" d="M6.176 9.618h1.588v4.765H6.176z" />
              <path fill="#9695F8"
                d="M6.176 8.03h1.588v1.588H6.176zM4.587 9.617h1.589v4.764H4.587zm14.824 0h-1.588v4.764h1.588z" />
              <path fill="#5552FD" d="M3 9.618h1.588v4.765H3zm18 0h-1.588v4.765H21z" />
              <path fill="#FED955" d="M16.235 9.618h1.588v4.765h-1.588zm-5.294 0h2.118v1.588H10.94z" />
              <path fill="#9695F8" d="M16.235 8.03h1.588v1.588h-1.588zm-1.588-1.59h1.588v1.59h-1.588z" />
              <path fill="#FED955"
                d="M9.354 6.441h5.294V8.03H9.354zm0 1.589h5.294v1.588H9.354zm5.294 3.176v6.353H9.354v-6.353z" />
              <path fill="#5552FD" d="M10.94 11.206h2.119v1.588H10.94z" />
            </svg>
          </div>
          <span class="logo-text">Abracadabra</span>
        </a>
        <nav class="nav-links">
          <a href="javascript:void(0)" @click="scrollTo('overview')">Overview</a>
          <a href="javascript:void(0)" @click="scrollTo('engine')">Engine</a>
          <a href="javascript:void(0)" @click="scrollTo('experience')">Experience</a>
          <a href="javascript:void(0)" @click="scrollTo('agentic')">Agentic</a>
          <a href="javascript:void(0)" @click="scrollTo('launch')">Launch</a>
        </nav>
      </header>

      <!-- Article -->
      <article>
        <header class="article-header">
          <div class="kicker reveal">Private DeFi Banking</div>
          <h1 class="article-title reveal delay-1">Abracadabra V2 brings the protocol into a real banking experience.
          </h1>
          <p class="article-subtitle reveal delay-2">
            The original promise remains: borrow MIM against interest-bearing collateral and keep your upside.
            V2 delivers it as a complete product with privacy by default.
          </p>
          <div class="article-meta reveal delay-3">
            <span>January 2026</span>
            <span>6 min read</span>
          </div>
        </header>

        <!-- Debit Card Showcase -->
        <div class="debit-card-showcase reveal delay-3">
          <div class="debit-card">
            <div class="card-content">
              <div class="card-top">
                <div class="card-brand">
                  <span class="card-brand-text">Abracadabra</span>
                </div>
                <div class="card-chip"></div>
              </div>
              <div class="card-bottom">
                <span class="card-tagline">Truly Private Banking</span>
                <span class="card-contactless">))))</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero Grid -->
        <div class="hero-grid" id="overview">
          <div class="hero-content reveal delay-3">
            <p>
              Abracadabra V2 is the next evolution of the protocol. It keeps everything that made the original
              work—borrowing
              against interest-bearing collateral, maintaining upside exposure, and using MIM as the only
              stablecoin—while
              upgrading everything around it.
            </p>
            <p>
              The system is still DeFi at its core, but the experience finally feels like a bank. Privacy by default,
              not by configuration. Higher borrowing power up to 90% LTV. A streamlined interface across web and mobile.
            </p>
            <p>
              V2 adds an encrypted Vault for ZK receipts and privacy credentials. It supports multi-device sync,
              passkeys, and an offline Recovery Kit. Your keys stay encrypted end-to-end, even during backup or restore.
            </p>
          </div>
          <aside class="hero-panel reveal delay-4">
            <div class="hero-panel-title">Launch Windows</div>
            <div class="stat-row">
              <span class="stat-label">Beta Access</span>
              <span class="stat-value">Q2 2026</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">V2 Launch</span>
              <span class="stat-value">Q3 2026</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Network</span>
              <span class="stat-value">Ethereum</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Stablecoin</span>
              <span class="stat-value">MIM only</span>
            </div>
          </aside>
        </div>

        <!-- What Changes Section -->
        <section class="section reveal">
          <div class="section-header">
            <h2 class="section-title">What changes, what stays</h2>
            <p class="section-subtitle">
              V2 keeps the original Abracadabra focus on interest-bearing collateral while upgrading everything around
              it.
            </p>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="comparison-title">Stays the same</div>
              <ul class="comparison-list">
                <li>MIM remains the only stablecoin</li>
                <li>Borrow against interest-bearing collateral</li>
                <li>Keep upside exposure while borrowing</li>
                <li>Positions remain overcollateralized</li>
              </ul>
            </div>
            <div class="comparison-card highlight">
              <div class="comparison-title">Upgraded in V2</div>
              <ul class="comparison-list">
                <li>Private spending with debit cards</li>
                <li>Higher borrowing power up to 90% LTV</li>
                <li>Privacy by default, not by configuration</li>
                <li>Full bank experience across web and mobile</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Bank Experience Section -->
        <section class="section reveal" id="experience">
          <div class="section-header">
            <h2 class="section-title">The V2 bank experience</h2>
            <p class="section-subtitle">
              V2 is a real flow: add money, borrow MIM, protect privacy, and spend. The cryptography is real,
              but it stays under the hood.
            </p>
          </div>
          <div class="cards-grid cols-3">
            <div class="card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <div class="card-title">Debit cards</div>
              <p class="card-text">Spend MIM in the real world without exposing your on-chain history.</p>
            </div>
            <div class="card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div class="card-title">Best privacy default</div>
              <p class="card-text">Private spending is the default. You can still choose instant public transfers if
                needed.</p>
            </div>
            <div class="card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div class="card-title">Everyday simplicity</div>
              <p class="card-text">One balance, two primary actions: add money and pay.</p>
            </div>
            <div class="card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div class="card-title">Borrowing power</div>
              <p class="card-text">Borrow up to 90% LTV against supported collateral to unlock liquidity.</p>
            </div>
            <div class="card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div class="card-title">Keep upside</div>
              <p class="card-text">Stay exposed to crypto appreciation while borrowing against it.</p>
            </div>
            <div class="card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <div class="card-title">Positions and controls</div>
              <p class="card-text">See collateral, LTV, interest, and repayment options in one place.</p>
            </div>
          </div>

          <div class="blockquote">
            <p>V2 keeps the core Abracadabra strategy intact while removing the friction that kept it from being a daily
              tool.</p>
          </div>
        </section>

        <!-- Card Availability & Limits -->
        <section class="section reveal">
          <div class="section-header">
            <h2 class="section-title">Card availability &amp; limits</h2>
            <p class="section-subtitle">
              Card features launch by market with provider controls for limits and risk.
            </p>
          </div>
          <div class="cards-grid cols-3">
            <div class="card">
              <div class="card-title">Country availability</div>
              <p class="card-text">Card issuance and spending are available in supported countries at launch, with
                additional markets enabled over time.</p>
            </div>
            <div class="card">
              <div class="card-title">Spending limits</div>
              <p class="card-text">Card transactions are subject to provider and jurisdiction limits, including daily
                and periodic controls that can vary by user profile.</p>
            </div>
            <div class="card">
              <div class="card-title">Rail restrictions</div>
              <p class="card-text">Certain merchant categories, currencies, or transaction types may be restricted by
                network, compliance, or market policy requirements.</p>
            </div>
          </div>
        </section>

        <!-- Agentic Era Section -->
        <section class="section reveal" id="agentic">
          <div class="section-header">
            <h2 class="section-title">The agentic era</h2>
            <p class="section-subtitle">
              Users can delegate controlled spending to AI agents while keeping approval authority and data boundaries
              in the app.
            </p>
          </div>
          <div class="cards-grid cols-2">
            <div class="card">
              <div class="card-title">Subcards for agents</div>
              <p class="card-text">Create dedicated subcards per agent, task, or budget. Each subcard has isolated
                limits, controls, and instant revoke.</p>
            </div>
            <div class="card">
              <div class="card-title">Connectors to protocols</div>
              <p class="card-text">By utilizing the HeyAnon tech stack, agents can connect to 50+ protocols across
                chains and execute approved workflows from one control surface.</p>
            </div>
            <div class="card">
              <div class="card-title">MCP &amp; skills exposure</div>
              <p class="card-text">Expose scoped card actions through MCP and skills so agents can execute allowed
                payment tasks without full account access.</p>
            </div>
            <div class="card">
              <div class="card-title">Trusted bank interactions</div>
              <p class="card-text">Agents can interact with your bank account only through policy-gated actions,
                preserving trusted execution, explicit approvals, and auditable outcomes.</p>
            </div>
            <div class="card">
              <div class="card-title">Approval in the app</div>
              <p class="card-text">When a spend action requires approval, you can approve, reject, or adjust the amount
                directly in the app before settlement.</p>
            </div>
            <div class="card">
              <div class="card-title">Burner cards</div>
              <p class="card-text">Issue single-use or time-boxed burner cards for one-off automations, subscriptions,
                and risky merchants, then expire them automatically.</p>
            </div>
          </div>
          <div class="comparison-grid" style="margin-top: 16px;">
            <div class="comparison-card highlight">
              <div class="comparison-title">Agent guardrails</div>
              <ul class="comparison-list">
                <li>Least-privilege scopes with partial balance and policy visibility.</li>
                <li>Credentials are isolated so agents never receive raw card secrets.</li>
                <li>User data is redacted and shared only to the extent required by policy.</li>
                <li>Every agent action is auditable with policy enforcement and emergency revoke.</li>
              </ul>
            </div>
            <div class="comparison-card">
              <div class="comparison-title">Human control remains final</div>
              <ul class="comparison-list">
                <li>Approval rules can be configured per agent, merchant type, and amount band.</li>
                <li>High-risk spends are blocked or escalated for explicit user confirmation.</li>
                <li>Delegation can be paused instantly without disabling the main account.</li>
                <li>Fallback to manual mode is always available in web and mobile.</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Engine Section -->
        <section class="section reveal" id="engine">
          <div class="section-header">
            <h2 class="section-title">The V2 engine at a glance</h2>
            <p class="section-subtitle">
              Three core systems work together: credit, privacy, and spending.
            </p>
          </div>
          <div class="hero-grid" style="margin-bottom: 0;">
            <div class="feature-list">
              <div class="feature-item">
                <span class="feature-tag">Credit</span>
                <div class="feature-content">
                  <h4>Borrow MIM against interest-bearing collateral.</h4>
                  <p>Clear terms, predictable behavior, and higher LTV options for supported assets.</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-tag">Privacy</span>
                <div class="feature-content">
                  <h4>Break linkability with a ZK privacy pool.</h4>
                  <p>Borrowed funds can move through privacy rails before spending or withdrawal.</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-tag">Spend</span>
                <div class="feature-content">
                  <h4>Card payments with privacy preserved.</h4>
                  <p>Use MIM like cash while keeping your on-chain history private.</p>
                </div>
              </div>
            </div>
            <div class="card" style="align-self: start;">
              <div class="card-title">Supported Collateral</div>
              <p class="card-text" style="margin-bottom: 12px;">
                V2 supports multiple interest-bearing collateral types with market-specific LTV ratios.
              </p>
              <div class="token-row">
                <div class="token-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path fill="#8FFCF3" d="M12 3v6.65l5.625 2.516z" />
                    <path fill="#CABCF8" d="m12 3-5.625 9.166L12 9.651z" />
                    <path fill="#CBA7F5" d="M12 16.477v4.522l5.625-7.784z" />
                    <path fill="#74A0F3" d="M12 21v-4.523l-5.625-3.262z" />
                    <path fill="#CBA7F5" d="m12 15.43 5.625-3.263L12 9.65z" />
                    <path fill="#74A0F3" d="M6.375 12.167 12 15.429V9.651z" />
                  </svg>
                  <span>ETH</span>
                </div>
                <div class="token-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path fill="#F7931A"
                      d="M18.763 10.236c.28-1.895-1.155-2.905-3.131-3.591l.64-2.553-1.56-.389-.623 2.49-1.245-.297.631-2.508L11.915 3l-.641 2.562-.992-.234v-.01l-2.157-.54-.415 1.668s1.155.272 1.137.28c.631.163.74.578.722.903l-.722 2.923.162.054-.171-.036-1.02 4.087c-.072.19-.27.478-.712.36.018.028-1.128-.27-1.128-.27l-.776 1.778 2.03.505 1.11.289-.65 2.59 1.56.387.633-2.562 1.253.324-.64 2.554 1.56.388.641-2.59c2.662.505 4.665.308 5.505-2.102.676-1.94-.037-3.05-1.435-3.79 1.02-.225 1.786-.902 1.985-2.282zm-3.564 4.999c-.479 1.94-3.745.884-4.8.63l.857-3.436c1.055.27 4.448.784 3.943 2.796zm.478-5.026c-.433 1.76-3.158.866-4.033.65l.775-3.113c.885.217 3.718.632 3.258 2.463" />
                  </svg>
                  <span>wBTC</span>
                </div>
                <div class="token-badge">
                  <span>+8 more</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Flow Section -->
        <section class="section reveal">
          <div class="section-header">
            <h2 class="section-title">How the flow works</h2>
            <p class="section-subtitle">
              From deposit to spend in six clear steps.
            </p>
          </div>
          <div class="flow-grid">
            <div class="flow-card">
              <div class="flow-number">1</div>
              <h4>Add collateral</h4>
              <p>Deposit interest-bearing collateral into the V2 credit engine.</p>
            </div>
            <div class="flow-card">
              <div class="flow-number">2</div>
              <h4>Borrow MIM</h4>
              <p>Borrow up to 90% LTV and keep exposure to your crypto upside.</p>
            </div>
            <div class="flow-card">
              <div class="flow-number">3</div>
              <h4>Route privately</h4>
              <p>Move borrowed funds through the ZK privacy pool by default.</p>
            </div>
            <div class="flow-card">
              <div class="flow-number">4</div>
              <h4>Spend or repay</h4>
              <p>Spend MIM with a debit card or repay to unlock collateral.</p>
            </div>
            <div class="flow-card">
              <div class="flow-number">5</div>
              <h4>Manage receipts</h4>
              <p>Vault-backed receipts keep your privacy data safe across devices.</p>
            </div>
            <div class="flow-card">
              <div class="flow-number">6</div>
              <h4>Stay in control</h4>
              <p>Full position tracking, privacy score, and activity history.</p>
            </div>
          </div>
        </section>

        <!-- Launch Plan -->
        <section class="section reveal" id="launch">
          <div class="section-header">
            <h2 class="section-title">Launch plan</h2>
            <p class="section-subtitle">
              Rolling out in two phases to ensure stability, security, and operational readiness.
            </p>
          </div>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-date">Q2 2026</div>
              <div class="timeline-content">
                <h4>Beta invitations begin</h4>
                <p>Early users will be invited into the V2 beta testing phase. Limited capacity, full feature set.</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">Q3 2026</div>
              <div class="timeline-content">
                <h4>V2 launches on Ethereum</h4>
                <p>Full product release with the V2 engine and banking experience available to all users.</p>
              </div>
            </div>
          </div>
          <div class="cards-grid cols-2" style="margin-top: 24px;">
            <div class="card">
              <div class="card-title">Card authorization behavior</div>
              <p class="card-text">Normal card authorizations use an external authorization path with strict response
                SLAs. Mandatory and advice transactions continue through provider settlement paths to preserve payment
                continuity.</p>
            </div>
            <div class="card">
              <div class="card-title">Webhook reliability in beta</div>
              <p class="card-text">Beta operations include idempotent webhook processing, replay-safe event handlers,
                and retry-aware monitoring to keep ledger state consistent during delivery interruptions.</p>
            </div>
          </div>
        </section>

        <!-- Existing Positions, Incentives & Revenue -->
        <section class="section reveal">
          <div class="section-header">
            <h2 class="section-title">Existing positions, incentives &amp; revenue</h2>
            <p class="section-subtitle">
              V2 introduces new revenue streams while maintaining continuity for existing stakeholders.
            </p>
          </div>
          <div class="cards-grid cols-2">
            <div class="card card-warning">
              <div class="card-title">Existing positions</div>
              <p class="card-text">Existing positions are expected to be gradually closed by increasing interest rates
                across all cauldrons. Users should proactively repay debt to avoid liquidations. Subject to governance
                approval and rollout timing.</p>
            </div>
            <div class="card">
              <div class="card-title">sSPELL continues</div>
              <p class="card-text">sSPELL will continue its operation and capture the majority of protocol revenue.
                Stakers benefit from V2's expanded revenue base.</p>
            </div>
            <div class="card">
              <div class="card-title">mSPELL deprecation</div>
              <p class="card-text">mSPELL is being deprecated. Holders should migrate to sSPELL to continue earning from
                protocol revenue.</p>
            </div>
            <div class="card">
              <div class="card-title">Revenue streams</div>
              <p class="card-text">Primary revenue comes from borrow fees, interest on outstanding loans, and private
                banking services—creating sustainable protocol income.</p>
            </div>
            <div class="card">
              <div class="card-title">Security overhaul</div>
              <p class="card-text">V2 introduces a completely new set of smart contracts, audited by leading security
                firms. Full migration to battle-tested, professionally reviewed code.</p>
            </div>
            <div class="card">
              <div class="card-title">Multi-currency &amp; global reach</div>
              <p class="card-text">Support for multiple currencies across supported countries at launch, with
                jurisdiction coverage expanding over time through localized banking experiences.</p>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <div class="cta-section reveal">
          <h3 class="cta-title">Ready for private DeFi banking?</h3>
          <p class="cta-text">Join the beta waitlist to get early access to V2. Card access is subject to KYC approval
            and jurisdiction eligibility.</p>
          <div>
            <span class="cta-title" style="cursor: default;">Beta Access Coming Soon</span>
          </div>
        </div>
      </article>

      <!-- Footer -->
      <footer class="v2-footer reveal">
        <div class="footer-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path fill="#5552FD" d="M9.354 3.264h5.294v1.588H9.354z" />
            <path fill="#9695F8" d="M9.354 17.56h5.294v1.588H9.354z" />
            <path fill="#5552FD"
              d="M7.764 4.854h1.588v1.588H7.764zM6.176 6.442h1.588V8.03H6.176zm3.176 3.176h1.588v1.588H9.352zm3.706 0h1.588v1.588h-1.588zM4.588 8.03h1.588v1.588H4.587z" />
            <path fill="#9695F8" d="M6.176 14.382h1.588v1.588H6.176z" />
            <path fill="#5552FD" d="M6.176 15.972h1.588v1.588H6.176z" />
            <path fill="#9695F8" d="M7.765 15.972h1.588v1.588H7.765z" />
            <path fill="#5552FD" d="M7.764 17.558h1.588v1.588H7.764zm-3.177-3.176h1.589v1.588H4.587z" />
            <path fill="#9695F8" d="M17.824 14.382h-1.589v1.588h1.589z" />
            <path fill="#5552FD" d="M17.824 15.972h-1.589v1.588h1.589z" />
            <path fill="#9695F8" d="M16.235 15.972h-1.588v1.588h1.588z" />
            <path fill="#5552FD"
              d="M16.235 17.56h-1.588v1.588h1.588zm3.177-3.177h-1.588v1.588h1.588zM7.765 8.03h1.588v7.941H7.765zm6.882 0h1.588v7.941h-1.588zm3.176 0h1.589v1.588h-1.588zm-3.176-3.176h1.588v1.588h-1.588zm1.588 1.588h1.588V8.03h-1.588z" />
            <path fill="#9695F8" d="M9.354 4.854h5.294v1.588H9.354z" />
            <path fill="#5552FD" d="M9.354 19.148h5.294v1.588H9.354z" />
            <path fill="#9695F8" d="M7.765 6.441h1.588V8.03H7.765z" />
            <path fill="#FED955" d="M6.176 9.618h1.588v4.765H6.176z" />
            <path fill="#9695F8"
              d="M6.176 8.03h1.588v1.588H6.176zM4.587 9.617h1.589v4.764H4.587zm14.824 0h-1.588v4.764h1.588z" />
            <path fill="#5552FD" d="M3 9.618h1.588v4.765H3zm18 0h-1.588v4.765H21z" />
            <path fill="#FED955" d="M16.235 9.618h1.588v4.765h-1.588zm-5.294 0h2.118v1.588H10.94z" />
            <path fill="#9695F8" d="M16.235 8.03h1.588v1.588h-1.588zm-1.588-1.59h1.588v1.59h-1.588z" />
            <path fill="#FED955"
              d="M9.354 6.441h5.294V8.03H9.354zm0 1.589h5.294v1.588H9.354zm5.294 3.176v6.353H9.354v-6.353z" />
            <path fill="#5552FD" d="M10.94 11.206h2.119v1.588H10.94z" />
          </svg>
          <span class="footer-text">Abracadabra V2</span>
        </div>
        <div class="footer-links">
          <a href="https://x.com/MIM_Spell" target="_blank" rel="noopener">X</a>
        </div>
      </footer>
    </div>

    <!-- Sticky Signup Banner -->
    <div class="sticky-signup" :class="{ hidden: signupState === 'hidden', submitted: signupState === 'submitted' }">
      <button class="sticky-signup-close" aria-label="Close" @click="dismissSignup">&times;</button>
      <div class="sticky-signup-inner">
        <div class="sticky-signup-text">
          <div class="sticky-signup-title">Get early access to V2</div>
          <div class="sticky-signup-subtitle">Be the first to know when the app goes live.</div>
        </div>
        <form class="sticky-signup-form" @submit.prevent="handleSignupSubmit">
          <input v-model="signupEmail" type="email" name="email" class="sticky-signup-input"
            placeholder="Enter your email" required>
          <button type="submit" class="sticky-signup-btn" :disabled="signupLoading">
            {{ signupLoading ? 'Sending...' : 'Notify Me' }}
          </button>
        </form>
        <div class="sticky-signup-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>You're on the list. We'll be in touch.</span>
        </div>
      </div>
    </div>

    <!-- Support Button -->
    <button class="support-btn" :class="{ 'signup-hidden': signupState === 'hidden' }" aria-label="Open support chat" @click="chatOpen = !chatOpen">
      <svg width="46" height="57" viewBox="0 0 46 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g class="steam steam-1">
          <path d="M21.6 12H19.6V14H21.6V12Z" fill="#7B79F7" opacity="0.6" />
        </g>
        <g class="steam steam-2">
          <path d="M23.6 10H21.6V12H23.6V10Z" fill="#7B79F7" opacity="0.5" />
        </g>
        <g class="steam steam-3">
          <path d="M25.6 12H23.6V14H25.6V12Z" fill="#7B79F7" opacity="0.4" />
        </g>
        <path d="M19.6 18H17.6V20H19.6V18Z" fill="#7B79F7" />
        <path d="M23.6 18H21.6V20H23.6V18Z" fill="#7B79F7" />
        <path d="M25.6 18H23.6V20H25.6V18Z" fill="#7B79F7" />
        <path d="M27.6 18H25.6V20H27.6V18Z" fill="#7B79F7" />
        <path d="M21.6 18H19.6V20H21.6V18Z" fill="#FBF0FD" />
        <path d="M23.6 16H21.6V18H23.6V16Z" fill="#FBF0FD" />
        <path d="M23.6 14H21.6V16H23.6V14Z" fill="#FBF0FD" />
        <path d="M23.6 12H21.6V14H23.6V12Z" fill="#FBF0FD" />
        <path d="M21.6 16H19.6V18H21.6V16Z" fill="#7B79F7" />
        <path d="M25.6 16H23.6V18H25.6V16Z" fill="#7B79F7" />
        <path d="M21.6 14H19.6V16H21.6V14Z" fill="#7B79F7" />
        <path d="M25.6 14H23.6V16H25.6V14Z" fill="#7B79F7" />
        <path d="M21.6 12H19.6V14H21.6V12Z" fill="#7B79F7" />
        <path d="M25.6 12H23.6V14H25.6V12Z" fill="#7B79F7" />
        <path d="M20 20H18V22H20V20Z" fill="#7B79F7" />
        <path d="M20 22H18V24H20V22Z" fill="#7B79F7" />
        <path d="M17.6 18H15.6V20H17.6V18Z" fill="#25265B" />
        <path d="M27.6 18H29.6V20H27.6V18Z" fill="#25265B" />
        <path d="M19.6 16H17.6V18H19.6V16Z" fill="#25265B" />
        <path d="M27.6 16H25.6V18H27.6V16Z" fill="#25265B" />
        <path d="M19.6 14H17.6V16H19.6V14Z" fill="#25265B" />
        <path d="M27.6 14H25.6V16H27.6V14Z" fill="#25265B" />
        <path d="M19.6 12H17.6V14H19.6V12Z" fill="#25265B" />
        <path d="M27.6 12H25.6V14H27.6V12Z" fill="#25265B" />
        <path d="M19.6 10H17.6V12H19.6V10Z" fill="#25265B" />
        <path d="M19.6 8H17.6V10H19.6V8Z" fill="#25265B" />
        <path d="M19.6 4H17.6V6H19.6V4Z" fill="#25265B" />
        <path d="M27.6 4H25.6V5.99997H27.6V4Z" fill="#25265B" />
        <path d="M17.6 8H15.6V9.99999H17.6V8Z" fill="#25265B" />
        <path d="M17.6 6H15.6V7.99999H17.6V6Z" fill="#25265B" />
        <path d="M21.6 10H19.6V12H21.6V10Z" fill="#25265B" />
        <path d="M21.6 8H19.6V10H21.6V8Z" fill="#25265B" />
        <path d="M23.6 10H21.6V12H23.6V10Z" fill="#25265B" />
        <path d="M23.6 8H21.6V10H23.6V8Z" fill="#25265B" />
        <path d="M25.6 10H23.6V12H25.6V10Z" fill="#25265B" />
        <path d="M27.6 10H25.6V12H27.6V10Z" fill="#25265B" />
        <path d="M25.6 8H23.6V10H25.6V8Z" fill="#25265B" />
        <path d="M27.6 8H25.6V9.99997H27.6V8Z" fill="#25265B" />
        <path d="M27.6 6H25.6V7.99997H27.6V6Z" fill="#25265B" />
        <path d="M29.6 6H27.6V8H29.6V6Z" fill="#25265B" />
        <path d="M25.6 6H23.6V8H25.6V6Z" fill="#25265B" />
        <path d="M23.6 6H21.6V8.00002H23.6V6Z" fill="#25265B" />
        <path d="M21.6 6H19.6V8H21.6V6Z" fill="#25265B" />
        <path d="M21.6 4H19.6V6H21.6V4Z" fill="#605EE8" />
        <path d="M21.6 2H19.6V4H21.6V2Z" fill="#605EE8" />
        <path d="M23.6 2H21.6V4.00002H23.6V2Z" fill="#605EE8" />
        <path d="M23.6 4H21.6V6.00002H23.6V4Z" fill="#605EE8" />
        <path d="M25.6 2H23.6V4H25.6V2Z" fill="#605EE8" />
        <path d="M25.6 4H23.6V6H25.6V4Z" fill="#605EE8" />
        <path d="M19.6 6H17.6V8H19.6V6Z" fill="#25265B" />
        <path d="M19.6 2H17.6V4H19.6V2Z" fill="#25265B" />
        <path d="M21.6 0H19.6V2H21.6V0Z" fill="#25265B" />
        <path d="M23.6 0H21.6V2.00002H23.6V0Z" fill="#25265B" />
        <path d="M25.6 0H23.6V2H25.6V0Z" fill="#25265B" />
        <path d="M27.6 2H25.6V3.99997H27.6V2Z" fill="#25265B" />
        <path d="M29.6 8H27.6V10H29.6V8Z" fill="#25265B" />
        <path d="M18 20H16V22H18V20Z" fill="#7B79F7" />
        <path d="M28 20H30V22H28V20Z" fill="#7B79F7" />
        <path d="M26 20H28V22H26V20Z" fill="#7B79F7" />
        <path d="M26 22H28V24H26V22Z" fill="#7B79F7" />
        <path d="M24 20H26V22H24V20Z" fill="#7B79F7" />
        <path d="M24 22H26V24H24V22Z" fill="#7B79F7" />
        <path d="M22 20H24V22H22V20Z" fill="#7B79F7" />
        <path d="M22 22H24V24H22V22Z" fill="#7B79F7" />
        <path d="M20 20H22V22H20V20Z" fill="#7B79F7" />
        <path d="M20 22H22V24H20V22Z" fill="#7B79F7" />
        <path d="M15.6 18H13.6V20H15.6V18Z" fill="#25265B" />
        <path d="M29.6 18H31.6V20H29.6V18Z" fill="#25265B" />
        <path d="M16 20H14V22H16V20Z" fill="#7B79F7" />
        <path d="M30 20H32V22H30V20Z" fill="#7B79F7" />
        <path d="M16 22H14V24H16V22Z" fill="#7B79F7" />
        <path d="M30 22H32V24H30V22Z" fill="#7B79F7" />
        <path d="M14 22H12V24H14V22Z" fill="#7B79F7" />
        <path d="M32 22H34V24H32V22Z" fill="#7B79F7" />
        <g class="potion-glow">
          <path class="bubble bubble-1" d="M14 24H12V26H14V24Z" fill="#F09BB9" />
          <path class="bubble bubble-2" d="M32 24H34V26H32V24Z" fill="#F09BB9" />
          <path class="bubble bubble-3" d="M20 24H18V26H20V24Z" fill="#F09BB9" />
          <path class="bubble bubble-4" d="M24 24H22V26H24V24Z" fill="#F09BB9" />
          <path class="bubble bubble-5" d="M28 24H26V26H28V24Z" fill="#F09BB9" />
          <path d="M20 28H18V30H20V28Z" fill="#F09BB9" />
          <path d="M26 26H24V28H26V26Z" fill="#F09BB9" />
        </g>
        <path d="M14 26H12V28H14V26Z" fill="#E54369" />
        <path d="M32 26H34V28H32V26Z" fill="#E54369" />
        <path d="M16 26H14V28H16V26Z" fill="#FBF0FD" />
        <path d="M30 26H32V28H30V26Z" fill="#B62850" />
        <path d="M16 24H14V26H16V24Z" fill="#FBF0FD" />
        <path d="M30 24H32V26H30V24Z" fill="#FBF0FD" />
        <path d="M18 22H16V24H18V22Z" fill="#FBF0FD" />
        <path d="M28 22H30V24H28V22Z" fill="#FBF0FD" />
        <path d="M14 28H12V30H14V28Z" fill="#E54369" />
        <path d="M32 28H34V30H32V28Z" fill="#E54369" />
        <path d="M14 30H12V32H14V30Z" fill="#E54369" />
        <path d="M32 30H34V32H32V30Z" fill="#E54369" />
        <path d="M16 30H14V32H16V30Z" fill="#E54369" />
        <path d="M30 30H32V32H30V30Z" fill="#B62850" />
        <path d="M14 32H12V34H14V32Z" fill="#E54369" />
        <path d="M32 32H34V34H32V32Z" fill="#E54369" />
        <path d="M16 32H14V34H16V32Z" fill="#E54369" />
        <path d="M30 32H32V34H30V32Z" fill="#B62850" />
        <path d="M16 34H14V36H16V34Z" fill="#E54369" />
        <path d="M18 36H16V38H18V36Z" fill="#B62850" />
        <path d="M18 34H16V36H18V34Z" fill="#E54369" />
        <path d="M18 32H16V34H18V32Z" fill="#E54369" />
        <path d="M18 30H16V32H18V30Z" fill="#E54369" />
        <path d="M18 28H16V30H18V28Z" fill="#E54369" />
        <path d="M18 26H16V28H18V26Z" fill="#E54369" />
        <path d="M20 26H18V28H20V26Z" fill="#E54369" />
        <path d="M22 26H20V28H22V26Z" fill="#E54369" />
        <path d="M24 26H22V28H24V26Z" fill="#E54369" />
        <path d="M28 26H26V28H28V26Z" fill="#E54369" />
        <path d="M24 36H22V38H24V36Z" fill="#B62850" />
        <path d="M24 34H22V36H24V34Z" fill="#E54369" />
        <path d="M24 32H22V34H24V32Z" fill="#E54369" />
        <path d="M24 30H22V32H24V30Z" fill="#E54369" />
        <path d="M24 28H22V30H24V28Z" fill="#E54369" />
        <path d="M26 28H24V30H26V28Z" fill="#E54369" />
        <path d="M20 36H18V38H20V36Z" fill="#B62850" />
        <path d="M20 34H18V36H20V34Z" fill="#E54369" />
        <path d="M20 32H18V34H20V32Z" fill="#E54369" />
        <path d="M20 30H18V32H20V30Z" fill="#E54369" />
        <path d="M26 36H24V38H26V36Z" fill="#B62850" />
        <path d="M26 34H24V36H26V34Z" fill="#E54369" />
        <path d="M26 32H24V34H26V32Z" fill="#E54369" />
        <path d="M26 30H24V32H26V30Z" fill="#E54369" />
        <path d="M22 36H20V38H22V36Z" fill="#B62850" />
        <path d="M22 34H20V36H22V34Z" fill="#E54369" />
        <path d="M22 32H20V34H22V32Z" fill="#E54369" />
        <path d="M22 30H20V32H22V30Z" fill="#E54369" />
        <path d="M22 28H20V30H22V28Z" fill="#E54369" />
        <path d="M28 36H26V38H28V36Z" fill="#B62850" />
        <path d="M28 34H26V36H28V34Z" fill="#B62850" />
        <path d="M28 32H26V34H28V32Z" fill="#E54369" />
        <path d="M28 30H26V32H28V30Z" fill="#E54369" />
        <path d="M28 28H26V30H28V28Z" fill="#E54369" />
        <path d="M30 36H28V38H30V36Z" fill="#B62850" />
        <path d="M30 34H28V36H30V34Z" fill="#B62850" />
        <path d="M30 32H28V34H30V32Z" fill="#B62850" />
        <path d="M30 30H28V32H30V30Z" fill="#B62850" />
        <path d="M30 34H32V36H30V34Z" fill="#B62850" />
        <path d="M16 28H14V30H16V28Z" fill="#FBF0FD" />
        <path d="M30 28H32V30H30V28Z" fill="#B62850" />
        <path d="M12 24H10V26H12V24Z" fill="#F09BB9" />
        <path d="M34 24H36V26H34V24Z" fill="#F09BB9" />
        <path d="M18 24H16V26H18V24Z" fill="#F09BB9" />
        <path d="M22 24H20V26H22V24Z" fill="#F09BB9" />
        <path d="M26 24H24V26H26V24Z" fill="#F09BB9" />
        <path d="M28 24H30V26H28V24Z" fill="#F09BB9" />
        <path d="M12 26H10V28H12V26Z" fill="#B62850" />
        <path d="M34 26H36V28H34V26Z" fill="#B62850" />
        <path d="M28 26H30V28H28V26Z" fill="#E54369" />
        <path d="M12 28H10V30H12V28Z" fill="#B62850" />
        <path d="M34 28H36V30H34V28Z" fill="#B62850" />
        <path d="M28 28H30V30H28V28Z" fill="#B62850" />
        <path d="M14 20H12V22H14V20Z" fill="#25265B" />
        <path d="M32 20H34V22H32V20Z" fill="#25265B" />
        <path d="M12 22H10V24H12V22Z" fill="#25265B" />
        <path d="M34 22H36V24H34V22Z" fill="#25265B" />
        <path d="M10 24H8V26H10V24Z" fill="#25265B" />
        <path d="M36 24H38V26H36V24Z" fill="#25265B" />
        <path d="M10 28H8V30H10V28Z" fill="#25265B" />
        <path d="M10 30H8V32H10V30Z" fill="#25265B" />
        <path d="M36 28H38V30H36V28Z" fill="#25265B" />
        <path d="M36 30H38V32H36V30Z" fill="#25265B" />
        <path d="M10 26H8V28H10V26Z" fill="#25265B" />
        <path d="M36 26H38V28H36V26Z" fill="#25265B" />
        <path d="M12 30H10V32H12V30Z" fill="#25265B" />
        <path d="M34 30H36V32H34V30Z" fill="#25265B" />
        <path d="M12 32H10V34H12V32Z" fill="#25265B" />
        <path d="M12 34H10V36H12V34Z" fill="#25265B" />
        <path d="M34 32H36V34H34V32Z" fill="#25265B" />
        <path d="M34 34H36V36H34V34Z" fill="#25265B" />
        <path d="M14 34H12V36H14V34Z" fill="#25265B" />
        <path d="M32 34H34V36H32V34Z" fill="#25265B" />
        <path d="M16 36H14V38H16V36Z" fill="#25265B" />
        <path d="M14 36H12V38H14V36Z" fill="#25265B" />
        <path d="M30 36H32V38H30V36Z" fill="#25265B" />
        <path d="M32 36H34V38H32V36Z" fill="#25265B" />
        <path d="M18 38H16V40H18V38Z" fill="#25265B" />
        <path d="M28 38H30V40H28V38Z" fill="#25265B" />
        <path d="M22 38H20V40H22V38Z" fill="#25265B" />
        <path d="M26 38H24V40H26V38Z" fill="#25265B" />
        <path d="M20 38H18V40H20V38Z" fill="#25265B" />
        <path d="M24 38H22V40H24V38Z" fill="#25265B" />
        <path d="M28 38H26V40H28V38Z" fill="#25265B" />
        <text x="23" y="52" text-anchor="middle" font-family="'Instrument Sans', system-ui, sans-serif" font-size="9"
          font-weight="600" fill="black" letter-spacing="0.02em">HeyAnon</text>
      </svg>
    </button>

    <!-- Chat Panel -->
    <div class="chat-panel" :class="{ open: chatOpen }">
      <div class="chat-header">
        <div class="chat-header-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div class="chat-header-text">
          <div class="chat-header-title">HeyAnon</div>
          <div class="chat-header-subtitle">Your private DeFi assistant</div>
        </div>
        <button class="chat-close" aria-label="Close chat" @click="chatOpen = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref="chatMessages" class="chat-messages">
        <div v-for="(msg, i) in messages" :key="i" class="chat-message" :class="msg.role">
          <div class="chat-avatar">
            <svg v-if="msg.role === 'bot'" fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <svg v-else fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="chat-bubble" v-html="msg.role === 'bot' ? formatResponse(msg.content) : escapeHtml(msg.content)">
          </div>
        </div>
        <div v-if="isTyping" class="chat-message bot">
          <div class="chat-avatar">
            <svg fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div class="chat-bubble">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <input v-model="chatInput" type="text" class="chat-input" placeholder="Type your message..."
          @keypress.enter="sendMessage">
        <button class="chat-send" aria-label="Send message" @click="sendMessage">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="notification" class="toast" :class="notification.type" @click="closeNotification">
        <svg v-if="notification.type === 'error'" class="toast-icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
        <svg v-else class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <span class="toast-message">{{ notification.message }}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
const HEYANON_API = import.meta.env.VITE_APP_HEYANON_API;
const SIGNUP_API = import.meta.env.VITE_APP_SIGNUP_API;

export default {
  name: "V2Announcement",

  data() {
    return {
      chatOpen: false,
      chatInput: "",
      messages: [
        {
          role: "bot",
          content:
            "Hey, anon. I'm here to help you navigate Abracadabra V2. Ask me about borrowing, privacy pools, collateral, or anything else.",
        },
      ] as Array<{ role: string; content: string }>,
      isTyping: false,
      conversationHistory: [] as Array<{ role: string; content: string }>,
      signupEmail: "",
      signupLoading: false,
      signupState: "default" as "default" | "submitted" | "hidden",
      notification: null as any,
      notificationTimer: null as any,
    };
  },

  mounted() {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Instrument+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    link.id = "v2-announcement-fonts";
    document.head.appendChild(link);

    // Override #app background for this page
    const app = document.getElementById("app");
    if (app) {
      app.style.background = "#FAFAF8";
    }

    // Restore signup state from localStorage
    if (localStorage.getItem("v2-signup-submitted") === "true") {
      this.signupState = "submitted";
    }
  },

  unmounted() {
    // Remove Google Fonts link
    const link = document.getElementById("v2-announcement-fonts");
    if (link) link.remove();

    // Restore #app background
    const app = document.getElementById("app");
    if (app) {
      app.style.background = "";
    }
  },

  methods: {
    scrollTo(id: string) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },

    dismissSignup() {
      this.signupState = "hidden";
      localStorage.setItem("v2-signup-dismissed", "true");
    },

    showNotification(message: string, type: string) {
      if (this.notificationTimer) clearTimeout(this.notificationTimer as NodeJS.Timeout);
      this.notification = { message, type };
      this.notificationTimer = setTimeout(() => {
        this.notification = null;
      }, 4000);
    },

    async handleSignupSubmit() {
      this.signupLoading = true;

      try {
        const res = await fetch(SIGNUP_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.signupEmail }),
        });

        const data = await res.json().catch(() => null);

        const msg = data && data.message;
        const isAlreadyExists =
          msg && msg.toLowerCase().includes("already exists");

        if (!res.ok && !isAlreadyExists) {
          throw new Error(msg || "Something went wrong. Please try again.");
        }

        if (isAlreadyExists) {
          this.showNotification(msg, "success");
        } else if (msg) {
          this.showNotification(msg, "success");
        }

        this.signupState = "submitted";
        localStorage.setItem("v2-signup-submitted", "true");
      } catch (err) {
        this.signupLoading = false;
        this.showNotification((err as Error).message, "error");
      }
    },

    async sendMessage() {
      const message = this.chatInput.trim();
      if (!message) return;

      this.messages.push({ role: "user", content: message });
      this.chatInput = "";
      this.isTyping = true;

      this.$nextTick(() => {
        const container = this.$refs.chatMessages as HTMLElement;
        if (container) container.scrollTop = container.scrollHeight;
      });

      try {
        const response = await fetch(`${HEYANON_API}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            conversationHistory: this.conversationHistory.slice(-10),
          }),
        });

        const data = await response.json();
        this.isTyping = false;

        let botResponse =
          "Sorry, I encountered an error. Please try again.";
        if (data.success && data.response) {
          botResponse = data.response;
          this.conversationHistory.push({ role: "user", content: message });
          this.conversationHistory.push({
            role: "assistant",
            content: botResponse,
          });
        } else if (data.error) {
          botResponse = data.error;
        }

        this.messages.push({ role: "bot", content: botResponse });
      } catch (error) {
        console.error("HeyAnon API error:", error);
        this.isTyping = false;
        this.messages.push({
          role: "bot",
          content:
            "Sorry anon, I couldn't connect to the server. Please try again later.",
        });
      }

      this.$nextTick(() => {
        const container = this.$refs.chatMessages as HTMLElement;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },

    formatResponse(text: string): string {
      return text
        .split("\n")
        .map((line) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return `<strong>${this.escapeHtml(line.slice(2, -2))}</strong>`;
          } else if (line.startsWith("- ")) {
            return `<span style="display:block;padding-left:8px;">&bull; ${this.escapeHtml(line.slice(2))}</span>`;
          }
          return this.escapeHtml(line);
        })
        .join("<br>");
    },

    escapeHtml(text: string): string {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    },

    closeNotification() {
      if (this.notificationTimer) clearTimeout(this.notificationTimer);
      this.notification = null;
    },
  },
};
</script>

<style lang="scss" scoped>
/* ===== CSS Variables ===== */
.v2-page {
  --bg: #fafaf8;
  --ink: #0b0d0b;
  --muted: #8a8a8a;
  --accent: #171917;
  --primary: #dfdfc1;
  --primary-dark: #d4d4b0;
  --card: #ffffff;
  --border: rgba(0, 0, 0, 0.07);
  --border-strong: rgba(0, 0, 0, 0.12);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.06);
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Instrument Sans", system-ui, sans-serif;

  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  position: relative;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

/* Grid texture background */
.v2-page::before {
  content: "";
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, rgba(250, 250, 248, 0.95), rgba(250, 250, 248, 0.98)),
    repeating-linear-gradient(90deg, rgba(11, 13, 11, 0.025) 0 1px, transparent 1px 100px),
    repeating-linear-gradient(0deg, rgba(11, 13, 11, 0.025) 0 1px, transparent 1px 100px);
  pointer-events: none;
  z-index: -1;
}

/* ===== Layout ===== */
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: clamp(24px, 5vw, 64px) clamp(20px, 4vw, 48px);
  padding-bottom: 100px;
}

/* ===== Navigation ===== */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink);
}

.logo-mark {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
}

.logo-text {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.nav-links {
  display: flex;
  gap: 24px;

  a {
    font-size: 11px;
    color: var(--muted);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: color 0.2s;

    &:hover {
      color: var(--ink);
    }
  }
}

/* ===== Article Header ===== */
.article-header {
  margin-bottom: 48px;
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: var(--primary);
  border: 1px solid var(--border-strong);
  border-radius: 100px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink);
  margin-bottom: 20px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
  }
}

.article-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 16px;
  max-width: 720px;
}

.article-subtitle {
  font-size: 15px;
  line-height: 1.6;
  color: var(--muted);
  max-width: 600px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

/* ===== Hero Panel ===== */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  margin-bottom: 64px;
  align-items: start;
}

.hero-content p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink);
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.hero-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.hero-panel-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.stat-label {
  font-size: 11px;
  color: var(--muted);
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

/* ===== Debit Card ===== */
.debit-card-showcase {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.debit-card {
  width: 340px;
  aspect-ratio: 1.586 / 1;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 35%, #0a0a0a 65%, #050505 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;

  &::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -40px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(223, 223, 193, 0.15) 0%, rgba(223, 223, 193, 0.05) 40%, transparent 70%);
    border-radius: 50%;
    filter: blur(30px);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: -40px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(200, 200, 168, 0.1) 0%, transparent 60%);
    border-radius: 50%;
    filter: blur(20px);
  }
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-brand-text {
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  background: linear-gradient(135deg, #dfdfc1 0%, #c8c8a8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-chip {
  width: 40px;
  height: 28px;
  border-radius: 3px;
  background: linear-gradient(135deg, #e8c848 0%, #d4af37 30%, #b8860b 70%, #c8a020 100%);
  position: relative;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    background: repeating-linear-gradient(0deg,
        rgba(0, 0, 0, 0.2) 0px,
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 4px);
  }
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-tagline {
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.4);
}

.card-contactless {
  color: rgba(255, 255, 255, 0.4);
  font-size: 20px;
  transform: rotate(90deg);
}

/* ===== Sections ===== */
.section {
  margin-bottom: 64px;
  padding-top: 48px;
  border-top: 1px solid var(--border);

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  max-width: 560px;
}

/* ===== Cards Grid ===== */
.cards-grid {
  display: grid;
  gap: 12px;

  &.cols-2 {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  &.cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 16px;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-sm);
  }

  &.card-warning {
    position: relative;
    background: linear-gradient(180deg, #fff7e8 0%, #fffdf8 100%);
    border-color: rgba(176, 109, 24, 0.35);
    border-left: 3px solid #b06d18;
    box-shadow: 0 0 0 1px rgba(176, 109, 24, 0.12), 0 12px 28px rgba(176, 109, 24, 0.18);
    animation: card-warning-glow 2.8s ease-in-out infinite;

    &:hover {
      border-color: rgba(176, 109, 24, 0.5);
      box-shadow: 0 0 0 1px rgba(176, 109, 24, 0.2), 0 16px 34px rgba(176, 109, 24, 0.24);
    }

    &::after {
      content: "Important";
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #5a2d00;
      background: rgba(255, 214, 140, 0.6);
      border: 1px solid rgba(176, 109, 24, 0.35);
    }

    .card-title {
      color: #5a2d00;
      padding-right: 86px;
    }

    .card-text {
      color: #3f2a14;
    }
  }

  ul {
    margin: 8px 0 0;
    padding-left: 16px;
  }

  li {
    font-size: 12px;
    line-height: 1.5;
    color: var(--ink);
    margin-bottom: 4px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.card-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink);
  margin-bottom: 6px;
}

.card-text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
}

/* ===== Feature List ===== */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: var(--primary);
  border: 1px solid var(--border-strong);
  border-radius: 100px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink);
  height: fit-content;
}

.feature-content {
  h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
  }

  p {
    font-size: 12px;
    line-height: 1.5;
    color: var(--muted);
  }
}

/* ===== Token Badges ===== */
.token-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.token-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;

  svg {
    width: 18px;
    height: 18px;
  }
}

/* ===== Timeline ===== */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 80px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
  }

  &::after {
    content: "";
    position: absolute;
    left: 76px;
    top: 24px;
    width: 9px;
    height: 9px;
    background: var(--primary);
    border: 2px solid var(--accent);
    border-radius: 50%;
  }

  &:last-child {
    border-bottom: none;
  }
}

.timeline-date {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
  padding-top: 2px;
}

.timeline-content {
  padding-left: 24px;

  h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
  }

  p {
    font-size: 12px;
    line-height: 1.5;
    color: var(--muted);
  }
}

/* ===== Blockquote ===== */
.blockquote {
  background: var(--primary);
  border-radius: 3px;
  padding: 24px;
  margin: 32px 0;
  border-left: 3px solid var(--accent);

  p {
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: -0.01em;
    color: var(--ink);
  }
}

/* ===== Comparison Grid ===== */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.comparison-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 20px;

  &.highlight {
    background: var(--primary);
    border-color: var(--border-strong);

    .comparison-title {
      color: var(--ink);
      border-color: var(--border-strong);
    }

    .comparison-list li {
      border-color: var(--border-strong);
    }
  }
}

.comparison-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.comparison-list {
  list-style: none;

  li {
    font-size: 12px;
    line-height: 1.5;
    color: var(--ink);
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: flex-start;
    gap: 10px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &::before {
      content: "";
      width: 6px;
      height: 6px;
      background: var(--accent);
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }
  }
}

/* ===== Flow Steps ===== */
.flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.flow-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 16px;
  position: relative;

  h4 {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
    margin-top: 4px;
  }

  p {
    font-size: 11px;
    line-height: 1.5;
    color: var(--muted);
  }
}

.flow-number {
  position: absolute;
  top: -8px;
  left: 12px;
  width: 20px;
  height: 20px;
  background: var(--accent);
  color: var(--bg);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 600;
}

/* ===== CTA Section ===== */
.cta-section {
  background: var(--accent);
  border-radius: 3px;
  padding: 32px;
  text-align: center;
  margin: 48px 0;
}

.cta-title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: 500;
  color: var(--bg);
  margin-bottom: 8px;
}

.cta-text {
  font-size: 12px;
  color: rgba(250, 250, 248, 0.7);
  margin-bottom: 20px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--bg);
  color: var(--accent);
}

/* ===== Footer ===== */
.v2-footer {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-text {
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.footer-links {
  display: flex;
  gap: 20px;

  a {
    font-size: 10px;
    color: var(--muted);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: color 0.2s;

    &:hover {
      color: var(--ink);
    }
  }
}

/* ===== Animations ===== */
.reveal {
  opacity: 0;
  transform: translateY(12px);
  animation: reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-1 {
  animation-delay: 0.1s;
}

.delay-2 {
  animation-delay: 0.2s;
}

.delay-3 {
  animation-delay: 0.3s;
}

.delay-4 {
  animation-delay: 0.4s;
}

.delay-5 {
  animation-delay: 0.5s;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes card-warning-glow {

  0%,
  100% {
    box-shadow: 0 0 0 1px rgba(176, 109, 24, 0.12), 0 12px 28px rgba(176, 109, 24, 0.18);
  }

  50% {
    box-shadow: 0 0 0 1px rgba(176, 109, 24, 0.2), 0 18px 36px rgba(176, 109, 24, 0.26);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .card.card-warning {
    animation: none;
  }
}

/* ===== Sticky Signup Banner ===== */
.sticky-signup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--accent);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  z-index: 10;
  transform: translateY(100%);
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 2s forwards;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);

  &.hidden {
    transform: translateY(100%);
    animation: none;
  }

  &.submitted {
    animation: none;
    transform: translateY(0);

    .sticky-signup-form {
      display: none;
    }

    .sticky-signup-success {
      display: flex;
    }
  }
}

/* ===== Toast Notification ===== */
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  background: var(--card);
  border: 1px solid var(--border-strong);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
  cursor: pointer;
  max-width: 400px;
  font-family: var(--font-body);

  &.error {
    border-color: #e5436933;
    background: #fef2f2;

    .toast-icon {
      color: #e54369;
    }
  }

  &.success {
    border-color: #22c55e33;
    background: #f0fdf4;

    .toast-icon {
      color: #22c55e;
    }
  }
}

.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast-message {
  font-size: 13px;
  line-height: 1.4;
  color: var(--ink);
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--muted);
  cursor: pointer;
  padding: 0 0 0 4px;
  line-height: 1;

  &:hover {
    color: var(--ink);
  }
}

.toast-enter-active {
  animation: toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  animation: toast-out 0.25s ease-in forwards;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-out {
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
}

@keyframes slideUp {
  to {
    transform: translateY(0);
  }
}

.sticky-signup-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.sticky-signup-text {
  flex: 1;
  min-width: 200px;
}

.sticky-signup-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  color: var(--bg);
  margin-bottom: 2px;
}

.sticky-signup-subtitle {
  font-size: 11px;
  color: rgba(250, 250, 248, 0.6);
}

.sticky-signup-form {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sticky-signup-input {
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--bg);
  font-family: var(--font-body);
  font-size: 13px;
  width: 240px;
  transition: border-color 0.2s, background 0.2s;

  &::placeholder {
    color: rgba(250, 250, 248, 0.4);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.12);
  }
}

.sticky-signup-btn {
  padding: 10px 20px;
  background: var(--bg);
  color: var(--accent);
  border: none;
  border-radius: 3px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.sticky-signup-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(250, 250, 248, 0.4);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: var(--bg);
  }
}

.sticky-signup-success {
  display: none;
  align-items: center;
  gap: 10px;
  color: var(--bg);
  font-size: 13px;

  svg {
    width: 20px;
    height: 20px;
    color: #4caf50;
  }
}

/* ===== Support Button ===== */
.support-btn {
  position: fixed;
  bottom: 84px;
  right: 30px;
  width: 60px;
  height: 74px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease, bottom 0.3s ease;
  padding: 0;

  &.signup-hidden {
    bottom: 24px;
  }

  &:hover {
    transform: scale(1.08);
  }

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 12px rgba(123, 121, 247, 0.4));
  }

  .bubble {
    animation: bubble-float 2s ease-in-out infinite;
    transform-origin: center;
  }

  .bubble-1 {
    animation-delay: 0s;
  }

  .bubble-2 {
    animation-delay: 0.3s;
  }

  .bubble-3 {
    animation-delay: 0.6s;
  }

  .bubble-4 {
    animation-delay: 0.9s;
  }

  .bubble-5 {
    animation-delay: 1.2s;
  }

  .potion-glow {
    animation: potion-pulse 2.5s ease-in-out infinite;
  }

  .steam {
    animation: steam-rise 1.8s ease-out infinite;
    transform-origin: center bottom;
  }

  .steam-1 {
    animation-delay: 0s;
  }

  .steam-2 {
    animation-delay: 0.6s;
  }

  .steam-3 {
    animation-delay: 1.2s;
  }
}

@keyframes bubble-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(-3px) scale(1.15);
    opacity: 0.85;
  }
}

@keyframes potion-pulse {

  0%,
  100% {
    filter: brightness(1) saturate(1);
  }

  50% {
    filter: brightness(1.2) saturate(1.3);
  }
}

@keyframes steam-rise {
  0% {
    transform: translateY(0) scaleY(1);
    opacity: 0.9;
  }

  100% {
    transform: translateY(-6px) scaleY(0.7);
    opacity: 0;
  }
}

/* ===== Chat Panel ===== */
.chat-panel {
  position: fixed;
  bottom: 170px;
  right: 24px;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 520px;
  max-height: calc(100vh - 160px);
  background: var(--bg);
  border-radius: 3px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.98);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }
}

.chat-header {
  background: var(--accent);
  color: var(--bg);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-header-icon {
  width: 32px;
  height: 32px;
  background: var(--primary);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    stroke: var(--accent);
  }
}

.chat-header-text {
  flex: 1;
}

.chat-header-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin-bottom: 1px;
}

.chat-header-subtitle {
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.7;
}

.chat-close {
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(250, 250, 248, 0.2);
  border-radius: 3px;
  color: var(--bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(250, 250, 248, 0.1);
    border-color: rgba(250, 250, 248, 0.3);
  }
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg);
}

.chat-message {
  display: flex;
  gap: 10px;
  max-width: 88%;

  &.bot {
    align-self: flex-start;
  }

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
}

.chat-avatar {
  width: 28px;
  height: 28px;
  border-radius: 3px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    stroke: var(--accent);
  }
}

.chat-message.user .chat-avatar {
  background: var(--accent);

  svg {
    stroke: var(--bg);
  }
}

.chat-bubble {
  padding: 12px 14px;
  border-radius: 3px;
  font-size: 13px;
  line-height: 1.55;
  font-family: var(--font-body);
}

.chat-message.bot .chat-bubble {
  background: var(--card);
  color: var(--ink);
  border: 1px solid var(--border);
}

.chat-message.user .chat-bubble {
  background: var(--accent);
  color: var(--bg);
}

.chat-input-area {
  padding: 16px;
  background: var(--card);
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
}

.chat-input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 3px;
  font-size: 13px;
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--border-strong);
  }

  &::placeholder {
    color: var(--muted);
  }
}

.chat-send {
  width: 42px;
  height: 42px;
  background: var(--accent);
  border: none;
  border-radius: 3px;
  color: var(--bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, opacity 0.15s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 5px;
  padding: 6px 0;

  span {
    width: 6px;
    height: 6px;
    background: var(--primary-dark);
    border-radius: 50%;
    animation: typing-bounce 1.4s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing-bounce {

  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-4px);
  }
}

/* ===== Responsive ===== */
@media (max-width: 800px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .sticky-signup {
    padding: 14px 16px 16px;
  }

  .sticky-signup-inner {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 12px;
  }

  .sticky-signup-title {
    font-size: 14px;
  }

  .sticky-signup-subtitle {
    font-size: 10px;
  }

  .sticky-signup-form {
    flex-direction: column;
    gap: 8px;
  }

  .sticky-signup-input {
    width: 100%;
    padding: 12px 14px;
    font-size: 16px;
  }

  .sticky-signup-btn {
    width: 100%;
    padding: 12px 20px;
  }

  .sticky-signup-close {
    top: 8px;
    right: 12px;
  }

  .sticky-signup-success {
    flex-direction: column;
    gap: 6px;

    span {
      font-size: 12px;
    }
  }
}

@media (max-width: 480px) {
  .nav-links {
    display: none;
  }

  .nav {
    justify-content: center;
    margin-bottom: 32px;
    padding-bottom: 20px;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 10px;
    letter-spacing: 0.12em;
  }

  .page {
    padding: 20px 16px 120px;
  }

  .article-title {
    font-size: 1.75rem;
    line-height: 1.15;
  }

  .article-subtitle {
    font-size: 14px;
  }

  .kicker {
    font-size: 8px;
    padding: 3px 10px;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .debit-card {
    width: 100%;
    max-width: 300px;
    padding: 16px;
  }

  .card-brand-text {
    font-size: 16px;
  }

  .card-chip {
    width: 32px;
    height: 22px;
  }

  .card-tagline {
    font-size: 7px;
    letter-spacing: 1.5px;
  }

  .section {
    margin-bottom: 48px;
    padding-top: 32px;
  }

  .section-title {
    font-size: 1.35rem;
  }

  .section-subtitle {
    font-size: 12px;
  }

  .cards-grid.cols-3 {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .card {
    padding: 14px;
  }

  .card-title {
    font-size: 11px;
  }

  .card-text {
    font-size: 11px;
  }

  .feature-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px 0;
  }

  .feature-tag {
    width: fit-content;
  }

  .flow-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .flow-card {
    padding: 14px 14px 14px 16px;
  }

  .flow-number {
    position: static;
    width: 24px;
    height: 24px;
    margin-bottom: 8px;
  }

  .timeline-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-left: 20px;

    &::before {
      left: 0;
    }

    &::after {
      left: -4px;
    }
  }

  .timeline-date {
    font-size: 9px;
  }

  .timeline-content {
    padding-left: 0;
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .blockquote {
    padding: 16px;
    margin: 24px 0;

    p {
      font-size: 1.1rem;
    }
  }

  .cta-section {
    padding: 24px 16px;
    margin: 32px 0;
  }

  .cta-title {
    font-size: 1.1rem;
  }

  .token-row {
    gap: 8px;
  }

  .token-badge {
    padding: 5px 10px;
    font-size: 10px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .v2-footer {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    margin-top: 48px;
    padding-top: 20px;
  }

  .support-btn {
    bottom: 180px;
    right: 10px;
    width: 50px;
    height: 62px;

    &.signup-hidden {
      bottom: 60px;
    }
  }

  .toast {
    top: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }

  .chat-panel {
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    border: none;

    &.open {
      transform: translateY(0);
    }
  }
}

/* Print styles */
@media print {
  .v2-page::before {
    display: none;
  }

  .nav,
  .cta-section,
  .v2-footer,
  .sticky-signup,
  .support-btn,
  .chat-panel {
    display: none;
  }
}
</style>

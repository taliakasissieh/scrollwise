// About ScrollWise and the privacy notice. Plain text pages: edit the wording here.
import { Mark } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';

export const MAIN_MESSAGE = 'We don’t need to stop using social media. We need to stop social media from controlling how we use our time.';

function PageHead({ eyebrow, title, onBack }) {
  return (
    <header className="page-head">
      <div className="page-head-l">
        <button type="button" className="icon-btn outline" onClick={onBack} aria-label="Back">
          <Icon name="arrowLeft" />
        </button>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
    </header>
  );
}

function Block({ icon, title, children, id }) {
  return (
    <section className="doc-block" aria-labelledby={id}>
      <h2 id={id} className="doc-h">
        <span className="doc-ico">
          <Icon name={icon} size={18} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function About({ onBack, onPrivacy, onCredits, onStart }) {
  return (
    <div className="page doc">
      <PageHead eyebrow="About" title="About ScrollWise" onBack={onBack} />

      <section className="doc-hero">
        <Mark size={44} />
        <p className="doc-slogan">Less scroll. More life.</p>
        <blockquote className="doc-quote">
          <p>“{MAIN_MESSAGE}”</p>
          <footer>The ScrollWise team</footer>
        </blockquote>
      </section>

      <Block icon="refresh" title="The problem: feeds without an end" id="ab-problem">
        <p>Most social media feeds never finish. New posts keep loading, there’s no sense of how long you’ve been scrolling, and the only way out is to force yourself to stop. It’s easy to open an app for a minute and look up much later, without having planned to.</p>
        <p>We don’t think social media is the enemy. The problem is design that decides for you how long you stay.</p>
      </Block>

      <Block icon="flag" title="Our solution" id="ab-solution">
        <ul className="doc-list">
          <li>
            <b>A feed with a finish line.</b> You choose how many posts and how many minutes a session lasts.
          </li>
          <li>
            <b>A subtle timer and progress you can see,</b> plus gentle, optional reminders.
          </li>
          <li>
            <b>A real stopping point.</b> When the session ends, nothing loads by itself. You can finish, or consciously start another short session.
          </li>
          <li>
            <b>Find Your Next Moment.</b> Offline ideas matched to your mood, energy, time and interests, each with simple steps to start.
          </li>
          <li>
            <b>Habits you can measure.</b> A dashboard of your own browsing time, stopping-point decisions, offline moments and goals.
          </li>
        </ul>
      </Block>

      <Block icon="spark" title="What makes it different" id="ab-new">
        <p>Timers, reminders and limited feeds already exist in some products, such as phone screen-time settings or an “all caught up” message. ScrollWise doesn’t claim to be the first to use them.</p>
        <p>What’s new is the combination, inside one familiar feed: an intentional stopping point you set yourself, personalised offline alternatives at exactly the moment you stop, and digital habits you can actually measure. The goal isn’t to block social media. It’s to give you a real moment to choose.</p>
      </Block>

      <Block icon="users" title="Who it’s for" id="ab-who">
        <p>Teenagers who enjoy social media but want it to fit their day, not take it over. It can also start conversations with families and teachers about healthier digital habits.</p>
      </Block>

      <Block icon="globe" title="Healthy Habits in a Digital World" id="ab-comp">
        <p>We built ScrollWise for the British Council Your World 2026–27 competition, whose theme is “Healthy Habits in a Digital World”. Our answer to the theme is that healthy habits don’t have to mean giving technology up: digital products can be designed to respect people’s time.</p>
        <p className="doc-small">ScrollWise is an independent student project. It isn’t made, approved or endorsed by the British Council.</p>
      </Block>

      <Block icon="target" title="Our contribution to SDG 3: Good Health and Well-being" id="ab-sdg">
        <p>The UN’s Sustainable Development Goal 3 aims to ensure healthy lives and promote well-being for all at all ages, including mental health. ScrollWise contributes in small, practical ways:</p>
        <ul className="doc-list">
          <li>helping young people notice and choose how much time they spend scrolling;</li>
          <li>turning the end of a session into a moment for movement, rest, creativity or time with other people;</li>
          <li>letting users follow their own habits and set goals, without pressure or guilt.</li>
        </ul>
      </Block>

      <Block icon="flask" title="How we’re testing the idea" id="ab-research">
        <p>Our question: does an intentional stopping point change how teenagers browse?</p>
        <ul className="doc-list">
          <li>
            <b>Two feeds, same posts.</b> Each volunteer tries a conventional feed that keeps loading (Mode A) and the ScrollWise feed with a stopping point (Mode B), with the same maximum time.
          </li>
          <li>
            <b>A fair order.</b> Half try A first and half try B first, so neither feed gets an advantage from going second.
          </li>
          <li>
            <b>What we measure.</b> Browsing time, posts viewed, whether people stopped by choice, and short neutral questions about time awareness, control and ease of stopping.
          </li>
          <li>
            <b>Done responsibly.</b> With school approval, voluntary and supervised, using anonymous codes instead of names.
          </li>
        </ul>
        <p>A small study can show early signals, not proof. We’ll report our results honestly, including their limits.</p>
      </Block>

      <Block icon="pen" title="Student-led" id="ab-team">
        <p>ScrollWise was created by Talia Kassissieh with a student team aged 14 to 17. We use social media every day ourselves, so we chose a problem we see in our own lives. The team decided what ScrollWise should do and say, and planned how to test it. AI tools helped with coding and with some sample images, and the team reviewed what to keep.</p>
      </Block>

      <Block icon="bulb" title="How it’s built" id="ab-tech">
        <ul className="doc-list">
          <li>HTML, CSS and JavaScript, using the React library, bundled with esbuild into a static website.</li>
          <li>Everything runs in the browser. Settings and stats are saved with localStorage on your own device. There are no accounts, servers, databases, ads or paid services.</li>
          <li>Views are counted with the browser’s IntersectionObserver: a post counts once half of it has been on screen. The timer only counts time while the feed is on screen.</li>
          <li>Activity pictures are drawn in code. Feed photos are licensed photographs or AI-generated sample images, which are marked “AI info”.</li>
          <li>Hosted for free on GitHub Pages.</li>
        </ul>
      </Block>

      <Block icon="arrowRight" title="Where it could go next" id="ab-next">
        <p>ScrollWise is a prototype, but the ideas could be used in other places:</p>
        <ul className="doc-list">
          <li>social media apps could offer a stopping point you set yourself, as an option inside the feed;</li>
          <li>schools could use it in digital well-being lessons, to talk about how apps are designed;</li>
          <li>the same approach could work for video and news feeds, or as a browser extension;</li>
          <li>with more research, the activity ideas and reminders could be improved with young people’s feedback.</li>
        </ul>
      </Block>

      <Block icon="info" title="A working prototype (public beta)" id="ab-proto">
        <p>ScrollWise is a functional student-built prototype, not a commercial social network. This is a public beta: we’re still adding photographs and improvements, at this same address. The feed shows sample posts from fictional creators. There are no real accounts, likes and comments stay on your device, and nobody else sees them.</p>
        <p>We haven’t proven that ScrollWise improves well-being. Research mode is how we’re starting to find out, and we’ll report what we learn honestly, including the limits of a small study.</p>
      </Block>

      <div className="doc-actions">
        <button type="button" className="btn btn-primary" onClick={onStart}>
          Try the feed
          <Icon name="arrowRight" size={18} />
        </button>
        <button type="button" className="btn btn-outline" onClick={onPrivacy}>
          <Icon name="shield" size={18} />
          Privacy notice
        </button>
        <button type="button" className="btn btn-outline" onClick={onCredits}>
          <Icon name="image" size={18} />
          Photo credits
        </button>
      </div>
    </div>
  );
}

export function Privacy({ onBack, onReset }) {
  return (
    <div className="page doc">
      <PageHead eyebrow="Privacy" title="Privacy notice" onBack={onBack} />
      <p className="doc-intro">The short version: ScrollWise has no accounts and no server. Everything stays in the browser on your device.</p>

      <Block icon="layers" title="What ScrollWise saves" id="pv-what">
        <p>On this device only, using your browser’s localStorage:</p>
        <ul className="doc-list">
          <li>your settings, interests and goals;</li>
          <li>likes, saved posts, comments and follows on the sample feed;</li>
          <li>which sample posts you’ve seen, session times and stopping-point choices;</li>
          <li>the activities you’ve started, saved or completed, and any photos you add to them.</li>
        </ul>
      </Block>

      <Block icon="shield" title="What it never does" id="pv-never">
        <ul className="doc-list">
          <li>No sign-up, passwords, names or email addresses.</li>
          <li>No analytics, advertising or tracking cookies.</li>
          <li>Nothing you do is sent to a server or shown to other people.</li>
        </ul>
      </Block>

      <Block icon="globe" title="Outside services" id="pv-third">
        <p>The website’s fonts load from Google Fonts, so your browser contacts Google to download them, as with most websites. Photo credit links open the photographers’ pages on other websites. Nothing else is loaded from outside.</p>
      </Block>

      <Block icon="flask" title="Research mode" id="pv-research">
        <p>Research mode is for supervised tests by the student team. Participants are identified only by a code like P001. It records time, posts viewed, stopping choices and three optional answers, stored on this device until the team exports them. Taking part is voluntary, and participants can stop at any time.</p>
      </Block>

      <Block icon="trash" title="Deleting your data" id="pv-delete">
        <p>Go to Settings and choose Reset data, or clear this website’s data in your browser settings. Research results can be deleted in research mode.</p>
        {onReset ? (
          <button type="button" className="btn btn-outline" onClick={onReset}>
            <Icon name="sliders" size={18} />
            Open Settings
          </button>
        ) : null}
      </Block>
    </div>
  );
}

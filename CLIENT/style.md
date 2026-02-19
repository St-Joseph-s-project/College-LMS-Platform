Here is a **clean, professional `style.md`** you can use for your project. It is written as a design guide for you (and future teammates) to maintain **consistent spacing, layout, and visual quality**.

You can copy this into a file named **`style.md`** in your project root.

---

# 📘 Application Styling Guide (`style.md`)

## 1. Purpose

This document defines the design system and styling standards for this application.
It ensures:

* Consistent spacing and layout
* Clean visual hierarchy
* Good readability
* Scalable UI
* Professional appearance

All developers must follow these rules to avoid messy UI and inconsistent designs.

---

## 2. Design Philosophy

Our UI follows these principles:

### ✅ Minimal & Clean

* Avoid clutter
* Use whitespace properly
* Keep layouts simple

### ✅ Consistent

* Same spacing everywhere
* Same font sizes
* Same colors

### ✅ Accessible

* High contrast
* Readable font sizes
* Proper focus states

### ✅ Responsive

* Works on mobile, tablet, desktop

---

## 3. Color System

All colors must come from CSS variables.

### Light Theme (Default)

| Purpose        | Variable           |
| -------------- | ------------------ |
| Background     | `--bg-color`       |
| Surface        | `--surface-color`  |
| Primary Text   | `--text-primary`   |
| Secondary Text | `--text-secondary` |
| Accent         | `--accent`         |
| Border         | `--border-color`   |
| Success        | `--success`        |
| Warning        | `--warning`        |
| Error          | `--error`          |

### Dark Theme

Dark theme uses `[data-theme="dark"]` variables.

⚠️ Never hardcode colors like `#fff` or `#000`.
Always use variables.

Example:

```css
background: var(--bg-color);
color: var(--text-primary);
```

---

## 4. Typography System

### Font Sizes

| Type    | Variable         | Usage           |
| ------- | ---------------- | --------------- |
| H1      | `--font-h1`      | Main page title |
| H2      | `--font-h2`      | Section heading |
| H3      | `--font-h3`      | Sub section     |
| Body    | `--font-body`    | Normal text     |
| Small   | `--font-small`   | Meta info       |
| Caption | `--font-caption` | Hints           |

### Rules

* Only one H1 per page
* Do not skip levels (H1 → H3 ❌)
* Body text minimum: `0.813rem`
* Line-height must be respected

Example:

```css
font-size: var(--font-body);
line-height: var(--font-body--line-height);
```

---

## 5. Spacing System (MOST IMPORTANT)

❗ Inconsistent spacing is the main problem in the app.
This section must be followed strictly.

### Base Unit

We use **4px grid system**

| Size | Value |
| ---- | ----- |
| xs   | 4px   |
| sm   | 8px   |
| md   | 12px  |
| lg   | 16px  |
| xl   | 24px  |
| 2xl  | 32px  |
| 3xl  | 48px  |

### Tailwind Mapping

| Size | Tailwind |
| ---- | -------- |
| 4px  | `p-1`    |
| 8px  | `p-2`    |
| 12px | `p-3`    |
| 16px | `p-4`    |
| 24px | `p-6`    |
| 32px | `p-8`    |
| 48px | `p-12`   |

---

### Padding Rules

#### Containers

```txt
Page container:     p-6 or p-8
Cards:              p-4
Forms:              p-4 or p-6
Modals:             p-6
```

#### Buttons

```txt
Small:  px-3 py-1.5
Medium: px-4 py-2
Large:  px-6 py-3
```

---

### Margin Rules

Use margins only for layout separation.

```txt
Between sections:  mt-8 / mb-8
Between cards:     gap-6
Between inputs:    space-y-4
Between text:      mb-2 / mb-3
```

Never use random values like:

❌ `margin: 17px`
❌ `margin-top: 23px`

---

## 6. Layout Structure

### Page Layout

Each page must follow:

```txt
Page Wrapper
 └── Max Width Container
      └── Section
           └── Content
```

### Tailwind Example

```jsx
<div className="min-h-screen bg-[var(--bg-color)]">
  <div className="max-w-7xl mx-auto p-6">
    <section className="space-y-6">
      ...
    </section>
  </div>
</div>
```

---

### Width Rules

| Type       | Max Width |
| ---------- | --------- |
| Dashboard  | 1280px    |
| Forms      | 720px     |
| Auth pages | 420px     |

Use:

```css
max-w-7xl
max-w-3xl
max-w-md
```

---

## 7. Card System

All cards must use:

```txt
- glass-card utility
- border
- rounded corners
- padding
```

### Standard Card

```jsx
<div className="glass-card p-4 rounded-xl border border-[var(--border-color)]">
```

### Card Rules

* Border radius: `rounded-xl`
* Padding: `p-4` minimum
* Shadow: use default glass shadow
* No sharp corners ❌

---

## 8. Form Design

### Input Style

All inputs must:

* Use `--input-bg`
* Have border
* Have focus state
* Have padding

Example:

```jsx
<input
  className="
    w-full
    p-3
    rounded-lg
    bg-[var(--input-bg)]
    border border-[var(--border-color)]
    focus:outline-none
    focus:ring-2
    focus:ring-[var(--accent)]
  "
/>
```

---

### Form Layout

```txt
Label
Input
Helper text
```

Spacing:

```txt
Between fields: space-y-4
Form padding: p-6
```

---

## 9. Button System

### Types

| Type      | Usage       |
| --------- | ----------- |
| Primary   | Main action |
| Secondary | Alternative |
| Ghost     | Minimal     |
| Danger    | Delete      |

---

### Primary Button

```jsx
<button className="
  px-4 py-2
  rounded-lg
  bg-[var(--accent)]
  text-white
  hover:bg-[var(--accent-hover)]
  transition
">
```

---

### Button Rules

* Always rounded
* Always have hover
* Always have focus
* No square buttons ❌

---

## 10. Animation Rules

Use animations only for:

* Loading
* Feedback
* Micro-interactions

Allowed:

* `fadeIn`
* `float`
* `glow`
* `shimmer`
* `ringPulse`

Never animate layout ❌
Never animate height/width ❌

---

## 11. Grid & Flex Standards

### Default

```txt
Vertical layouts: flex-col + space-y-*
Horizontal layouts: flex + gap-*
Cards: grid grid-cols-*
```

Example:

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

---

## 12. Responsive Rules

### Breakpoints

| Size    | Tailwind |
| ------- | -------- |
| Mobile  | <640px   |
| Tablet  | md       |
| Desktop | lg       |
| Large   | xl       |

Rules:

* Mobile first
* No horizontal scroll
* Text never overflow

---

## 13. Dark Mode Rules

* Theme controlled by `[data-theme="dark"]`
* Never hardcode dark colors
* Use variables only

Example:

```css
color: var(--text-primary);
background: var(--background);
```

---

## 14. Code Organization

### CSS Rules

* No inline styles ❌
* No `!important` ❌
* No random overrides ❌



## 15. Common Mistakes (Avoid)

❌ Random margins
❌ Mixed paddings
❌ Inline styles
❌ Different card sizes
❌ No whitespace
❌ Inconsistent fonts
❌ Over animations

---

## 16. Standard Page Template

Use this for every page:

```jsx
export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">

          <header>
            <h1 className="text-[var(--font-h1)]">
              Page Title
            </h1>
          </header>

          <section className="glass-card p-6 rounded-xl">
            Content
          </section>

        </div>
      </div>
    </div>
  );
}
```


## 18. Final Goal

The UI must feel:

✔ Clean
✔ Premium
✔ Modern
✔ Consistent
✔ Scalable

No page should look "random" or "unfinished".

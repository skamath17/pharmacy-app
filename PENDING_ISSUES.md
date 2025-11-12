# Pending Issues

This document tracks known issues and bugs that need to be addressed in the future.

## Cart Badge Not Updating Immediately

**Status:** Open  
**Priority:** Medium  
**Created:** 2025-01-10

### Description
The cart icon badge in the header does not update immediately when items are added to the cart. Users need to click on the cart icon or navigate to the cart page for the badge count to update.

### Steps to Reproduce
1. Log in as a patient user
2. Navigate to the Medicine Catalog page
3. Click "Add to Cart" on any medicine
4. Observe that the cart badge count in the header does not update immediately
5. Click on the cart icon or navigate to the cart page
6. The badge count now shows the correct number

### Expected Behavior
The cart badge should update immediately when items are added, removed, or updated in the cart, without requiring user interaction.

### Technical Details
- **Component:** `frontend/src/components/layout/Layout.tsx`
- **Store:** `frontend/src/stores/cartStore.ts`
- **Zustand Version:** 4.4.7
- **Issue Type:** State Management / Reactivity

### Attempted Fixes
1. Changed from `getItemCount()` function to direct `cart?.itemCount` access
2. Used Zustand selectors `useCartStore((state) => state.cart)`
3. Ensured proper subscription to cart state changes

### Possible Root Causes
1. Zustand persist middleware causing async delays
2. React batching updates preventing immediate re-render
3. Cart object reference not changing when updated
4. Component not properly subscribed to store changes

### Next Steps
- [ ] Add console logging to verify store updates are happening
- [ ] Test with Zustand's `useShallow` hook for object selectors
- [ ] Consider removing persist middleware temporarily to test
- [ ] Check if React 18 automatic batching is affecting updates
- [ ] Verify cart object reference changes when `setCart` is called

---

## Issue Template

Use this template for adding new issues:

```markdown
## [Issue Title]

**Status:** Open / In Progress / Resolved  
**Priority:** Low / Medium / High / Critical  
**Created:** YYYY-MM-DD

### Description
[Brief description of the issue]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Technical Details
- **Component/File:** [Relevant files]
- **Error Messages:** [If any]
- **Issue Type:** [Bug / Feature Request / Performance / etc.]

### Attempted Fixes
- [Fix attempt 1]
- [Fix attempt 2]

### Possible Root Causes
- [Possible cause 1]
- [Possible cause 2]

### Next Steps
- [ ] [Action item 1]
- [ ] [Action item 2]
```



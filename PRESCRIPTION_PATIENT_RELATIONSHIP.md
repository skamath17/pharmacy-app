# Prescription-Patient Profile Relationship

## Current Architecture

### How It Works Now:
1. **Prescription** stores only `patient_id` (foreign key to `patients` table)
2. **Patient Profile** is stored separately in `patients` table
3. When viewing a prescription, patient details are fetched from the current patient profile

### Database Relationship:
```
users (id)
  └── patients (user_id → users.id, id)
        └── prescriptions (patient_id → patients.id)
```

## Two Approaches

### Approach 1: **Reference Only** (Current MVP Implementation)
- Prescription stores only `patient_id`
- Patient details fetched dynamically from `patients` table
- **Pros:** Simple, always shows current patient info
- **Cons:** If patient profile changes, prescription shows updated info (may not match what was on prescription)

### Approach 2: **Snapshot/Historical Data** (Production Best Practice)
- Prescription stores `patient_id` + snapshot of patient data at upload time
- **Pros:** Preserves historical accuracy, matches what was on the actual prescription
- **Cons:** More complex, requires additional fields

## Recommendation for Your System

### For MVP (Current):
✅ **Keep it simple** - Just link via `patient_id`
- Prescription is linked to patient profile
- When displaying prescription, fetch current patient details
- This is sufficient for MVP

### For Production (Future Enhancement):
✅ **Add snapshot fields** to preserve prescription data:
```sql
ALTER TABLE prescriptions ADD COLUMN patient_name_snapshot VARCHAR(200);
ALTER TABLE prescriptions ADD COLUMN patient_dob_snapshot DATE;
ALTER TABLE prescriptions ADD COLUMN patient_address_snapshot JSONB;
```

## Current Behavior

**What happens now:**
1. User uploads prescription → Linked to their patient profile via `patient_id`
2. Prescription is associated with the patient who uploaded it
3. When viewing prescription, we can fetch patient details from `patients` table
4. If patient updates their profile, prescription will show updated info

**Validation:**
- ✅ Prescription must belong to a valid patient (enforced by foreign key)
- ✅ User must have completed patient profile before uploading
- ❌ No validation that prescription file content matches patient profile (would require OCR)

## Best Practices

### For Prescription Verification (Pharmacist):
1. **Check prescription file** (the uploaded image/PDF)
2. **Verify against current patient profile**:
   - Name matches?
   - DOB matches?
   - Address matches?
3. **Check for discrepancies**:
   - If prescription shows different name/DOB → Flag for review
   - If prescription is for someone else → Reject

### For System Design:
- **MVP:** Link via `patient_id` only ✅ (Current)
- **Production:** Add snapshot fields for historical accuracy
- **Verification:** Pharmacist manually compares prescription file with patient profile

## Implementation Options

### Option A: Keep Current (MVP)
- Simple and works for MVP
- Patient details fetched dynamically
- Good enough for testing

### Option B: Add Snapshot (Future)
- Store patient name, DOB, address at prescription upload time
- Preserves historical data
- Better for compliance/audit

### Option C: Add Validation (Future)
- When pharmacist verifies, compare prescription file data with patient profile
- Flag mismatches automatically
- Requires OCR/parsing of prescription content

## Recommendation

**For now:** Keep the current implementation (Option A)
- It's working correctly
- Prescription is properly linked to patient
- Patient details can be fetched when needed
- Simple and maintainable

**For future:** Consider adding snapshot fields when implementing pharmacist verification workflow
- This will help pharmacists verify prescriptions match patient profiles
- Better audit trail
- Compliance with pharmacy regulations

## Current Code Flow

```java
// 1. User uploads prescription
prescription.setPatientId(patientId); // Links to patient profile

// 2. When viewing prescription, fetch patient details:
// SELECT * FROM patients WHERE id = prescription.patient_id

// 3. Display prescription with current patient info
```

**The prescription is correctly linked to the patient profile. The patient details are fetched from the profile when needed, which is the standard approach for MVP.**



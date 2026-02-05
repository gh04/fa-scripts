# FormAssembly Process Manual

## Forms

### ID Connection Form - 5205293

#### Use Case
- Provides general program/enrollment information
- Sets Youth/Adult routing variables
- Sets Parent/first Student JCC Ids

#### Connectors

**Prefill**
- None

**Submitted**
- **Salesforce**
  - If the JCC ID provided does not match SF, create a staging Contact record with just the last name
  - If a match is found, update the Contact record with just the last name
  - This guarantees we have the Account Id

#### Routing

**Next URL:**
```
https://www.tfaforms.com/5205300?parentid=%%SFA_CONTACT%%&student1jccid=&tfa_12994=
```

**Parameters:**
- `parentid=%%SFA_CONTACT%%` - Parent Contact Id Param (Parent Form uses this as Prefill lookup to get Contact and Account details)
- `student1jccid=` - Student JCC Id Param
- `tfa_12994=` - Id of the isYouth field on the Parent Form
  - Result of this field sets conditional visibility on Parent Form
  - Used in Parent Form submit connector to conditionally send data

#### Notes
This process creates a staging Contact or simply updates the Last name of the contact to send the SFA_Contact (we get the Account Id for free) in the Parent Form Prefill. Since we enabled empty values to SF in Parent Form, we update the Parent contact info in one of two locations:
1. With basic information for just the youth self-reg, or
2. The complete information for the parent route

So we cannot attach an Opportunity to an account using a simple lookup on the Parent Form submit connector, we need to know the account id before that step.

---

## Parent Form - 5205300

### Use Case
- Sets Parent/Primary Guardian Information
- Sets Income Level and staff Verification (Skipped if confirmed for SY. See logic)
- Sets the Emergency Contacts that get stamped to each child with SF automation (See Trigger Propagate Release Values)
- **Route Conditional Visibility (`&tfa_12994=`):**
  - If `isYouth=1`: only show Parent First, Last Name and Email. Income and emergency details are hidden
  - If `isYouth=0`: show all fields

### Connectors

**Prefill**
- Lookup Parent/Primary contact to prefill parent fields and existing emergency contacts
- Lookup Student1 to prefill the JCC-Student 1 ID form field
- Lookup Opportunity on the Account and current Campaign for SY Reg
  - **YEARLY change required:** Update "Campaign ID for Current Registration Period" field with new value
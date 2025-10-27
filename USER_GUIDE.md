# Therapy AI Demo - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login](#login)
3. [Admin Dashboard](#admin-dashboard)
4. [Therapist Dashboard](#therapist-dashboard)
5. [Child Profile Management](#child-profile-management)
6. [AI Chat Assistant](#ai-chat-assistant)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection for Bootstrap CDN resources
- JavaScript enabled in browser

### Accessing the Application
1. Open your web browser
2. Navigate to the application URL (or `http://localhost:8000` for local development)
3. You will see the login page

---

## Login

### Demo Accounts

**Administrator Account:**
- Email: `admin@demo.com`
- Password: `admin123`
- Use this account to manage therapists

**Therapist Account:**
- Email: `therapist@demo.com`
- Password: `therapist123`
- Use this account to manage child clients

### Login Process
1. Enter your email address
2. Enter your password
3. Click "Sign In" button
4. You will be redirected to your role-specific dashboard

---

## Admin Dashboard

### Overview
The admin dashboard allows you to manage therapist accounts in the system.

### Managing Therapists

#### Adding a New Therapist
1. Click the "Add Therapist" button (top right)
2. Fill in the required information:
   - **Full Name**: Enter therapist's full name
   - **Email**: Enter unique email address (will be used for login)
   - **Password**: Create a secure password (minimum 6 characters)
3. Click "Add Therapist" to save
4. The new therapist will appear in the therapist list

#### Editing a Therapist
1. Locate the therapist in the table
2. Click the pencil icon (Edit button) in the Actions column
3. Modify the information:
   - Update name or email
   - Use "Reset Password" to generate a new random password
4. Click "Update Therapist" to save changes
5. **Note:** The new password will be displayed in a notification - make sure to copy it

#### Deleting a Therapist
1. Locate the therapist in the table
2. Click the trash icon (Delete button) in the Actions column
3. Confirm the deletion in the popup
4. **Important:** You cannot delete therapists who have assigned clients
   - You must reassign or remove their clients first

#### Viewing Therapist Information
The therapist table displays:
- **Name**: Therapist's full name
- **Email**: Login email address
- **Assigned Clients**: Number of children assigned to this therapist
- **Date Added**: When the therapist account was created
- **Actions**: Edit and delete buttons

---

## Therapist Dashboard

### Overview
The therapist dashboard is your main workspace for managing child clients and tracking their progress.

### Dashboard Sections

#### 1. My Clients Table
View all children assigned to you with:
- **Child ID**: Unique identifier for each child
- **Age**: Current age in years
- **Category**: Development focus area (badge)
- **Primary Concern**: Main developmental challenge
- **Last Updated**: When the record was last modified

#### 2. Recent Chat Activity
- View your most recent AI chat conversations
- Quick access to therapy guidance history

### Managing Children

#### Adding a New Child
1. Click "Add Child" button (top right)
2. Fill in the required information:
   - **Child ID**: Enter unique identifier (replaces child name for privacy)
   - **Year of Birth**: Select from dropdown (2022-2025, ensuring age ≤3)
   - **Development Category**: Choose one:
     - **Social**: Social interaction and communication
     - **Gross Motor**: Large muscle movement and coordination
     - **Fine Motor**: Small muscle control and dexterity
     - **Communication**: Language and speech development
   - **Primary Concern**: Describe the main developmental challenge
   - **Notes** (optional): Additional observations or information
3. Click "Add Child" to save
4. The child will appear in your clients table

#### Editing a Child's Information
1. Locate the child in the table
2. Click the pencil icon (Edit button)
3. Modify the information as needed
4. Click "Update Child" to save changes

#### Viewing Child Details
1. Click on the child's ID in the table
2. You will be taken to the child's detailed profile page

#### Deleting a Child
1. In the child's profile page, click the "Delete" button (top right)
2. Confirm the deletion
3. **Warning:** This will permanently delete all data including therapy goals, strategies, and chat history

---

## Child Profile Management

### Child Profile Page Overview
When you open a child's profile, you'll see several sections:

#### 1. Header Section
- **Child ID**: Displayed prominently
- **Age**: Calculated automatically from year of birth
- **Action Buttons**:
  - **Edit Info**: Modify child details
  - **Delete**: Remove child from system
  - **AI Chat**: Open chat assistant

#### 2. Milestones & Targets Card
- View current therapy goals and milestones
- Pre-generated based on typical developmental objectives
- Click "Regenerate" to refresh with new suggestions
- **Examples:**
  - "Follow one-step directions consistently"
  - "Label 20+ familiar objects spontaneously"
  - "Use 2-word combinations spontaneously"

#### 3. Strategies Card
- View recommended intervention strategies
- Evidence-based approaches for therapy
- Click "Regenerate" to get new strategy suggestions
- **Examples:**
  - "Use mirror work for visual feedback"
  - "Model target vocabulary during play routines"
  - "Practice turn-taking with cause-effect toys"

#### 4. Child Information Card
Displays all child details:
- **Year of Birth**
- **Development Category** (displayed as colored badge)
- **Primary Concern**
- **Last Updated** timestamp
- **Notes** (if available)

### Working with Goals and Strategies

#### Understanding Milestones
Milestones are specific, measurable therapy objectives:
- Automatically generated based on development category
- Provide clear targets for therapy sessions
- Help track progress over time

#### Understanding Strategies
Strategies are evidence-based intervention techniques:
- Practical approaches for therapy sessions
- Can be shared with parents for home practice
- Tailored to the child's development category

#### Regenerating Content
- Both milestones and strategies can be regenerated
- Useful when you need fresh ideas or different approaches
- Simply click the "Regenerate" button on either card

---

## AI Chat Assistant

### Accessing the Chat
1. Open a child's profile page
2. Click the "AI Chat" button (top right, blue button)
3. The chat panel will slide in from the right

### Using the Chat Assistant

#### What You Can Ask
The AI assistant provides clinical guidance on:
- **Therapy Techniques**: "How can I help with /r/ sound production?"
- **Activity Ideas**: "What activities work for fine motor development?"
- **Home Practice**: "What should I suggest for home practice?"
- **Strategy Refinement**: "How do I bridge from isolation to words?"
- **Clinical Questions**: "What are key indicators of childhood apraxia?"

#### Having a Conversation
1. Type your question in the text box at the bottom
2. Click the send button (paper plane icon) or press Enter
3. The AI will respond with evidence-based guidance
4. Continue the conversation with follow-up questions
5. Your chat history is automatically saved

#### Chat Features
- **Context Awareness**: AI remembers the current child's profile
- **Conversation History**: All chats are saved and can be reviewed
- **Therapist Messages**: Appear on the right (blue bubbles)
- **AI Responses**: Appear on the left (gray bubbles)
- **Timestamps**: Each message shows when it was sent

#### Best Practices
- Be specific in your questions
- Reference the child's specific challenges
- Ask follow-up questions for clarification
- Use the chat for clinical guidance, not diagnosis
- Review chat history for progress notes

#### Closing the Chat
- Click the X button in the top right of the chat panel
- Or click outside the chat panel
- Your conversation is automatically saved

---

## Common Workflows

### Starting with a New Child
1. **Login** as a therapist
2. **Add Child** with basic information
3. **Review** auto-generated milestones and strategies
4. **Use AI Chat** to get additional guidance
5. **Document** progress in notes field

### Planning a Therapy Session
1. **Open** the child's profile
2. **Review** current milestones and strategies
3. **Consult AI Chat** for activity ideas
4. **Regenerate** if you need fresh approaches
5. **Update** notes after the session

### Monthly Review
1. **Open** each child's profile
2. **Review** progress on milestones
3. **Update** primary concern if needed
4. **Regenerate** goals for next phase
5. **Update** last modified date

---

## Tips for Success

### For Administrators
- ✅ Regularly review therapist accounts
- ✅ Monitor client assignments across therapists
- ✅ Use secure passwords for new therapist accounts
- ✅ Keep therapist contact information up to date

### For Therapists
- ✅ Update child records regularly
- ✅ Use the AI chat for clinical support
- ✅ Document sessions in the notes field
- ✅ Regenerate goals as children progress
- ✅ Share strategies with parents
- ✅ Review chat history for continuity

### Data Entry Best Practices
- Use consistent Child ID formatting
- Be specific in describing primary concerns
- Include relevant background in notes
- Update records promptly after sessions
- Use appropriate development categories

---

## Troubleshooting

### Login Issues

**Problem:** "Invalid email or password"
- **Solution:** Double-check your email and password
- Ensure CAPS LOCK is off
- Try the demo credentials to test
- Contact your administrator for password reset

**Problem:** Redirected back to login after signing in
- **Solution:** Enable cookies and local storage in your browser
- Check browser privacy settings
- Try a different browser

### Dashboard Issues

**Problem:** No children appearing in therapist dashboard
- **Solution:** 
  - Verify you're logged in as a therapist
  - Add a new child using the "Add Child" button
  - Refresh the page

**Problem:** Cannot delete therapist
- **Solution:** 
  - Check if therapist has assigned clients
  - Reassign or delete clients first
  - Only therapists with zero clients can be deleted

### Child Profile Issues

**Problem:** Cannot add child
- **Solution:**
  - Ensure all required fields are filled
  - Select a year of birth from dropdown
  - Choose a development category
  - Verify Child ID is unique

**Problem:** Milestones or strategies not showing
- **Solution:**
  - Click the "Regenerate" button
  - Refresh the page
  - Check browser console for errors

### AI Chat Issues

**Problem:** Chat panel not opening
- **Solution:**
  - Refresh the page
  - Check if you're on a child's profile page
  - Look for JavaScript errors in console

**Problem:** Messages not sending
- **Solution:**
  - Type a message before clicking send
  - Refresh the page
  - Clear browser cache

### Browser Compatibility

**Recommended Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**If experiencing issues:**
1. Update your browser to the latest version
2. Clear browser cache and cookies
3. Disable browser extensions temporarily
4. Try incognito/private browsing mode

---

## Data Privacy & Security

### Important Notes
- All data is stored locally in browser localStorage
- No data is sent to external servers (except for demo purposes)
- Clear browser data will erase all records
- For production use, implement proper backend storage
- Always follow HIPAA and local privacy regulations
- Use Child IDs instead of names to maintain privacy

### Data Backup
- **Current Version:** No automatic backup (demo only)
- **Recommendation:** For production use, implement:
  - Regular database backups
  - Export/import functionality
  - Cloud storage integration
  - Audit logging

---

## Keyboard Shortcuts

### General
- **Escape**: Close open modals or chat panels
- **Enter**: Submit forms
- **Tab**: Navigate between form fields

### Chat
- **Enter**: Send message
- **Escape**: Close chat panel

---

## Support

### For Demo Users
This is a demonstration application. For questions about functionality, refer to this guide or the README.md file.

### For Production Deployment
For deploying this system in a production environment:
- Implement secure backend with proper authentication
- Add database for persistent storage
- Ensure HIPAA compliance
- Configure SSL/TLS encryption
- Set up regular backups
- Implement audit logging
- Add role-based access control
- Conduct security audit

---

## Glossary

**Child ID**: Unique identifier used instead of child's name for privacy

**Development Category**: One of four focus areas (Social, Gross Motor, Fine Motor, Communication)

**Milestones**: Specific, measurable therapy goals

**Strategies**: Evidence-based intervention techniques

**Primary Concern**: Main developmental challenge being addressed

**Year of Birth**: Birth year used to calculate age (limited to ages 0-3)

**AI Chat**: Clinical guidance assistant for therapy support

---

## Version Information

**Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Platform:** Web-based (HTML/CSS/JavaScript)

---

## Quick Reference Card

### Admin Actions
| Action | Steps |
|--------|-------|
| Add Therapist | Dashboard → Add Therapist → Fill form → Save |
| Edit Therapist | Find in table → Edit icon → Modify → Update |
| Delete Therapist | Find in table → Delete icon → Confirm |

### Therapist Actions
| Action | Steps |
|--------|-------|
| Add Child | Dashboard → Add Child → Fill form → Save |
| View Child | Click Child ID in table |
| Edit Child | Child profile → Edit Info → Modify → Update |
| Delete Child | Child profile → Delete → Confirm |
| Use AI Chat | Child profile → AI Chat button |

### Required Fields
- **Add Therapist**: Name, Email, Password
- **Add Child**: Child ID, Year of Birth, Category, Primary Concern

### Age Restrictions
- Children must be born between 2022-2025 (ages 0-3)

---

**End of User Guide**

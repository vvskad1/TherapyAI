# Therapy AI Demo

A comprehensive web-based therapy management system designed for early childhood development therapy practices.

## Features

- **Role-Based Access Control**: Admin and Therapist roles
- **Child Management**: Track children with development categories (Social, Gross Motor, Fine Motor, Communication)
- **Age-Appropriate**: Focus on children aged 3 and under
- **Therapy Goals**: Manage milestones and intervention strategies
- **AI Chat Assistant**: Get therapy guidance and clinical support
- **Progress Tracking**: Monitor child development over time

## Technology Stack

- Pure HTML5, CSS3, and Vanilla JavaScript (ES6 modules)
- Bootstrap 5 for responsive UI
- LocalStorage for client-side data persistence

## Getting Started

### Prerequisites

- Python 3.x (for local development server)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd UI
```

2. Start the local server:
```bash
python -m http.server 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Demo Credentials

### Admin Account
- Email: `admin@demo.com`
- Password: `admin123`

### Therapist Account
- Email: `therapist@demo.com`
- Password: `therapist123`

## Project Structure

```
├── index.html          # Login page
├── admin.html         # Admin dashboard
├── therapist.html     # Therapist dashboard
├── child.html         # Child profile workspace
└── assets/
    ├── css/
    │   └── style.css  # Custom styling
    └── js/
        ├── auth.js    # Authentication & authorization
        ├── storage.js # Data management
        ├── ui.js      # UI components
        ├── admin.js   # Admin functionality
        ├── therapist.js # Therapist functionality
        └── child.js   # Child workspace functionality
```

## Features Overview

### For Administrators
- Manage therapist accounts
- Create, edit, and delete therapist profiles
- View client assignments
- Monitor system usage

### For Therapists
- Manage child client profiles
- Track development categories
- Set therapy goals and strategies
- Access AI chat assistant for clinical guidance
- Monitor progress and update records

### Child Profile Management
- **Child ID**: Unique identifier for each child
- **Year of Birth**: Restricted to ages 0-3
- **Development Category**: Social, Gross Motor, Fine Motor, or Communication
- **Primary Concern**: Specific developmental challenges
- **Notes**: Additional observations and information

## Development

The application uses ES6 modules for clean code organization:

- **auth.js**: Handles user authentication and role-based access
- **storage.js**: Manages localStorage operations and seed data
- **ui.js**: Provides reusable UI components (toasts, modals, forms)
- **admin.js**: Admin dashboard functionality
- **therapist.js**: Therapist dashboard and child management
- **child.js**: Individual child workspace with goals and AI chat

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This is a demo application for educational and demonstration purposes.

## Support

For questions or issues, please contact your system administrator.
